import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useCategories } from '../context/CategoriesContext';

const CATEGORY_IMAGES = {
  'צלם': ['https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&w=600&h=400&fit=crop'],
  'מאפרת': ['https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&w=600&h=400&fit=crop'],
  'קייטרינג': ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=600&h=400&fit=crop'],
  'DJ': ['https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&w=600&h=400&fit=crop'],
  'פרחים': ['https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop'],
  'אולם': ['https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&w=600&h=400&fit=crop'],
  'תכשיטים': ['https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&w=600&h=400&fit=crop'],
  'הסעות': ['https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&w=600&h=400&fit=crop'],
  'עוגות': ['https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&w=600&h=400&fit=crop'],
};
const CATEGORY_ICON = {
  'צלם': '📸', 'מאפרת': '💄', 'קייטרינג': '🍽️', 'DJ': '🎧',
  'פרחים': '💐', 'אולם': '🏛️', 'תכשיטים': '💍', 'הסעות': '🚌', 'עוגות': '🎂',
};

export default function FavoritesPage() {
  const { catMap } = useCategories();
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!favorites.length) { setLoading(false); return; }
    const favIds = favorites;
    api.get('/providers').then(r => {
      setProviders(r.data.filter(p => favIds.includes(p.Id)));
    }).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFav = (e, id) => {
    e.preventDefault();
    const next = favorites.filter(f => f !== id);
    setFavorites(next);
    setProviders(p => p.filter(x => x.Id !== id));
    localStorage.setItem('favorites', JSON.stringify(next));
  };

  const getImg = (p) => {
    if (catMap[p.Category]?.BannerUrl) return catMap[p.Category].BannerUrl;
    return CATEGORY_IMAGES[p.Category]?.[0] || null;
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px' }}>❤️ ספקים מועדפים</h1>
        <p style={{ color: '#888', marginTop: '0.3rem' }}>{providers.length} ספקים שמורים</p>
      </div>

      {loading ? (
        <div className="loading">טוען...</div>
      ) : providers.length === 0 ? (
        <div className="empty-state" style={{ gridColumn: 'unset', padding: '5rem 2rem' }}>
          <div className="empty-icon">🤍</div>
          <p>אין ספקים מועדפים עדיין</p>
          <span>לחץ על הלב בכרטיס ספק כדי לשמור אותו</span>
          <Link to="/" className="btn-primary" style={{ marginTop: '1.5rem', textDecoration: 'none', display: 'inline-block' }}>
            גלה ספקים
          </Link>
        </div>
      ) : (
        <div className="providers-grid">
          {providers.map((p, i) => (
            <Link
              to={`/provider/${p.Id}`}
              key={p.Id}
              className="provider-card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="card-image-wrap">
                {getImg(p)
                  ? <img className="card-image" src={getImg(p)} alt={p.Category} loading="lazy" />
                  : <div className="card-image-placeholder">{CATEGORY_ICON[p.Category] || '🎉'}</div>
                }
                <div className="card-image-overlay" />
                <div className="card-category-float">
                  <span>{CATEGORY_ICON[p.Category]}</span> {p.Category}
                </div>
                {p.AverageRating > 0 && <div className="card-rating-float">⭐ {p.AverageRating.toFixed(1)}</div>}
                <button className="card-fav-btn active" onClick={(e) => removeFav(e, p.Id)}>❤️</button>
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
          ))}
        </div>
      )}
    </div>
  );
}
