import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api';
import { useCategories } from '../context/CategoriesContext';

const CATEGORY_IMAGES = {
  'צלם': [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3811082/pexels-photo-3811082.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2606596/pexels-photo-2606596.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3585798/pexels-photo-3585798.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'מאפרת': [
    'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1813346/pexels-photo-1813346.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2688992/pexels-photo-2688992.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'קייטרינג': [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2291367/pexels-photo-2291367.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/784633/pexels-photo-784633.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'DJ': [
    'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2078071/pexels-photo-2078071.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1649693/pexels-photo-1649693.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1916821/pexels-photo-1916821.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3321796/pexels-photo-3321796.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'פרחים': [
    'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1477166/pexels-photo-1477166.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2879226/pexels-photo-2879226.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'אולם': [
    'https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/265920/pexels-photo-265920.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2291599/pexels-photo-2291599.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'תכשיטים': [
    'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1616096/pexels-photo-1616096.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1616096/pexels-photo-1616096.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'הסעות': [
    'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3422964/pexels-photo-3422964.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3422964/pexels-photo-3422964.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'עוגות': [
    'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2144200/pexels-photo-2144200.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3992131/pexels-photo-3992131.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
};

const CATEGORY_ICON = {
  'צלם': '📸', 'מאפרת': '💄', 'קייטרינג': '🍽️', 'DJ': '🎧',
  'פרחים': '💐', 'אולם': '🏛️', 'תכשיטים': '💍', 'הסעות': '🚌', 'עוגות': '🎂',
};

const STATS = [
  { value: '500+', label: 'ספקים מקצועיים' },
  { value: '2,000+', label: 'אירועים מוצלחים' },
  { value: '4.8★', label: 'דירוג ממוצע' },
  { value: '100%', label: 'שביעות רצון' },
];

function getCardImage(p, catMap) {
  if (catMap[p.Category]?.BannerUrl) return catMap[p.Category].BannerUrl;
  const imgs = CATEGORY_IMAGES[p.Category];
  return imgs ? imgs[p.Id % imgs.length] : null;
}

function SkeletonCard() {
  return (
    <div className="provider-card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="card-body">
        <div className="skeleton skeleton-badge" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-footer" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, catMap } = useCategories();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(() => {
    return searchParams.get('category') || sessionStorage.getItem('hp_category') || 'הכל';
  });
  const [minRating, setMinRating] = useState(() => sessionStorage.getItem('hp_minRating') || '');
  const [search, setSearch] = useState(() => sessionStorage.getItem('hp_search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => sessionStorage.getItem('hp_search') || '');
  const [sortBy, setSortBy] = useState(() => sessionStorage.getItem('hp_sortBy') || '');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [hoveredCard, setHoveredCard] = useState(null);

  // שמור מצב פילטרים ב-sessionStorage
  useEffect(() => { sessionStorage.setItem('hp_category', activeCategory); }, [activeCategory]);
  useEffect(() => { sessionStorage.setItem('hp_minRating', minRating); }, [minRating]);
  useEffect(() => { sessionStorage.setItem('hp_sortBy', sortBy); }, [sortBy]);
  useEffect(() => { sessionStorage.setItem('hp_search', search); }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const allCats = [{ Name: 'הכל', Icon: '✨' }, ...categories];
  const getIcon = (cat) => catMap[cat]?.Icon || CATEGORY_ICON[cat] || '🎉';
  const getCardImage = (p) => {
    if (p.CoverImage) return p.CoverImage;
    if (catMap[p.Category]?.BannerUrl) return catMap[p.Category].BannerUrl;
    const imgs = CATEGORY_IMAGES[p.Category];
    return imgs ? imgs[p.Id % imgs.length] : null;
  };
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== activeCategory) setActiveCategory(cat);
  }, [searchParams]); // eslint-disable-line

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory !== 'הכל') params.category = activeCategory;
    if (minRating) params.minRating = minRating;
    if (sortBy) params.sortBy = sortBy;
    api.get('/providers', { params })
      .then(r => setProviders(r.data))
      .finally(() => setLoading(false));
  }, [activeCategory, minRating, sortBy]);

  const filtered = debouncedSearch
    ? providers.filter(p =>
        p.BusinessName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.WorkArea?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : providers;

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem('favorites', JSON.stringify(next));
  };

  const isNew = (p) => !p.ReviewCount;

  return (
    <div>
      <Helmet>
        <title>EventPro - מרקטפלייס לאירועים</title>
        <meta name="description" content="מצא צלמים, מאפרות, קייטרינג, DJ ועוד לאירוע שלך. אלפי ספקים מקצועיים בישראל." />
      </Helmet>
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ הפלטפורמה #1 לאירועים בישראל</div>
          <h1>מצא את הספק המושלם<br />לאירוע שלך</h1>
          <p>אלפי ספקים מקצועיים — צלמים, מאפרות, קייטרינג ועוד</p>
          <div className="hero-search">
            <span className="hero-search-icon">🔍</span>
            <input
              type="text"
              placeholder="חפש לפי שם עסק או אזור..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="hero-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        {STATS.map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="categories">
        {allCats.map(c => (
          <button
            key={c.Name}
            className={`cat-pill ${activeCategory === c.Name ? 'active' : ''}`}
            onClick={() => setActiveCategory(c.Name)}
          >
            <span>{c.Icon}</span> {c.Name}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="filters">
        <span className="filters-label">סנן לפי:</span>
        <select value={minRating} onChange={e => setMinRating(e.target.value)}>
          <option value="">כל הדירוגים</option>
          <option value="4">⭐ 4+ כוכבים</option>
          <option value="3">⭐ 3+ כוכבים</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">מיון: ברירת מחדל</option>
          <option value="rating">מיון: דירוג גבוה</option>
          <option value="price">מיון: מחיר נמוך</option>
          <option value="new">מיון: חדש</option>
        </select>
        {(minRating || sortBy || activeCategory !== 'הכל' || search) && (
          <button className="clear-filters" onClick={() => {
            setMinRating(''); setSortBy(''); setActiveCategory('הכל'); setSearch('');
            sessionStorage.removeItem('hp_category');
            sessionStorage.removeItem('hp_minRating');
            sessionStorage.removeItem('hp_sortBy');
            sessionStorage.removeItem('hp_search');
          }}>
            נקה פילטרים ✕
          </button>
        )}
        <span className="results-count">{loading ? '' : `${filtered.length} ספקים`}</span>
      </div>

      {/* Grid */}
      <div className="providers-grid">
        {loading
          ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map((p, i) => {
              return (
                <Link
                  to={`/provider/${p.Id}`}
                  key={p.Id}
                  className="provider-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onMouseEnter={() => setHoveredCard(p.Id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="card-image-wrap">
                    {getCardImage(p)
                      ? <img
                          className="card-image"
                          src={hoveredCard === p.Id
                            ? (CATEGORY_IMAGES[p.Category]?.[(p.Id + 1) % CATEGORY_IMAGES[p.Category]?.length] || getCardImage(p))
                            : getCardImage(p)}
                          alt={p.Category} loading="lazy"
                          onLoad={e => e.target.classList.remove('loading')}
                          style={{filter: 'blur(0)'}}
                        />
                      : <div className="card-image-placeholder">{getIcon(p.Category)}</div>
                    }
                    <div className="card-image-overlay" />
                    <div className="card-category-float">
                      <span>{getIcon(p.Category)}</span> {p.Category}
                    </div>
                    {isNew(p) && <div className="card-new-badge">✨ חדש</div>}
                    {p.AverageRating > 0 && (
                      <div className="card-rating-float">⭐ {p.AverageRating.toFixed(1)}</div>
                    )}
                    <button
                      className={`card-fav-btn ${favorites.includes(p.Id) ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(e, p.Id)}
                    >{favorites.includes(p.Id) ? '❤️' : '🤍'}</button>
                  </div>
                  <div className="card-body">
                    <h3>{p.BusinessName}</h3>
                    <p className="work-area">📍 {p.WorkArea}</p>
                    <div className="card-footer">
                      <span className="card-rating">
                        {'★'.repeat(Math.round(p.AverageRating || 0))}{'☆'.repeat(5 - Math.round(p.AverageRating || 0))}
                        <span className="card-rating-num">{p.AverageRating > 0 ? p.AverageRating.toFixed(1) : 'חדש'}</span>
                        {p.ReviewCount > 0 && <span className="card-review-count">({p.ReviewCount})</span>}
                      </span>
                      {p.PriceFrom && <span className="card-price">החל מ-₪{Number(p.PriceFrom).toLocaleString()}</span>}
                    </div>
                  </div>
                </Link>
              );
            })
        }
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>לא נמצאו ספקים</p>
            <span>נסה לשנות את הפילטרים</span>
          </div>
        )}
      </div>
    </div>
  );
}
