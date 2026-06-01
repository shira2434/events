import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);

  const load = () =>
    api.get('/providers/categories/all').then(r => setCategories(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  // map by name for easy lookup: { 'צלם': { Name, Icon, BannerUrl } }
  const catMap = Object.fromEntries(categories.map(c => [c.Name, c]));

  return (
    <CategoriesContext.Provider value={{ categories, catMap, reload: load }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => useContext(CategoriesContext);
