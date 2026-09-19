'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Flame,
  Search,
  Settings,
  Download,
  LogOut,
  Trophy,
  Swords,
  Edit,
  Trash2,
  CheckCircle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { ParticipantData, MatchData } from '@/lib/types';
import { combatSound } from '@/lib/sound';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [stats, setStats] = useState<{
    totalSlots: number;
    registeredCount: number;
    availableSlots: number;
    waitlistCount: number;
    checkedInCount: number;
    registrationOpen: boolean;
    waitlistEnabled: boolean;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Settings modal state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [maxSlotsInput, setMaxSlotsInput] = useState(32);
  const [regOpenInput, setRegOpenInput] = useState(true);
  const [waitlistInput, setWaitlistInput] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // View mode tab state
  const [activeTab, setActiveTab] = useState<'participants' | 'matches'>('participants');
  const [adminSelectedPool, setAdminSelectedPool] = useState<string>('A');
  const [adminSelectedRound, setAdminSelectedRound] = useState<number>(1);
  const [updatingMatchId, setUpdatingMatchId] = useState<string | null>(null);

  // Match manager modal state
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const [modalPoolFilter, setModalPoolFilter] = useState<string>('A');
  const [modalRoundFilter, setModalRoundFilter] = useState<number>(1);
  const [score1Input, setScore1Input] = useState(0);
  const [score2Input, setScore2Input] = useState(0);
  const [winnerSlotInput, setWinnerSlotInput] = useState<number | null>(null);

  // Slot reassignment modal
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [targetParticipant, setTargetParticipant] = useState<ParticipantData | null>(null);
  const [newSlotNumber, setNewSlotNumber] = useState<number | ''>('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Clear All modal
  const [clearAllModalOpen, setClearAllModalOpen] = useState(false);
  const [clearAllInput, setClearAllInput] = useState('');
  const [clearAllLoading, setClearAllLoading] = useState(false);
  const [clearAllError, setClearAllError] = useState<string | null>(null);

  // Check auth on mount & setup real-time refresh
  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          fetchDashboardData();
          fetchMatches();
        }
      })
      .catch(() => setAuthenticated(false));
  }, []);

  // Real-time reflection: poll every 5s when active + listen for registration events
  useEffect(() => {
    if (!authenticated) return;

    const handleTournamentUpdate = () => {
      if (!settingsOpen && !matchModalOpen && !reassignModalOpen && !clearAllModalOpen) {
        fetchDashboardData(false);
        fetchMatches();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'tournament_updated_at') {
        handleTournamentUpdate();
      }
    };

    const interval = setInterval(() => {
      if (
        document.visibilityState === 'visible' &&
        !settingsOpen &&
        !matchModalOpen &&
        !reassignModalOpen &&
        !clearAllModalOpen
      ) {
        fetchDashboardData(false);
        fetchMatches();
      }
    }, 12000);

    window.addEventListener('tournament-updated', handleTournamentUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('tournament-updated', handleTournamentUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [authenticated, settingsOpen, matchModalOpen, reassignModalOpen, clearAllModalOpen, searchQuery, statusFilter]);

  const fetchDashboardData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const url = new URL('/api/admin/participants', window.location.origin);
      if (searchQuery) url.searchParams.set('q', searchQuery);
      if (statusFilter !== 'ALL') url.searchParams.set('status', statusFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setParticipants(data.participants || []);
        setStats(data.stats || null);
        if (data.stats) {
          setMaxSlotsInput(data.stats.totalSlots);
          setRegOpenInput(data.stats.registrationOpen);
          setWaitlistInput(data.stats.waitlistEnabled);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Authentication failed');
        setLoginLoading(false);
        return;
      }

      setAuthenticated(true);
      fetchDashboardData();
    } catch {
      setLoginError('Error connecting to authentication endpoint');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setPassword('');
  };

  const handleCheckIn = async (id: string) => {
    if (combatSound && combatSound.playSlash) combatSound.playSlash();
    try {
      const res = await fetch(`/api/admin/checkin/${id}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message || 'Player checked in!');
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/participants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromoteWaitlist = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/participants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PROMOTE_WAITLIST' }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Could not promote participant');
      } else {
        setActionMessage('Participant promoted to available slot!');
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReassignSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetParticipant) return;

    try {
      const res = await fetch(`/api/admin/participants/${targetParticipant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotNumber: newSlotNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to reassign slot');
      } else {
        setReassignModalOpen(false);
        setActionMessage(`Slot reassigned to #${newSlotNumber}!`);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          MAX_SLOTS: String(maxSlotsInput),
          REGISTRATION_OPEN: String(regOpenInput),
          WAITLIST_ENABLED: String(waitlistInput),
        }),
      });
      if (res.ok) {
        setSettingsOpen(false);
        setActionMessage('Tournament settings saved successfully!');
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsSaving(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/bracket');
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openMatchManager = async () => {
    try {
      const res = await fetch('/api/bracket');
      if (res.ok) {
        const data = await res.json();
        const mList: MatchData[] = data.matches || [];
        setMatches(mList);
        if (mList.length > 0) {
          const match = mList.find((m) => m.pool === modalPoolFilter && m.round === modalRoundFilter) || mList[0];
          setSelectedMatch(match);
          setScore1Input(match.score1);
          setScore2Input(match.score2);
          setWinnerSlotInput(match.winnerSlot);
        }
        setMatchModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const declareWinner = async (match: MatchData, winnerSlot: number, s1?: number, s2?: number) => {
    setUpdatingMatchId(match.id);
    try {
      const isP1 = winnerSlot === match.player1Slot;
      const defaultScore = match.round >= 5 ? 2 : 1;
      const finalS1 = s1 !== undefined ? s1 : (isP1 ? defaultScore : 0);
      const finalS2 = s2 !== undefined ? s2 : (isP1 ? 0 : defaultScore);

      const res = await fetch(`/api/admin/matches/${match.id}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score1: finalS1,
          score2: finalS2,
          winnerSlot,
          status: 'COMPLETED',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const winnerName = isP1 ? match.player1Name : match.player2Name;
        setActionMessage(`🏆 Winner declared: ${winnerName || 'Contender'} for Match #${match.matchNumber}! Bracket updated.`);
        fetchMatches();
        try {
          localStorage.setItem('tournament_updated_at', Date.now().toString());
          window.dispatchEvent(new CustomEvent('tournament-updated'));
        } catch {}
      } else {
        setActionMessage(data.error || 'Failed to record winner');
      }
    } catch (err) {
      console.error(err);
      setActionMessage('Error updating winner');
    } finally {
      setUpdatingMatchId(null);
    }
  };

  const resetMatch = async (match: MatchData) => {
    setUpdatingMatchId(match.id);
    try {
      const res = await fetch(`/api/admin/matches/${match.id}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score1: 0,
          score2: 0,
          winnerSlot: null,
          status: 'SCHEDULED',
        }),
      });

      if (res.ok) {
        setActionMessage(`Match #${match.matchNumber} reset to Scheduled.`);
        fetchMatches();
        try {
          localStorage.setItem('tournament_updated_at', Date.now().toString());
          window.dispatchEvent(new CustomEvent('tournament-updated'));
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingMatchId(null);
    }
  };

  const handleSaveMatchResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !winnerSlotInput) return;

    try {
      const res = await fetch(`/api/admin/matches/${selectedMatch.id}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score1: score1Input,
          score2: score2Input,
          winnerSlot: winnerSlotInput,
          status: 'COMPLETED',
        }),
      });

      if (res.ok) {
        setActionMessage('Match result updated and winner advanced in bracket!');
        fetchMatches();
        try {
          localStorage.setItem('tournament_updated_at', Date.now().toString());
          window.dispatchEvent(new CustomEvent('tournament-updated'));
        } catch {}
        setMatchModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (clearAllInput !== 'CLEAR ALL') {
      setClearAllError('Please type CLEAR ALL exactly to confirm.');
      return;
    }
    setClearAllLoading(true);
    setClearAllError(null);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'CLEAR ALL REGISTRATIONS' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setClearAllError(data.error || 'Reset failed');
      } else {
        setClearAllModalOpen(false);
        setClearAllInput('');
        setActionMessage(data.message);
        try {
          localStorage.setItem('tournament_updated_at', Date.now().toString());
          window.dispatchEvent(new CustomEvent('tournament-updated'));
        } catch {}
        fetchDashboardData();
      }
    } catch {
      setClearAllError('Network error. Please try again.');
    } finally {
      setClearAllLoading(false);
    }
  };

  // 1. Loading screen while checking auth
  if (authenticated === null) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-red-500 font-heading text-lg font-bold">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>CHECKING CREDENTIALS...</span>
        </div>
      </div>
    );
  }

  // 2. Login Screen if not authenticated
  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="rounded-2xl border border-arena-cardBorder bg-arena-card/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-red-950/60 text-arena-accent shadow-glow-crimson">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-heading text-2xl font-black uppercase text-white">
              ORGANIZER COMMAND CENTER
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Authorized tournament officials only.
            </p>
          </div>

          {loginError && (
            <div className="mt-4 rounded-lg border border-red-800 bg-red-950/80 p-3 text-xs font-bold text-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                ADMIN USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="Enter password (default: kombat2026!)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-800 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-2 w-full rounded-lg border border-red-500 bg-gradient-to-r from-red-800 via-arena-accent to-red-700 py-3 font-heading text-sm font-black tracking-widest text-white shadow-glow-crimson hover:from-red-700 hover:to-red-500 transition-all active:scale-98"
            >
              {loginLoading ? 'AUTHENTICATING...' : 'ENTER COMMAND CENTER'}
            </button>
          </form>

          <p className="mt-4 text-center text-[10px] text-slate-500">
            Default credentials: <code className="text-slate-400">admin</code> / <code className="text-slate-400">kombat2026!</code>
          </p>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin Dashboard
  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-arena-cardBorder pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-400">
            <Swords className="h-4 w-4" />
            LIVE TOURNAMENT ADMINISTRATION
          </span>
          <h1 className="mt-1 font-heading text-3xl font-black uppercase tracking-wider text-white">
            CONSOLE CONQUEST COMMAND CENTER
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-bold text-slate-200 hover:border-slate-500 hover:text-white cursor-pointer touch-manipulation active:scale-95 transition-transform duration-75"
          >
            <Settings className="h-4 w-4" />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('matches');
              fetchMatches();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-amber-800/80 bg-amber-950/50 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/50 cursor-pointer touch-manipulation active:scale-95 transition-transform duration-75"
          >
            <Trophy className="h-4 w-4" />
            <span>BRACKET & WINNER CONTROL</span>
          </button>

          <a
            href="/api/admin/export"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-bold text-slate-200 hover:border-slate-500 hover:text-white cursor-pointer touch-manipulation active:scale-95 transition-transform duration-75"
          >
            <Download className="h-4 w-4" />
            <span>EXPORT CSV</span>
          </a>

          <button
            onClick={() => { setClearAllModalOpen(true); setClearAllInput(''); setClearAllError(null); }}
            className="flex items-center gap-1.5 rounded-lg border border-red-700/80 bg-red-950/70 px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-900/60 hover:text-red-300 cursor-pointer touch-manipulation active:scale-95 transition-all duration-75"
          >
            <Trash2 className="h-4 w-4" />
            <span>CLEAR ALL</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/60 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-900/50 cursor-pointer touch-manipulation active:scale-95 transition-transform duration-75"
          >
            <LogOut className="h-4 w-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-800 bg-emerald-950/80 p-3 text-xs font-bold text-emerald-300">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white cursor-pointer touch-manipulation">
            ✕
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-xl border border-arena-cardBorder bg-arena-card/80 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL SLOTS</span>
            <div className="mt-1 font-heading text-2xl font-black text-white">{stats.totalSlots}</div>
            <span className="text-[10px] text-slate-500">Configured limit</span>
          </div>

          <div className="rounded-xl border border-arena-cardBorder bg-arena-card/80 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CLAIMED SLOTS</span>
            <div className="mt-1 font-heading text-2xl font-black text-red-400">{stats.registeredCount}</div>
            <span className="text-[10px] text-slate-500">Active roster players</span>
          </div>

          <div className="rounded-xl border border-arena-cardBorder bg-arena-card/80 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AVAILABLE</span>
            <div className="mt-1 font-heading text-2xl font-black text-emerald-400">{stats.availableSlots}</div>
            <span className="text-[10px] text-slate-500">Remaining open slots</span>
          </div>

          <div className="rounded-xl border border-arena-cardBorder bg-arena-card/80 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WAITLIST</span>
            <div className="mt-1 font-heading text-2xl font-black text-amber-400">{stats.waitlistCount}</div>
            <span className="text-[10px] text-slate-500">Waiting for promotion</span>
          </div>

          <div className="rounded-xl border border-arena-cardBorder bg-arena-card/80 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CHECKED-IN</span>
            <div className="mt-1 font-heading text-2xl font-black text-sky-400">{stats.checkedInCount}</div>
            <span className="text-[10px] text-slate-500">Confirmed present at desk</span>
          </div>
        </div>
      )}

      {/* View Mode Navigation Tabs */}
      <div className="flex border-b border-arena-cardBorder gap-2 sm:gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('participants')}
          className={`flex items-center gap-2 pb-3 px-1 text-xs font-black uppercase tracking-wider cursor-pointer touch-manipulation active:scale-95 transition-all duration-75 border-b-2 ${
            activeTab === 'participants'
              ? 'border-red-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>ROSTER & CONTENDERS ({participants.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('matches');
            fetchMatches();
          }}
          className={`flex items-center gap-2 pb-3 px-1 text-xs font-black uppercase tracking-wider cursor-pointer touch-manipulation active:scale-95 transition-all duration-75 border-b-2 ${
            activeTab === 'matches'
              ? 'border-amber-500 text-amber-300 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="h-4 w-4 text-amber-400" />
          <span>MATCHES & WINNER CONTROL (128-PLAYER BRACKET)</span>
        </button>
      </div>

      {activeTab === 'participants' && (
        <>
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-arena-cardBorder bg-arena-card/60 p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, roll, tag, slot #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchDashboardData()}
            className="w-full rounded-lg border border-slate-800 bg-black/60 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-black/80 px-3 py-1.5 text-xs font-bold text-white focus:border-red-500 focus:outline-none"
          >
            <option value="ALL">ALL PARTICIPANTS</option>
            <option value="REGISTERED">REGISTERED</option>
            <option value="CHECKED-IN">CHECKED-IN</option>
            <option value="WAITLISTED">WAITLISTED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="DISQUALIFIED">DISQUALIFIED</option>
          </select>

          <button
            onClick={() => fetchDashboardData(true)}
            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white cursor-pointer touch-manipulation active:scale-90 transition-transform duration-75"
            title="Refresh participant list"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-arena-accent' : ''}`} />
          </button>
        </div>
      </div>

      {/* Participants Table */}
      <div className="overflow-x-auto rounded-xl border border-arena-cardBorder bg-arena-card/80">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-arena-cardBorder bg-black/40 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Player / Alias</th>
              <th className="px-4 py-3">College & Roll</th>
              <th className="px-4 py-3">Fighter</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {participants.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No participants matching current search/filter.
                </td>
              </tr>
            ) : (
              participants.map((p) => {
                const isCheckedIn = p.status === 'CHECKED-IN';
                return (
                  <tr key={p.id} className="transition-colors hover:bg-slate-900/50">
                    {/* Slot */}
                    <td className="px-4 py-3 font-mono font-bold">
                      {p.slotNumber ? (
                        <span className="rounded bg-red-950/60 border border-red-500/40 px-2 py-0.5 text-xs text-red-300">
                          #{String(p.slotNumber).padStart(3, '0')}
                        </span>
                      ) : p.waitlistPosition ? (
                        <span className="rounded bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 text-[10px] text-amber-300">
                          WL #{p.waitlistPosition}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Player / Tag */}
                    <td className="px-4 py-3">
                      <div className="font-heading font-black text-sm text-white">{p.fullName}</div>
                      <div className="text-[11px] font-bold text-red-400">{p.gamerTag}</div>
                      <div className="text-[10px] text-slate-500">{p.registrationId}</div>
                    </td>

                    {/* College */}
                    <td className="px-4 py-3 text-slate-300">
                      <div>{p.college}</div>
                      <div className="font-mono text-[10px] text-slate-500">{p.rollNumber}</div>
                    </td>

                    {/* Fighter */}
                    <td className="px-4 py-3 text-slate-200 font-bold">
                      {p.preferredFighter || 'Scorpion'}
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3 text-slate-400">
                      <div>{p.phone}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{p.email}</div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          isCheckedIn
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                            : p.status === 'REGISTERED'
                            ? 'bg-sky-950/80 text-sky-300 border border-sky-800'
                            : p.status === 'WAITLISTED'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-700'
                            : 'bg-red-950/80 text-red-400 border border-red-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCheckedIn && p.status !== 'CANCELLED' && p.status !== 'WAITLISTED' && (
                          <button
                            onClick={() => handleCheckIn(p.id)}
                            title="Check-In Player"
                            className="rounded bg-emerald-900/60 border border-emerald-600 px-2 py-1 text-[10px] font-bold text-emerald-200 hover:bg-emerald-800"
                          >
                            Check-In
                          </button>
                        )}

                        {p.status === 'WAITLISTED' && (
                          <button
                            onClick={() => handlePromoteWaitlist(p.id)}
                            title="Promote into tournament slot"
                            className="rounded bg-amber-900/60 border border-amber-600 px-2 py-1 text-[10px] font-bold text-amber-200 hover:bg-amber-800"
                          >
                            Promote
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setTargetParticipant(p);
                            setNewSlotNumber(p.slotNumber || '');
                            setReassignModalOpen(true);
                          }}
                          title="Reassign Slot"
                          className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-300 hover:text-white"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleStatusChange(p.id, p.status === 'CANCELLED' ? 'REGISTERED' : 'CANCELLED')}
                          title={p.status === 'CANCELLED' ? 'Re-open' : 'Cancel Registration'}
                          className="rounded border border-slate-800 bg-black/60 p-1 text-slate-400 hover:text-red-400"
                        >
                          {p.status === 'CANCELLED' ? 'Re-open' : 'Cancel'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
        </>
      )}

      {/* ── MATCHES & WINNER CONTROL TAB ───────────────────────── */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          {/* Pool & Round Control Header */}
          <div className="rounded-2xl border border-arena-cardBorder bg-arena-card/90 p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5" />
                  OFFICIAL BRACKET CONTROLLER
                </span>
                <h2 className="font-heading text-xl font-black uppercase text-white mt-0.5">
                  1-CLICK WINNER DECLARATION & MATCH MANAGER
                </h2>
                <p className="text-xs text-slate-400">
                  Select Pool and Round. Click &ldquo;👑 DECLARE WINNER&rdquo; on either contender to automatically advance them to their next round match in real time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchMatches}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${updatingMatchId ? 'animate-spin text-arena-accent' : ''}`} />
                  <span>REFRESH MATCHES</span>
                </button>
              </div>
            </div>

            {/* Pool Selector Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                { key: 'A', name: 'POOL A', desc: 'Slots 001 - 032' },
                { key: 'B', name: 'POOL B', desc: 'Slots 033 - 064' },
                { key: 'C', name: 'POOL C', desc: 'Slots 065 - 096' },
                { key: 'D', name: 'POOL D', desc: 'Slots 097 - 128' },
                { key: 'FINALS', name: 'FINALS', desc: 'Pool Champions' },
              ].map((p) => {
                const isSelected = adminSelectedPool === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setAdminSelectedPool(p.key);
                      setAdminSelectedRound(1);
                    }}
                    className={`rounded-xl border p-2.5 text-center transition-all ${
                      isSelected
                        ? 'border-red-500 bg-red-950/70 text-white shadow-glow-crimson scale-[1.02]'
                        : 'border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="block font-heading text-xs font-black uppercase">{p.name}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{p.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Round Selector Tabs */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">ROUND:</span>
              {adminSelectedPool !== 'FINALS' ? (
                [
                  { r: 1, name: 'ROUND 1 (R32 - 16 Matches)' },
                  { r: 2, name: 'ROUND 2 (R16 - 8 Matches)' },
                  { r: 3, name: 'ROUND 3 (QUARTERS - 4 Matches)' },
                  { r: 4, name: 'ROUND 4 (SEMIS - 2 Matches)' },
                  { r: 5, name: 'ROUND 5 (POOL FINAL - 1 Match)' },
                ].map((rd) => (
                  <button
                    key={rd.r}
                    type="button"
                    onClick={() => setAdminSelectedRound(rd.r)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      adminSelectedRound === rd.r
                        ? 'bg-amber-500 text-black font-black shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {rd.name}
                  </button>
                ))
              ) : (
                [
                  { r: 1, name: 'CHAMPIONSHIP SEMIFINALS (2 Matches)' },
                  { r: 2, name: 'GRAND FINAL & 3RD PLACE (2 Matches)' },
                ].map((rd) => (
                  <button
                    key={rd.r}
                    type="button"
                    onClick={() => setAdminSelectedRound(rd.r)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      adminSelectedRound === rd.r
                        ? 'bg-amber-500 text-black font-black shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {rd.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches
              .filter((m) => m.pool === adminSelectedPool && m.round === adminSelectedRound)
              .map((m) => {
                const isCompleted = m.status === 'COMPLETED';
                const isP1Winner = isCompleted && m.winnerSlot !== null && m.winnerSlot === m.player1Slot;
                const isP2Winner = isCompleted && m.winnerSlot !== null && m.winnerSlot === m.player2Slot;
                const isUpdating = updatingMatchId === m.id;

                return (
                  <div
                    key={m.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isCompleted
                        ? 'border-slate-800 bg-black/40'
                        : 'border-red-500/30 bg-arena-card/90 shadow-lg'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xs font-black uppercase text-amber-400">
                          MATCH #{m.matchNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (Round {m.round} • Pool {m.pool})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                              : m.status === 'LIVE'
                              ? 'bg-red-950 text-red-300 border border-red-700 animate-pulse'
                              : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {m.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMatch(m);
                            setScore1Input(m.score1);
                            setScore2Input(m.score2);
                            setWinnerSlotInput(m.winnerSlot);
                            setModalPoolFilter(m.pool || 'A');
                            setModalRoundFilter(m.round);
                            setMatchModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors underline"
                        >
                          Details / Edit
                        </button>

                        {isCompleted && (
                          <button
                            type="button"
                            onClick={() => resetMatch(m)}
                            disabled={isUpdating}
                            title="Reset match back to Scheduled"
                            className="text-[10px] font-bold text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Contenders Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Player 1 Side */}
                      <div
                        className={`rounded-xl border p-3 flex flex-col justify-between transition-all ${
                          isP1Winner
                            ? 'border-amber-500 bg-amber-950/40 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                            : isCompleted
                            ? 'border-slate-800/80 bg-black/30 opacity-60'
                            : 'border-slate-800 bg-black/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400">
                              {m.player1Slot ? `#${String(m.player1Slot).padStart(3, '0')}` : '??'}
                            </span>
                            <span className="font-heading text-base font-black text-white">
                              {m.score1}
                            </span>
                          </div>

                          <div className="font-heading text-sm font-black truncate text-white">
                            {m.player1Name || 'Open Contender Slot'}
                          </div>

                          {m.player1Tag && (
                            <div className="text-[11px] font-bold text-red-400 truncate">
                              {m.player1Tag}
                            </div>
                          )}
                          {m.player1Fighter && (
                            <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                              {m.player1Fighter}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/60">
                          {isP1Winner ? (
                            <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-black text-amber-300">
                              <Trophy className="h-3.5 w-3.5" />
                              <span>WINNER ADVANCED</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => declareWinner(m, m.player1Slot!)}
                              disabled={!m.player1Slot || isUpdating}
                              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/70 bg-emerald-950/80 hover:bg-emerald-900 py-2 text-xs font-black uppercase tracking-wider text-emerald-200 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                            >
                              <span>👑 DECLARE WINNER</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Player 2 Side */}
                      <div
                        className={`rounded-xl border p-3 flex flex-col justify-between transition-all ${
                          isP2Winner
                            ? 'border-amber-500 bg-amber-950/40 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                            : isCompleted
                            ? 'border-slate-800/80 bg-black/30 opacity-60'
                            : 'border-slate-800 bg-black/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="rounded bg-slate-900 border border-slate-700 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400">
                              {m.player2Slot ? `#${String(m.player2Slot).padStart(3, '0')}` : '??'}
                            </span>
                            <span className="font-heading text-base font-black text-white">
                              {m.score2}
                            </span>
                          </div>

                          <div className="font-heading text-sm font-black truncate text-white">
                            {m.player2Name || 'Open Contender Slot'}
                          </div>

                          {m.player2Tag && (
                            <div className="text-[11px] font-bold text-red-400 truncate">
                              {m.player2Tag}
                            </div>
                          )}
                          {m.player2Fighter && (
                            <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                              {m.player2Fighter}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/60">
                          {isP2Winner ? (
                            <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-black text-amber-300">
                              <Trophy className="h-3.5 w-3.5" />
                              <span>WINNER ADVANCED</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => declareWinner(m, m.player2Slot!)}
                              disabled={!m.player2Slot || isUpdating}
                              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-emerald-600/70 bg-emerald-950/80 hover:bg-emerald-900 py-2 text-xs font-black uppercase tracking-wider text-emerald-200 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                            >
                              <span>👑 DECLARE WINNER</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-arena-cardBorder bg-arena-card p-6 shadow-2xl">
            <h3 className="font-heading text-xl font-black uppercase text-white">
              TOURNAMENT SYSTEM SETTINGS
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Configure capacity limits and registration availability.
            </p>

            <form onSubmit={handleSaveSettings} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300">
                  MAXIMUM TOURNAMENT SLOTS
                </label>
                <input
                  type="number"
                  min="4"
                  max="128"
                  value={maxSlotsInput}
                  onChange={(e) => setMaxSlotsInput(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-black/60 px-4 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <span className="text-xs font-bold text-slate-300">REGISTRATION STATUS</span>
                <button
                  type="button"
                  onClick={() => setRegOpenInput(!regOpenInput)}
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                    regOpenInput ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-red-950 text-red-400 border border-red-700'
                  }`}
                >
                  {regOpenInput ? 'OPEN' : 'CLOSED'}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <span className="text-xs font-bold text-slate-300">WAITLIST SYSTEM</span>
                <button
                  type="button"
                  onClick={() => setWaitlistInput(!waitlistInput)}
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                    waitlistInput ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {waitlistInput ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settingsSaving}
                  className="rounded-lg border border-red-500 bg-red-700 px-5 py-2 text-xs font-black uppercase text-white shadow-glow-crimson hover:bg-red-600"
                >
                  {settingsSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slot Reassignment Modal */}
      {reassignModalOpen && targetParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-arena-cardBorder bg-arena-card p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-black uppercase text-white">
              MANUALLY REASSIGN SLOT
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Change slot for <strong>{targetParticipant.fullName}</strong> ({targetParticipant.gamerTag}).
            </p>

            <form onSubmit={handleReassignSlot} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300">
                  NEW SLOT NUMBER (1 - {stats?.totalSlots || 32})
                </label>
                <input
                  type="number"
                  min="1"
                  max={stats?.totalSlots || 32}
                  value={newSlotNumber}
                  onChange={(e) => setNewSlotNumber(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Enter slot number"
                  required
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-black/60 px-4 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setReassignModalOpen(false)}
                  className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg border border-red-500 bg-red-700 px-4 py-1.5 text-xs font-black uppercase text-white hover:bg-red-600"
                >
                  Update Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Match Result Modal */}
      {matchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-arena-cardBorder bg-arena-card p-6 shadow-2xl">
            <h3 className="font-heading text-xl font-black uppercase text-white">
              RECORD BRACKET MATCH RESULT
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Input final match score and declare victor to advance them to the next round.
            </p>

            <form onSubmit={handleSaveMatchResult} className="mt-4 space-y-4">
              {/* Pool & Round quick filters in modal */}
              <div className="space-y-2 rounded-lg border border-slate-800 bg-black/40 p-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">POOL:</span>
                  {['A', 'B', 'C', 'D', 'FINALS'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setModalPoolFilter(p);
                        const match = matches.find((m) => m.pool === p && m.round === modalRoundFilter) || matches.find((m) => m.pool === p);
                        if (match) {
                          setSelectedMatch(match);
                          setScore1Input(match.score1);
                          setScore2Input(match.score2);
                          setWinnerSlotInput(match.winnerSlot);
                        }
                      }}
                      className={`rounded px-2.5 py-1 text-[10px] font-black uppercase transition-colors ${
                        modalPoolFilter === p
                          ? 'bg-red-700 text-white shadow-sm'
                          : 'bg-black/60 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p === 'FINALS' ? 'FINALS' : `POOL ${p}`}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">ROUND:</span>
                  {(modalPoolFilter !== 'FINALS' ? [1, 2, 3, 4, 5] : [1, 2]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setModalRoundFilter(r);
                        const match = matches.find((m) => m.pool === modalPoolFilter && m.round === r);
                        if (match) {
                          setSelectedMatch(match);
                          setScore1Input(match.score1);
                          setScore2Input(match.score2);
                          setWinnerSlotInput(match.winnerSlot);
                        }
                      }}
                      className={`rounded px-2 py-0.5 text-[10px] font-bold transition-colors ${
                        modalRoundFilter === r
                          ? 'bg-amber-500 text-black font-black'
                          : 'bg-black/60 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Round {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300">
                  SELECT MATCH
                </label>
                <select
                  value={selectedMatch?.id || ''}
                  onChange={(e) => {
                    const match = matches.find((m) => m.id === e.target.value);
                    if (match) {
                      setSelectedMatch(match);
                      setScore1Input(match.score1);
                      setScore2Input(match.score2);
                      setWinnerSlotInput(match.winnerSlot);
                    }
                  }}
                  className="mt-1.5 w-full rounded-lg border border-slate-800 bg-black/80 px-3 py-2 text-xs text-white"
                >
                  {matches
                    .filter((m) => m.pool === modalPoolFilter && m.round === modalRoundFilter)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        Match #{m.matchNumber}: {m.player1Name || `Slot #${m.player1Slot}`} vs {m.player2Name || `Slot #${m.player2Slot}`} {m.status === 'COMPLETED' ? '(COMPLETED)' : ''}
                      </option>
                    ))}
                </select>
              </div>

              {selectedMatch && (
                <div className="rounded-lg border border-slate-800 bg-black/40 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <span className="block font-heading text-xs font-black text-white">
                        {selectedMatch.player1Name || `Slot #${selectedMatch.player1Slot}`}
                      </span>
                      <span className="text-[10px] text-red-400 font-bold">
                        {selectedMatch.player1Fighter || 'Fighter 1'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={score1Input}
                        onChange={(e) => setScore1Input(Number(e.target.value))}
                        className="mt-1 w-full rounded border border-slate-700 bg-black px-3 py-1.5 text-center font-heading text-base font-black text-white"
                      />
                    </div>

                    <div>
                      <span className="block font-heading text-xs font-black text-white">
                        {selectedMatch.player2Name || `Slot #${selectedMatch.player2Slot}`}
                      </span>
                      <span className="text-[10px] text-red-400 font-bold">
                        {selectedMatch.player2Fighter || 'Fighter 2'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={score2Input}
                        onChange={(e) => setScore2Input(Number(e.target.value))}
                        className="mt-1 w-full rounded border border-slate-700 bg-black px-3 py-1.5 text-center font-heading text-base font-black text-white"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <label className="block text-xs font-bold uppercase text-slate-300">
                      1-CLICK WINNER DECLARATION
                    </label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedMatch.player1Slot && (
                        <button
                          type="button"
                          onClick={() => {
                            declareWinner(selectedMatch, selectedMatch.player1Slot!, score1Input, score2Input);
                            setMatchModalOpen(false);
                          }}
                          className="rounded-lg border border-emerald-600 bg-emerald-950/80 hover:bg-emerald-900 py-2.5 px-2 text-xs font-black uppercase text-emerald-200 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Trophy className="h-3.5 w-3.5 text-amber-400" />
                          <span className="truncate">👑 {selectedMatch.player1Name || 'P1'} WINS</span>
                        </button>
                      )}

                      {selectedMatch.player2Slot && (
                        <button
                          type="button"
                          onClick={() => {
                            declareWinner(selectedMatch, selectedMatch.player2Slot!, score1Input, score2Input);
                            setMatchModalOpen(false);
                          }}
                          className="rounded-lg border border-emerald-600 bg-emerald-950/80 hover:bg-emerald-900 py-2.5 px-2 text-xs font-black uppercase text-emerald-200 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Trophy className="h-3.5 w-3.5 text-amber-400" />
                          <span className="truncate">👑 {selectedMatch.player2Name || 'P2'} WINS</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setMatchModalOpen(false)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!winnerSlotInput}
                  className="rounded-lg border border-amber-600 bg-amber-700 px-5 py-2 text-xs font-black uppercase text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  Record Result & Advance Winner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── CLEAR ALL REGISTRATIONS Confirmation Modal ───────────── */}
      {clearAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border-2 border-red-700 bg-[#0e0505] p-6 shadow-[0_0_60px_rgba(220,38,38,0.35)]">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-red-900/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-600 bg-red-950 text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black uppercase text-white">
                  Clear All Registrations
                </h3>
                <p className="text-[11px] text-red-400 font-bold">This cannot be undone</p>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-4 rounded-lg border border-red-800/60 bg-red-950/50 p-3 text-xs text-red-300">
              <p className="font-bold uppercase text-red-400 mb-1">⚠ DANGER — Permanent Action</p>
              <p>This will permanently delete <strong className="text-white">ALL participants</strong> and <strong className="text-white">ALL match records</strong> from the database.</p>
              <p className="mt-2">Tournament settings and admin credentials will be preserved.</p>
            </div>

            {/* Confirmation input */}
            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Type <code className="text-red-400 bg-red-950/70 px-1.5 py-0.5 rounded">CLEAR ALL</code> to confirm
              </label>
              <input
                type="text"
                value={clearAllInput}
                onChange={(e) => { setClearAllInput(e.target.value); setClearAllError(null); }}
                placeholder="CLEAR ALL"
                className="w-full rounded-lg border border-slate-700 bg-black/70 px-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/40"
                autoFocus
              />
              {clearAllError && (
                <p className="mt-2 text-xs font-bold text-red-400">{clearAllError}</p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => { setClearAllModalOpen(false); setClearAllInput(''); setClearAllError(null); }}
                disabled={clearAllLoading}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 py-2.5 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={clearAllLoading || clearAllInput !== 'CLEAR ALL'}
                className="flex-1 rounded-lg border border-red-600 bg-red-800 py-2.5 text-xs font-black uppercase text-white shadow-glow-crimson hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {clearAllLoading ? 'CLEARING...' : '🗑 CLEAR ALL REGISTRATIONS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
