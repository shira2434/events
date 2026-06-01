import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../context/CategoriesContext';
import { useToast } from '../components/Toast';

const CATEGORY_BANNER = {
  'צלם':     'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&w=1200&h=400&fit=crop',
  'מאפרת':   'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&w=1200&h=400&fit=crop',
  'קייטרינג':'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=1200&h=400&fit=crop',
  'DJ':      'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&w=1200&h=400&fit=crop',
  'פרחים':   'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=1200&h=400&fit=crop',
  'אולם':    'https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&w=1200&h=400&fit=crop',
  'תכשיטים': 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&w=1200&h=400&fit=crop',
  'הסעות':   'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&w=1200&h=400&fit=crop',
  'עוגות':   'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&w=1200&h=400&fit=crop',
};

// Each provider ID maps to a unique set — 6 different images, zero repeats within a provider
const DEMO_PORTFOLIO = {
  'צלם': [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/3811082/pexels-photo-3811082.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2606596/pexels-photo-2606596.jpeg?auto=compress&w=600&h=400&fit=crop',
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
    'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&w=600&h=400&fit=crop',
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
    'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&w=600&h=400&fit=crop',
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
  ],
  'הסעות': [
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
  ],
};

const CATEGORY_ICON = {
  'צלם': '📸', 'מאפרת': '💄', 'קייטרינג': '🍽️', 'DJ': '🎧',
  'פרחים': '💐', 'אולם': '🏛️', 'תכשיטים': '💍', 'הסעות': '🚌', 'עוגות': '🎂',
};

// Returns 6 unique images for this specific provider — no repeats
function getDemoPortfolio(provider) {
  const pool = DEMO_PORTFOLIO[provider.Category];
  if (!pool) return [];
  // hash the ID to get a more varied offset
  const offset = (provider.Id * 7 + 3) % pool.length;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
  const unique = [...new Map(rotated.map(u => [u, u])).values()];
  return unique.slice(0, 6).map(url => ({ FilePath: url, isDemo: true }));
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-picker">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          className={`star-btn ${n <= (hover || value) ? 'active' : ''}`}
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}>★</button>
      ))}
      <span className="star-label">{value} כוכבים</span>
    </div>
  );
}

export default function ProviderPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { catMap } = useCategories();
  const navigate = useNavigate();
  const toast = useToast();
  const [provider, setProvider] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/providers/${id}`).then(r => setProvider(r.data));
  }, [id]);

  const sendMessage = async () => {
    if (!user) return navigate('/login');
    const targetUserId = provider.UserId || provider.userid;
    if (!targetUserId) return;
    // שמור את שם הספק ל-localStorage
    localStorage.setItem(`chat_name_${targetUserId}`, provider.BusinessName || provider.businessname || provider.Email || provider.email || '');
    navigate(`/chat/${targetUserId}`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!review.comment.trim() || review.comment.trim().length < 5) {
      toast('ביקורת חייבת להכיל לפחות 5 תווים', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/providers/${id}/reviews`, review);
      const r = await api.get(`/providers/${id}`);
      setProvider(r.data);
      setReview({ rating: 5, comment: '' });
      setActiveTab('reviews');
      toast('ההמלצה נשלחה בהצלחה! 🎉');
    } catch (err) {
      toast(err.response?.data?.message || 'שגיאה בשליחת ביקורת', 'error');
    }
    setSubmitting(false);
  };

  if (!provider) return (
    <div className="provider-page-loading">
      <div className="loading-spinner" />
      <p>טוען פרופיל...</p>
    </div>
  );

  const icon = catMap[provider.Category]?.Icon || CATEGORY_ICON[provider.Category] || '🎉';
  const bannerImg = catMap[provider.Category]?.BannerUrl || CATEGORY_BANNER[provider.Category];
  const portfolioItems = provider.portfolio?.length > 0 ? provider.portfolio : getDemoPortfolio(provider);
  const allImages = portfolioItems.map(m =>
    m.isDemo ? m.FilePath : (m.FilePath.startsWith('http') ? m.FilePath : `http://localhost:5000${m.FilePath}`)
  );
  const avatarImg = allImages[0];

  const shareProvider = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: provider.BusinessName, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('הקישור הועתק!');
    }
  };

  const openLightbox = (i) => { setLightboxIndex(i); setLightbox(true); };
  const prev = (e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length); };
  const next = (e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % allImages.length); };

  return (
    <div className="provider-page">
      <Helmet>
        <title>{provider.BusinessName} | EventPro</title>
        <meta name="description" content={`${provider.BusinessName} - ${provider.Category} ב${provider.WorkArea}. ${provider.Description || ''}`} />
        <meta property="og:title" content={`${provider.BusinessName} | EventPro`} />
        <meta property="og:description" content={provider.Description || `${provider.Category} ב${provider.WorkArea}`} />
        {avatarImg && <meta property="og:image" content={avatarImg} />}
      </Helmet>
      <button className="back-btn" onClick={() => navigate(-1)}>← חזרה</button>

      <div className="provider-banner" style={bannerImg ? { backgroundImage: `url(${bannerImg})` } : {}}>
        <div className="provider-banner-overlay" />
      </div>

      <div className="provider-profile-card">
        <div className="provider-avatar">
          {avatarImg
            ? <img src={avatarImg} alt={provider.BusinessName} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'inherit'}} />
            : icon
          }
        </div>
        <div className="provider-info">
          <div className="provider-meta-top">
            <span className="category-badge">{provider.Category}</span>
            {provider.AverageRating > 0 && <span className="rating-badge">⭐ {provider.AverageRating.toFixed(1)}</span>}
          </div>
          <h1>{provider.BusinessName}</h1>
          <div className="provider-meta">
            <span>📍 {provider.WorkArea}</span>
            {provider.PriceFrom && <span>💰 החל מ-₪{Number(provider.PriceFrom).toLocaleString()}</span>}
            <span>💬 {provider.reviews?.length || 0} המלצות</span>
          </div>
          {provider.Description && <p className="provider-description">{provider.Description}</p>}
        </div>
        <div className="provider-cta">
          <button className="btn-primary btn-lg" onClick={sendMessage}>💬 שלח הודעה</button>
          <button className="btn-share" onClick={shareProvider}>🔗 שתף</button>
        </div>
      </div>

      <div className="provider-tabs">
        <button className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
          📁 תיק עבודות <span className="tab-count">{portfolioItems.length}</span>
        </button>
        <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
          ⭐ המלצות {provider.reviews?.length > 0 && <span className="tab-count">{provider.reviews.length}</span>}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'portfolio' && (
          <div>
            {!provider.portfolio?.length && (
              <p className="demo-notice">📌 תמונות לדוגמה — הספק טרם העלה תמונות משלו</p>
            )}
            <div className="portfolio-grid">
              {portfolioItems.map((m, i) => (
                <div key={i} className="portfolio-item" onClick={() => openLightbox(i)}>
                  <img src={allImages[i]} alt="" loading="lazy" />
                  <div className="portfolio-overlay">🔍</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            {provider.reviews?.length > 0 ? (
              <div className="reviews-list">
                {provider.reviews.map((r, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <div className="review-avatar">{(r.Name || r.Email)?.[0]?.toUpperCase()}</div>
                      <div style={{flex:1}}>
                        <div className="review-email">{r.Name || r.Email?.split('@')[0]}</div>
                        <div className="review-stars">{'★'.repeat(r.Rating)}{'☆'.repeat(5 - r.Rating)}</div>
                      </div>
                      {r.CreatedAt && (
                        <div style={{fontSize:'0.75rem',color:'#bbb'}}>
                          {new Date(r.CreatedAt).toLocaleDateString('he-IL')}
                        </div>
                      )}
                    </div>
                    <p className="review-comment">{r.Comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tab-empty"><span>⭐</span><p>אין המלצות עדיין</p></div>
            )}
            {user?.role === 'Customer' && (
              <form className="review-form" onSubmit={submitReview}>
                <h3>✍️ כתוב המלצה</h3>
                <StarRating value={review.rating} onChange={v => setReview({ ...review, rating: v })} />
                <textarea placeholder="שתף את החוויה שלך..." value={review.comment}
                  onChange={e => setReview({ ...review, comment: e.target.value })} required />
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'שולח...' : 'שלח המלצה'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(false)}>
          <button className="lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <button className="lightbox-prev" onClick={prev}>‹</button>
          <img src={allImages[lightboxIndex]} alt="" onClick={e => e.stopPropagation()} />
          <button className="lightbox-next" onClick={next}>›</button>
          <div className="lightbox-counter">{lightboxIndex + 1} / {allImages.length}</div>
        </div>
      )}
    </div>
  );
}
