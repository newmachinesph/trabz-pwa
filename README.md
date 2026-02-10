# Trabz PWA - Worker-Facing Application

A complete Progressive Web App built with Next.js 16 for Filipino workers to find jobs, earn money through gigs, and learn new skills.

## 🚀 Features

### Core Features
- **Dashboard** - Overview of applications, earnings, and recent activity
- **Jobs Search** - Browse and search thousands of verified job opportunities with filters
- **Gigs Marketplace** - Find quick gigs to earn extra income
- **Wallet** - Track earnings, view transaction history, and cash out
- **Learning Center** - Free courses with progress tracking
- **Profile & Settings** - Manage account, documents, and preferences

### Authentication
- Login & Registration
- Social login (Google, Facebook)
- Remember me functionality
- Password visibility toggle

### PWA Features
- ✅ Installable on all devices
- ✅ Offline support with service workers
- ✅ Fast loading and caching
- ✅ Mobile-optimized (max-width: 428px)
- ✅ Bottom navigation for easy access
- ✅ Safe area support for iOS devices

## 📱 Pages

### Main App Pages
- `/` - Landing page with login/register options
- `/dashboard` - Worker dashboard with quick stats and actions
- `/jobs` - Jobs listing with search and category filters
- `/gigs` - Gigs marketplace with urgent filter
- `/wallet` - Earnings overview and transaction history
- `/learning` - Course catalog with enrollment tracking
- `/profile` - User profile and settings

### Authentication Pages
- `/login` - User login
- `/register` - User registration

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4
- **PWA**: @ducanh2912/next-pwa
- **TypeScript**: 5.x
- **API Integration**: Custom fetch-based API client

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit: http://localhost:3000

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.trabz.ph
NEXT_PUBLIC_PORTAL_URL=https://portal.trabz.ph
NEXT_PUBLIC_APP_URL=https://trabz.ph
NEXT_PUBLIC_APP_NAME=Trabz
```

### PWA Configuration

- **Manifest**: `public/manifest.json`
- **Service Worker**: Auto-generated in `public/`
- **Icons Needed**:
  - `icon-192x192.png` (192×192px)
  - `icon-384x384.png` (384×384px)
  - `icon-512x512.png` (512×512px)
  - `favicon.ico`

## 📁 Project Structure

```
trabz-pwa/
├── app/
│   ├── dashboard/page.tsx      # Worker dashboard
│   ├── jobs/page.tsx           # Jobs search & listing
│   ├── gigs/page.tsx           # Gigs marketplace
│   ├── wallet/page.tsx         # Wallet & transactions
│   ├── learning/page.tsx       # Learning center
│   ├── profile/page.tsx        # User profile
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Registration page
│   ├── layout.tsx              # Root layout with bottom nav
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles (max-width: 428px)
├── components/
│   └── BottomNav.tsx           # Bottom navigation component
├── lib/
│   └── api.ts                  # API client & services
├── public/
│   └── manifest.json           # PWA manifest
├── next.config.ts              # Next.js config with PWA
└── package.json
```

## 🎨 Design

- **Mobile-first**: Optimized for 428px width (iPhone 14 Pro Max)
- **Color Scheme**: Blue primary (#1E40AF), Yellow accent
- **Safe Areas**: iOS notch and home indicator support
- **Bottom Navigation**: Easy thumb-reach navigation
- **Card-based UI**: Clean, modern interface

## 📊 API Integration

All pages are ready for API integration using the service layer in `lib/api.ts`:

- `authService` - Login, register, logout
- `jobsService` - Get jobs, search, apply
- `gigsService` - Get gigs, claim
- `walletService` - Balance, transactions, cashout
- `learningService` - Courses, enrollment, progress
- `profileService` - Profile management, documents

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Manual Deployment

```bash
npm run build
npm start
```

## 📝 Testing PWA

1. Build the app: `npm run build`
2. Start production: `npm start`
3. Open Chrome DevTools → Application
4. Check:
   - Service Workers registered
   - Manifest loaded
   - Install prompt works
   - Offline functionality

## 🔐 Security

- All API calls include JWT authentication
- Secure password handling
- HTTPS required for PWA features
- Environment variables for sensitive data

## 📱 Platform Support

### iOS
- Add to Home Screen via Share button
- Standalone mode with custom status bar
- Safe area insets for notch devices

### Android
- Automatic install prompt
- Add to home screen
- WebAPK installation

### Desktop
- Install from browser address bar
- Runs as standalone application

## 📄 License

Private - Trabz Platform

---

**Built with ❤️ for Filipino Workers**
