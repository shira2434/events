import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CATEGORIES = [
  { name: 'הכל', icon: '✨' },
  { name: 'צלם', icon: '📸' },
  { name: 'מאפרת', icon: '💄' },
  { name: 'קייטרינג', icon: '🍽️' },
  { name: 'DJ', icon: '🎧' },
  { name: 'פרחים', icon: '💐' },
  { name: 'אולם', icon: '🏛️' },
  { name: 'תכשיטים', icon: '💍' },
  { name: 'הסעות', icon: '🚌' },
  { name: 'עוגות', icon: '🎂' },
];

const CATEGORY_IMAGES = {
  'צלם': [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'מאפרת': [
    'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1813346/pexels-photo-1813346.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'קייטרינג': [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2291367/pexels-photo-2291367.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'DJ': [
    'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'פרחים': [
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
  ],
  'תכשיטים': [
    'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'הסעות': [
    'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&w=600&h=400&fit=crop',
  ],
  'עוגות': [
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

function getImageForProvider(provider) {
  const images = CATEGORY_IMAGES[provider.Category];
  if (!images) return null;
  return images[provider.Id % images.length];
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
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [minRating, setMinRating] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory !== 'הכל') params.category = activeCategory;
    if (minRating) params.minRating = minRating;
    api.get('/providers', { params })
      .then(r => setProviders(r.data))
      .finally(() => setLoading(false));
  }, [activeCategory, minRating]);

  const filtered = search
    ? providers.filter(p =>
        p.BusinessName?.toLowerCase().includes(search.toLowerCase()) ||
        p.WorkArea?.toLowerCase().includes(search.toLowerCase())
      )
    : providers;

  return (
    <div>
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
        {CATEGORIES.map(c => (
          <button
            key={c.name}
            className={`cat-pill ${activeCategory === c.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(c.name)}
          >
            <span>{c.icon}</span> {c.name}
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
        {(minRating || activeCategory !== 'הכל' || search) && (
          <button className="clear-filters" onClick={() => { setMinRating(''); setActiveCategory('הכל'); setSearch(''); }}>
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
              const img = getImageForProvider(p);
              return (
                <Link
                  to={`/provider/${p.Id}`}
                  key={p.Id}
                  className="provider-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="card-image-wrap">
                    {img
                      ? <img className="card-image" src={img} alt={p.Category} loading="lazy" />
                      : <div className="card-image-placeholder">{CATEGORY_ICON[p.Category] || '🎉'}</div>
                    }
                    <div className="card-image-overlay" />
                    <div className="card-category-float">
                      <span>{CATEGORY_ICON[p.Category]}</span> {p.Category}
                    </div>
                    {p.AverageRating > 0 && (
                      <div className="card-rating-float">⭐ {p.AverageRating.toFixed(1)}</div>
                    )}
                  </div>
                  <div className="card-body">
                    <h3>{p.BusinessName}</h3>
                    <p className="work-area">📍 {p.WorkArea}</p>
                    <div className="card-footer">
                      <span className="card-rating">
                        {'★'.repeat(Math.round(p.AverageRating || 0))}{'☆'.repeat(5 - Math.round(p.AverageRating || 0))}
                        <span className="card-rating-num">{p.AverageRating > 0 ? p.AverageRating.toFixed(1) : 'חדש'}</span>
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
