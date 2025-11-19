# 🧠 MemoHub Backend - Complete Documentation

> **Spaced Repetition System (SRS) Learning App Backend**
> Built with Node.js, Express, TypeScript, MongoDB, Redis, and BullMQ

---

## 📚 Table of Contents

1. [Tech Stack](#-tech-stack)
2. [Quick Start](#-quick-start)
3. [Architecture](#-architecture)
4. [Environment Setup](#-environment-setup)
5. [API Documentation](#-api-documentation)
6. [Data Flow & Caching](#-data-flow--caching)
7. [Background Jobs](#-background-jobs)
8. [Testing & Monitoring](#-testing--monitoring)
9. [Deployment](#-deployment)
10. [Troubleshooting](#-troubleshooting)

---

## 🛠 Tech Stack

### Core

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: MongoDB 6+ (Mongoose 8.0)
- **Cache**: Redis Cloud (ioredis 5.8)
- **Queue**: BullMQ 5.0

### Features

- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, cors, helmet
- **Real-time**: Socket.io
- **Email**: Nodemailer (Gmail SMTP)
- **SRS Algorithm**: SM-2 (SuperMemo 2)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd server
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 3. Seed database (optional)
npm run seed:system  # System decks (IELTS, JLPT, etc.)
npm run seed:full    # Full test data (user + cards + reviews)

# 4. Start development server
npm run dev

# 5. Server running at http://localhost:5000
```

### Login Credentials (After Full Seed)

```
Email: test@memohub.com
Password: 123456
```

---

## 🏗 Architecture

### Directory Structure

```
server/
├── src/
│   ├── config/              # Database, Redis, Queue configs
│   │   ├── database.ts      # MongoDB connection
│   │   ├── redis.ts         # Redis client with transactions
│   │   └── queue.ts         # BullMQ queues setup
│   ├── models/              # Mongoose schemas
│   │   ├── User.ts          # User + Gamification
│   │   ├── Deck.ts          # Card decks
│   │   ├── Card.ts          # Flashcards with SRS status
│   │   ├── ReviewHistory.ts # Review records
│   │   └── SystemDeck.ts    # Pre-made decks (IELTS, JLPT)
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── deckController.ts
│   │   ├── cardController.ts
│   │   └── studyController.ts  # SRS logic + Stats
│   ├── services/            # Business logic
│   │   ├── srsService.ts         # SM-2 algorithm
│   │   ├── cacheService.ts       # Cache utilities
│   │   ├── redisOperations.ts    # Atomic Redis ops
│   │   ├── redisKeys.ts          # Key design patterns
│   │   └── gamificationService.ts # XP, levels, achievements
│   ├── utils/               # Helper functions
│   │   └── dateHelper.ts    # Timezone-aware date utils
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts    # JWT verification
│   │   └── error.middleware.ts   # Error handling
│   ├── routes/              # API routes
│   ├── workers/             # Background job processors
│   │   └── emailWorker.ts   # Email notifications
│   └── server.ts            # Entry point
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

### Data Flow

```
┌────────────┐      ┌──────────────┐      ┌─────────────┐
│  Frontend  │─────>│   Express    │─────>│   MongoDB   │
│ (React.js) │      │  Controllers │      │  (Mongoose) │
└────────────┘      └──────────────┘      └─────────────┘
                           │                       ▲
                           │                       │
                           ▼                       │
                    ┌──────────────┐              │
                    │     Redis    │──────────────┘
                    │  (ioredis)   │  Cache-Aside
                    └──────────────┘  Write-Through
                           │
                           ▼
                    ┌──────────────┐
                    │    BullMQ    │
                    │   Workers    │
                    └──────────────┘
```

---

## 🔐 Environment Setup

### Required Variables

Create a `.env` file:

```bash
# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/memohub?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Redis Cloud
REDIS_HOST=your-redis-host.cloud.redislabs.com
REDIS_PORT=16231
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# Gmail SMTP (IMPORTANT: Use App Password, NOT regular password!)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-char App Password
```

### ⚠️ CRITICAL: Gmail App Password Setup

**DON'T use your regular Gmail password - it won't work!**

1. Enable 2-Step Verification:

   - https://myaccount.google.com/security

2. Generate App Password:

   - https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" → Enter "MemoHub"
   - Copy the 16-character password (remove spaces)

3. Update `.env`:
   ```bash
   EMAIL_PASSWORD=abcdefghijklmnop  # No spaces!
   ```

### Verify Setup

```bash
npm run dev
```

Expected logs:

```
✅ MongoDB Connected
✅ Redis connected successfully!
✅ Email server ready to send messages
🚀 Email worker started successfully
📅 Daily reminder job scheduled
🚀 Server running on port 5000
```

---

## 📡 API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "Password123!"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Study (Core SRS)

#### Get Study Session

```http
GET /api/study/session?limit=20&deckId=optional
Authorization: Bearer <token>
```

**Response:** Returns cards due for review today.

#### Review Card

```http
POST /api/study/review/:cardId
Authorization: Bearer <token>
Content-Type: application/json

{
  "grade": 2,
  "timezoneOffset": 7
}
```

**Grades:**

- `0` - Again (forgot completely)
- `1` - Hard (struggled to remember)
- `2` - Good (remembered with effort)
- `3` - Easy (remembered instantly)

**Response:**

```json
{
  "success": true,
  "data": {
    "new_interval": 7,
    "next_review_at": "2025-11-26T10:00:00.000Z",
    "daily_progress": {
      "cards_studied_today": 15,
      "cards_due_today": 42,
      "daily_goal": 20,
      "progress_percentage": 75,
      "goal_completed": false
    },
    "streak": {
      "current": 7,
      "longest": 30
    }
  }
}
```

#### Get Study Stats

```http
GET /api/study/stats?timezoneOffset=7
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "total_cards": 150,
    "cards_studied_today": 15,
    "cards_due_today": 42,
    "new_cards": 50,
    "learning_cards": 80,
    "mastered_cards": 20,
    "current_streak": 7,
    "longest_streak": 30,
    "weekly_activity": [...]
  }
}
```

### Decks & Cards

See full API documentation in `/docs/API_DOCUMENTATION.md`

---

## 💾 Data Flow & Caching

### Write-Through Caching Strategy

#### Review Card Flow

```
User reviews card
  ↓
1. MongoDB Write (Source of Truth)
   - card.save() → Update srs_status
   - ReviewHistory.create() → Log review
  ↓
2. Redis Transaction (Atomic)
   MULTI
   - INCR user:123:daily:2025-11-19  ← Daily counter
   - ZREM user:123:due_queue {cardId}  ← Remove from queue
   - ZADD user:123:due_queue {timestamp} {cardId}  ← Add back
   - SADD user:123:study_dates "2025-11-19"  ← Streak tracking
   EXEC
  ↓
3. Response
   {
     cards_studied_today: 15,  ← From Redis INCR
     cards_due_today: 42        ← From Redis ZCARD
   }
```

**Why Transaction?**

- ✅ Atomic: All commands execute together or none
- ✅ No race conditions: Multiple concurrent reviews handled correctly
- ✅ Consistent: Redis matches MongoDB state

#### Get Stats Flow

```
Request stats
  ↓
1. Try Redis First (Fast Path < 1ms)
   - GET user:123:daily:2025-11-19 → 15 cards
   - ZCARD user:123:due_queue → 42 due
   - HGETALL user:123:stats → cached stats
  ↓
IF CACHE HIT → Return immediately ✅
  ↓
IF CACHE MISS:
2. Fallback to MongoDB (100ms)
   - Aggregate cards by status
   - Count reviews today
   - Compute streak
  ↓
3. Cache Repair (Write-Through)
   - HMSET user:123:stats {computed stats}
   - EXPIRE 300 seconds (5 min TTL)
  ↓
4. Return Response
```

### Redis Key Design

| Key Pattern                    | Type         | TTL   | Purpose                               |
| ------------------------------ | ------------ | ----- | ------------------------------------- |
| `user:{id}:daily:{YYYY-MM-DD}` | String (Int) | 48h   | Daily review counter (auto-reset)     |
| `user:{id}:due_queue`          | Sorted Set   | None  | Cards sorted by next_review_timestamp |
| `user:{id}:stats`              | Hash         | 5 min | Cached computed stats                 |
| `user:{id}:study_dates`        | Set          | 90d   | Dates studied (for streak)            |
| `user:{id}:streak`             | Hash         | 24h   | Current & longest streak              |

**Why Date-Based Keys?**

- ✅ Auto-reset: New date = New key = Counter starts at 0
- ✅ No cronjobs: Natural reset at midnight in user's timezone
- ✅ Timezone-aware: Key includes user's local date

### Timezone Handling

**Frontend sends offset:**

```javascript
// client/src/services/index.js
const timezoneOffset = -new Date().getTimezoneOffset() / 60;
// Vietnam: 7, US-EST: -5, UK: 0

api.post("/study/review/:cardId", {
  grade: 2,
  timezoneOffset,
});
```

**Backend uses helper:**

```typescript
// server/src/utils/dateHelper.ts
const today = getTodayDateKey(timezoneOffset);
// Returns: "2025-11-19" in user's timezone

// Redis key: user:123:daily:2025-11-19
// Resets automatically when user's date changes
```

---

## 📧 Background Jobs

### Email Worker (BullMQ)

**Queue**: `email-notifications`

**Job Types:**

1. `welcome` - New user registration
2. `daily-reminder` - "You have X cards due today!"
3. `achievement-unlocked` - 🎉 New achievement
4. `level-up` - 🎊 Level up celebration

**Worker Configuration:**

```typescript
// CRITICAL: BullMQ requires maxRetriesPerRequest: null
connection: {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,  // NOT 3!
}
```

**Processing:**

```
Job added to queue
  ↓
Worker picks up job (concurrency: 5)
  ↓
Generate email HTML from template
  ↓
Send via Gmail SMTP (nodemailer)
  ↓
Success: Log message ID
Failure: Retry (max 3 attempts)
```

**Monitoring:**

```bash
# Check queue status
redis-cli -h your-host -p 16231 -a password

# List jobs
KEYS bull:email-notifications:*

# Check waiting
LLEN bull:email-notifications:wait

# Check completed
ZCARD bull:email-notifications:completed
```

### Daily Reminders

**Schedule**: 9:00 AM Vietnam Time (daily)

**Cron**: `0 9 * * *` (Asia/Ho_Chi_Minh)

**Logic:**

1. Find users with `cards_due_today > 0`
2. Queue email job for each user
3. Worker processes emails asynchronously

---

## 🧪 Testing & Monitoring

### Manual Testing

**1. Test Registration Email**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Password123!"
  }'
```

Expected:

- ✅ User created
- ✅ Welcome email received
- ✅ Logs: `📧 [WORKER] Processing email job: ... (welcome)`
- ✅ Logs: `✅ [WORKER] Email sent successfully`

**2. Test Stats Update**

```bash
# Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@memohub.com","password":"123456"}' \
  | jq -r '.token')

# Get stats (before)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/study/stats?timezoneOffset=7

# Review a card
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"grade":2,"timezoneOffset":7}' \
  http://localhost:5000/api/study/review/CARD_ID

# Get stats (after) - should show +1
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/study/stats?timezoneOffset=7
```

### Performance Metrics

| Endpoint                 | Cache Hit | Cache Miss |
| ------------------------ | --------- | ---------- |
| `GET /study/stats`       | < 1ms     | ~100ms     |
| `POST /study/review/:id` | N/A       | ~50ms      |

**Target Cache Hit Rate**: > 95%

### Logs to Monitor

**Success Indicators:**

```
✅ MongoDB Connected
✅ Redis connected successfully!
✅ Email server ready to send messages
🚀 Email worker started successfully
📅 Daily reminder job scheduled
```

**Review Logs:**

```
📝 ========== REVIEW CARD ==========
   User: 691dc4528c24a2eecf1fada8
   Card: 64f5a8b9c1e2d3f4a5b6c7d8
   Grade: 2
   Timezone: UTC+7
   Today (User): 2025-11-19
   New Interval: 7d
====================================

🔄 Starting atomic Redis update for user ...
✅ Atomic update complete: 15 cards today, 42 due
```

**Stats Logs:**

```
📊 ========== GET STUDY STATS ==========
   User: 691dc4528c24a2eecf1fada8
   Timezone: UTC+7
   Today (User): 2025-11-19
========================================

🔑 Redis counters: 15 studied today (2025-11-19), 42 due
✅ Cache HIT - Full stats available
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Update `.env`:

  ```bash
  NODE_ENV=production
  CORS_ORIGIN=https://your-domain.com
  ```

- [ ] Build TypeScript:

  ```bash
  npm run build
  ```

- [ ] Start production server:

  ```bash
  npm start
  ```

- [ ] Verify services:
  - [ ] MongoDB Atlas connection working
  - [ ] Redis Cloud connection stable
  - [ ] Email worker processing jobs
  - [ ] All API endpoints responding
  - [ ] CORS configured correctly

### Environment-Specific Configs

**Development:**

- Detailed logging
- Hot reload (nodemon)
- Local MongoDB (optional)

**Production:**

- Minimal logging
- Process manager (PM2)
- MongoDB Atlas
- Redis Cloud
- Error monitoring (Sentry)

---

## 🔧 Troubleshooting

### Issue 1: Email Not Sending

**Symptoms:**

```
❌ Email transport error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solution:**

1. Generate Gmail App Password (see Environment Setup)
2. Update `.env`: `EMAIL_PASSWORD=<16-char-app-password>`
3. Restart server

### Issue 2: Stats Not Updating

**Symptoms:**

- "Cards Studied Today" stuck at 0
- Review count doesn't increment

**Solution:**
✅ **FIXED!** Ensure:

1. Frontend sends `timezoneOffset` in requests
2. Backend uses `getTodayDateKey(timezoneOffset)`
3. Redis transaction completes atomically

**Verify:**

```bash
# Check Redis key exists
redis-cli -h your-host -p 16231 -a password
GET "user:YOUR_USER_ID:daily:2025-11-19"
# Should return: "15" (or your count)
```

### Issue 3: BullMQ Worker Not Starting

**Symptoms:**

```
📧 Email worker status: ❌ Inactive
BullMQ: WARNING! maxRetriesPerRequest must be null
```

**Solution:**
✅ **FIXED!** Check `queue.ts` and `emailWorker.ts`:

```typescript
connection: {
  maxRetriesPerRequest: null,  // NOT 3!
  enableReadyCheck: false,
}
```

### Issue 4: Timezone Mismatch

**Symptoms:**

- Daily counter resets at wrong time
- "Today" shows yesterday's count

**Solution:**

1. Frontend must send timezone:

   ```javascript
   const timezoneOffset = -new Date().getTimezoneOffset() / 60;
   ```

2. Backend logs should show:

   ```
   Timezone: UTC+7
   Today (User): 2025-11-19
   ```

3. Verify Redis key:
   ```bash
   # Key should have YOUR date, not server's date
   GET "user:123:daily:2025-11-19"
   ```

### Common Commands

```bash
# Check server logs
npm run dev

# Rebuild TypeScript
npm run build

# Clear Redis cache
redis-cli -h your-host -p 16231 -a password FLUSHDB

# Test MongoDB connection
mongosh "mongodb+srv://..."

# Check BullMQ jobs
redis-cli -h your-host -p 16231 -a password
KEYS bull:*
```

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-reload)

# Production
npm run build        # Compile TypeScript
npm start            # Run compiled JS

# Database
npm run seed:system  # Seed system decks (IELTS, JLPT, etc.)
npm run seed:full    # Seed full test data (user + cards + reviews)

# Code Quality
npm run lint         # ESLint check
npm run format       # Prettier format
```

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

- **Documentation**: This README + `/docs` folder
- **Issues**: GitHub Issues
- **Email**: your-email@example.com

---

**Last Updated**: November 19, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
