You are an expert full-stack web developer and UI/UX designer.

Build a complete, production-ready web application for a college gaming event called:

                    CONSOLE CONQUEST
                 MORTAL KOMBAT 11

This is a competitive 1v1 Mortal Kombat 11 gaming tournament.

IMPORTANT:
Do not create a generic gaming website.
The entire UI/UX should feel like a premium Mortal Kombat-inspired fighting tournament registration system.

==================================================
1. CORE OBJECTIVE
==================================================

Build a responsive registration website where participants can:

1. View the Console Conquest event.
2. Understand that the game is Mortal Kombat 11.
3. Register for the 1v1 tournament.
4. Submit their participant details.
5. Automatically receive a unique tournament slot after successful registration.
6. See their registration confirmation and slot number.
7. See the number of slots remaining.
8. Prevent duplicate registrations.
9. Prevent two users from receiving the same slot.
10. Allow organizers/admins to manage registrations and slots.

The registration flow must be reliable even if multiple people register at almost the same time.

==================================================
2. VISUAL DESIGN
==================================================

Theme:
Mortal Kombat 11 / dark fighting-game arena.

Use a premium, cinematic esports aesthetic.

Color direction:
- Black / near-black background
- Deep crimson red
- Dark charcoal
- Metallic gray
- White typography
- Subtle orange/red glow
- Avoid making the UI look childish

Visual inspiration:
- Fighting game character-select screens
- Tournament brackets
- Arcade interfaces
- Esports dashboards
- Mortal Kombat-style dramatic presentation

DO NOT copy copyrighted Mortal Kombat artwork directly.

Instead create an ORIGINAL Mortal Kombat-inspired visual language:
- dark arena background
- smoke/fog
- sparks
- subtle particles
- cracked-metal textures
- glowing red accents
- sharp/angular UI panels
- dramatic shadows
- combat-inspired transitions

The design should feel like:

"ENTER THE ARENA"

==================================================
3. LANDING PAGE
==================================================

Create a dramatic hero section.

Main title:

CONSOLE CONQUEST

Subtitle:

MORTAL KOMBAT 11
1V1 TOURNAMENT

Primary CTA:

REGISTER NOW

Secondary CTA:

VIEW TOURNAMENT

Hero information cards:

GAME
Mortal Kombat 11

FORMAT
1v1

STATUS
REGISTRATION OPEN

Add an animated background with:
- dark smoke
- red particles
- subtle light movement
- gaming arena atmosphere

Add a prominent countdown/event section if event date is available.

==================================================
4. EVENT INFORMATION
==================================================

Create a section called:

THE BATTLE

Display:

Game:
Mortal Kombat 11

Format:
1v1

Platform:
Console

Tournament:
Console Conquest

Add short text:

"Choose your fighter. Enter the arena. Defeat your opponent."

Do not overfill this section.

==================================================
5. SLOT SYSTEM
==================================================

This is extremely important.

The tournament uses numbered registration slots.

Example:

SLOT 001
SLOT 002
SLOT 003
...
SLOT 032

Make the maximum number of participants configurable from the admin panel.

For example:

MAX_SLOTS = 32

Do NOT hardcode 32 throughout the application.

The system should dynamically calculate:

Total Slots
Registered Players
Available Slots

Example UI:

TOURNAMENT CAPACITY

24 / 32 PLAYERS REGISTERED

████████████████░░░░░░

8 SLOTS REMAINING

When all slots are occupied:

REGISTRATION CLOSED

No new registration should be accepted.

==================================================
6. REGISTRATION FORM
==================================================

Create a premium registration form.

Fields:

FULL NAME
- required
- minimum 2 characters

COLLEGE / INSTITUTION
- required

ROLL NUMBER / STUDENT ID
- required

EMAIL
- required
- valid email format

PHONE NUMBER
- required
- valid Indian phone number

GAMER TAG / IN-GAME NAME
- required

MORTAL KOMBAT MAIN / PREFERRED FIGHTER
- optional

AGE
- required if required by event rules

TERMS & CONDITIONS
- mandatory checkbox

Example:

[ ] I agree to the Console Conquest tournament rules and understand that registration is subject to slot availability.

Button:

ENTER THE ARENA

==================================================
7. FORM VALIDATION
==================================================

Implement strong client-side AND server-side validation.

Validate:

- required fields
- email format
- phone number
- duplicate email
- duplicate phone number
- duplicate roll number/student ID
- duplicate registration

Display clear error messages.

Examples:

"Email already registered."

"This roll number has already registered."

"Please enter a valid phone number."

"All required fields must be completed."

Do not expose database errors directly to users.

==================================================
8. SLOT ALLOCATION LOGIC
==================================================

The slot allocation must happen SERVER-SIDE.

NEVER assign slots using only frontend JavaScript.

When a registration is successfully submitted:

1. Check whether registration is still open.
2. Validate participant information.
3. Check duplicate registration.
4. Find the next available slot.
5. Atomically reserve that slot.
6. Create the participant record.
7. Return the assigned slot.

Example:

Participant A registers:
→ SLOT 001

Participant B registers:
→ SLOT 002

Participant C registers:
→ SLOT 003

If Participant B cancels:

SLOT 002 becomes available according to the configured slot-reuse policy.

Prefer a database-backed unique constraint for slot_number.

IMPORTANT:
The system must be race-condition safe.

If 5 users register simultaneously, they MUST NOT receive the same slot.

Use a database transaction / atomic operation / row locking / unique constraint as appropriate for the selected database.

==================================================
9. REGISTRATION CONFIRMATION
==================================================

After successful registration, DO NOT simply show:

"Registration successful."

Instead show a dramatic confirmation screen.

Example:

--------------------------------------------

       REGISTRATION CONFIRMED

             SLOT 017

          PLAYER READY

Name:
LOKESH JOSHI

Game:
Mortal Kombat 11

Format:
1v1

Registration ID:
CC-2026-0017

--------------------------------------------

Button:

DOWNLOAD / SAVE CONFIRMATION

Button:

BACK TO EVENT

Create a visually impressive tournament ID card.

==================================================
10. UNIQUE REGISTRATION ID
==================================================

Every participant receives a unique registration ID.

Example:

CC-2026-0001
CC-2026-0002
CC-2026-0003

The registration ID and slot number are separate fields.

Example:

Registration ID:
CC-2026-0017

Tournament Slot:
17

==================================================
11. QR CODE
==================================================

Generate a QR code on the confirmation screen.

The QR code should encode the participant's registration verification URL.

Example conceptual URL:

/verify/CC-2026-0017

When scanned, it should show a verification page:

CONSOLE CONQUEST

Registration Verified

Player:
[Name]

Registration ID:
CC-2026-0017

Slot:
017

Game:
Mortal Kombat 11

Status:
REGISTERED

Do not expose unnecessary personal information through the QR verification page.

==================================================
12. REGISTRATION STATUS PAGE
==================================================

Create:

CHECK MY REGISTRATION

Allow participants to enter:

Registration ID
OR
Email + verification mechanism

Then display:

Registration Status
Player Name
Game
Slot Number
Registration ID

Possible statuses:

REGISTERED
WAITLISTED
CANCELLED
CHECKED-IN
DISQUALIFIED

==================================================
13. WAITLIST
==================================================

If all tournament slots are filled, optionally allow users to join a waitlist.

Display:

ALL SLOTS FILLED

TOURNAMENT:
32 / 32

JOIN WAITLIST

If enabled, waitlist users receive:

WAITLIST #01
WAITLIST #02
etc.

Admin can promote a waitlisted participant into a tournament slot.

Make waitlist functionality configurable.

==================================================
14. ADMIN DASHBOARD
==================================================

Create a protected admin dashboard.

Admin dashboard should display:

TOTAL REGISTRATIONS
AVAILABLE SLOTS
FILLED SLOTS
WAITLIST
CHECKED-IN PLAYERS

Example:

32 TOTAL SLOTS

27 REGISTERED

5 AVAILABLE

--------------------------------

REGISTRATION TABLE

Slot | Player | College | Gamer Tag | Phone | Email | Status

001 | Player A | College X | ScorpionMain | ... | ... | REGISTERED
002 | Player B | College Y | SubZeroX | ... | ... | REGISTERED

Admin actions:

VIEW
EDIT
CANCEL
CHECK-IN
DISQUALIFY
PROMOTE FROM WAITLIST

==================================================
15. ADMIN SLOT MANAGEMENT
==================================================

Admin must be able to:

- set maximum slots
- open registration
- close registration
- reopen registration
- view available slots
- manually assign a slot
- move participant to another slot
- cancel registration
- promote waitlisted player

Do not allow an admin to create duplicate slot numbers.

==================================================
16. SEARCH AND FILTER
==================================================

Admin dashboard should support:

Search by:
- name
- email
- phone
- roll number
- gamer tag
- registration ID
- slot number

Filters:

REGISTERED
CHECKED-IN
CANCELLED
WAITLISTED
DISQUALIFIED

==================================================
17. TOURNAMENT BRACKET
==================================================

Create a tournament bracket page.

The bracket should be generated from registered participants.

Example:

ROUND 1

SLOT 001 ─────┐
              ├── PLAYER
SLOT 016 ─────┘

SLOT 008 ─────┐
              ├── PLAYER
SLOT 009 ─────┘

Continue dynamically.

Do not hardcode players.

The bracket should support:

- match status
- winner
- next round
- score
- player slot number

Admin should be able to update match results.

==================================================
18. PLAYER CHECK-IN
==================================================

Admin can mark players as:

CHECKED-IN

Player status changes:

REGISTERED
→ CHECKED-IN
→ PLAYING
→ ELIMINATED / ADVANCED

Display check-in status on admin dashboard.

==================================================
19. DATABASE
==================================================

Use a real database.

Recommended stack:

Frontend:
Next.js / React
TypeScript
Tailwind CSS

Backend:
Next.js API routes / server actions

Database:
PostgreSQL

ORM:
Prisma

Authentication:
Secure admin authentication.

Suggested Participant schema:

Participant:

id
registrationId
slotNumber
fullName
college
rollNumber
email
phone
gamerTag
preferredFighter
status
createdAt
updatedAt

Important database constraints:

registrationId UNIQUE
slotNumber UNIQUE
email UNIQUE where appropriate
phone UNIQUE where appropriate
rollNumber UNIQUE where appropriate

Create indexes for commonly searched fields.

==================================================
20. SECURITY
==================================================

This is a public registration website.

Implement:

- server-side validation
- rate limiting
- CSRF protection where applicable
- input sanitization
- secure admin authentication
- password hashing if passwords are used
- protected admin routes
- no database credentials exposed to frontend
- no sensitive environment variables exposed
- safe error handling

Never trust client-side slot numbers.

The frontend must NEVER be able to decide:

"Give me slot 17."

The server decides the slot.

==================================================
21. API DESIGN
==================================================

Create clean API/server actions.

Example:

POST /api/register

Request:

{
  fullName,
  college,
  rollNumber,
  email,
  phone,
  gamerTag,
  preferredFighter
}

Response:

{
  success: true,
  registrationId: "CC-2026-0017",
  slotNumber: 17
}

Create:

GET /api/registration/[registrationId]

GET /api/tournament/status

GET /api/bracket

Admin:

GET /api/admin/participants

PATCH /api/admin/participants/[id]

POST /api/admin/checkin/[id]

POST /api/admin/matches/[id]/result

==================================================
22. REAL-TIME SLOT COUNTER
==================================================

On the landing page show:

27 / 32 PLAYERS

5 SLOTS LEFT

Update the count after registration.

If possible, use real-time updates or short polling.

Do not fake the numbers.

The displayed availability must come from the database.

==================================================
23. RESPONSIVE DESIGN
==================================================

The website MUST work perfectly on:

Desktop
Laptop
Tablet
Mobile

Mobile registration should be extremely easy.

Use:

- large touch-friendly buttons
- readable typography
- properly spaced inputs
- responsive tournament cards
- horizontally scrollable bracket on mobile

==================================================
24. ANIMATIONS
==================================================

Use tasteful animations.

Examples:

Hero:
fade + scale entrance

Buttons:
subtle glow on hover

Registration:
smooth step transition

Slot assignment:
dramatic reveal

Confirmation:

"YOUR SLOT HAS BEEN CLAIMED"

then:

017

Use Framer Motion if appropriate.

Do NOT overuse animations.

The website must remain fast.

==================================================
25. SOUND
==================================================

Do NOT autoplay audio.

Optionally provide a muted/unmuted toggle for ambient event audio.

Default:

SOUND OFF

==================================================
26. NAVIGATION
==================================================

Navigation:

CONSOLE CONQUEST

HOME
ABOUT
RULES
TOURNAMENT
CHECK REGISTRATION
REGISTER

ADMIN LOGIN should not be prominently exposed to normal participants.

==================================================
27. RULES SECTION
==================================================

Create a dedicated tournament rules page.

Structure:

GAME
Mortal Kombat 11

FORMAT
1v1

MATCH FORMAT
[Make configurable]

CONTROLLER
[Make configurable]

CHECK-IN
[Make configurable]

DISCONNECTION POLICY
[Make configurable]

FORFEIT POLICY
[Make configurable]

SPORTSMANSHIP
[Make configurable]

The rules should be editable from the admin/configuration layer rather than hardcoded where practical.

==================================================
28. REGISTRATION STATES
==================================================

The application must correctly handle:

Registration Open

Registration Closed

Slots Available

Slots Full

Waitlist Active

Registration Cancelled

Participant Checked In

Tournament Started

Tournament Completed

Show appropriate UI for each state.

==================================================
29. ERROR / EDGE CASE HANDLING
==================================================

Handle:

- two people registering simultaneously
- database failure
- network failure
- duplicate registration
- full tournament
- registration closed during submission
- invalid form data
- accidental refresh
- repeated form submission
- browser back button
- admin manually changing slots
- participant cancellation

Disable the submit button while submitting.

Prevent double-click registration.

If a request fails, do not accidentally create duplicate registrations.

==================================================
30. UX FLOW
==================================================

Expected participant journey:

HOME
↓
CLICK "REGISTER NOW"
↓
REGISTRATION FORM
↓
ENTER DETAILS
↓
ACCEPT TERMS
↓
CLICK "ENTER THE ARENA"
↓
SERVER VALIDATES REGISTRATION
↓
SERVER ALLOCATES UNIQUE SLOT
↓
REGISTRATION CONFIRMED
↓
SHOW:

CONSOLE CONQUEST
MORTAL KOMBAT 11

SLOT 017

REGISTRATION ID:
CC-2026-0017

↓
GENERATE QR CODE
↓
OPTION TO SAVE CONFIRMATION

==================================================
31. DESIGN COMPONENTS
==================================================

Create reusable components:

Navbar
HeroSection
EventStats
RegistrationForm
SlotCounter
TournamentStatus
ConfirmationCard
QRCodeCard
RegistrationLookup
TournamentBracket
PlayerCard
MatchCard
AdminSidebar
AdminDashboard
ParticipantTable
StatsCard
Modal
Toast
LoadingState
ErrorState

==================================================
32. DATA CONFIGURATION
==================================================

Create a central event configuration.

Example:

EVENT_NAME = "Console Conquest"
GAME_NAME = "Mortal Kombat 11"
FORMAT = "1v1"
MAX_SLOTS = 32
REGISTRATION_OPEN = true

Do not scatter these values throughout the code.

Make it easy for the organizers to change:

- event name
- game
- maximum slots
- registration status
- rules
- event dates
- platform
- match format

==================================================
33. PERFORMANCE
==================================================

Optimize for fast loading.

Use:

- optimized images
- lazy loading
- minimal client-side JavaScript
- server-side rendering where useful
- database indexes
- efficient queries

Avoid unnecessary libraries.

==================================================
34. ACCESSIBILITY
==================================================

Implement:

- keyboard navigation
- proper labels
- accessible buttons
- visible focus states
- sufficient contrast
- ARIA attributes where necessary
- accessible error messages

==================================================
35. FINAL UI EXPERIENCE
==================================================

The final product should feel like an actual esports tournament portal.

The participant should feel:

"I am entering a fighting tournament."

NOT:

"I am filling out a Google Form."

The key emotional moment is the slot assignment.

Make this visually impressive.

Example:

-----------------------------------

      CONSOLE CONQUEST

       PLAYER REGISTERED

       YOUR SLOT

          017

    MORTAL KOMBAT 11

       1V1 TOURNAMENT

   REGISTRATION ID

      CC-2026-0017

        [ QR CODE ]

      [SAVE DETAILS]

-----------------------------------

==================================================
36. DEVELOPMENT REQUIREMENT
==================================================

Build the application as a complete working project.

Do not create a static mockup.

All of the following must actually work:

✓ Registration
✓ Database storage
✓ Unique registration ID
✓ Automatic slot allocation
✓ Duplicate prevention
✓ Slot counter
✓ Registration closing
✓ Waitlist
✓ Confirmation page
✓ QR verification
✓ Registration lookup
✓ Admin dashboard
✓ Participant management
✓ Check-in
✓ Tournament bracket
✓ Match result management

Use clean, modular, maintainable code.

Include:

1. Complete source code
2. Database schema
3. Environment variable example
4. Database migration/setup instructions
5. Admin authentication setup
6. Seed data
7. Local development instructions
8. Production deployment instructions

Before finishing, test the critical registration flow, especially concurrent registrations and duplicate prevention.

==================================================
37. IMPORTANT IMPLEMENTATION RULE
==================================================

Do NOT fake backend functionality.

If backend/database functionality is not available in the current environment, clearly separate:

- frontend implementation
- backend implementation
- database implementation

But whenever the environment supports a database/backend, implement the complete system.

The registration and slot allocation system is the highest-priority functionality.

==================================================

FINAL GOAL:

Create a premium, dark, cinematic, Mortal Kombat 11-inspired Console Conquest tournament platform where a participant can register in under 60 seconds and immediately receive a unique tournament slot.

The site should look like an esports tournament system, not a college registration form.
