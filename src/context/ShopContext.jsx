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

  useEffect(() => {
    const initFirebase = async () => {
      await seedInitialData(INITIAL_MOBILES, INITIAL_ACTIVITIES, INITIAL_PERSON_HISTORIES);
    };
    initFirebase();

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

  const logActivity = useCallback(async (action, mobileName, im, type, details) => {
    const newAct = {
      id: 'act-' + Date.now() + Math.random().toString(36).substring(2, 5),
      action, mobileName, im, date: getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type, details
    };
    await addActivityToDb(newAct);
  }, []);

  const appendPersonHistory = useCallback(async (phone, name, event) => {
    if (!phone && !name) return;
    const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : name.replace(/\s+/g, '_').toLowerCase();
    const key = cleanPhone;
    const existing = personHistories[key] || { name: name || 'Customer', phone: cleanPhone, role: 'Customer', events: [] };
    const newEvent = { date: getCurrentDateFormatted(), time: getCurrentTimeFormatted(), ...event };
    const updatedPerson = { ...existing, name: name || existing.name, events: [newEvent, ...(existing.events || [])] };
    await upsertPersonInDb(cleanPhone, updatedPerson);
  }, [personHistories]);

  const addMobile = useCallback(async (newMob) => {
    const id = 'mob-' + Date.now() + Math.random().toString(36).substring(2, 5);
    const personName = newMob.contactName || newMob.personName || 'Person';
    const personNumber = newMob.contactNumber || newMob.personNumber || '';
    const fullMob = {
      ...newMob, id, status: 'Stock', contactName: personName, contactNumber: personNumber, serviceCount: 0, exchangeCount: 0,
      history: [{ date: newMob.inDate || getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type: 'INBOUND', title: 'Mobile Received into Stock', description: `Intake from ${personName}. IM: ${newMob.im}`, personName, personNumber }]
    };
    await addMobileToDb(fullMob);
    await logActivity('New Mobile Added', fullMob.mobileName, fullMob.im, 'added', `Added from ${personName}`);
    return fullMob;
  }, [logActivity]);

  const updateMobile = useCallback(async (id, updatedFields) => {
    await updateMobileInDb(id, updatedFields);
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
    const newHistoryEntry = { date: saleFormData.saleDate || getCurrentDateFormatted(), time: saleFormData.saleTime || getCurrentTimeFormatted(), type: 'SOLD', title: 'Sold Directly', description: `Sold to ${saleFormData.customerName}. Price: ${saleFormData.sellPrice}`, price: saleFormData.sellPrice, personName: saleFormData.customerName, personNumber: saleFormData.customerMobile };
    const nextHistory = [newHistoryEntry, ...(target.history || [])];
    
    // Saves exactly to database so real-time data syncs all tabs together smoothly!
    await updateMobileInDb(id, { status: 'Sold', saleDetails, history: nextHistory });
    await logActivity('Mobile Sold', target.mobileName, target.im, 'sell', `Sold to ${saleFormData.customerName}`);
    setSelectedMobileForSell(null); 
  }, [mobiles, logActivity]);

  const restockMobile = useCallback(async (oldMobileId, restockDetails) => {
    const target = mobiles.find(m => m.id === oldMobileId);
    if (!target) return;
    const newId = 'mob-' + Date.now() + '-restock';
    const restockedMob = {
      ...target, id: newId, status: 'Stock', inDate: getCurrentDateFormatted(), description: restockDetails.description || `Restocked item.`, saleDetails: null,
      history: [{ date: getCurrentDateFormatted(), time: getCurrentTimeFormatted(), type: 'RESTOCK', title: 'Mobile Restocked into System', description: `Item re-added using original Barcode/IMEI: ${target.imei || 'N/A'}` }, ...(target.history || [])]
    };
    await addMobileToDb(restockedMob);
    await logActivity('Mobile Restocked', target.mobileName, target.im, 'added', `Restocked unit with IMEI: ${target.imei}`);
  }, [mobiles, logActivity]);

  const openMobileScanner = useCallback(() => {
    setBarcodeScanResult(null);
    setIsBarcodeScannerOpen(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).catch(err => console.error(err));
    }
  }, []);

  return (
    <ShopContext.Provider value={{
      mobiles, activities, personHistories, loading, currentScreen, setCurrentScreen, tradingVisible, setTradingVisible,
      isAddMobileOpen, setIsAddMobileOpen, selectedMobileForDetails, setSelectedMobileForDetails, selectedMobileForEdit, setSelectedMobileForEdit,
      selectedMobileForSell, setSelectedMobileForSell, selectedMobileForReturn, setSelectedMobileForReturn, selectedMobileForDelete, setSelectedMobileForDelete,
      billPreviewData, setBillPreviewData, imeiStickerData, setImeiStickerData, personHistoryData, setPersonHistoryData, isBarcodeScannerOpen, setIsBarcodeScannerOpen,
      barcodeScanResult, setBarcodeScanResult, addMobile, updateMobile, deleteMobile, sellMobile, restockMobile, openMobileScanner
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
