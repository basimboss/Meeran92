import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_MOBILES, INITIAL_ACTIVITIES, INITIAL_PERSON_HISTORIES } from '../data/mockData';
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
  upsertPersonInDb,
  seedInitialData
} from '../firebase/firebaseService';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  // ─── STATE ──────────────────────────────────────────────────────────────────
  const [mobiles, setMobiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [personHistories, setPersonHistories] = useState({});
  const [loading, setLoading] = useState(true);

  // Navigation & UI
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [tradingVisible, setTradingVisible] = useState(false);

  // Modal States
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

  // ─── FIREBASE LISTENERS ─────────────────────────────────────────────────────
  useEffect(() => {
    let seeded = false;

    // Seed initial data on first load, then subscribe
    const initFirebase = async () => {
      await seedInitialData(INITIAL_MOBILES, INITIAL_ACTIVITIES, INITIAL_PERSON_HISTORIES);
      seeded = true;
    };

    initFirebase();

    // Real-time listeners
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

  // ─── HELPERS ────────────────────────────────────────────────────────────────
  const logActivity = useCallback(async (action, mobileName, im, type, details) => {
    const newAct = {
      id: 'act-' + Date.now() + Math.random().toString(36).substring(2, 5),
      action,
      mobileName,
      im,
      date: getCurrentDateFormatted(),
      time: getCurrentTimeFormatted(),
      type,
      details
    };
    await addActivityToDb(newAct);
  }, []);

  const appendPersonHistory = useCallback(async (phone, name, event) => {
    if (!phone && !name) return;
    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : name.replace(/\s+/g, '_').toLowerCase();
    const key = cleanPhone;

    const existing = personHistories[key] || {
      name: name || 'Customer',
      phone: cleanPhone,
      role: 'Customer',
      events: []
    };

    const newEvent = {
      date: getCurrentDateFormatted(),
      time: getCurrentTimeFormatted(),
      ...event
    };

    const updatedPerson = {
      ...existing,
      name: name || existing.name,
      events: [newEvent, ...(existing.events || [])]
    };

    await upsertPersonInDb(cleanPhone, updatedPerson);
  }, [personHistories]);

  // ─── MOBILE ACTIONS ─────────────────────────────────────────────────────────

  const addMobile = useCallback(async (newMob) => {
    const id = 'mob-' + Date.now() + Math.random().toString(36).substring(2, 5);
    const personName = newMob.contactName || newMob.personName || 'Person';
    const personNumber = newMob.contactNumber || newMob.personNumber || '';

    const fullMob = {
      ...newMob,
      id,
      status: 'Stock',
      contactName: personName,
      contactNumber: personNumber,
      serviceCount: 0,
      exchangeCount: 0,
      history: [
        {
          date: newMob.inDate || getCurrentDateFormatted(),
          time: getCurrentTimeFormatted(),
          type: 'INBOUND',
          title: 'Mobile Received into Stock',
          description: `Intake from ${personName}. IM: ${newMob.im}`,
          personName,
          personNumber
        }
      ]
    };

    await addMobileToDb(fullMob);
    await logActivity(
      'New Mobile Added',
      fullMob.mobileName,
      fullMob.im,
      'added',
      `Added from ${personName}${fullMob.imei ? ' - IMEI Attached' : ' - No Barcode'}`
    );
    await appendPersonHistory(personNumber || personName, personName, {
      type: 'BOUGHT',
      mobileName: fullMob.mobileName,
      im: fullMob.im,
      imei: fullMob.imei,
      price: '-',
      description: `Supplied ${fullMob.mobileName} to shop stock`
    });

    return fullMob;
  }, [logActivity, appendPersonHistory]);

  const updateMobile = useCallback(async (id, updatedFields) => {
    await updateMobileInDb(id, updatedFields);
    await logActivity('Mobile Updated', updatedFields.mobileName || 'Mobile', updatedFields.im || '-', 'edit', 'Mobile specifications or status modified');
  }, [logActivity]);

  const deleteMobile = useCallback(async (id) => {
    const target = mobiles.find(m => m.id === id);
    if (target) {
      await deleteMobileFromDb(id);
      await logActivity('Mobile Deleted', target.mobileName, target.im, 'delete', `Removed mobile ${target.mobileName} [${target.im}] from system`);
    }
  }, [mobiles, logActivity]);

  const sellMobile = useCallback(async (id, saleFormData) => {
    const target = mobiles.find(m => m.id === id);
    if (!target) return null;

    const numericPrice = parseSellPrice(saleFormData.sellPrice);
    const saleDetails = { ...saleFormData, sellPriceNumeric: numericPrice };

    const newHistoryEntry = {
      date: saleFormData.saleDate || getCurrentDateFormatted(),
      time: saleFormData.saleTime || getCurrentTimeFormatted(),
      type: 'SOLD',
      title: saleFormData.saleType === 'Exchange' ? 'Sold on Exchange' : 'Sold Directly',
      description: `Sold to ${saleFormData.customerName}. Price: ${saleFormData.sellPrice}${saleFormData.saleType === 'Exchange' ? ` (Exchange: ${saleFormData.exchangeMobile?.mobileName || saleFormData.exchangeMobileName || 'Intake'})` : ''}`,
      price: saleFormData.sellPrice,
      personName: saleFormData.customerName,
      personNumber: saleFormData.customerMobile
    };

    const updatedMob = {
      ...target,
      status: 'Sold',
      saleDetails,
      history: [newHistoryEntry, ...(target.history || [])]
    };

    await updateMobileInDb(id, updatedMob);

    // Auto-intake exchange mobile
    let newExchangeMob = null;
    if (saleFormData.saleType === 'Exchange' && saleFormData.exchangeMobile) {
      const ex = saleFormData.exchangeMobile;
      if (ex.mobileName) {
        newExchangeMob = {
          id: 'mob-' + Date.now() + '-ex',
          mobileName: ex.mobileName,
          ram: ex.ram || '8GB',
          storage: ex.storage || '128GB',
          inDate: ex.inDate || getCurrentDateFormatted(),
          contactName: ex.personName || saleFormData.customerName,
          contactNumber: ex.personNumber || saleFormData.customerMobile,
          im: ex.im || `EX-${Math.floor(1000 + Math.random() * 9000)}`,
          description: ex.description || `Exchange intake against sold ${target.mobileName}`,
          imei: ex.imei || '',
          status: 'Stock',
          serviceCount: 0,
          exchangeCount: 1,
          history: [
            {
              date: ex.inDate || getCurrentDateFormatted(),
              time: getCurrentTimeFormatted(),
              type: 'EXCHANGE',
              title: 'Exchange Intake Received',
              description: `Exchange received from ${saleFormData.customerName} against sold ${target.mobileName}`,
              personName: saleFormData.customerName,
              personNumber: saleFormData.customerMobile
            }
          ]
        };
        await addMobileToDb(newExchangeMob);
        await logActivity('Exchange Mobile Received', newExchangeMob.mobileName, newExchangeMob.im, 'added', `Intake on exchange from ${saleFormData.customerName}`);
      }
    }

    await logActivity(
      saleFormData.saleType === 'Exchange' ? 'Mobile Sold (Exchange)' : 'Mobile Sold',
      target.mobileName, target.im, 'sold',
      `Sold to ${saleFormData.customerName} for ${saleFormData.sellPrice}`
    );

    await appendPersonHistory(saleFormData.customerMobile, saleFormData.customerName, {
      type: 'SOLD',
      mobileName: target.mobileName,
      im: target.im,
      imei: target.imei,
      price: saleFormData.sellPrice,
      description: `Purchased ${target.mobileName} (${saleFormData.saleType})`
    });

    if (newExchangeMob) {
      await appendPersonHistory(saleFormData.customerMobile, saleFormData.customerName, {
        type: 'EXCHANGE',
        mobileName: newExchangeMob.mobileName,
        im: newExchangeMob.im,
        imei: newExchangeMob.imei,
        price: '-',
        description: `Exchanged ${newExchangeMob.mobileName} towards purchase of ${target.mobileName}`
      });
    }

    return updatedMob;
  }, [mobiles, logActivity, appendPersonHistory]);

  const returnMobile = useCallback(async (id, returnData) => {
    const target = mobiles.find(m => m.id === id);
    if (!target) return;

    const returnHistory = {
      date: returnData.outDate || getCurrentDateFormatted(),
      time: getCurrentTimeFormatted(),
      type: 'RETURN',
      title: 'Mobile Returned',
      description: `Return processed: ${returnData.description || 'No reason provided'}`,
      personName: target.contactName || 'Customer',
      personNumber: target.contactNumber || ''
    };

    const updatedMob = {
      ...target,
      status: 'Service',
      returnDetails: returnData,
      history: [returnHistory, ...(target.history || [])]
    };

    await updateMobileInDb(id, updatedMob);
    await logActivity('Mobile Returned', target.mobileName, target.im, 'return', `Return logged: ${returnData.description || 'Return received'}`);

    if (target.contactNumber) {
      await appendPersonHistory(target.contactNumber, target.contactName, {
        type: 'RETURN',
        mobileName: target.mobileName,
        im: target.im,
        imei: target.imei,
        price: '-',
        description: `Return processed. Reason: ${returnData.description || 'Customer return'}`
      });
    }
  }, [mobiles, logActivity, appendPersonHistory]);

  const returnToStock = useCallback(async (id) => {
    const target = mobiles.find(m => m.id === id);
    if (!target) return;

    const stockHistory = {
      date: getCurrentDateFormatted(),
      time: getCurrentTimeFormatted(),
      type: 'STOCK',
      title: 'Returned to Stock from Service',
      description: 'Service completed. Tested and returned to active stock.',
      personName: target.contactName || '',
      personNumber: target.contactNumber || ''
    };

    const updatedMob = {
      ...target,
      status: 'Stock',
      serviceDetails: null,
      history: [stockHistory, ...(target.history || [])]
    };

    await updateMobileInDb(id, updatedMob);
    await logActivity('Returned to Stock', target.mobileName, target.im, 'stock', 'Service resolved and unit returned to available stock');
  }, [mobiles, logActivity]);

  // ─── PERSON HELPERS ─────────────────────────────────────────────────────────

  const findPersonHistory = useCallback((query) => {
    if (!query) return null;
    const cleanQuery = query.trim().toLowerCase();
    const cleanDigits = query.replace(/[^\d]/g, '');

    if (cleanDigits && personHistories[cleanDigits]) {
      return enrichPersonRecord(personHistories[cleanDigits]);
    }

    for (const [phone, record] of Object.entries(personHistories)) {
      if (
        (cleanDigits && phone.includes(cleanDigits)) ||
        record.name?.toLowerCase().includes(cleanQuery)
      ) {
        return enrichPersonRecord(record);
      }
    }

    const matchingMob = mobiles.find(m =>
      (m.contactNumber && cleanDigits && m.contactNumber.includes(cleanDigits)) ||
      (m.contactName && m.contactName.toLowerCase().includes(cleanQuery)) ||
      (m.saleDetails?.customerMobile && cleanDigits && m.saleDetails.customerMobile.includes(cleanDigits)) ||
      (m.saleDetails?.customerName && m.saleDetails.customerName.toLowerCase().includes(cleanQuery))
    );

    if (matchingMob) {
      const isSale = matchingMob.saleDetails &&
        ((cleanDigits && matchingMob.saleDetails.customerMobile?.includes(cleanDigits)) ||
          matchingMob.saleDetails.customerName?.toLowerCase().includes(cleanQuery));
      const name = isSale ? matchingMob.saleDetails.customerName : matchingMob.contactName;
      const phone = isSale ? matchingMob.saleDetails.customerMobile : matchingMob.contactNumber;
      return enrichPersonRecord({
        name: name || 'Customer',
        phone: phone || cleanDigits || '',
        role: isSale ? 'Customer' : 'Dealer / Supplier',
        events: []
      });
    }

    return null;
  }, [personHistories, mobiles]);

  const enrichPersonRecord = useCallback((record) => {
    if (!record) return null;
    const targetPhone = record.phone ? record.phone.replace(/[^\d]/g, '') : '';
    const targetName = record.name?.toLowerCase().trim() || '';

    const mobilesBought = [];
    const mobilesSupplied = [];
    const events = [...(record.events || [])];

    mobiles.forEach(m => {
      if (m.saleDetails) {
        const sPhone = m.saleDetails.customerMobile?.replace(/[^\d]/g, '');
        const sName = m.saleDetails.customerName?.toLowerCase().trim();
        if ((targetPhone && sPhone === targetPhone) || (targetName && sName === targetName)) {
          mobilesBought.push({
            id: m.id, mobileName: m.mobileName, ram: m.ram, storage: m.storage,
            im: m.im, imei: m.imei, price: m.saleDetails.sellPrice,
            saleDate: m.saleDetails.saleDate, saleTime: m.saleDetails.saleTime,
            saleType: m.saleDetails.saleType
          });
        }
      }

      const cPhone = m.contactNumber?.replace(/[^\d]/g, '');
      const cName = m.contactName?.toLowerCase().trim();
      if ((targetPhone && cPhone === targetPhone) || (targetName && cName === targetName)) {
        mobilesSupplied.push({
          id: m.id, mobileName: m.mobileName, ram: m.ram, storage: m.storage,
          im: m.im, imei: m.imei, inDate: m.inDate, status: m.status
        });
      }

      if (m.history) {
        m.history.forEach(h => {
          const hPhone = h.personNumber?.replace(/[^\d]/g, '');
          const hName = h.personName?.toLowerCase().trim();
          if ((targetPhone && hPhone === targetPhone) || (targetName && hName === targetName)) {
            const alreadyExists = events.some(e => e.date === h.date && e.time === h.time && e.description === h.description);
            if (!alreadyExists) {
              events.push({
                date: h.date, time: h.time, type: h.type || 'LOG',
                mobileName: m.mobileName, im: m.im, imei: m.imei,
                price: h.price || '-', description: h.description
              });
            }
          }
        });
      }
    });

    events.sort((a, b) => new Date(b.date + ' ' + (b.time || '12:00 PM')) - new Date(a.date + ' ' + (a.time || '12:00 PM')));

    return { ...record, mobilesBought, mobilesSupplied, events };
  }, [mobiles]);

  const getAllCustomers = useCallback(() => {
    const map = {};

    Object.values(personHistories).forEach(p => {
      const key = (p.phone ? p.phone.replace(/[^\d]/g, '') : '') || p.name?.toLowerCase().trim();
      if (key) {
        map[key] = {
          name: p.name, phone: p.phone,
          role: p.role || 'Customer',
          eventsCount: p.events?.length || 0,
          mobilesBought: [], mobilesSupplied: [],
          lastActiveDate: p.events?.[0]?.date || getCurrentDateFormatted()
        };
      }
    });

    mobiles.forEach(m => {
      if (m.contactName) {
        const key = (m.contactNumber ? m.contactNumber.replace(/[^\d]/g, '') : '') || m.contactName.toLowerCase().trim();
        if (!map[key]) {
          map[key] = {
            name: m.contactName, phone: m.contactNumber || '',
            role: m.contactName.toLowerCase().includes('dealer') ? 'Dealer / Supplier' : 'Customer / Party',
            eventsCount: 0, mobilesBought: [], mobilesSupplied: [],
            lastActiveDate: m.inDate || getCurrentDateFormatted()
          };
        }
        if (!map[key].mobilesSupplied.some(x => x.id === m.id)) {
          map[key].mobilesSupplied.push(m);
        }
      }

      if (m.saleDetails?.customerName) {
        const key = (m.saleDetails.customerMobile ? m.saleDetails.customerMobile.replace(/[^\d]/g, '') : '') || m.saleDetails.customerName.toLowerCase().trim();
        if (!map[key]) {
          map[key] = {
            name: m.saleDetails.customerName, phone: m.saleDetails.customerMobile || '',
            role: 'Customer', eventsCount: 0, mobilesBought: [], mobilesSupplied: [],
            lastActiveDate: m.saleDetails.saleDate || getCurrentDateFormatted()
          };
        }
        if (!map[key].mobilesBought.some(x => x.id === m.id)) {
          map[key].mobilesBought.push(m);
        }
      }
    });

    return Object.values(map);
  }, [personHistories, mobiles]);

  const calculateTradingTotals = useCallback(() => {
    const todayStr = getCurrentDateFormatted();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    let todayTotal = 0, weekTotal = 0, monthTotal = 0, yearTotal = 0;

    mobiles.forEach(mob => {
      if (mob.status === 'Sold' && mob.saleDetails) {
        const price = mob.saleDetails.sellPriceNumeric || parseSellPrice(mob.saleDetails.sellPrice);
        const saleDateStr = mob.saleDetails.saleDate;
        if (!saleDateStr) return;
        const saleDate = new Date(saleDateStr);
        if (saleDateStr === todayStr) todayTotal += price;
        if (saleDate >= oneWeekAgo && saleDate <= now) weekTotal += price;
        if (saleDate.getFullYear() === currentYear && saleDate.getMonth() === currentMonth) monthTotal += price;
        if (saleDate.getFullYear() === currentYear) yearTotal += price;
      }
    });

    return { today: todayTotal, week: weekTotal, month: monthTotal, year: yearTotal };
  }, [mobiles]);

  const openPersonProfile = useCallback((nameOrPhone) => {
    const person = findPersonHistory(nameOrPhone);
    if (person) {
      setPersonHistoryData(person);
    } else {
      setPersonHistoryData({
        name: nameOrPhone,
        phone: nameOrPhone.replace(/[^\d]/g, '') || '',
        role: 'Customer',
        mobilesBought: [], mobilesSupplied: [], events: []
      });
    }
  }, [findPersonHistory]);

  const allCustomersList = getAllCustomers();

  const counts = {
    total: mobiles.length,
    stock: mobiles.filter(m => m.status === 'Stock').length,
    service: mobiles.filter(m => m.status === 'Service').length,
    sold: mobiles.filter(m => m.status === 'Sold').length,
    customers: allCustomersList.length
  };

  return (
    <ShopContext.Provider
      value={{
        mobiles, activities, personHistories, counts, loading,
        currentScreen, setCurrentScreen,
        tradingVisible, setTradingVisible,
        // Modals
        isAddMobileOpen, setIsAddMobileOpen,
        selectedMobileForDetails, setSelectedMobileForDetails,
        selectedMobileForEdit, setSelectedMobileForEdit,
        selectedMobileForSell, setSelectedMobileForSell,
        selectedMobileForReturn, setSelectedMobileForReturn,
        selectedMobileForDelete, setSelectedMobileForDelete,
        billPreviewData, setBillPreviewData,
        imeiStickerData, setImeiStickerData,
        personHistoryData, setPersonHistoryData,
        isBarcodeScannerOpen, setIsBarcodeScannerOpen,
        barcodeScanResult, setBarcodeScanResult,
        // Methods
        addMobile, updateMobile, deleteMobile, sellMobile,
        returnMobile, returnToStock,
        findPersonHistory, getAllCustomers,
        openPersonProfile, calculateTradingTotals,
        enrichPersonRecord
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
}
