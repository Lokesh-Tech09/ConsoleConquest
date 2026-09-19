export interface ParticipantData {
  id: string;
  registrationId: string;
  slotNumber: number | null;
  fullName: string;
  college: string;
  rollNumber: string;
  email: string;
  phone: string;
  gamerTag: string;
  preferredFighter: string | null;
  age?: number | null;
  pool?: string | null;
  status: 'REGISTERED' | 'WAITLISTED' | 'CHECKED-IN' | 'PLAYING' | 'ELIMINATED' | 'ADVANCED' | 'CANCELLED' | 'DISQUALIFIED';
  waitlistPosition?: number | null;
  notes?: string | null;
  checkedInAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RegistrationInput {
  fullName: string;
  college: string;
  rollNumber: string;
  email: string;
  phone: string;
  gamerTag: string;
  preferredFighter?: string;
  age?: number;
  agreeTerms: boolean;
  honeypot?: string; // Point 18: Spam bot trap
  formLoadedAt?: number; // Point 18: Submission timing check
}

export interface TournamentStatus {
  eventName: string;
  gameName: string;
  format: string;
  maxSlots: number;
  registeredCount: number;
  availableSlots: number;
  isRegistrationOpen: boolean;
  waitlistEnabled: boolean;
  waitlistCount: number;
  checkedInCount: number;
  status: 'OPEN' | 'FULL' | 'CLOSED' | 'WAITLIST_ACTIVE' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface MatchData {
  id: string;
  pool?: string;
  round: number;
  matchNumber: number;
  player1Slot: number | null;
  player2Slot: number | null;
  player1Name: string | null;
  player2Name: string | null;
  player1Tag: string | null;
  player2Tag: string | null;
  player1Fighter: string | null;
  player2Fighter: string | null;
  score1: number;
  score2: number;
  winnerSlot: number | null;
  winnerName: string | null;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  nextMatchId?: string | null;
}

export interface FighterInfo {
  name: string;
  title: string;
  archetype: string;
  color: string;
  iconLetter: string;
  signatureMove: string;
  description: string;
}
