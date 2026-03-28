import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const DEFAULT_PRODUCTS = [
  {
    id: 'h001', name: "Nebula Puff Hoodie", category: 'hoodies',
    price: 1299, printType: 'Puff Print', image: '',
    sizes: ['S','M','L','XL','XXL'],
    fabrics: ['Luxury Fleece','Ultra-Soft Poly-Blend','Heavyweight Cotton'],
    colors: ['Obsidian Black','Platinum White','Midnight Navy'],
    prints: ['Puff Print','3D Gel Print','Shiny Metallic','DTG'],
    description: 'Premium heavyweight hoodie with stunning puff print. Custom orders in 5-7 days.',
    leadTime: '5-7 days', featured: true,
  },
  {
    id: 'h002', name: "Galaxy 3D Hoodie", category: 'hoodies',
    price: 1499, printType: '3D Gel Print', image: '',
    sizes: ['S','M','L','XL','XXL'],
    fabrics: ['Luxury Fleece','Heavyweight Cotton'],
    colors: ['Obsidian Black','Midnight Navy','Ember Red'],
    prints: ['3D Gel Print','Puff Print'],
    description: 'Bold 3D gel print on ultra-plush fleece. Eye-catching from every angle.',
    leadTime: '7-10 days', featured: true,
  },
  {
    id: 't001', name: "Shiny Chrome Tee", category: 'tshirts',
    price: 699, printType: 'Shiny Metallic', image: '',
    sizes: ['S','M','L','XL','XXL'],
    fabrics: ['Ultra-Soft Poly-Blend','Heavyweight Cotton'],
    colors: ['Platinum White','Obsidian Black','Midnight Navy'],
    prints: ['Shiny Metallic','Classic Screen','DTG'],
    description: 'Reflective metallic print on premium poly-blend. Makes you stand out instantly.',
    leadTime: '4-6 days', featured: true,
  },
  {
    id: 't002', name: "Puff Print Streetwear Tee", category: 'tshirts',
    price: 799, printType: 'Puff Print', image: '',
    sizes: ['S','M','L','XL','XXL'],
    fabrics: ['Heavyweight Cotton','Ultra-Soft Poly-Blend'],
    colors: ['Ember Red','Obsidian Black','Platinum White'],
    prints: ['Puff Print','Classic Screen'],
    description: 'Thick raised puff print for maximum street cred. 100% custom design.',
    leadTime: '4-6 days', featured: false,
  },
  {
    id: 'tr001', name: "Custom Print Track Pant", category: 'trousers',
    price: 1099, printType: 'DTG', image: '',
    sizes: ['S','M','L','XL','XXL'],
    fabrics: ['Lightweight Fleece','Cotton Blend'],
    colors: ['Obsidian Black','Midnight Navy','Midnight Navy'],
    prints: ['DTG','Shiny Metallic','Classic Screen'],
    description: 'Comfortable all-day track pants with vibrant DTG print. Slim or relaxed fit.',
    leadTime: '5-7 days', featured: true,
  },
  {
    id: 'tr002', name: "Metallic Jogger", category: 'trousers',
    price: 1199, printType: 'Shiny Metallic', image: '',
    sizes: ['S','M','L','XL','XXL'],
    fabrics: ['Lightweight Fleece','Cotton Blend'],
    colors: ['Obsidian Black','Platinum White'],
    prints: ['Shiny Metallic','Puff Print'],
    description: 'Statement joggers with eye-catching metallic prints. Perfect for streetwear looks.',
    leadTime: '5-8 days', featured: false,
  },
];

const LS_PRODUCTS = 'gestalt_products';
const LS_LEADS    = 'gestalt_leads';
const LS_WA       = 'gestalt_wa_number';

export function AppProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try { const s = localStorage.getItem(LS_PRODUCTS); return s ? JSON.parse(s) : DEFAULT_PRODUCTS; }
    catch { return DEFAULT_PRODUCTS; }
  });
  const [leads, setLeads] = useState(() => {
    try { const s = localStorage.getItem(LS_LEADS); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [waNumber, setWaNumber] = useState(() => localStorage.getItem(LS_WA) || '919999999999');

  useEffect(() => { localStorage.setItem(LS_PRODUCTS, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(LS_LEADS, JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem(LS_WA, waNumber); }, [waNumber]);

  const addProduct = (p) => setProducts(prev => [{ id: `p${Date.now()}`, ...p }, ...prev]);
  const updateProduct = (id, data) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const addLead = (lead) => {
    const entry = { id: `L${Date.now()}`, createdAt: new Date().toISOString(), status: 'Lead Received', ...lead };
    setLeads(prev => [entry, ...prev]);
    return entry.id;
  };
  const updateLead = (id, data) => setLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));

  return (
    <AppContext.Provider value={{
      products, leads, waNumber,
      setWaNumber, addProduct, updateProduct, deleteProduct, addLead, updateLead,
      featured: products.filter(p => p.featured),
      byCategory: (cat) => products.filter(p => p.category === cat),
      getProduct: (id) => products.find(p => p.id === id),
    }}>
      {children}
    </AppContext.Provider>
  );
}
