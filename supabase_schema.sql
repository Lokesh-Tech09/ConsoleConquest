-- ====================================================================
-- Console Conquest: Mortal Kombat 11 Tournament Platform (ET-2026)
-- PostgreSQL / Supabase Schema Definition
-- Run this in the Supabase SQL Editor if you prefer direct SQL setup.
-- ====================================================================

-- 1. Participant Table
CREATE TABLE IF NOT EXISTS "Participant" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "slotNumber" INTEGER,
    "fullName" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gamerTag" TEXT NOT NULL,
    "preferredFighter" TEXT,
    "age" INTEGER,
    "pool" TEXT,
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "waitlistPosition" INTEGER,
    "notes" TEXT,
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- 2. Tournament Settings Table
CREATE TABLE IF NOT EXISTS "TournamentSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentSetting_pkey" PRIMARY KEY ("id")
);

-- 3. Match Table
CREATE TABLE IF NOT EXISTS "Match" (
    "id" TEXT NOT NULL,
    "pool" TEXT NOT NULL DEFAULT 'A',
    "round" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "player1Slot" INTEGER,
    "player2Slot" INTEGER,
    "player1Name" TEXT,
    "player2Name" TEXT,
    "player1Tag" TEXT,
    "player2Tag" TEXT,
    "player1Fighter" TEXT,
    "player2Fighter" TEXT,
    "score1" INTEGER NOT NULL DEFAULT 0,
    "score2" INTEGER NOT NULL DEFAULT 0,
    "winnerSlot" INTEGER,
    "winnerName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "nextMatchId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- 4. Admin User Table
CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- 5. Constraints & Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Participant_registrationId_key" ON "Participant"("registrationId");
CREATE UNIQUE INDEX IF NOT EXISTS "Participant_slotNumber_key" ON "Participant"("slotNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Participant_rollNumber_key" ON "Participant"("rollNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Participant_email_key" ON "Participant"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Participant_phone_key" ON "Participant"("phone");

CREATE INDEX IF NOT EXISTS "Participant_registrationId_idx" ON "Participant"("registrationId");
CREATE INDEX IF NOT EXISTS "Participant_email_idx" ON "Participant"("email");
CREATE INDEX IF NOT EXISTS "Participant_phone_idx" ON "Participant"("phone");
CREATE INDEX IF NOT EXISTS "Participant_status_idx" ON "Participant"("status");
CREATE INDEX IF NOT EXISTS "Participant_pool_idx" ON "Participant"("pool");

CREATE UNIQUE INDEX IF NOT EXISTS "TournamentSetting_key_key" ON "TournamentSetting"("key");
CREATE INDEX IF NOT EXISTS "Match_pool_round_matchNumber_idx" ON "Match"("pool", "round", "matchNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_username_key" ON "AdminUser"("username");
