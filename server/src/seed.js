require('dotenv').config();
const { pool, poolConnect, sql } = require('./db/db');
const bcrypt = require('bcryptjs');

const providers = [
  {
    email: 'maya.photo@gmail.com', businessName: 'מאיה צילום', category: 'צלם',
    description: 'צלמת חתונות ואירועים עם ניסיון של 10 שנים. מתמחה בצילום רגשי ואותנטי שמספר את הסיפור שלכם.',
    workArea: 'תל אביב והמרכז', priceFrom: 3500,
    images: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1128783/pexels-photo-1128783.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'david.photo@gmail.com', businessName: 'דוד לנס', category: 'צלם',
    description: 'צלם מקצועי לאירועים, בר מצוות וחתונות. עובד עם ציוד מקצועי ומספק אלבום דיגיטלי מלא.',
    workArea: 'ירושלים והסביבה', priceFrom: 2800,
    images: [
      'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2788488/pexels-photo-2788488.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/3585798/pexels-photo-3585798.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'noa.makeup@gmail.com', businessName: 'נועה מייקאפ', category: 'מאפרת',
    description: 'מאפרת מקצועית לכלות ואירועים. מתמחה במייקאפ עדין ועמיד לאורך כל היום.',
    workArea: 'תל אביב, רמת גן, גבעתיים', priceFrom: 800,
    images: [
      'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1813346/pexels-photo-1813346.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1721943/pexels-photo-1721943.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'shira.beauty@gmail.com', businessName: 'שירה ביוטי', category: 'מאפרת',
    description: 'מאפרת וספרית לאירועים. חבילות מיוחדות לכלה + שושבינות. ניסיון של 8 שנים.',
    workArea: 'השרון והצפון', priceFrom: 700,
    images: [
      'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2253842/pexels-photo-2253842.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2253843/pexels-photo-2253843.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'taste.catering@gmail.com', businessName: 'טעם הבית קייטרינג', category: 'קייטרינג',
    description: 'קייטרינג כשר למהדרין לכל סוגי האירועים. תפריט מגוון הכולל מנות ים תיכוניות ואסייתיות.',
    workArea: 'כל הארץ', priceFrom: 120,
    images: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'chef.events@gmail.com', businessName: 'שף אירועים', category: 'קייטרינג',
    description: 'שירותי קייטרינג פרימיום עם שפים מנוסים. מתמחים באירועי חברות וחתונות יוקרתיות.',
    workArea: 'גוש דן', priceFrom: 180,
    images: [
      'https://images.pexels.com/photos/299347/pexels-photo-299347.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'dj.ron@gmail.com', businessName: 'DJ רון', category: 'DJ',
    description: "די ג'י מקצועי לחתונות ומסיבות. מערכת סאונד ותאורה מקצועית. מנגן בכל הסגנונות.",
    workArea: 'כל הארץ', priceFrom: 2500,
    images: [
      'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'dj.beats@gmail.com', businessName: 'DJ Beats', category: 'DJ',
    description: "די ג'י עם ניסיון של 15 שנה. מתמחה במוזיקה מזרחית, מערבית ומיקסים מיוחדים.",
    workArea: 'דרום ומרכז', priceFrom: 2000,
    images: [
      'https://images.pexels.com/photos/1649693/pexels-photo-1649693.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1916821/pexels-photo-1916821.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2078071/pexels-photo-2078071.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'flowers.eden@gmail.com', businessName: 'גן עדן פרחים', category: 'פרחים',
    description: 'עיצוב פרחוני לחתונות ואירועים. מתמחים בעיצובים רומנטיים ומודרניים עם פרחים טריים.',
    workArea: 'מרכז הארץ', priceFrom: 1500,
    images: [
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2253849/pexels-photo-2253849.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'bloom.events@gmail.com', businessName: 'בלום אירועים', category: 'פרחים',
    description: 'שזירת פרחים ועיצוב אירועים. חופות, מרכזי שולחן ועיצוב כללי לאירוע חלומי.',
    workArea: 'תל אביב והצפון', priceFrom: 2000,
    images: [
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'hall.dreams@gmail.com', businessName: 'אולם החלומות', category: 'אולם',
    description: 'אולם אירועים יוקרתי ל-50-500 אורחים. גן חיצוני, חניה, קייטרינג פנימי ועיצוב מלא.',
    workArea: 'פתח תקווה', priceFrom: 15000,
    images: [
      'https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/265920/pexels-photo-265920.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
  {
    email: 'garden.events@gmail.com', businessName: 'גן האירועים', category: 'אולם',
    description: 'גן אירועים פתוח עם אווירה קסומה. מתאים לחתונות, בר מצוות ואירועי חברות.',
    workArea: 'ראשון לציון', priceFrom: 12000,
    images: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1128783/pexels-photo-1128783.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/2291462/pexels-photo-2291462.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/265920/pexels-photo-265920.jpeg?auto=compress&w=600&h=400&fit=crop',
    ]
  },
];

const reviews = [
  { rating: 5, comment: 'מדהים! השירות היה מעל ומעבר לציפיות שלנו' },
  { rating: 5, comment: 'מקצועי ביותר, ממליץ בחום לכולם' },
  { rating: 4, comment: 'שירות מצוין, תמחור הוגן' },
  { rating: 5, comment: 'חוויה בלתי נשכחת, תודה רבה!' },
  { rating: 4, comment: 'עבודה איכותית ומקצועית' },
  { rating: 5, comment: 'הכי טוב שיש! בדיוק מה שרצינו' },
];

async function seed() {
  await poolConnect;
  console.log('Connected to DB, seeding...');

  await pool.request().query('DELETE FROM PortfolioMedia');
  await pool.request().query('DELETE FROM Reviews');
  await pool.request().query('DELETE FROM ProviderProfiles');
  await pool.request().query('DELETE FROM ChatMessages');
  await pool.request().query('DELETE FROM Users');
  console.log('Cleared existing data');

  const hash = await bcrypt.hash('password123', 10);

  for (let i = 1; i <= 3; i++) {
    await pool.request()
      .input('email', sql.NVarChar, `customer${i}@gmail.com`)
      .input('hash', sql.NVarChar, hash)
      .input('role', sql.NVarChar, 'Customer')
      .query('INSERT INTO Users (Email, PasswordHash, Role) VALUES (@email, @hash, @role)');
  }

  for (let idx = 0; idx < providers.length; idx++) {
    const p = providers[idx];

    await pool.request()
      .input('email', sql.NVarChar, p.email)
      .input('hash', sql.NVarChar, hash)
      .input('role', sql.NVarChar, 'Provider')
      .query('INSERT INTO Users (Email, PasswordHash, Role) VALUES (@email, @hash, @role)');

    const { recordset: [{ Id: userId }] } = await pool.request()
      .input('email', sql.NVarChar, p.email)
      .query('SELECT Id FROM Users WHERE Email = @email');

    await pool.request()
      .input('userId', sql.Int, userId)
      .input('businessName', sql.NVarChar, p.businessName)
      .input('category', sql.NVarChar, p.category)
      .input('description', sql.NVarChar, p.description)
      .input('workArea', sql.NVarChar, p.workArea)
      .input('priceFrom', sql.Int, p.priceFrom)
      .query('INSERT INTO ProviderProfiles (UserId, BusinessName, Category, Description, WorkArea, PriceFrom) VALUES (@userId, @businessName, @category, @description, @workArea, @priceFrom)');

    const { recordset: [{ Id: providerId }] } = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT Id FROM ProviderProfiles WHERE UserId = @userId');

    for (const img of p.images) {
      await pool.request()
        .input('providerId', sql.Int, providerId)
        .input('filePath', sql.NVarChar, img)
        .query('INSERT INTO PortfolioMedia (ProviderId, FilePath) VALUES (@providerId, @filePath)');
    }

    const { recordset: customers } = await pool.request()
      .query("SELECT TOP 3 Id FROM Users WHERE Role = 'Customer'");

    for (let k = 0; k < customers.length; k++) {
      const rev = reviews[(idx + k) % reviews.length];
      await pool.request()
        .input('providerId', sql.Int, providerId)
        .input('customerId', sql.Int, customers[k].Id)
        .input('rating', sql.Int, rev.rating)
        .input('comment', sql.NVarChar, rev.comment)
        .query('INSERT INTO Reviews (ProviderId, CustomerId, Rating, Comment) VALUES (@providerId, @customerId, @rating, @comment)');
    }

    await pool.request().input('id', sql.Int, providerId)
      .query('UPDATE ProviderProfiles SET AverageRating = (SELECT AVG(CAST(Rating AS FLOAT)) FROM Reviews WHERE ProviderId = @id) WHERE Id = @id');

    console.log(`✓ ${p.businessName}`);
  }

  console.log('\nSeed completed!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
