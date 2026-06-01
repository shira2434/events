-- PostgreSQL Schema for EventPro
-- Run this in your PostgreSQL database (Supabase / Railway)

CREATE TABLE IF NOT EXISTS Users (
  Id SERIAL PRIMARY KEY,
  Email VARCHAR(255) UNIQUE NOT NULL,
  PasswordHash VARCHAR(255) NOT NULL,
  Role VARCHAR(20) NOT NULL CHECK (Role IN ('Customer', 'Provider')),
  CreatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ProviderProfiles (
  Id SERIAL PRIMARY KEY,
  UserId INT UNIQUE NOT NULL REFERENCES Users(Id) ON DELETE CASCADE,
  BusinessName VARCHAR(255) NOT NULL,
  Category VARCHAR(100) NOT NULL,
  Description TEXT,
  WorkArea VARCHAR(255),
  PriceFrom INT,
  AverageRating FLOAT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS PortfolioMedia (
  Id SERIAL PRIMARY KEY,
  ProviderId INT NOT NULL REFERENCES ProviderProfiles(Id) ON DELETE CASCADE,
  FilePath VARCHAR(500) NOT NULL,
  UploadedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ChatMessages (
  Id SERIAL PRIMARY KEY,
  SenderId INT NOT NULL REFERENCES Users(Id),
  ReceiverId INT NOT NULL REFERENCES Users(Id),
  Content TEXT NOT NULL,
  IsRead BOOLEAN DEFAULT FALSE,
  SentAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Reviews (
  Id SERIAL PRIMARY KEY,
  ProviderId INT NOT NULL REFERENCES ProviderProfiles(Id) ON DELETE CASCADE,
  CustomerId INT NOT NULL REFERENCES Users(Id),
  Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
  Comment TEXT,
  CreatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS Categories (
  Id SERIAL PRIMARY KEY,
  Name VARCHAR(100) UNIQUE NOT NULL,
  Icon VARCHAR(10) DEFAULT '🏷️',
  SortOrder INT DEFAULT 0
);

INSERT INTO Categories (Name, Icon, SortOrder) VALUES
('צלם','📷',1),('מאפרת','💄',2),('קייטרינג','🍽️',3),('DJ','🎧',4),
('פרחים','💐',5),('אולם','🏛️',6),('תכשיטים','💍',7),('הסעות','🚗',8),('עוגות','🎂',9)
ON CONFLICT (Name) DO NOTHING;
