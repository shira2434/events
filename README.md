# EventPro 🎉
**Event Marketplace in Israel** — A platform connecting customers with professional event vendors.

🔗 **Live site:** https://events-szpi.onrender.com

---

## Table of Contents
- [Overview](#overview)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Reference](#api-reference)
- [User Roles](#user-roles)
- [Key Features](#key-features)
- [Deploy](#deploy)

---

## Overview

EventPro allows users to find event vendors (photographers, makeup artists, catering, DJs, etc.), view their portfolios, read and write reviews, and contact them through a built-in chat system.

---

## Technologies

### Frontend
| Technology | Usage |
|---|---|
| React 19 | UI |
| React Router v7 | Routing |
| Axios | API calls |
| react-helmet-async | SEO / meta tags |

### Backend
| Technology | Usage |
|---|---|
| Node.js + Express 5 | Server |
| PostgreSQL (pg) | Database |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| multer | File uploads |
| express-rate-limit | Spam protection |
| helmet | Header security |
| compression | Response compression |

---

## Project Structure

```
events/
├── client/                     # React Frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   ├── ChatBot.js
│       │   ├── Toast.js          # Notification system
│       │   ├── ErrorBoundary.js
│       │   └── ScrollToTopButton.js
│       ├── context/
│       │   ├── AuthContext.js
│       │   └── CategoriesContext.js
│       ├── pages/
│       │   ├── HomePage.js       # Vendor list + filters + sorting
│       │   ├── ProviderPage.js   # Vendor profile + portfolio + reviews
│       │   ├── DashboardPage.js  # Vendor dashboard
│       │   ├── ChatPage.js       # Chat system
│       │   ├── AdminPage.js      # Admin panel
│       │   ├── FavoritesPage.js  # Saved vendors
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

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the project
```bash
git clone https://github.com/shira2434/events.git
cd events
```

### 2. Set up the server
```bash
cd server
npm install
```

Create `server/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eventprodb
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
JWT_SECRET=any_random_secret_string
PORT=5000
```

### 3. Set up the database
```bash
psql -U postgres -c "CREATE DATABASE eventprodb;"
psql -U postgres -d eventprodb -f src/db/schema_postgres.sql
```

Add missing columns if needed:
```sql
ALTER TABLE ProviderProfiles ADD COLUMN IF NOT EXISTS CoverImage TEXT;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS FullName VARCHAR(255);
```

### 4. Start the server
```bash
npm run dev   # with nodemon
# or
npm start     # without nodemon
```

### 5. Set up the client
```bash
cd ../client
npm install
npm start
```

The app will run at `http://localhost:3000`

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | Database server address | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `eventprodb` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `secret` |
| `JWT_SECRET` | Token signing secret | `my_secret_key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Runtime environment | `production` |

---

## Database

### Tables

| Table | Description |
|---|---|
| `Users` | Users (Customer / Provider / Admin) |
| `ProviderProfiles` | Vendor profiles |
| `PortfolioMedia` | Portfolio images |
| `ChatMessages` | Chat messages |
| `Reviews` | Reviews |
| `Categories` | Vendor categories |

### Relationship Diagram
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
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| PUT | `/api/auth/password` | Change password | ✅ |

### Providers
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/providers` | List vendors (with filters) | ❌ |
| GET | `/api/providers/:id` | Full vendor profile | ❌ |
| GET | `/api/providers/me` | Logged-in vendor profile | Provider |
| PUT | `/api/providers/settings` | Update vendor details | Provider |
| PUT | `/api/providers/cover` | Update cover image | Provider |
| POST | `/api/providers/:id/reviews` | Add review | Customer |

**Query params for GET /providers:**
- `category` — filter by category
- `minRating` — filter by minimum rating
- `sortBy` — `rating` / `price` / `new`

### Portfolio
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/portfolio` | Upload images | Provider |

### Chat
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/chat` | List conversations | ✅ |
| GET | `/api/chat/:targetId` | Conversation history | ✅ |
| POST | `/api/chat` | Send message | ✅ |
| POST | `/api/chat/image` | Send image | ✅ |
| DELETE | `/api/chat/:targetId` | Delete conversation | ✅ |
| POST | `/api/chat/typing` | Update typing status | ✅ |
| GET | `/api/chat/typing/:targetId` | Check typing status | ✅ |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | General statistics |
| GET | `/api/admin/providers` | All vendors |
| PUT | `/api/admin/providers/:id` | Update vendor |
| PUT | `/api/admin/providers/:id/cover` | Update cover image |
| DELETE | `/api/admin/providers/:id` | Delete vendor |
| GET | `/api/admin/providers/:id/images` | Vendor images |
| POST | `/api/admin/providers/:id/images` | Add image to vendor |
| DELETE | `/api/admin/images/:id` | Delete image |
| GET | `/api/admin/users` | All users |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/categories` | Categories |
| POST | `/api/admin/categories` | Add category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |

---

## User Roles

| Role | Capabilities |
|---|---|
| **Guest** | Browse vendors, search and filter |
| **Customer** | + Write reviews, chat with vendors, save favorites |
| **Provider** | + Manage profile, upload images, set cover image |
| **Admin** | + Manage all vendors, users, and categories |

To create an Admin — update manually in DB:
```sql
UPDATE Users SET Role = 'Admin' WHERE Email = 'your@email.com';
```

---

## Key Features

- 🔍 **Search & Filter** — by category, rating, price, sorting
- 🖼️ **Portfolio** — upload images, set cover image
- ⭐ **Reviews** — star ratings, verified responses
- 💬 **Chat** — real-time messages (polling), typing indicator, reply to message, send images
- ❤️ **Favorites** — save vendors to localStorage
- 🔗 **Share** — share vendor profile page
- 🛡️ **Admin Panel** — full management of vendors, users, and categories
- 📱 **Responsive** — full mobile support
- 🔒 **Security** — Rate limiting, helmet, JWT, bcrypt

---

## Deploy

The project is configured to deploy on **Render**:

- **Server:** Web Service from the `server/` directory
- **Client:** Static build served by the server in production

### Render Settings
- Build Command: `cd server && npm install`
- Start Command: `node server/src/index.js`
- Environment Variables: set all `.env` values in the Render dashboard

### Required DB migration after first deploy
```sql
ALTER TABLE ProviderProfiles ADD COLUMN IF NOT EXISTS CoverImage TEXT;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS FullName VARCHAR(255);
ALTER TABLE Categories ADD COLUMN IF NOT EXISTS banner_url TEXT;
```
