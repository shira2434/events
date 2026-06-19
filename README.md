# EventPro 🎉
**מרקטפלייס לאירועים בישראל** — פלטפורמה לחיבור בין לקוחות לספקי אירועים מקצועיים.

🔗 **אתר חי:** https://events-szpi.onrender.com

---

## תוכן עניינים
- [סקירה כללית](#סקירה-כללית)
- [טכנולוגיות](#טכנולוגיות)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [התקנה והרצה מקומית](#התקנה-והרצה-מקומית)
- [משתני סביבה](#משתני-סביבה)
- [מסד הנתונים](#מסד-הנתונים)
- [API Reference](#api-reference)
- [תפקידי משתמשים](#תפקידי-משתמשים)
- [פיצ'רים עיקריים](#פיצ'רים-עיקריים)
- [Deploy](#deploy)

---

## סקירה כללית

EventPro מאפשרת למשתמשים למצוא ספקי אירועים (צלמים, מאפרות, קייטרינג, DJ ועוד), לצפות בתיק העבודות שלהם, לקרוא ולכתוב ביקורות, וליצור איתם קשר דרך מערכת צ'אט מובנית.

---

## טכנולוגיות

### Frontend
| טכנולוגיה | שימוש |
|---|---|
| React 19 | UI |
| React Router v7 | ניתוב |
| Axios | קריאות API |
| react-helmet-async | SEO / meta tags |

### Backend
| טכנולוגיה | שימוש |
|---|---|
| Node.js + Express 5 | שרת |
| PostgreSQL (pg) | מסד נתונים |
| JWT (jsonwebtoken) | אימות |
| bcryptjs | הצפנת סיסמאות |
| multer | העלאת קבצים |
| express-rate-limit | הגנה מ-spam |
| helmet | אבטחת headers |
| compression | דחיסת תגובות |

---

## מבנה הפרויקט

```
events/
├── client/                     # React Frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   ├── ChatBot.js
│       │   ├── Toast.js          # מערכת הודעות
│       │   ├── ErrorBoundary.js
│       │   └── ScrollToTopButton.js
│       ├── context/
│       │   ├── AuthContext.js
│       │   └── CategoriesContext.js
│       ├── pages/
│       │   ├── HomePage.js       # רשימת ספקים + סינון + מיון
│       │   ├── ProviderPage.js   # פרופיל ספק + תיק עבודות + ביקורות
│       │   ├── DashboardPage.js  # לוח בקרה לספק
│       │   ├── ChatPage.js       # מערכת צ'אט
│       │   ├── AdminPage.js      # לוח ניהול
│       │   ├── FavoritesPage.js  # ספקים מועדפים
│       │   ├── AuthPage.js
│       │   ├── ProfilePage.js
│       │   ├── AboutPage.js
│       │   └── ContactPage.js
│       └── App.js
│
└── server/                     # Node.js Backend
    └── src/
        ├── db/
        │   ├── db.js
        │   └── schema_postgres.sql
        ├── middleware/
        │   └── auth.js           # JWT middleware
        ├── routes/
        │   ├── auth.js
        │   ├── providers.js
        │   ├── portfolio.js
        │   ├── chat.js
        │   └── admin.js
        └── index.js
```

---

## התקנה והרצה מקומית

### דרישות מוקדמות
- Node.js 18+
- PostgreSQL 14+

### 1. שכפל את הפרויקט
```bash
git clone https://github.com/shira2434/events.git
cd events
```

### 2. הגדר את השרת
```bash
cd server
npm install
```

צור קובץ `server/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eventprodb
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
JWT_SECRET=any_random_secret_string
PORT=5000
```

### 3. הגדר את מסד הנתונים
```bash
# צור את ה-DB וייבא את הסכמה
psql -U postgres -c "CREATE DATABASE eventprodb;"
psql -U postgres -d eventprodb -f src/db/schema_postgres.sql
```

הוסף עמודה לתמונת פתיחה (אם לא קיימת):
```sql
ALTER TABLE ProviderProfiles ADD COLUMN IF NOT EXISTS CoverImage TEXT;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS FullName VARCHAR(255);
```

### 4. הפעל את השרת
```bash
npm run dev   # עם nodemon
# או
npm start     # ללא nodemon
```

### 5. הגדר את ה-Client
```bash
cd ../client
npm install
npm start
```

האתר יעלה על `http://localhost:3000`

---

## משתני סביבה

| משתנה | תיאור | דוגמה |
|---|---|---|
| `DB_HOST` | כתובת שרת ה-DB | `localhost` |
| `DB_PORT` | פורט PostgreSQL | `5432` |
| `DB_NAME` | שם מסד הנתונים | `eventprodb` |
| `DB_USER` | משתמש DB | `postgres` |
| `DB_PASSWORD` | סיסמת DB | `secret` |
| `JWT_SECRET` | מפתח להצפנת טוקנים | `my_secret_key` |
| `PORT` | פורט השרת | `5000` |
| `NODE_ENV` | סביבת הרצה | `production` |

---

## מסד הנתונים

### טבלאות

| טבלה | תיאור |
|---|---|
| `Users` | משתמשים (Customer / Provider / Admin) |
| `ProviderProfiles` | פרופילי ספקים |
| `PortfolioMedia` | תמונות תיק עבודות |
| `ChatMessages` | הודעות צ'אט |
| `Reviews` | ביקורות |
| `Categories` | קטגוריות ספקים |

### דיאגרמת יחסים
```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────┐
│    Users    │       │ ProviderProfiles │       │  PortfolioMedia │
│─────────────│       │──────────────────│       │─────────────────│
│ UserID (PK) │──1────│ UserID (FK)      │──1────│ ProfileID (FK)  │
│ Role        │       │ ProfileID (PK)   │       │ MediaID (PK)    │
│ FullName    │       │ CoverImage       │       │ ImageURL        │
└──────┬──────┘       └────────┬─────────┘       └─────────────────┘
       │                       │
       │ 1                     │ 1
       │                       │
       ▼ N                     ▼ N
┌──────────────┐       ┌───────────────┐       ┌─────────────────┐
│ ChatMessages │       │    Reviews    │       │   Categories    │
│──────────────│       │───────────────│       │─────────────────│
│ MessageID(PK)│       │ ReviewID (PK) │       │ CategoryID (PK) │
│ SenderID(FK) │       │ ProfileID(FK) │       │ Name            │
│ ReceiverID(FK│       │ UserID (FK)   │       │ banner_url      │
└──────────────┘       └───────────────┘       └─────────────────┘
```

---

## API Reference

### Auth
| Method | Endpoint | תיאור | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | הרשמה | ❌ |
| POST | `/api/auth/login` | התחברות | ❌ |
| PUT | `/api/auth/password` | שינוי סיסמה | ✅ |

### Providers
| Method | Endpoint | תיאור | Auth |
|---|---|---|---|
| GET | `/api/providers` | רשימת ספקים (עם פילטרים) | ❌ |
| GET | `/api/providers/:id` | פרופיל ספק מלא | ❌ |
| GET | `/api/providers/me` | פרופיל הספק המחובר | Provider |
| PUT | `/api/providers/settings` | עדכון פרטי ספק | Provider |
| PUT | `/api/providers/cover` | עדכון תמונת פתיחה | Provider |
| POST | `/api/providers/:id/reviews` | הוספת ביקורת | Customer |

**Query params ל-GET /providers:**
- `category` — סינון לפי קטגוריה
- `minRating` — סינון לפי דירוג מינימלי
- `sortBy` — `rating` / `price` / `new`

### Portfolio
| Method | Endpoint | תיאור | Auth |
|---|---|---|---|
| POST | `/api/portfolio` | העלאת תמונות | Provider |

### Chat
| Method | Endpoint | תיאור | Auth |
|---|---|---|---|
| GET | `/api/chat` | רשימת שיחות | ✅ |
| GET | `/api/chat/:targetId` | היסטוריית שיחה | ✅ |
| POST | `/api/chat` | שליחת הודעה | ✅ |
| POST | `/api/chat/image` | שליחת תמונה | ✅ |
| DELETE | `/api/chat/:targetId` | מחיקת שיחה | ✅ |
| POST | `/api/chat/typing` | עדכון סטטוס הקלדה | ✅ |
| GET | `/api/chat/typing/:targetId` | בדיקת סטטוס הקלדה | ✅ |

### Admin
| Method | Endpoint | תיאור |
|---|---|---|
| GET | `/api/admin/stats` | סטטיסטיקות כלליות |
| GET | `/api/admin/providers` | כל הספקים |
| PUT | `/api/admin/providers/:id` | עדכון ספק |
| PUT | `/api/admin/providers/:id/cover` | עדכון תמונת פתיחה |
| DELETE | `/api/admin/providers/:id` | מחיקת ספק |
| GET | `/api/admin/providers/:id/images` | תמונות ספק |
| POST | `/api/admin/providers/:id/images` | הוספת תמונה לספק |
| DELETE | `/api/admin/images/:id` | מחיקת תמונה |
| GET | `/api/admin/users` | כל המשתמשים |
| DELETE | `/api/admin/users/:id` | מחיקת משתמש |
| GET | `/api/admin/categories` | קטגוריות |
| POST | `/api/admin/categories` | הוספת קטגוריה |
| PUT | `/api/admin/categories/:id` | עדכון קטגוריה |
| DELETE | `/api/admin/categories/:id` | מחיקת קטגוריה |

---

## תפקידי משתמשים

| תפקיד | יכולות |
|---|---|
| **Guest** | צפייה בספקים, חיפוש וסינון |
| **Customer** | + כתיבת ביקורות, צ'אט עם ספקים, שמירת מועדפים |
| **Provider** | + ניהול פרופיל, העלאת תמונות, בחירת תמונת פתיחה |
| **Admin** | + ניהול כל הספקים, משתמשים, קטגוריות |

ליצירת Admin — עדכן ידנית ב-DB:
```sql
UPDATE Users SET Role = 'Admin' WHERE Email = 'your@email.com';
```

---

## פיצ'רים עיקריים

- 🔍 **חיפוש וסינון** — לפי קטגוריה, דירוג, מחיר, מיון
- 🖼️ **תיק עבודות** — העלאת תמונות, בחירת תמונת פתיחה
- ⭐ **ביקורות** — דירוג כוכבים, תגובות מאומתות
- 💬 **צ'אט** — הודעות בזמן אמת (polling), אינדיקטור הקלדה, תגובה להודעה, שליחת תמונות
- ❤️ **מועדפים** — שמירת ספקים מועדפים ב-localStorage
- 🔗 **שיתוף** — שיתוף דף ספק
- 🛡️ **לוח ניהול** — ניהול מלא של ספקים, משתמשים וקטגוריות
- 📱 **Responsive** — תמיכה מלאה במובייל
- 🔒 **אבטחה** — Rate limiting, helmet, JWT, bcrypt

---

## Deploy

הפרויקט מוגדר ל-deploy על **Render**:

- **שרת:** Web Service מהתיקייה `server/`
- **Client:** build סטטי מוגש על ידי השרת בסביבת production

### הגדרות Render
- Build Command: `cd server && npm install`
- Start Command: `node server/src/index.js`
- משתני סביבה: הגדר את כל ה-`.env` בממשק Render

### migration נדרש ב-DB לאחר deploy ראשון
```sql
ALTER TABLE ProviderProfiles ADD COLUMN IF NOT EXISTS CoverImage TEXT;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS FullName VARCHAR(255);
ALTER TABLE Categories ADD COLUMN IF NOT EXISTS banner_url TEXT;
```
