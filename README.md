# EventPro - Marketplace לאירועים

## מבנה הפרויקט
```
events/
├── server/          # Node.js + Express + SQL Server
└── client/          # React
```

## הגדרת מסד הנתונים
1. פתח SQL Server Management Studio
2. הרץ את הסקריפט: `server/src/db/schema.sql`

## הגדרת השרת
1. ערוך את `server/.env` עם פרטי ה-DB שלך:
```
DB_SERVER=localhost
DB_NAME=EventProDB
DB_USER=sa
DB_PASSWORD=YOUR_PASSWORD
JWT_SECRET=any_random_secret_string
```
2. הפעל:
```bash
cd server
npm install
npm run dev   # או: node src/index.js
```

## הפעלת ה-Client
```bash
cd client
npm start
```

## נקודות קצה (API)
| Method | Endpoint | תיאור |
|--------|----------|-------|
| POST | /api/auth/register | הרשמה |
| POST | /api/auth/login | התחברות |
| GET | /api/providers | רשימת ספקים (עם פילטרים) |
| GET | /api/providers/:id | פרופיל ספק + תיק עבודות + המלצות |
| PUT | /api/providers/settings | עדכון פרטי ספק (Provider בלבד) |
| POST | /api/providers/:id/reviews | הוספת המלצה (Customer בלבד) |
| POST | /api/portfolio | העלאת תמונות (Provider בלבד) |
| GET | /api/chat | רשימת שיחות |
| GET | /api/chat/:targetId | היסטוריית שיחה |
| POST | /api/chat | שליחת הודעה |
