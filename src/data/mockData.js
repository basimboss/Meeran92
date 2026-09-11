export const INITIAL_MOBILES = [
  {
    id: 'mob-1',
    mobileName: 'Samsung Galaxy S25 Ultra',
    ram: '12GB',
    storage: '256GB',
    im: 'IM-9201',
    imei: '864294061839201',
    inDate: '2026-09-08',
    contactName: 'Kumar Dealer',
    contactNumber: '9840122334',
    description: 'Brand new seal-packed unit, Phantom Black, Box & 65W adapter',
    status: 'Stock',
    serviceCount: 0,
    exchangeCount: 0,
    history: [
      {
        date: '2026-09-08',
        time: '10:30 AM',
        type: 'INBOUND',
        title: 'Mobile Received from Dealer',
        description: 'New stock intake supplied by Kumar Dealer. IM: IM-9201',
        personName: 'Kumar Dealer',
        personNumber: '9840122334'
      }
    ]
  },
  {
    id: 'mob-2',
    mobileName: 'iPhone 15 Pro Max',
    ram: '8GB',
    storage: '512GB',
    im: 'IM-9202',
    imei: '358941094829105',
    inDate: '2026-09-02',
    contactName: 'Kumar Dealer',
    contactNumber: '9840122334',
    description: 'Natural Titanium, immaculate condition, 98% battery health',
    status: 'Sold',
    serviceCount: 1,
    exchangeCount: 1,
    saleDetails: {
      customerName: 'Rajesh Sharma',
      customerMobile: '9876543210',
      saleDate: '2026-09-11',
      saleTime: '11:40 AM',
      sellPrice: '₹1,18,000',
      sellPriceNumeric: 118000,
      saleType: 'Sell Directly',
      description: 'Customer paid full UPI payment with 6 months store warranty'
    },
    history: [
      {
        date: '2026-09-02',
        time: '11:15 AM',
        type: 'INBOUND',
        title: 'Supplied by Kumar Dealer',
        description: 'Lot intake from Kumar Dealer',
        personName: 'Kumar Dealer',
        personNumber: '9840122334'
      },
      {
        date: '2026-09-04',
        time: '03:20 PM',
        type: 'SERVICE',
        title: 'Service Inspection #1',
        description: 'Sent for camera sensor calibration and clean-up',
        personName: 'Kumar Dealer',
        personNumber: '9840122334'
      },
      {
        date: '2026-09-06',
        time: '01:10 PM',
        type: 'STOCK',
        title: 'Returned to Stock from Service',
        description: 'Camera sensor certified 100% OK, returned to stock',
        personName: 'Shop Tech',
        personNumber: ''
      },
      {
        date: '2026-09-09',
        time: '02:15 PM',
        type: 'EXCHANGE',
        title: 'Exchange Valuation Processed',
        description: 'Valuation logged for customer exchange proposal',
        personName: 'Rajesh Sharma',
        personNumber: '9876543210'
      },
      {
        date: '2026-09-11',
        time: '11:40 AM',
        type: 'SOLD',
        title: 'Sold Directly',
        description: 'Sold to Rajesh Sharma for ₹1,18,000',
        price: '₹1,18,000',
        personName: 'Rajesh Sharma',
        personNumber: '9876543210'
      }
    ]
  },
  {
    id: 'mob-3',
    mobileName: 'OnePlus 12 5G',
    ram: '16GB',
    storage: '512GB',
    im: 'IM-9203',
    imei: '869281049281042',
    inDate: '2026-09-05',
    contactName: 'Kumar Dealer',
    contactNumber: '9840122334',
    description: 'Emerald Green, original 100W SuperVOOC charger included',
    status: 'Stock',
    serviceCount: 0,
    exchangeCount: 0,
    history: [
      {
        date: '2026-09-05',
        time: '11:00 AM',
        type: 'INBOUND',
        title: 'Stock Added by Kumar Dealer',
        description: 'Batch shipment from Kumar Dealer',
        personName: 'Kumar Dealer',
        personNumber: '9840122334'
      }
    ]
  },
  {
    id: 'mob-4',
    mobileName: 'Vivo V40 Pro',
    ram: '12GB',
    storage: '256GB',
    im: 'IM-9204',
    imei: '',
    inDate: '2026-09-07',
    contactName: 'Imran Ali',
    contactNumber: '9711055667',
    description: 'Titanium Grey, Zeiss optics series',
    status: 'Stock',
    serviceCount: 0,
    exchangeCount: 0,
    history: [
      {
        date: '2026-09-07',
        time: '04:10 PM',
        type: 'INBOUND',
        title: 'Stock Added',
        description: 'Direct customer intake from Imran Ali (Awaiting Barcode)',
        personName: 'Imran Ali',
        personNumber: '9711055667'
      }
    ]
  },
  {
    id: 'mob-5',
    mobileName: 'Google Pixel 9 Pro',
    ram: '16GB',
    storage: '128GB',
    im: 'IM-9205',
    imei: '354891028394012',
    inDate: '2026-08-28',
    contactName: 'Mohammed Aslam',
    contactNumber: '9845067890',
    description: 'Obsidian color, display refresh glitch under service inspection',
    status: 'Service',
    serviceCount: 2,
    exchangeCount: 1,
    serviceDetails: {
      serviceDate: '2026-09-06',
      serviceReason: 'Display Refresh Glitch & Green Line Check',
      description: 'Submitted to Google authorized service partner for panel inspection under warranty'
    },
    history: [
      {
        date: '2026-08-28',
        time: '01:20 PM',
        type: 'EXCHANGE',
        title: 'Exchange Intake #1',
        description: 'Intake on exchange from Mohammed Aslam',
        personName: 'Mohammed Aslam',
        personNumber: '9845067890'
      },
      {
        date: '2026-09-01',
        time: '11:00 AM',
        type: 'SERVICE',
        title: 'Service Entry #1',
        description: 'Software diagnosis & firmware flash',
        personName: 'Mohammed Aslam',
        personNumber: '9845067890'
      },
      {
        date: '2026-09-03',
        time: '02:30 PM',
        type: 'STOCK',
        title: 'Returned to Stock',
        description: 'Firmware updated, returned to stock',
        personName: 'Shop Tech',
        personNumber: ''
      },
      {
        date: '2026-09-06',
        time: '03:45 PM',
        type: 'SERVICE',
        title: 'Service Entry #2 (Current)',
        description: 'Hardware green line appeared, panel replacement requested',
        personName: 'Mohammed Aslam',
        personNumber: '9845067890'
      }
    ]
  },
  {
    id: 'mob-6',
    mobileName: 'Samsung Galaxy A55 5G',
    ram: '8GB',
    storage: '128GB',
    im: 'IM-9206',
    imei: '861940294829103',
    inDate: '2026-09-02',
    contactName: 'Kumar Dealer',
    contactNumber: '9840122334',
    description: 'Awesome Navy, fast selling mid-range unit',
    status: 'Sold',
    serviceCount: 0,
    exchangeCount: 1,
    saleDetails: {
      customerName: 'Priya Sharma',
      customerMobile: '9822011223',
      saleDate: '2026-09-10',
      saleTime: '06:15 PM',
      sellPrice: '₹38,500',
      sellPriceNumeric: 38500,
      saleType: 'Exchange',
      exchangeMobileName: 'Redmi Note 11 Pro',
      exchangeMobileIm: 'EX-991',
      description: 'Customer exchanged old Redmi Note 11 and paid balance'
    },
    history: [
      {
        date: '2026-09-02',
        time: '12:00 PM',
        type: 'INBOUND',
        title: 'Supplied by Kumar Dealer',
        description: 'Intake batch from Kumar Dealer',
        personName: 'Kumar Dealer',
        personNumber: '9840122334'
      },
      {
        date: '2026-09-10',
        time: '06:15 PM',
        type: 'SOLD',
        title: 'Sold on Exchange',
        description: 'Sold to Priya Sharma with Exchange of Redmi Note 11 Pro (EX-991). Price: ₹38,500',
        price: '₹38,500',
        personName: 'Priya Sharma',
        personNumber: '9822011223'
      }
    ]
  },
  {
    id: 'mob-7',
    mobileName: 'Xiaomi 14 Ultra',
    ram: '16GB',
    storage: '512GB',
    im: 'IM-9207',
    imei: '869402847291028',
    inDate: '2026-08-20',
    contactName: 'Rajesh Sharma',
    contactNumber: '9876543210',
    description: 'Leica photography kit edition, White Ceramic',
    status: 'Stock',
    serviceCount: 0,
    exchangeCount: 1,
    history: [
      {
        date: '2026-08-20',
        time: '01:15 PM',
        type: 'RETURN',
        title: 'Customer Return Handled',
        description: 'Exchanged back to shop stock by Rajesh Sharma',
        personName: 'Rajesh Sharma',
        personNumber: '9876543210'
      }
    ]
  },
  {
    id: 'mob-8',
    mobileName: 'Realme GT 6',
    ram: '12GB',
    storage: '256GB',
    im: 'IM-9208',
    imei: '865829104928103',
    inDate: '2026-09-04',
    contactName: 'Super Cell Hub',
    contactNumber: '9822011223',
    description: 'Fluid Silver, Snapdragon 8s Gen 3',
    status: 'Service',
    serviceCount: 1,
    exchangeCount: 0,
    serviceDetails: {
      serviceDate: '2026-09-09',
      serviceReason: 'Speaker distortion and mic failure',
      description: 'Hardware audio jack and lower flex board inspection'
    },
    history: [
      {
        date: '2026-09-04',
        time: '11:45 AM',
        type: 'INBOUND',
        title: 'Stock Added',
        description: 'Supplied by Super Cell Hub',
        personName: 'Super Cell Hub',
        personNumber: '9822011223'
      },
      {
        date: '2026-09-09',
        time: '01:10 PM',
        type: 'SERVICE',
        title: 'Service Entry #1 (Current)',
        description: 'Speaker distortion and mic failure diagnosed',
        personName: 'Super Cell Hub',
        personNumber: '9822011223'
      }
    ]
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    action: 'Mobile Sold',
    mobileName: 'iPhone 15 Pro Max',
    im: 'IM-9202',
    date: '2026-09-11',
    time: '11:40 AM',
    type: 'sold',
    details: 'Sold directly to Rajesh Sharma for ₹1,18,000'
  },
  {
    id: 'act-2',
    action: 'Mobile Sold (Exchange)',
    mobileName: 'Samsung Galaxy A55 5G',
    im: 'IM-9206',
    date: '2026-09-10',
    time: '06:15 PM',
    type: 'sold',
    details: 'Sold with exchange of Redmi Note 11 Pro to Priya Sharma'
  },
  {
    id: 'act-3',
    action: 'Moved to Service',
    mobileName: 'Realme GT 6',
    im: 'IM-9208',
    date: '2026-09-09',
    time: '01:10 PM',
    type: 'service',
    details: 'Speaker distortion diagnosed and logged'
  },
  {
    id: 'act-4',
    action: 'New Mobile Added',
    mobileName: 'Samsung Galaxy S25 Ultra',
    im: 'IM-9201',
    date: '2026-09-08',
    time: '10:30 AM',
    type: 'added',
    details: 'Supplied by Kumar Dealer [IM-9201]'
  },
  {
    id: 'act-5',
    action: 'New Mobile Added',
    mobileName: 'Vivo V40 Pro',
    im: 'IM-9204',
    date: '2026-09-07',
    time: '04:10 PM',
    type: 'added',
    details: 'Added from Imran Ali (No Barcode)'
  },
  {
    id: 'act-6',
    action: 'Moved to Service',
    mobileName: 'Google Pixel 9 Pro',
    im: 'IM-9205',
    date: '2026-09-06',
    time: '03:45 PM',
    type: 'service',
    details: 'Display Refresh Glitch sent to service center'
  }
];

export const INITIAL_PERSON_HISTORIES = {
  '9840122334': {
    name: 'Kumar Dealer',
    phone: '9840122334',
    role: 'Dealer / Supplier',
    events: [
      {
        date: '2026-09-08',
        time: '10:30 AM',
        type: 'BOUGHT',
        mobileName: 'Samsung Galaxy S25 Ultra',
        im: 'IM-9201',
        imei: '864294061839201',
        price: '₹1,05,000',
        description: 'Supplied Samsung Galaxy S25 Ultra 12GB/256GB to shop stock'
      },
      {
        date: '2026-09-05',
        time: '11:00 AM',
        type: 'BOUGHT',
        mobileName: 'OnePlus 12 5G',
        im: 'IM-9203',
        imei: '869281049281042',
        price: '₹54,000',
        description: 'Supplied OnePlus 12 16GB/512GB to shop stock'
      },
      {
        date: '2026-09-02',
        time: '12:00 PM',
        type: 'BOUGHT',
        mobileName: 'Samsung Galaxy A55 5G',
        im: 'IM-9206',
        imei: '861940294829103',
        price: '₹32,000',
        description: 'Supplied Samsung A55 8GB/128GB to shop stock'
      },
      {
        date: '2026-09-02',
        time: '11:15 AM',
        type: 'BOUGHT',
        mobileName: 'iPhone 15 Pro Max',
        im: 'IM-9202',
        imei: '358941094829105',
        price: '₹95,000',
        description: 'Supplied iPhone 15 Pro Max 8GB/512GB to shop stock'
      }
    ]
  },
  '9876543210': {
    name: 'Rajesh Sharma',
    phone: '9876543210',
    role: 'Customer',
    events: [
      {
        date: '2026-09-11',
        time: '11:40 AM',
        type: 'SOLD',
        mobileName: 'iPhone 15 Pro Max',
        im: 'IM-9202',
        imei: '358941094829105',
        price: '₹1,18,000',
        description: 'Customer purchased iPhone 15 Pro Max, full UPI payment'
      },
      {
        date: '2026-09-09',
        time: '02:15 PM',
        type: 'EXCHANGE',
        mobileName: 'iPhone 15 Pro Max',
        im: 'IM-9202',
        imei: '358941094829105',
        price: '-',
        description: 'Handed over for exchange valuation proposal'
      },
      {
        date: '2026-08-20',
        time: '01:15 PM',
        type: 'RETURN',
        mobileName: 'Xiaomi 14 Ultra',
        im: 'IM-9207',
        imei: '869402847291028',
        price: '-',
        description: 'Customer return for model change preference'
      }
    ]
  },
  '9822011223': {
    name: 'Priya Sharma',
    phone: '9822011223',
    role: 'Customer',
    events: [
      {
        date: '2026-09-10',
        time: '06:15 PM',
        type: 'SOLD',
        mobileName: 'Samsung Galaxy A55 5G',
        im: 'IM-9206',
        imei: '861940294829103',
        price: '₹38,500',
        description: 'Purchased Samsung Galaxy A55 5G with exchange of Redmi Note 11 Pro (EX-991)'
      },
      {
        date: '2026-09-05',
        time: '11:00 AM',
        type: 'BOUGHT',
        mobileName: 'Realme GT 6',
        im: 'IM-9208',
        imei: '865829104928103',
        price: '-',
        description: 'Delivery intake Super Cell Hub'
      }
    ]
  },
  '9845067890': {
    name: 'Mohammed Aslam',
    phone: '9845067890',
    role: 'Customer',
    events: [
      {
        date: '2026-09-06',
        time: '03:45 PM',
        type: 'SERVICE',
        mobileName: 'Google Pixel 9 Pro',
        im: 'IM-9205',
        imei: '354891028394012',
        price: '-',
        description: 'Submitted mobile for screen panel glitch service check'
      },
      {
        date: '2026-08-28',
        time: '01:20 PM',
        type: 'EXCHANGE',
        mobileName: 'Google Pixel 9 Pro',
        im: 'IM-9205',
        imei: '354891028394012',
        price: '-',
        description: 'Original exchange intake handover'
      }
    ]
  },
  '9711055667': {
    name: 'Imran Ali',
    phone: '9711055667',
    role: 'Customer',
    events: [
      {
        date: '2026-09-07',
        time: '04:10 PM',
        type: 'BOUGHT',
        mobileName: 'Vivo V40 Pro',
        im: 'IM-9204',
        imei: '',
        price: '-',
        description: 'Mobile sold to shop without barcode'
      }
    ]
  }
};
