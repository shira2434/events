-- הרץ את זה ב-PostgreSQL (Supabase / Railway)
-- סיסמה לכולם: Demo1234

INSERT INTO Users (Email, PasswordHash, Role) VALUES
('photo.studio.tel@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('lens.magic@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('wedding.shots@gmail.com',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('beauty.bar.il@gmail.com',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('glam.studio@gmail.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('royal.catering@gmail.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('gourmet.events@gmail.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('dj.neon@gmail.com',           '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('dj.vibe@gmail.com',           '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('rose.garden.flowers@gmail.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('floral.art@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('palace.hall@gmail.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('sky.venue@gmail.com',         '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('diamond.jewelry@gmail.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('gold.rings@gmail.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('vip.limo@gmail.com',          '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('luxury.transport@gmail.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('sweet.cakes@gmail.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('cake.art@gmail.com',          '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider'),
('band.live@gmail.com',         '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Provider')
ON CONFLICT (Email) DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'סטודיו אור - צילום מקצועי', 'צלם', 'צלם חתונות ואירועים עם 12 שנות ניסיון. מתמחה בצילום רגשי ואמנותי עם ציוד מקצועי.', 'תל אביב והמרכז', 2900, 4.9 FROM Users WHERE Email='photo.studio.tel@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'לנס מג''יק - צילום יצירתי', 'צלם', 'צילום בסגנון בוהו-שיק ורומנטי. כל אירוע מקבל טיפול אישי ועריכה מרהיבה.', 'השרון וגוש דן', 3100, 4.7 FROM Users WHERE Email='lens.magic@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'וודינג שוטס - חתונות', 'צלם', 'מתמחים בצילום חתונות בלבד. צוות של 2 צלמים לכיסוי מלא של היום המיוחד.', 'הצפון', 3400, 4.8 FROM Users WHERE Email='wedding.shots@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'ביוטי בר - איפור ושיער', 'מאפרת', 'שירות מלא של איפור ועיצוב שיער לכלות ואירועים. ניסיון של 10 שנים בתעשייה.', 'תל אביב', 750, 5.0 FROM Users WHERE Email='beauty.bar.il@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'גלאם סטודיו - יופי לכלות', 'מאפרת', 'מאפרת מוסמכת עם הכשרה בינלאומית. מוצרים איכותיים בלבד, תוצאות מרהיבות.', 'ירושלים והסביבה', 800, 4.8 FROM Users WHERE Email='glam.studio@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'רויאל קייטרינג - יוקרה', 'קייטרינג', 'קייטרינג יוקרתי לחתונות ואירועים עסקיים. תפריט גורמה עם שף מוביל.', 'תל אביב והמרכז', 180, 4.9 FROM Users WHERE Email='royal.catering@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'גורמה אירועים', 'קייטרינג', 'קייטרינג ים תיכוני ואסייתי. מנות טריות, שירות מקצועי, מחירים הוגנים.', 'הדרום', 130, 4.6 FROM Users WHERE Email='gourmet.events@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'DJ ניאון - מוזיקה לאירועים', 'DJ', 'DJ עם 15 שנות ניסיון. מערכת סאונד ותאורה מהמתקדמות. מתמחה בחתונות ומסיבות.', 'כל הארץ', 2200, 4.9 FROM Users WHERE Email='dj.neon@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'DJ ויב - אנרגיה לרחבה', 'DJ', 'מוזיקה לכל הטעמים — מזרחי, מערבי, אלקטרוני. הרחבה תמיד מלאה!', 'המרכז', 1900, 4.5 FROM Users WHERE Email='dj.vibe@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'גן הוורדים - פרחים', 'פרחים', 'עיצוב פרחוני יוקרתי לחתונות. חופות, שולחנות, זרי כלה — הכל בהתאמה אישית.', 'תל אביב והמרכז', 1800, 4.8 FROM Users WHERE Email='rose.garden.flowers@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'פלורל ארט - עיצוב פרחוני', 'פרחים', 'אמנות פרחונית ייחודית. סגנון בוהו, רומנטי ומודרני. פרחים טריים מהמשתלה שלנו.', 'הצפון', 1400, 4.7 FROM Users WHERE Email='floral.art@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'ארמון האירועים', 'אולם', 'אולם יוקרתי עם עיצוב מרהיב. קיבולת עד 600 אורחים. חניה, גן חיצוני, תאורה מקצועית.', 'השרון', 14000, 4.9 FROM Users WHERE Email='palace.hall@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'סקיי ויניו - גג תל אביב', 'אולם', 'אולם גג ייחודי עם נוף פנורמי לתל אביב. אווירה בלתי נשכחת לאירוע מיוחד.', 'תל אביב', 18000, 4.8 FROM Users WHERE Email='sky.venue@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'דיאמונד - תכשיטי יוקרה', 'תכשיטים', 'תכשיטים יוקרתיים לכלות. עיצוב אישי, יהלומים אמיתיים, שירות VIP.', 'תל אביב', 1200, 4.9 FROM Users WHERE Email='diamond.jewelry@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'גולד רינגס - טבעות נישואין', 'תכשיטים', 'מתמחים בטבעות נישואין וארוסין. זהב, פלטינה ויהלומים. עיצוב לפי בקשה.', 'ירושלים', 900, 4.7 FROM Users WHERE Email='gold.rings@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'VIP לימו - הסעות יוקרה', 'הסעות', 'לימוזינות ורכבי פרימיום לחתנים וכלות. שירות VIP מהבית לאולם ובחזרה.', 'כל הארץ', 800, 4.8 FROM Users WHERE Email='vip.limo@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'לוקשרי טרנספורט', 'הסעות', 'הסעות לאורחים ולזוג. אוטובוסים מפוארים ורכבים פרטיים. אמינות ודיוק.', 'המרכז', 600, 4.5 FROM Users WHERE Email='luxury.transport@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'סוויט קייקס - עוגות חתונה', 'עוגות', 'עוגות חתונה מעוצבות בהתאמה אישית. טעמים מגוונים, עיצוב מרהיב, חומרים טבעיים.', 'תל אביב והמרכז', 1100, 4.9 FROM Users WHERE Email='sweet.cakes@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'קייק ארט - אמנות בצק', 'עוגות', 'עוגות אמנותיות לכל אירוע. מיני קאפקייקס, עוגות קומות, שולחן ממתקים.', 'הצפון', 850, 4.7 FROM Users WHERE Email='cake.art@gmail.com' ON CONFLICT DO NOTHING;

INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom, AverageRating)
SELECT Id, 'להקת לייב - מוזיקה חיה', 'DJ', 'להקה חיה עם 5 נגנים. ג''אז, פופ, מזרחי — מוזיקה לכל טעם לאורך כל הערב.', 'כל הארץ', 4500, 4.8 FROM Users WHERE Email='band.live@gmail.com' ON CONFLICT DO NOTHING;
