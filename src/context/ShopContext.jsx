import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { parseSellPrice } from '../utils/priceParser';
import { getCurrentDateFormatted, getCurrentTimeFormatted } from '../utils/formatters';
import {
  subscribeMobiles,
  subscribeActivities,
  subscribePersons,
  addMobileToDb,
  updateMobileInDb,
  deleteMobileFromDb,
  addActivityToDb,
  appendPersonEventToDb
} from '../firebase/firebaseService';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [mobiles, setMobiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [personHistories, setPersonHistories] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [tradingVisible, setTradingVisible] = useState(false);

  const [isAddMobileOpen, setIsAddMobileOpen] = useState(false);
  const [selectedMobileForDetails, setSelectedMobileForDetails] = useState(null);
  const [selectedMobileForEdit, setSelectedMobileForEdit] = useState(null);
  const [selectedMobileForSell, setSelectedMobileForSell] = useState(null);
  const [selectedMobileForReturn, setSelectedMobileForReturn] = useState(null);
  const [selectedMobileForDelete, setSelectedMobileForDelete] = useState(null);
  const [billPreviewData, setBillPreviewData] = useState(null);
  const [imeiStickerData, setImeiStickerData] = useState(null);
  const [personHistoryData, setPersonHistoryData] = useState(null);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [barcodeScanResult, setBarcodeScanResult] = useState(null);
  const restockInFlight = useRef(new Set());

  useEffect(() => {
    const unsubMobiles = subscribeMobiles((data) => {
      setMobiles(data);
      setLoading(false);
    });

    const unsubActivities = subscribeActivities((data) => {
      setActivities(data);
    });

    const unsubPersons = subscribePersons((data) => {
      setPersonHistories(data);
    });

    return () => {
      unsubMobiles();
      unsubActivities();
      unsubPersons();
    };
  }, []);

  const counts = {
    total: mobiles.length,
    stock: mobiles.filter(m => m.status === 'Stock').length,
    service: mobiles.filter(m => m.status === 'Service').length,
    sold: mobiles.filter(m => m.status === 'Sold').length,
    customers: Object.keys(personHistories).length
  };

  const findPersonHistory = useCallback((query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return null;
    return Object.values(personHistories).find(person =>
      person.name?.toLowerCase().includes(normalized) || person.phone?.includes(normalized)
    ) || null;
  }, [personHistories]);

  const getAllCustomers = useCallback(() => {
    const customers = new Map();
    Object.values(personHistories).forEach(person => {
      const key = person.customerId || person.id || person.phone || person.name;
      customers.set(key, { ...person, customerId: key, mobilesBought: person.mobilesBought || [], mobilesSupplied: person.mobilesSupplied || [] });
    });

    mobiles.forEach(mobile => {
      const supplierKey = mobile.supplierId || mobile.contactNumber || mobile.contactName;
      if (supplierKey) {
        const supplier = customers.get(supplierKey) || {
          customerId: supplierKey, name: mobile.contactName || 'Person', phone: mobile.contactNumber || '', role: 'Supplier',
          events: [], mobilesBought: [], mobilesSupplied: []
        };
        if (!(supplier.mobilesSupplied || []).some(item => item.id === mobile.id)) {
          supplier.mobilesSupplied = [...(supplier.mobilesSupplied || []), mobile];
        }
        customers.set(supplierKey, supplier);
      }

      const sale = mobile.saleDetails;
      if (sale?.customerName) {
        const buyerKey = sale.customerId || sale.customerMobile || sale.customerName;
        const buyer = customers.get(buyerKey) || {
          customerId: buyerKey, name: sale.customerName, phone: sale.customerMobile || '', role: 'Customer',
          events: [], mobilesBought: [], mobilesSupplied: []
        };
        if (!(buyer.mobilesBought || []).some(item => item.id === mobile.id)) {
          buyer.mobilesBought = [...(buyer.mobilesBought || []), mobile];
        }
        customers.set(buyerKey, buyer);
      }
    });

    Object.values(personHistories).forEach(person => {
      const key = person.customerId || person.id || person.phone || person.name;
      const customer = customers.get(key);
      if (!customer) return;
      (person.events || []).forEach(event => {
        const linkedMobile = mobiles.find(mobile =>
          (event.mobileId && mobile.id === event.mobileId) ||
          (event.im && mobile.im === event.im) ||
          (event.imei && mobile.imei === event.imei)
        );
        if (!linkedMobile) return;
        const isSupply = ['BOUGHT', 'INBOUND'].includes(event.type);
        const list = isSupply ? customer.mobilesSupplied : customer.mobilesBought;
        if (!list.some(item => item.id === linkedMobile.id)) list.push(linkedMobile);
      });
    });

    return Array.from(customers.values());
  }, [mobiles, personHistories]);

  const getTradingSales = useCallback(() => mobiles.filter(mobile => mobile.saleDetails?.saleDate), [mobiles]);

  const calculateTradingTotals = useCallback(() => {
    const today = getCurrentDateFormatted();
    const sales = getTradingSales();
    const amountFor = (mobile) => Number(mobile.saleDetails?.sellPriceNumeric || parseSellPrice(mobile.saleDetails?.sellPrice || '')) || 0;
    const dateFor = (mobile) => mobile.saleDetails.saleDate;
    const todayParts = today.split('-').map(Number);
    const todayValue = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);
    const weekStart = new Date(todayValue);
    weekStart.setDate(todayValue.getDate() - todayValue.getDay());
    const formatDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const weekStartKey = formatDateKey(weekStart);
    return {
      today: sales.filter(m => dateFor(m) === today).reduce((sum, m) => sum + amountFor(m), 0),
      week: sales.filter(m => dateFor(m) >= weekStartKey && dateFor(m) <= today).reduce((sum, m) => sum + amountFor(m), 0),
      month: sales.filter(m => dateFor(m).startsWith(today.slice(0, 7))).reduce((sum, m) => sum + amountFor(m), 0),
      year: sales.filter(m => dateFor(m).startsWith(today.slice(0, 4))).reduce((sum, m) => sum + amountFor(m), 0)
    };
  }, [getTradingSales]);

  const logActivity = useCallback(async (action, mobileName, im, type, details) => {
    const newAct = {
      id: 'act-' + Date.now() + Math.random().toString(36).substring(2, 5),
      action, mobileName, im, date: getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type, details
    };
    await addActivityToDb(newAct);
  }, []);

  const appendPersonHistory = useCallback(async (phone, name, event, customerId = null) => {
    if (!phone && !name) return;
    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : name.replace(/\s+/g, '_').toLowerCase();
    const key = cleanPhone;
    const newEvent = { date: getCurrentDateFormatted(), time: getCurrentTimeFormatted(), ...event };
    await appendPersonEventToDb(cleanPhone, { customerId: customerId || key, name: name || 'Customer', phone: cleanPhone, role: ['BOUGHT', 'INBOUND'].includes(event.type) ? 'Dealer / Supplier' : 'Customer' }, newEvent);
  }, []);

  const addMobile = useCallback(async (newMob) => {
    const personName = newMob.contactName || newMob.personName || 'Person';
    const personNumber = newMob.contactNumber || newMob.personNumber || '';
    const supplierId = newMob.supplierId || (personNumber ? personNumber.replace(/[^\d]/g, '') : personName.replace(/\s+/g, '_').toLowerCase());
    const normalizedImei = newMob.imei?.trim().toLowerCase();
    const existing = mobiles.find(mobile =>
      (normalizedImei && mobile.imei?.trim().toLowerCase() === normalizedImei) ||
      (newMob.im && mobile.im?.trim().toLowerCase() === newMob.im.trim().toLowerCase())
    );
    if (existing) {
      const history = [{
        date: newMob.inDate || getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type: 'INBOUND',
        title: 'Existing Mobile Received Again', description: `Existing mobile record updated instead of creating a duplicate. Source: ${personName}.`,
        personName, personNumber, mobileId: existing.id, imei: existing.imei || newMob.imei || ''
      }, ...(existing.history || [])];
      const updated = { ...existing, ...newMob, id: existing.id, status: 'Stock', supplierId, contactName: personName, contactNumber: personNumber, history };
      const { id: existingId, ...persisted } = updated;
      await updateMobileInDb(existingId, persisted);
      await logActivity('Existing Mobile Updated', updated.mobileName, updated.im, 'stock', 'Existing IMEI/IM reused; duplicate record prevented');
      await appendPersonHistory(personNumber, personName, { type: 'BOUGHT', mobileId: existing.id, mobileName: updated.mobileName, im: updated.im, imei: updated.imei || '', description: 'Existing mobile received again' }, supplierId);
      return updated;
    }
    const id = 'mob-' + Date.now() + Math.random().toString(36).substring(2, 5);
    const fullMob = {
      ...newMob, id, status: 'Stock', supplierId, contactName: personName, contactNumber: personNumber, serviceCount: 0, exchangeCount: 0,
      history: [{ date: newMob.inDate || getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type: 'INBOUND', title: 'Mobile Received into Stock', description: `Intake from ${personName}. IM: ${newMob.im}`, personName, personNumber }]
    };
    await addMobileToDb(fullMob);
    await logActivity('New Mobile Added', fullMob.mobileName, fullMob.im, 'added', `Added from ${personName}`);
    await appendPersonHistory(personNumber, personName, {
      type: 'BOUGHT', mobileId: id, mobileName: fullMob.mobileName, im: fullMob.im, imei: fullMob.imei || '',
      description: `Mobile supplied to shop by ${personName}`
    }, supplierId);
    return fullMob;
  }, [mobiles, logActivity, appendPersonHistory]);

  const updateMobile = useCallback(async (id, updatedFields) => {
    const target = mobiles.find(mobile => mobile.id === id);
    const statusChanged = target && updatedFields.status && updatedFields.status !== target.status;
    const history = statusChanged ? [{
      date: getCurrentDateFormatted(),
      time: getCurrentTimeFormatted(),
      type: updatedFields.status.toUpperCase(),
      title: `Status changed to ${updatedFields.status}`,
      description: 'Status updated from the mobile edit flow.',
      mobileId: id
    }, ...(target.history || [])] : undefined;
    await updateMobileInDb(id, history ? { ...updatedFields, history } : updatedFields);
    await logActivity('Mobile Updated', updatedFields.mobileName || 'Mobile', updatedFields.im || '-', 'edit', 'Mobile specifications modified');
  }, [logActivity]);

  const deleteMobile = useCallback(async (id) => {
    const target = mobiles.find(m => m.id === id);
    if (target) {
      await deleteMobileFromDb(id);
      await logActivity('Mobile Deleted', target.mobileName, target.im, 'delete', `Removed ${target.mobileName} from system`);
      setSelectedMobileForDelete(null); 
    }
  }, [mobiles, logActivity]);

  const sellMobile = useCallback(async (id, saleFormData) => {
    const target = mobiles.find(m => m.id === id);
    if (!target) return null;
    const numericPrice = parseSellPrice(saleFormData.sellPrice);
    const saleDetails = { ...saleFormData, sellPriceNumeric: numericPrice };
    const customerId = saleFormData.customerId || saleFormData.customerMobile.replace(/[^\d]/g, '') || saleFormData.customerName.replace(/\s+/g, '_').toLowerCase();
    const newHistoryEntry = { date: saleFormData.saleDate || getCurrentDateFormatted(), time: saleFormData.saleTime || getCurrentTimeFormatted(), type: saleFormData.saleType === 'Exchange' ? 'EXCHANGE' : 'SOLD', title: saleFormData.saleType === 'Exchange' ? 'Sold on Exchange' : 'Sold Directly', description: `Sold to ${saleFormData.customerName}. Price: ${saleFormData.sellPrice}`, price: saleFormData.sellPrice, personName: saleFormData.customerName, personNumber: saleFormData.customerMobile, customerId, mobileId: id };
    const nextHistory = [newHistoryEntry, ...(target.history || [])];
    const saleWithCustomer = { ...saleDetails, customerId };
    
    // Saves exactly to database so real-time data syncs all tabs together smoothly!
    await updateMobileInDb(id, { status: 'Sold', saleDetails: saleWithCustomer, customerId, history: nextHistory });
    await logActivity('Mobile Sold', target.mobileName, target.im, 'sell', `Sold to ${saleFormData.customerName}`);
    await appendPersonHistory(saleFormData.customerMobile, saleFormData.customerName, { type: saleFormData.saleType === 'Exchange' ? 'EXCHANGE' : 'SOLD', mobileId: id, mobileName: target.mobileName, im: target.im, imei: target.imei || '', price: saleFormData.sellPrice, saleDetails: saleWithCustomer }, customerId);
    if (saleFormData.saleType === 'Exchange' && saleFormData.exchangeMobileId) {
      const exchangeTarget = mobiles.find(item => item.id === saleFormData.exchangeMobileId);
      if (exchangeTarget && exchangeTarget.id !== id) {
        const exchangeHistory = [{
          date: saleFormData.saleDate || getCurrentDateFormatted(),
          time: saleFormData.saleTime || getCurrentTimeFormatted(),
          type: 'EXCHANGE',
          title: 'Received in Customer Exchange',
          description: `Received from ${saleFormData.customerName} during exchange for ${target.mobileName}.`,
          mobileId: exchangeTarget.id,
          customerId,
          personName: saleFormData.customerName,
          personNumber: saleFormData.customerMobile
        }, ...(exchangeTarget.history || [])];
        await updateMobileInDb(exchangeTarget.id, {
          status: 'Stock',
          history: exchangeHistory,
          exchangeCustomerId: customerId,
          exchangeCustomerName: saleFormData.customerName,
          exchangeCustomerMobile: saleFormData.customerMobile
        });
        await appendPersonHistory(saleFormData.customerMobile, saleFormData.customerName, {
          type: 'EXCHANGE', mobileId: exchangeTarget.id, mobileName: exchangeTarget.mobileName, im: exchangeTarget.im, imei: exchangeTarget.imei || '', description: `Exchanged ${exchangeTarget.mobileName} for ${target.mobileName}.`
        }, customerId);
      }
    }
    setSelectedMobileForSell(null); 
    return { ...target, status: 'Sold', customerId, saleDetails: saleWithCustomer, history: nextHistory };
  }, [mobiles, logActivity, appendPersonHistory]);

  const returnToStock = useCallback(async (id) => {
    const target = mobiles.find(m => m.id === id);
    if (!target || target.status !== 'Service') return;
    const history = [{ date: getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type: 'STOCK', title: 'Returned to Stock from Service', description: 'Service completed and mobile returned to available stock.', mobileId: id }, ...(target.history || [])];
    await updateMobileInDb(id, { status: 'Stock', history, serviceDetails: null });
    await logActivity('Mobile Returned to Stock', target.mobileName, target.im, 'stock', 'Service completed');
  }, [mobiles, logActivity]);

  const returnMobile = useCallback(async (id, returnDetails) => {
    const target = mobiles.find(m => m.id === id);
    if (!target) return;
    const customerId = target.customerId || target.saleDetails?.customerId;
    const returnRecord = customerId ? { ...returnDetails, customerId } : { ...returnDetails };
    const history = [{ date: returnDetails.outDate || getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type: 'RETURN', title: 'Mobile Returned', description: returnDetails.description, mobileId: id, ...(customerId ? { customerId } : {}), ...(target.saleDetails?.customerName ? { personName: target.saleDetails.customerName, personNumber: target.saleDetails.customerMobile } : {}) }, ...(target.history || [])];
    await updateMobileInDb(id, { status: 'Stock', returnDetails: returnRecord, history });
    await logActivity('Mobile Returned', target.mobileName, target.im, 'return', returnDetails.description);
    if (target.saleDetails?.customerName) {
      await appendPersonHistory(target.saleDetails.customerMobile, target.saleDetails.customerName, { type: 'RETURN', mobileId: id, mobileName: target.mobileName, im: target.im, imei: target.imei || '', description: returnDetails.description }, target.saleDetails.customerId);
    }
  }, [mobiles, logActivity, appendPersonHistory]);

  const restockMobile = useCallback(async (oldMobileId, restockDetails) => {
    if (restockInFlight.current.has(oldMobileId)) return;
    const target = mobiles.find(m => m.id === oldMobileId);
    if (!target || target.status === 'Stock') return;
    restockInFlight.current.add(oldMobileId);
    try {
      const history = [{ date: getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type: 'RESTOCK', title: 'Mobile Restocked into Stock', description: restockDetails.description || `Restocked item.`, mobileId: target.id, imei: target.imei || '' }, ...(target.history || [])];
      await updateMobileInDb(target.id, { status: 'Stock', inDate: getCurrentDateFormatted(), history });
      await logActivity('Mobile Restocked', target.mobileName, target.im, 'stock', `Restocked existing mobile${target.imei ? ` with IMEI: ${target.imei}` : ''}`);
    } finally {
      restockInFlight.current.delete(oldMobileId);
    }
  }, [mobiles, logActivity]);

  const openMobileScanner = useCallback(() => {
    setBarcodeScanResult(null);
    setIsBarcodeScannerOpen(true);
  }, []);

  return (
    <ShopContext.Provider value={{
      mobiles, activities, personHistories, loading, currentScreen, setCurrentScreen, tradingVisible, setTradingVisible,
      isAddMobileOpen, setIsAddMobileOpen, selectedMobileForDetails, setSelectedMobileForDetails, selectedMobileForEdit, setSelectedMobileForEdit,
      selectedMobileForSell, setSelectedMobileForSell, selectedMobileForReturn, setSelectedMobileForReturn, selectedMobileForDelete, setSelectedMobileForDelete,
      billPreviewData, setBillPreviewData, imeiStickerData, setImeiStickerData, personHistoryData, setPersonHistoryData, isBarcodeScannerOpen, setIsBarcodeScannerOpen,
      barcodeScanResult, setBarcodeScanResult, addMobile, updateMobile, deleteMobile, sellMobile, restockMobile, openMobileScanner,
      returnToStock, returnMobile, counts, findPersonHistory, getAllCustomers,
      openPersonProfile: (key) => {
        const person = getAllCustomers().find(item => item.phone === key || item.name === key);
        if (person) setPersonHistoryData(person);
      },
      calculateTradingTotals, getTradingSales
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
