# 📚 MemoHub API - Complete Endpoints

## Base URL

```
http://localhost:5000
```

## 🔐 Authentication

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "learning_target": "IELTS 7.0"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📦 Deck Management

### Create Deck

```http
POST /api/decks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "IELTS Vocabulary",
  "description": "Essential words for IELTS exam",
  "is_public": false
}
```

### Get My Decks

```http
GET /api/decks/my
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Deck by ID

```http
GET /api/decks/:deckId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Deck

```http
PUT /api/decks/:deckId
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Updated Deck Name",
  "description": "New description",
  "is_public": true
}
```

### Delete Deck

```http
DELETE /api/decks/:deckId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🎴 Card Management

### Create Card

```http
POST /api/cards
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "deck_id": "deck_id_here",
  "front_content": "学习",
  "back_content": "Học tập",
  "pronunciation": "xué xí",
  "example_sentence": "我喜欢学习中文 (Tôi thích học tiếng Trung)"
}
```

### Get Cards by Deck

```http
GET /api/cards/byDeck/:deckId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Card by ID

```http
GET /api/cards/:cardId
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Card

```http
PUT /api/cards/:cardId
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "front_content": "Updated word",
  "back_content": "Updated translation",
  "pronunciation": "Updated pronunciation",
  "example_sentence": "Updated example"
}
```

### Delete Card

```http
DELETE /api/cards/:cardId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🎯 Study Module (SRS Core)

### Get Study Session

```http
GET /api/study/session?limit=50
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "Study session loaded successfully",
  "data": {
    "total_cards": 25,
    "new_cards_count": 10,
    "review_cards_count": 15,
    "cards": [...]
  }
}
```

### Review Card (Submit Grade)

```http
POST /api/study/review/:cardId
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "grade": 2
}
```

**Grade Values:**

- `0` = Again (Quên hoàn toàn) - Ôn lại ngay
- `1` = Hard (Khó) - Ôn lại sau 1 ngày
- `2` = Good (Tốt) - Ôn theo interval hiện tại
- `3` = Easy (Dễ) - Tăng interval mạnh

**Response:**

```json
{
  "success": true,
  "message": "Card reviewed successfully",
  "data": {
    "card_id": "...",
    "new_interval": 6,
    "new_ease_factor": 2.5,
    "next_review_at": "2024-01-20T10:00:00.000Z",
    "grade_submitted": 2
  }
}
```

### Get Study Statistics

```http
GET /api/study/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_cards": 150,
    "new_cards": 50,
    "learning_cards": 100,
    "due_today": 25,
    "due_next_week": 75
  }
}
```

---

## 🚨 Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing Flow

### 1. Register & Login

```bash
# Register
POST /api/auth/register

# Login & Get Token
POST /api/auth/login
```

### 2. Create Deck & Cards

```bash
# Create Deck
POST /api/decks

# Add Cards
POST /api/cards (multiple times)
```

### 3. Study Session

```bash
# Get cards to study
GET /api/study/session

# Review each card
POST /api/study/review/:cardId
```

### 4. Check Progress

```bash
# Get statistics
GET /api/study/stats
```
