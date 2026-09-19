'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swords, ShieldAlert, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { MK11_ROSTER } from '@/lib/config';
import { validateRegistrationInput } from '@/lib/validation';
import { RegistrationInput, TournamentStatus } from '@/lib/types';
import { combatSound } from '@/lib/sound';
import { trackEvent } from '@/lib/analytics';

export default function RegistrationForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegistrationInput>({
    fullName: '',
    college: '',
    rollNumber: '',
    email: '',
    phone: '',
    gamerTag: '',
    preferredFighter: 'Scorpion',
    age: 20,
    agreeTerms: false,
    honeypot: '',
    formLoadedAt: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<TournamentStatus | null>(null);
  const [successResult, setSuccessResult] = useState<{
    registrationId: string;
    slotNumber: number | null;
    pool?: string | null;
    message?: string;
    waitlistPosition?: number | null;
  } | null>(null);

  useEffect(() => {
    // Record form load timestamp for bot detection (Point 18)
    setFormData((prev) => ({ ...prev, formLoadedAt: Date.now() }));

    // Track registration page load in analytics (Point 19)
    trackEvent('register_form_loaded');

    fetch('/api/tournament/status')
      .then((r) => r.json())
      .then((data) => setStatus(data))
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateRegistrationInput(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Track submission attempt in analytics (Point 19)
    trackEvent('register_submit_attempt', { fighter: formData.preferredFighter });

    const validation = validateRegistrationInput(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched(
        Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {})
      );
      if (combatSound && combatSound.playSlash) combatSound.playSlash();
      return;
    }

    setSubmitting(true);
    if (combatSound && combatSound.playGong) combatSound.playGong();

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error || 'Registration failed. Please review your details.');
        if (data.field) {
          setErrors((prev) => ({ ...prev, [data.field]: data.error }));
        }
        setSubmitting(false);
        trackEvent('register_error', { error: data.error });
        return;
      }

      // Track successful registration in analytics (Point 19)
      trackEvent('register_success', {
        registrationId: data.registrationId,
        slotNumber: data.slotNumber,
        status: data.status,
      });

      const confirmationUrl = `/confirmation/${encodeURIComponent(data.registrationId)}`;
      router.prefetch(confirmationUrl);

      try {
        localStorage.setItem('tournament_updated_at', Date.now().toString());
        window.dispatchEvent(new CustomEvent('tournament-updated', { detail: data }));
      } catch {}

      setSuccessResult({
        registrationId: data.registrationId,
        slotNumber: data.slotNumber,
        pool: data.pool,
        message: data.message,
        waitlistPosition: data.waitlistPosition,
      });

      if (combatSound && combatSound.playSlotReveal) combatSound.playSlotReveal();

      setTimeout(() => {
        router.push(confirmationUrl);
      }, 750);
    } catch {
      setServerError('Network error connecting to the combat arena servers. Please try again.');
      setSubmitting(false);
    }
  };

  const isFull = status ? status.availableSlots <= 0 : false;
  const isClosed = status ? !status.isRegistrationOpen : false;

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-arena-cardBorder bg-gradient-to-b from-arena-card via-arena-dark to-arena-card p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
      {/* Top Combat Banner */}
      <div className="mb-8 border-b border-arena-cardBorder/80 pb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-red-400">
          <Swords className="h-3.5 w-3.5" aria-hidden="true" />
          AISSMS COE • 21ST ENGINEERING TODAY-2026
        </div>
        <h2 className="mt-3 font-heading text-3xl font-black uppercase tracking-wider text-white sm:text-4xl">
          CONSOLE CONQUEST ARENA ENLISTMENT
        </h2>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
          Department of AIML • {status?.maxSlots ?? 128} Total Contenders • 4 Symmetrical Pools of 32 • Entry Fee:{' '}
          <strong className="text-emerald-400 font-bold">₹100</strong>
        </p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 bg-black/50 p-3 rounded-lg border border-slate-800">
          <div><strong className="text-white">Venue:</strong> Room No. 340</div>
          <div><strong className="text-white">Dates:</strong> 29 &amp; 30 Sept</div>
          <div><strong className="text-white">Platform:</strong> PS5 1v1</div>
          <div><strong className="text-amber-300">Prize Pool:</strong> ₹8,000/-</div>
        </div>

        {isClosed && (
          <div className="mt-4 rounded-lg border border-red-800 bg-red-950/60 p-3 text-xs font-bold text-red-300">
            Tournament registration is currently closed. Contact the organizers or check back later.
          </div>
        )}

        {isFull && !isClosed && (
          <div className="mt-4 rounded-lg border border-amber-800 bg-amber-950/60 p-3 text-xs font-bold text-amber-300">
            All {status?.maxSlots ?? 128} tournament bracket slots have been claimed! You are registering for the official <strong>CHALLENGER WAITLIST</strong>.
          </div>
        )}
      </div>

      {serverError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-800 bg-red-950/80 p-4 text-xs font-semibold text-red-200">
          <ShieldAlert className="h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
          <div>
            <p className="font-bold">REGISTRATION DECLINED</p>
            <p className="mt-0.5 text-red-300">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Point 18: Honeypot Anti-Bot Field (Hidden from humans) */}
        <div
          aria-hidden="true"
          style={{
            opacity: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            height: 0,
            width: 0,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        >
          <label htmlFor="hp_company_trap">Leave this field blank</label>
          <input
            type="text"
            id="hp_company_trap"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={formData.honeypot || ''}
            onChange={handleChange}
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
            FULL LEGAL NAME <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="e.g. Lokesh Joshi"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur('fullName')}
              disabled={submitting || isClosed}
              aria-invalid={!!(touched.fullName && errors.fullName)}
              aria-describedby={touched.fullName && errors.fullName ? 'fullName-error' : undefined}
              className={`w-full rounded-lg border bg-black/60 px-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                touched.fullName && errors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                  : 'border-slate-800 focus:border-red-500 focus:ring-red-500/30'
              }`}
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p id="fullName-error" className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Gamer Tag & Preferred Fighter (Grid) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="gamerTag" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              GAMER TAG / IN-GAME NAME <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                id="gamerTag"
                type="text"
                name="gamerTag"
                placeholder="e.g. NetherReaper"
                value={formData.gamerTag}
                onChange={handleChange}
                onBlur={() => handleBlur('gamerTag')}
                disabled={submitting || isClosed}
                aria-invalid={!!(touched.gamerTag && errors.gamerTag)}
                aria-describedby={touched.gamerTag && errors.gamerTag ? 'gamerTag-error' : undefined}
                className={`w-full rounded-lg border bg-black/60 px-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                  touched.gamerTag && errors.gamerTag
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : 'border-slate-800 focus:border-red-500 focus:ring-red-500/30'
                }`}
              />
            </div>
            {touched.gamerTag && errors.gamerTag && (
              <p id="gamerTag-error" className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.gamerTag}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="preferredFighter" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              PREFERRED MK11 FIGHTER <span className="text-slate-400">(OPTIONAL)</span>
            </label>
            <div className="relative mt-1.5">
              <select
                id="preferredFighter"
                name="preferredFighter"
                value={formData.preferredFighter}
                onChange={handleChange}
                disabled={submitting || isClosed}
                className="w-full rounded-lg border border-slate-800 bg-black/80 px-4 py-3 text-base sm:text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                {MK11_ROSTER.map((f) => (
                  <option key={f.name} value={f.name} className="bg-slate-950 text-white">
                    {f.name} ({f.archetype.split('/')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* College & Roll Number (Grid) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="college" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              COLLEGE / INSTITUTION <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                id="college"
                type="text"
                name="college"
                placeholder="e.g. AISSMS COE Pune"
                value={formData.college}
                onChange={handleChange}
                onBlur={() => handleBlur('college')}
                disabled={submitting || isClosed}
                aria-invalid={!!(touched.college && errors.college)}
                aria-describedby={touched.college && errors.college ? 'college-error' : undefined}
                className={`w-full rounded-lg border bg-black/60 px-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                  touched.college && errors.college
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : 'border-slate-800 focus:border-red-500 focus:ring-red-500/30'
                }`}
              />
            </div>
            {touched.college && errors.college && (
              <p id="college-error" className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.college}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rollNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              ROLL NO. / STUDENT ID <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                id="rollNumber"
                type="text"
                name="rollNumber"
                placeholder="e.g. 21114055"
                value={formData.rollNumber}
                onChange={handleChange}
                onBlur={() => handleBlur('rollNumber')}
                disabled={submitting || isClosed}
                aria-invalid={!!(touched.rollNumber && errors.rollNumber)}
                aria-describedby={touched.rollNumber && errors.rollNumber ? 'rollNumber-error' : undefined}
                className={`w-full rounded-lg border bg-black/60 px-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                  touched.rollNumber && errors.rollNumber
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : 'border-slate-800 focus:border-red-500 focus:ring-red-500/30'
                }`}
              />
            </div>
            {touched.rollNumber && errors.rollNumber && (
              <p id="rollNumber-error" className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.rollNumber}</span>
              </p>
            )}
          </div>
        </div>

        {/* Email & Phone Number (Grid) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              EMAIL ADDRESS <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                id="email"
                type="email"
                name="email"
                placeholder="challenger@campus.edu"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                disabled={submitting || isClosed}
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                className={`w-full rounded-lg border bg-black/60 px-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                  touched.email && errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : 'border-slate-800 focus:border-red-500 focus:ring-red-500/30'
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p id="email-error" className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              PHONE NUMBER <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="10-digit mobile (e.g. 9876543210)"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                disabled={submitting || isClosed}
                aria-invalid={!!(touched.phone && errors.phone)}
                aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
                className={`w-full rounded-lg border bg-black/60 px-4 py-3 text-base sm:text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                  touched.phone && errors.phone
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : 'border-slate-800 focus:border-red-500 focus:ring-red-500/30'
                }`}
              />
            </div>
            {touched.phone && errors.phone && (
              <p id="phone-error" className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
            AGE <span className="text-slate-400">(14-80)</span>
          </label>
          <input
            id="age"
            type="number"
            name="age"
            min="14"
            max="80"
            value={formData.age}
            onChange={handleChange}
            disabled={submitting || isClosed}
            className="mt-1.5 w-full rounded-lg border border-slate-800 bg-black/60 px-4 py-3 text-base sm:text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>

        {/* Terms & Conditions Checkbox (Points 1 & 2) */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={submitting || isClosed}
              aria-invalid={!!(touched.agreeTerms && errors.agreeTerms)}
              aria-describedby={touched.agreeTerms && errors.agreeTerms ? 'agreeTerms-error' : undefined}
              className="mt-1 h-4 w-4 rounded border-slate-700 bg-black/60 text-red-600 focus:ring-red-500"
            />
            <span className="text-xs leading-relaxed text-slate-300">
              I agree to the{' '}
              <Link href="/rules" target="_blank" className="font-bold text-red-400 underline hover:text-red-300">
                Tournament Rules
              </Link>,{' '}
              <Link href="/terms" target="_blank" className="font-bold text-red-400 underline hover:text-red-300">
                Terms &amp; Conditions
              </Link>, and{' '}
              <Link href="/privacy" target="_blank" className="font-bold text-red-400 underline hover:text-red-300">
                Privacy Policy
              </Link>. I understand registration is subject to ₹100 entry fee and atomic slot availability.
            </span>
          </label>
          {touched.agreeTerms && errors.agreeTerms && (
            <p id="agreeTerms-error" className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errors.agreeTerms}</span>
            </p>
          )}
        </div>

        {/* Submit Button - Single Clear Call to Action (Point 20) */}
        <div className="pt-4">
          <button
            type="submit"
            id="register-submit-btn"
            disabled={submitting || isClosed}
            className={`group relative flex min-h-[52px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-red-500 py-4 font-heading text-base font-black tracking-widest text-white shadow-glow-crimson transition-all duration-75 touch-manipulation cursor-pointer ${
              submitting || isClosed
                ? 'cursor-not-allowed opacity-50 bg-slate-800 border-slate-700'
                : isFull
                ? 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 hover:from-amber-600 hover:to-orange-500 shadow-glow-ember active:scale-[0.97]'
                : 'bg-gradient-to-r from-red-800 via-arena-accent to-red-700 hover:from-red-700 hover:to-red-500 active:scale-[0.97]'
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>ALLOCATING ARENA SLOT...</span>
              </>
            ) : isClosed ? (
              <span>REGISTRATION CLOSED</span>
            ) : isFull ? (
              <>
                <Sparkles className="h-5 w-5" />
                <span>CLAIM WAITLIST SLOT</span>
              </>
            ) : (
              <>
                <Swords className="h-5 w-5 transition-transform group-hover:rotate-12" aria-hidden="true" />
                <span>ENTER THE ARENA — REGISTER (₹100)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Instant Success Reflection Modal */}
      {successResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-red-500/80 bg-gradient-to-b from-[#1c121e] via-[#0d0c13] to-[#150e18] p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(225,29,72,0.5)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/80 bg-emerald-950/60 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-950/60 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-red-400">
              <Swords className="h-3.5 w-3.5" />
              SLOT SECURED IMMEDIATELY
            </span>

            <h3 className="mt-2 font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              REGISTRATION CONFIRMED!
            </h3>

            <p className="mt-1 text-xs text-slate-300">
              {successResult.slotNumber
                ? `Allocated Tournament Slot #${String(successResult.slotNumber).padStart(3, '0')} • Pool ${successResult.pool || 'A'}`
                : `Added to Waitlist at Position #${successResult.waitlistPosition}`}
            </p>

            <div className="mt-5 rounded-xl border border-red-500/30 bg-black/60 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Official Registration ID
              </div>
              <div className="mt-1 font-heading text-2xl font-black tracking-widest text-arena-accent">
                {successResult.registrationId}
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Fighter: <span className="font-bold text-white">{formData.gamerTag}</span> ({formData.preferredFighter})
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => router.push(`/confirmation/${encodeURIComponent(successResult.registrationId)}`)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 bg-gradient-to-r from-red-700 to-arena-accent py-3.5 font-heading text-xs font-black uppercase tracking-wider text-white shadow-glow-crimson hover:from-red-600 hover:to-red-500 cursor-pointer touch-manipulation active:scale-95 transition-transform duration-75"
              >
                <span>OPEN OFFICIAL TOURNAMENT PASS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
