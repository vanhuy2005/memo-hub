# 🧠 MemoHub - Smart Language Learning Platform

<div align="center">

![MemoHub Logo](client/public/logo-icon.png)

**A powerful spaced repetition system (SRS) for mastering vocabulary with SM-2 algorithm**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)

[Documentation](./API_DOCUMENTATION.md) | [Report Bug](https://github.com/vanhuy2005/memo-hub/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [SRS Algorithm](#-srs-algorithm-sm-2)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 About

**MemoHub** is a modern, intelligent flashcard application designed to help language learners master vocabulary efficiently using the **Spaced Repetition System (SM-2)**. The app optimizes your study sessions by showing cards at scientifically-proven intervals, maximizing long-term retention.

### Why MemoHub?

- 🧠 **Science-backed learning**: Uses SM-2 algorithm for optimal retention
- 🌍 **Multi-language support**: Learn any language with built-in i18n (vi, en, zh, ja, ko)
- 📊 **Progress tracking**: Detailed statistics, streaks, and analytics
- 🌙 **Modern UI/UX**: Dark mode, responsive design, smooth animations
- 🎯 **Smart scheduling**: Cards appear exactly when you need to review them
- 📚 **Pre-made decks**: IELTS, JLPT, TOPIK, HSK vocabulary sets included

---

## ✨ Features

### 🔐 Authentication & User Management

- Secure JWT-based authentication with bcrypt hashing
- User profile customization (learning target, daily goal, theme, language)
- Change password functionality with validation
- Session persistence and auto-login

### 📚 Deck & Card Management

- Create unlimited custom decks with descriptions
- Rich card editor: front/back content, pronunciation, example sentences
- Import/Export cards (JSON format)
- Copy system decks to personal collection
- Organize cards by status (New/Learning/Mastered)
- Deck-specific study sessions

### 🎓 Smart Study System

- **SRS Algorithm**: SM-2 implementation with optimized intervals
- 4-level review buttons: Again/Hard/Good/Easy
- Real-time visual feedback with animations
- Progress tracking per deck and overall
- Review reminders and daily goal tracking
- Study from Dashboard (all decks) or specific deck

### 📊 Statistics & Analytics

- Current streak and longest streak calculation
- Daily/Weekly/Monthly review charts
- Card distribution breakdown (New/Learning/Mastered)
- Mastery progress visualization
- Total reviews and accuracy tracking
- Weekly activity heatmap

### 🌐 System Decks Library

Pre-loaded vocabulary sets ready to copy:

- **IELTS 6.0** - Essential academic vocabulary (20 cards)
- **JLPT N5** - Basic Japanese fundamentals (20 cards)
- **TOPIK I** - Korean essentials (20 cards)
- **HSK 1** - Chinese basics (20 cards)

### 🎨 UI/UX Features

- 🌙 Dark/Light theme toggle with system preference detection
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🌍 Multi-language interface (Vietnamese, English, Chinese, Japanese, Korean)
- ✨ Smooth animations and transitions
- ♿ Accessibility-focused design
- 🎨 Custom favicon and branding

### ⚡ Performance & Real-time (Phase 3)

- **Redis Caching**: 16x faster Dashboard loads (800ms → 50ms)
- **Smart Cache Strategy**: Cache-aside pattern with TTL (5min stats, 1hr cards)
- **BullMQ Background Jobs**: Async email notifications, bulk imports
- **Socket.io Real-time**: Instant level-up notifications with confetti
- **Scheduled Jobs**: Daily reminder emails at 9am (cron-based)
- **Graceful Degradation**: App works perfectly without Redis (no cache)

---

## 🛠 Tech Stack

### Frontend

- **React 18.3** - Modern UI library with hooks
- **Vite 5.4** - Lightning-fast build tool
- **TailwindCSS 3.4** - Utility-first CSS
- **Lucide Icons** - Beautiful, consistent icon set
- **React Router 6** - Client-side routing
- **React i18next** - Internationalization framework
- **Axios** - HTTP client

### Backend

- **Node.js 18+** - JavaScript runtime
- **Express.js 4** - Minimal web framework
- **TypeScript 5** - Type-safe development
- **MongoDB 6** - NoSQL document database
- **Mongoose 8** - Elegant MongoDB ODM
- **JWT** - Secure token-based auth
- **bcrypt** - Password hashing (10 rounds)
- **Redis (ioredis)** - In-memory caching layer (Phase 3)
- **BullMQ** - Redis-based message queue (Phase 3)
- **Socket.io** - Real-time WebSocket communication (Phase 3)
- **Nodemailer** - Email notifications (Phase 3)

### Development Tools

- **ESLint** - Code quality and style enforcement
- **Nodemon** - Auto-restart on file changes
- **ts-node** - TypeScript execution for Node.js
- **PostCSS** - CSS transformations

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **MongoDB** 6.x or higher ([Install Guide](https://www.mongodb.com/docs/manual/installation/)) OR MongoDB Atlas (Cloud)
- **Redis** (Optional - for caching & performance boost):
  - Local: [Redis for Windows](https://github.com/microsoftarchive/redis/releases) OR Docker
  - Cloud: [Redis Cloud](https://redis.com/try-free/) (Free tier available)
- **npm** 9.x or **yarn** 1.22+ package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vanhuy2005/memo-hub.git
   cd memo-hub
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   cd ..
   ```

3. **Configure environment variables**

   **Server** - Create `server/.env`:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration (Local or Cloud)
   MONGODB_URI=mongodb://localhost:27017/memohub
   # OR use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/memohub

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   JWT_EXPIRE=7d

   # Redis Configuration (Optional - for Phase 3 caching)
   # Leave empty to run without cache (slower)
   REDIS_HOST=redis-xxxxx.cxxxxx.region.cloud.redislabs.com
   REDIS_PORT=16231
   REDIS_PASSWORD=your_redis_password
   REDIS_DB=0

   # Email Configuration (Optional - for background jobs)
   EMAIL_USER=memohub@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password

   # CORS & Frontend
   CORS_ORIGIN=http://localhost:3000
   FRONTEND_URL=http://localhost:3000
   ```

   **Client** - Create `client/.env`:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   > **📌 Note**: App works without Redis but will be slower. See [Phase 3 Setup](#-phase-3-redis--real-time-features-optional) for Redis Cloud configuration.

4. **Start MongoDB**

   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **Seed sample data** (Recommended for testing)

   ```bash
   cd server

   # Option 1: Seed only system decks (IELTS, JLPT, TOPIK, HSK)
   npm run seed:system

   # Option 2: Seed complete test data (user + decks + cards + review history)
   npm run seed:full
   ```

   **Test Account** (after `seed:full`):

   - Email: `test@memohub.com`
   - Password: `123456`
   - Includes: 65 cards, 30 days of review history, streaks, stats

6. **Start development servers**

   **Terminal 1 - Backend**:

   ```bash
   cd server
   npm run dev
   # ✅ Server running on http://localhost:5000
   ```

   **Terminal 2 - Frontend**:

   ```bash
   cd client
   npm run dev
   # ✅ Client running on http://localhost:3001
   ```

7. **Access the application**
   - **Frontend**: <http://localhost:3001>
   - **Backend API**: <http://localhost:5000/api>
   - **API Health**: <http://localhost:5000/health>

---

### 🚀 Phase 3: Redis & Real-time Features (Optional)

Phase 3 adds performance optimization and real-time notifications using **Redis**, **BullMQ**, and **Socket.io**.

#### Benefits

- ⚡ **16x faster Dashboard loads** (cache HIT: 50ms vs 800ms)
- 📦 **Background jobs** for email notifications
- 🎊 **Real-time level-up** notifications with confetti
- 📧 **Daily reminder emails** (automated cron jobs)

#### Redis Cloud Setup (Recommended for production)

1. **Create free Redis Cloud account**:

   - Visit [Redis Cloud](https://redis.com/try-free/)
   - Sign up for Free tier (30MB, perfect for development)

2. **Create database**:

   - Click **"New Database"**
   - Select **Free tier** (30MB RAM)
   - Choose region closest to you
   - Click **"Activate"**

3. **Get connection details**:

   - In database dashboard, click **"Connect"**
   - Copy:
     - **Public Endpoint**: `redis-xxxxx.cxxxxx.region.cloud.redislabs.com:16231`
     - **Username**: `default` (usually)
     - **Password**: Click eye icon to reveal

4. **Update server/.env**:

   ```env
   # Example with Redis Cloud
   REDIS_HOST=redis-16231.c252.ap-southeast-1-1.ec2.cloud.redislabs.com
   REDIS_PORT=16231
   REDIS_PASSWORD=i9yEWKpVcNLq3xNR5XqP6LTrgwlcpORe
   REDIS_DB=0
   ```

5. **Restart server**:

   ```bash
   cd server
   npm run dev
   ```

   ✅ Look for: **"🚀 Redis connected successfully!"**

#### Redis Local Setup (Alternative)

**Windows**:

```bash
# Download Redis for Windows
https://github.com/microsoftarchive/redis/releases
# Install and run redis-server.exe
```

**Docker** (Recommended):

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

**Update .env for local**:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

#### Testing Redis Features

1. **Cache Test**:

   - Open Dashboard → Check server logs
   - First load: `📦 Cache MISS` → slower
   - Reload page: `📦 Cache HIT` → instant!

2. **Real-time Test**:

   - Open Browser Console
   - Login: See `✅ Socket.io connected`
   - Review cards until level-up
   - See confetti + toast notification instantly!

3. **Email Test** (if configured):
   - Register new account → Welcome email sent
   - Level up → Achievement email sent

#### Gmail App Password (for email features)

1. Enable 2FA on your Gmail account
2. Go to: <https://myaccount.google.com/apppasswords>
3. Create app password for "MemoHub"
4. Copy 16-character password (remove spaces)
5. Update `EMAIL_PASSWORD` in `.env`

#### Troubleshooting

**Redis not connecting**:

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Check server logs for errors
# App will continue without cache if Redis fails
```

**Socket.io not working**:

- Check browser console for connection errors
- Verify `CORS_ORIGIN` matches frontend URL
- Check firewall/antivirus blocking WebSocket

**Email not sending**:

- Verify Gmail 2FA enabled
- Check App Password is correct (no spaces)
- Test with: `npm run test:email` (if script exists)

> **📝 Note**: App works perfectly WITHOUT Redis - it just won't have caching, background jobs, or real-time features. All core functionality (study, decks, stats) remains intact.

---

## 📁 Project Structure

```
memo-hub/
├── client/                    # Frontend React application
│   ├── public/
│   │   └── fav-icon.png      # App favicon
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React Context (Auth, Theme)
│   │   ├── i18n/            # i18next configuration + translations
│   │   ├── pages/           # Route components
│   │   ├── services/        # API client services
│   │   ├── App.jsx          # Root component with routes
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                   # Backend Node.js application
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Request handlers (auth, deck, card, study)
│   │   ├── middlewares/     # Auth, error handling
│   │   ├── models/          # Mongoose schemas (User, Deck, Card, ReviewHistory)
│   │   ├── routes/          # Express routes
│   │   ├── scripts/         # Seed scripts for data generation
│   │   ├── services/        # Business logic (SRS algorithm)
│   │   └── server.ts        # Express app setup
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
├── .gitattributes
├── API_DOCUMENTATION.md      # Complete API reference
├── README.md                 # This file
└── LICENSE                   # MIT License
```

---

## 📘 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "learning_target": "IELTS 7.0"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Change Password

```http
PUT /auth/change-password
Authorization: Bearer <token>

{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

### Study Session

#### Get Cards Due Today

```http
GET /study/session?limit=50&deckId=<optional>
Authorization: Bearer <token>
```

Returns cards that need review. If `deckId` provided, filters by that deck.

#### Review Card

```http
POST /study/review/:cardId
Authorization: Bearer <token>

{
  "grade": 2  // 0=Again, 1=Hard, 2=Good, 3=Easy
}
```

Applies SM-2 algorithm and updates card intervals.

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🧠 SRS Algorithm (SM-2)

### Card Lifecycle

```
[New Card]  →  [Learning]  →  [Mastered]
interval=0      1-6 days       7+ days
ease=2.5        ease varies    ease≥2.0
```

### Mastery Criteria

A card is **Mastered** when:

- `interval >= 7 days` (reviewed successfully for at least a week)
- `ease_factor >= 2.0` (not too difficult to remember)

### Review Grades

| Grade | Button | Effect                                | Use Case            |
| ----- | ------ | ------------------------------------- | ------------------- |
| **0** | Again  | Reset interval to 0, review in 10 min | Completely forgot   |
| **1** | Hard   | Reduce interval by 50%                | Difficult to recall |
| **2** | Good   | Normal interval increase (×1.5-2.5)   | Correct recall      |
| **3** | Easy   | Maximum interval increase (×2.5+)     | Very easy           |

### Example Timeline

A card progressing from New → Mastered (selecting "Good" each time):

```
Day 0:  [New] interval=0         → Review, select "Good"
Day 1:  [Learning] interval=1    → Review, select "Good"
Day 4:  [Learning] interval=3    → Review, select "Good"
Day 9:  [Learning] interval=5    → Review, select "Good"
Day 17: [Mastered ✅] interval=8  → Review, select "Good"
Day 39: [Mastered] interval=22   → Review, select "Good"
Day 94: [Mastered] interval=55   → (Exponential growth continues)
```

**Key Insight**: With consistent "Good" ratings, a card becomes Mastered in ~4-5 reviews over ~17 days. After that, intervals grow exponentially (weeks → months → years).

### Implementation

Core algorithm in `server/src/services/srsService.ts`:

```typescript
export function calculateNextReview(
  grade: number,
  currentStatus: ISRSStatus
): ISRSStatus {
  let newInterval = currentStatus.interval;
  let newEaseFactor = currentStatus.ease_factor;

  if (grade < 2) {
    // Forgot (0) or Hard (1)
    if (grade === 0) {
      newInterval = 0; // Complete reset
      newEaseFactor -= 0.2;
    } else {
      newInterval = Math.floor(currentStatus.interval * 0.5);
      newEaseFactor -= 0.15;
    }
  } else {
    // Good (2) or Easy (3)
    if (currentStatus.interval === 0) {
      newInterval = 1; // First review: 1 day
    } else if (currentStatus.interval === 1) {
      newInterval = 3; // Second review: 3 days
    } else if (currentStatus.interval < 7) {
      newInterval = Math.round(currentStatus.interval * 1.5); // Learning phase
    } else {
      newInterval = Math.round(
        currentStatus.interval * currentStatus.ease_factor
      ); // Mastered: exponential
    }

    newEaseFactor += grade === 2 ? 0.05 : 0.15;
  }

  // Clamp ease factor between 1.3 and 3.0
  newEaseFactor = Math.max(1.3, Math.min(3.0, newEaseFactor));

  return {
    interval: newInterval,
    ease_factor: newEaseFactor,
    next_review_at: new Date(Date.now() + newInterval * 86400000), // milliseconds
  };
}
```

---

## 📖 Usage Guide

### Quick Start

1. **Sign Up**: Create account at `/register`
2. **Create Deck**: Click **+** button on Decks page
3. **Add Cards**: Click **Add Card** in your deck
4. **Start Studying**: Click **Study Now** on Dashboard
5. **Review**: Rate each card (Again/Hard/Good/Easy)
6. **Track Progress**: Check Statistics page for insights

### Detailed Workflows

#### Creating Custom Deck

1. Navigate to **Decks** page
2. Click **+** FAB (Floating Action Button)
3. Enter:
   - Deck name (e.g., "Business Vocabulary")
   - Description (optional)
4. Click **Create**
5. Start adding cards immediately

#### Adding Cards

1. Open your deck from Decks list
2. Click **Add Card** or **+ FAB**
3. Fill in:
   - **Front**: Question/Word (required)
   - **Back**: Answer/Translation (required)
   - **Pronunciation**: IPA or romanization (optional)
   - **Example**: Sample sentence (optional)
4. Click **Save**
5. Repeat or click **Done**

#### Study Session Flow

1. **Start**: Dashboard → **Study Now** (all decks) OR DeckDetail → **Start Study** (one deck)
2. **Read Front**: See the question/word
3. **Recall**: Try to remember the answer
4. **Reveal**: Click **Show Answer**
5. **Rate**: Select difficulty
   - **Again**: Reset, review in 10 min
   - **Hard**: Review sooner (50% interval)
   - **Good**: Normal progression
   - **Easy**: Maximum boost
6. **Repeat**: Continue until session complete
7. **Celebrate**: See completion stats and return to Dashboard

#### Using System Decks

1. Navigate to **System Decks** from Decks page
2. Browse available sets (IELTS, JLPT, TOPIK, HSK)
3. Click **Copy to My Decks**
4. Deck appears in your collection
5. Study immediately or customize cards

#### Customizing Settings

1. **Profile** → **Settings**
2. Adjust:
   - **Learning Target**: Your goal (e.g., "TOEFL 100")
   - **Daily Goal**: Cards to review per day (5-50)
   - **Theme**: Light, Dark, or Auto (system)
   - **Language**: Interface language (vi/en/zh/ja/ko)
   - **Notifications**: Enable/disable reminders
   - **Reminder Time**: When to send daily reminder
3. Click **Save**

#### Changing Password

1. **Profile** → **Change Password**
2. Enter:
   - Current password
   - New password (min 6 characters)
   - Confirm new password
3. Click **Change Password**
4. Logged out and redirected to login

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions are **greatly appreciated**.

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/memo-hub.git`
3. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
4. **Commit** your changes: `git commit -m 'Add some AmazingFeature'`
5. **Push** to branch: `git push origin feature/AmazingFeature`
6. **Open** a Pull Request

### Development Guidelines

- ✅ Follow existing code style (use ESLint)
- ✅ Write meaningful commit messages (Conventional Commits)
- ✅ Add comments for complex logic
- ✅ Test thoroughly before submitting
- ✅ Update documentation if needed
- ✅ Keep PRs focused and atomic

### Code Style

- **Frontend**: React functional components, hooks, Tailwind classes
- **Backend**: TypeScript, async/await, proper error handling
- **Commits**: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Nguyen Van Quang Huy (vanhuy2005)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See [LICENSE](LICENSE) file for full text.

---

## 👨‍💻 Author

**Nguyen Van Quang Huy (vanhuy2005)**

- 🌐 GitHub: [@vanhuy2005](https://github.com/vanhuy2005)
- 📧 Email: nguyen.van.quang.huy.2105@gmail.com
- 🔗 Repository: [memo-hub](https://github.com/vanhuy2005/memo-hub)

---

## 🙏 Acknowledgments

Special thanks to:

- **SuperMemo** - Original SM-2 algorithm research
- **Anki** - Inspiration for SRS implementation and UI patterns
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful, consistent icon library
- **React Community** - Excellent ecosystem and tools
- **MongoDB** - Flexible NoSQL database
- **Vercel** - Deployment platform

---

## 📞 Support

Need help? Have questions?

1. 📖 Read the [API Documentation](./API_DOCUMENTATION.md)
2. 🌱 Check [Seed Data Guide](./server/src/scripts/README_SEED.md)
3. 🐛 Open an issue: [GitHub Issues](https://github.com/vanhuy2005/memo-hub/issues)
4. 📧 Email: nguyen.van.quang.huy.2105@gmail.com

---

<div align="center">

**Made with ❤️ and ☕ by [vanhuy2005](https://github.com/vanhuy2005)**

⭐ **Star this repo** if you find it helpful!

[Report Bug](https://github.com/vanhuy2005/memo-hub/issues) · [Request Feature](https://github.com/vanhuy2005/memo-hub/issues)

</div>
