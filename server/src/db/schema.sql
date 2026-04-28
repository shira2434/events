-- Run this script in SQL Server Management Studio

CREATE DATABASE EventProDB;
GO

USE EventProDB;
GO

CREATE TABLE Users (
  Id INT PRIMARY KEY IDENTITY,
  Email NVARCHAR(255) UNIQUE NOT NULL,
  PasswordHash NVARCHAR(255) NOT NULL,
  Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Customer', 'Provider')),
  CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE ProviderProfiles (
  Id INT PRIMARY KEY IDENTITY,
  UserId INT UNIQUE NOT NULL FOREIGN KEY REFERENCES Users(Id) ON DELETE CASCADE,
  BusinessName NVARCHAR(255) NOT NULL,
  Category NVARCHAR(100) NOT NULL,
  Description NVARCHAR(MAX),
  WorkArea NVARCHAR(255),
  PriceFrom INT,
  AverageRating FLOAT DEFAULT 0
);

CREATE TABLE PortfolioMedia (
  Id INT PRIMARY KEY IDENTITY,
  ProviderId INT NOT NULL FOREIGN KEY REFERENCES ProviderProfiles(Id) ON DELETE CASCADE,
  FilePath NVARCHAR(500) NOT NULL,
  UploadedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE ChatMessages (
  Id INT PRIMARY KEY IDENTITY,
  SenderId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
  ReceiverId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
  Content NVARCHAR(MAX) NOT NULL,
  IsRead BIT DEFAULT 0,
  SentAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Reviews (
  Id INT PRIMARY KEY IDENTITY,
  ProviderId INT NOT NULL FOREIGN KEY REFERENCES ProviderProfiles(Id) ON DELETE CASCADE,
  CustomerId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
  Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
  Comment NVARCHAR(MAX),
  CreatedAt DATETIME DEFAULT GETDATE()
);

-- ── Seed Demo Providers ──
-- Run after schema.sql to populate demo data

USE EventProDB;
GO

-- Demo users (password: Demo1234)
INSERT INTO Users (Email, PasswordHash, Role) VALUES
('tzalam1@demo.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('tzalam2@demo.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('tzalam3@demo.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('makeup1@demo.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('makeup2@demo.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('catering1@demo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('catering2@demo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('dj1@demo.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('dj2@demo.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('flowers1@demo.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('flowers2@demo.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('hall1@demo.com',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('hall2@demo.com',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('jewelry1@demo.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('transport1@demo.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('cake1@demo.com',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider');

-- Provider profiles
INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'סטודיו לוי - צילום אירועים', N'צלם', N'צלם מקצועי עם 10 שנות ניסיון בחתונות ואירועים. מתמחה בצילום רגשי ואמנותי.', N'תל אביב והמרכז', 2800, 4.9 FROM Users WHERE Email='tzalam1@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'רון כהן פוטוגרפי', N'צלם', N'צילום חתונות ואירועים ברחבי הארץ. עבודה עם ציוד מקצועי ועריכה מתקדמת.', N'ירושלים והסביבה', 3200, 4.7 FROM Users WHERE Email='tzalam2@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'מיכל צילום - רגעים לנצח', N'צלם', N'מתמחה בצילום כלות ואירועים אינטימיים. סגנון בוהו-שיק ורומנטי.', N'הצפון', 2500, 4.8 FROM Users WHERE Email='tzalam3@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'גלית מאפרת - יופי לכלות', N'מאפרת', N'מאפרת מקצועית המתמחה בכלות ואירועים. שימוש במוצרים איכותיים בלבד.', N'תל אביב והמרכז', 700, 5.0 FROM Users WHERE Email='makeup1@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'סטודיו נועה - איפור ושיער', N'מאפרת', N'שירות מלא של איפור ועיצוב שיער לאירועים. ניסיון של 8 שנים בתעשייה.', N'השרון', 750, 4.6 FROM Users WHERE Email='makeup2@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'טעמים - קייטרינג גורמה', N'קייטרינג', N'קייטרינג יוקרתי לחתונות ואירועים עסקיים. תפריט מגוון הכולל מנות ים תיכוניות ואסייתיות.', N'תל אביב והמרכז', 150, 4.8 FROM Users WHERE Email='catering1@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'בית הבשר - קייטרינג כשר', N'קייטרינג', N'קייטרינג כשר למהדרין לכל סוגי האירועים. שף מנוסה עם 15 שנות ניסיון.', N'ירושלים והסביבה', 120, 4.5 FROM Users WHERE Email='catering2@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'DJ מאסטר - מוזיקה לאירועים', N'DJ', N'DJ מקצועי עם ציוד סאונד ותאורה מהמתקדמים בשוק. מתמחה בחתונות ומסיבות.', N'כל הארץ', 2000, 4.9 FROM Users WHERE Email='dj1@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'ביט פרפקט - הגברה ותאורה', N'DJ', N'שירות מלא של DJ, הגברה ותאורה לאירועים. ניסיון של 12 שנה בתעשייה.', N'הדרום', 1800, 4.4 FROM Users WHERE Email='dj2@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'גן עדן פרחים', N'פרחים', N'עיצוב פרחוני יוקרתי לחתונות. מתמחים בחופות, שולחנות וזרי כלה מרהיבים.', N'תל אביב והמרכז', 1500, 4.7 FROM Users WHERE Email='flowers1@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'פרחי הגליל', N'פרחים', N'עיצוב פרחוני טבעי ורומנטי. שימוש בפרחים טריים מהגינה שלנו.', N'הצפון', 1200, 4.6 FROM Users WHERE Email='flowers2@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'אולמי הגן הקסום', N'אולם', N'אולם אירועים יוקרתי עם גן חיצוני מרהיב. קיבולת עד 500 אורחים. חניה חינם.', N'השרון', 12000, 4.8 FROM Users WHERE Email='hall1@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'מגדל הים - אולם על הים', N'אולם', N'אולם ייחודי עם נוף לים. אווירה בלתי נשכחת לחתונה חלומית.', N'חיפה והצפון', 15000, 4.9 FROM Users WHERE Email='hall2@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'יהלום - תכשיטי כלות', N'תכשיטים', N'תכשיטים יוקרתיים לכלות ולאירועים. עיצוב אישי לפי בקשה.', N'תל אביב', 800, 4.7 FROM Users WHERE Email='jewelry1@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'ליל כלות - הסעות VIP', N'הסעות', N'הסעות יוקרה לחתנים וכלות. מגוון רכבים כולל לימוזינות ורכבי פרימיום.', N'כל הארץ', 600, 4.5 FROM Users WHERE Email='transport1@demo.com';

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, N'מתוק - עוגות חתונה', N'עוגות', N'עוגות חתונה מעוצבות בהתאמה אישית. שימוש בחומרי גלם איכותיים בלבד.', N'תל אביב והמרכז', 900, 4.9 FROM Users WHERE Email='cake1@demo.com';
