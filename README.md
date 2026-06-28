# TaxiWaala

A full-stack taxi fleet management platform built with Next.js. Operators use it to manage drivers, cabs, bookings, rides, and payments from a single dashboard. The public landing page markets the product as **TaxiFlow**; the authenticated dashboard is branded **FleetManager**.

## What it does

TaxiWaala is designed for taxi business owners who need to:

- Register and manage a fleet of drivers and vehicles
- Create bookings (immediate rides or scheduled trips)
- Track rides through their lifecycle: upcoming → confirmed → ongoing → completed
- Record advance, partial, and final payments per booking
- Upload driver documents (Aadhar, license, profile photo) to Cloudinary

Each company account is identified by a **company token**. Users log in with a username, password, and that token, then access their dashboard at `/dashboard/[token]`.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion, GSAP |
| Database | MongoDB via Mongoose |
| Auth | bcrypt password hashing, HTTP-only cookies, sessionStorage |
| File storage | Cloudinary |
| Email | Resend |
| Deployment | Docker (standalone Next.js output) |

## Project structure

```
taxiwaala/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page (TaxiFlow marketing site)
│   │   ├── layout.tsx                  # Root layout
│   │   ├── dashboard/[token]/          # Authenticated operator dashboard
│   │   │   ├── page.tsx                # Main dashboard (fleet overview, add driver/cab)
│   │   │   ├── layout.tsx              # Sidebar layout + auth guard
│   │   │   ├── schedule/               # Schedule a new booking
│   │   │   ├── upcoming-bookings/      # View/confirm scheduled rides
│   │   │   ├── current-bookings/       # Ongoing rides
│   │   │   ├── payments/               # Payment records
│   │   │   └── sidebar-pages/          # Driver, cab, and booking form components
│   │   ├── app-driver/[token]/         # Standalone driver registration page
│   │   └── api/                        # REST API routes (see below)
│   ├── components/
│   │   ├── landing/                    # Hero, Features, Pricing, Footer, etc.
│   │   ├── Sidebar.tsx                 # Dashboard navigation
│   │   └── loginMoodal.tsx             # Login modal on landing page
│   ├── lib/
│   │   ├── db.ts                       # MongoDB connection + shared Mongoose models
│   │   ├── cloudinary.ts               # Cloudinary client config
│   │   └── resend.ts                   # Resend email client
│   ├── models/                         # Standalone Mongoose schemas (Cab, Driver, Booking, Payments)
│   ├── middleware.ts                   # Redirects unauthenticated users away from /dashboard
│   └── scripts/
│       └── insertCab.ts                # Utility script to seed cab data
├── Dockerfile                          # Multi-stage production build
├── docker-compose.yml                  # Local Docker deployment
└── next.config.ts                      # Standalone output for Docker
```

## Features

### Landing page (`/`)

Public marketing site with hero, feature highlights, testimonials, pricing, and a login modal. Users authenticate here to reach their dashboard.

### Authentication & onboarding

- **Login** (`POST /api/login`): username + password + company token. On success, sets an HTTP-only `authToken` cookie and stores session state in `sessionStorage`.
- **Middleware** (`src/middleware.ts`): blocks unauthenticated access to `/dashboard/*` routes (checks for `authToken` cookie).
- **Dashboard layout**: additionally verifies `sessionStorage` login state before rendering.
- **User creation** (`POST /api/invite`): admin-only endpoint protected by `x-api-key` header. Creates a user with hashed password and hashed company token.
- **Invite flow** (`GET /api/verify-token`, `POST /api/complete-invite`): email-based invite tokens for new user registration.

### Dashboard (`/dashboard/[token]`)

Sidebar navigation includes:

| Section | Route | Status |
|---------|-------|--------|
| Dashboard | `/dashboard/[token]` | Implemented — fleet stats, add driver/cab |
| Schedule Booking | `.../schedule` | Implemented |
| Upcoming Bookings | `.../upcoming-bookings` | Implemented |
| Ongoing Rides | `.../current-bookings` | Implemented |
| Payments | `.../payments` | Implemented |
| Maintenance | `.../maintenance` | Sidebar only |
| Pending Salaries | `.../pending-salaries` | Sidebar only |
| Payment Reminders | `.../payment-reminders` | Sidebar only |
| Driver Licenses | `.../driver-licenses` | Sidebar only |
| Car Documents | `.../car-documents` | Sidebar only |
| Alerts & Reminders | `.../alerts` | Sidebar only |

### Fleet management

- **Drivers** (`GET/POST /api/driver`): register drivers with full name, phone, license details, Aadhar number, address, and document images. Auto-generates a `driverId` (e.g. `DRV-20250628-ABC123`). Tracks availability (`free` / `busy`).
- **Cabs** (`GET/POST /api/cabs`): register vehicles with license plate, model, brand, capacity, fuel type, and status (`available` / `booked` / `maintenance`).
- **File uploads** (`POST /api/upload`): uploads Aadhar, license, and profile photos to Cloudinary.

### Booking system

Bookings support two modes and two types:

- **Modes**: `IMMEDIATE` (ride starts now) or `SCHEDULE` (future pickup)
- **Types**: `LOCATION` (point-to-point) or `DURATION` (hourly/rental)

**Lifecycle**:

```
SCHEDULE booking  →  UPCOMING  →  (confirm)  →  ONGOING  →  (end ride)  →  COMPLETED
IMMEDIATE booking →  ONGOING   →  (end ride)  →  COMPLETED
```

Creating a booking (`POST /api/booking`):
1. Validates driver and cab are available
2. Creates the booking record
3. Auto-creates an advance payment record if advance amount > 0
4. For immediate bookings, marks driver as `busy` and cab as `booked`

Other booking endpoints:
- `GET /api/booking` — list available drivers and cabs
- `GET /api/upcoming-bookings` — fetch scheduled upcoming rides
- `POST /api/confirm-booking` — confirm an upcoming booking and start the ride
- `GET /api/current-bookings` — fetch ongoing rides
- `POST /api/end-ride` — complete a ride and free up driver/cab

### Payments

Payment records (`GET/POST /api/payments`) track:
- Advance, partial, final, and refund payments
- Payment methods: CASH, CARD, UPI, NET_BANKING, WALLET, OTHER
- Sequence numbers per booking (supports multiple partial payments)
- Amount validation: `amountPaid + remainingAmount = totalBookingAmount`

## Data models

All data is stored in MongoDB. Key collections:

### User
`username`, `email`, `password` (hashed), `companyTokenId` (hashed)

### Invite
`email`, `token`, `companyTokenId`, `used`

### Driver
`driverId`, `fullName`, `phoneNumber`, `licenseNumber`, `licenseExpiry`, `aadharNumber`, `aadharImage`, `licenseImage`, `address`, `availabilityStatus`, `profilePhoto`

### Cab
`cabId`, `licensePlate`, `model`, `brand`, `capacity`, `driver` (ref), `status`, `fuelType`, `notes`

### Booking
`bookingId`, customer info, pickup/drop locations, date/time, `bookingType`, `bookingMode`, `bookingStatus`, `scheduledDateTime`, amounts (total/advance/due), assigned `driverId` and `cabId`

### Payment
`paymentId`, `bookingId`, `clientName`, `amountPaid`, `remainingAmount`, `totalBookingAmount`, `paymentMethod`, `paymentType`, `paymentSequence`, `receivedBy`, `paymentStatus`

## API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate user |
| POST | `/api/invite` | Create user (requires `x-api-key` header) |
| GET | `/api/verify-token?token=...` | Validate invite token |
| POST | `/api/complete-invite` | Complete invite registration |
| GET | `/api/driver` | List all drivers |
| POST | `/api/driver` | Add a new driver |
| GET | `/api/cabs` | List all cabs |
| POST | `/api/cabs` | Add a new cab |
| GET | `/api/booking` | Get available drivers and cabs |
| POST | `/api/booking` | Create a booking |
| GET | `/api/upcoming-bookings` | List upcoming scheduled bookings |
| POST | `/api/confirm-booking` | Confirm and start an upcoming booking |
| GET | `/api/current-bookings` | List ongoing rides |
| POST | `/api/end-ride` | Complete a ride |
| GET | `/api/payments` | List payments (supports `?customerName=` filter) |
| POST | `/api/payments` | Record a payment |
| POST | `/api/upload` | Upload images to Cloudinary |

## Environment variables

Create a `.env.local` file in the project root:

```env
# Required
MONGO_URI=mongodb+srv://...          # MongoDB connection string

# Auth
API_SECRET=your-secret-key           # Protects POST /api/invite

# Cloudinary (for driver document uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (optional)
RESEND_API_KEY=
```

## Getting started

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page. Log in via the modal to reach the dashboard.

### Docker

```bash
# Build and run (uses .env.local for secrets)
docker compose --env-file .env.local up --build
```

The app runs on port 3000. The Dockerfile uses Next.js standalone output for a minimal production image.

### Other scripts

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Auth flow (how login works)

```
Landing page login modal
  → POST /api/login (username, password, companyToken)
  → Sets HTTP-only authToken cookie
  → Stores fromLogin + loginToken in sessionStorage
  → Redirects to /dashboard/[companyToken]
  → Middleware checks authToken cookie
  → Dashboard layout checks sessionStorage
  → Renders sidebar + page content
```

To create the first user, call `POST /api/invite` with the `x-api-key` header:

```bash
curl -X POST http://localhost:3000/api/invite \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_SECRET" \
  -d '{"username": "admin", "password": "secret", "companyTokenId": "my-company-token"}'
```

Then log in with username `admin`, password `secret`, and token `my-company-token`.

## Notes

- Models are defined in both `src/lib/db.ts` (used by API routes) and `src/models/` (standalone schemas). The API routes primarily use `@/lib/db`.
- Several sidebar sections (maintenance, salaries, alerts, etc.) are listed in navigation but do not yet have dedicated page implementations.
- The driver standalone page at `/app-driver/[token]` reuses the driver form component from the dashboard.
