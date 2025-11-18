# MemoHub Client - Frontend Application

## 🚀 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Material Symbols

## 📦 Cài đặt

```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install
```

## 🏃 Chạy ứng dụng

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Cấu hình

Tạo file `.env` trong thư mục client:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Cấu trúc thư mục

```
client/
├── src/
│   ├── components/       # Reusable components
│   │   ├── BottomNav.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── Decks.jsx
│   ├── services/         # API services
│   │   ├── api.js
│   │   └── index.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Design System

### Colors

- **Primary**: `#13ec5b` (Green)
- **Background Light**: `#f6f8f6`
- **Background Dark**: `#102216`

### Font

- **Be Vietnam Pro** (400, 500, 700)

### Icons

- **Material Symbols Outlined**

## 🔌 API Integration

Frontend tự động kết nối với backend qua proxy configuration trong `vite.config.js`. Tất cả request đến `/api/*` sẽ được forward đến backend server.

## 📱 Features

### Đã hoàn thành:

- ✅ Authentication (Login/Register)
- ✅ Protected Routes với JWT
- ✅ Dashboard với statistics
- ✅ Deck Management (List view)
- ✅ Bottom Navigation
- ✅ Dark Mode Support
- ✅ Responsive Design (Mobile-first)

### Đang phát triển:

- 🔄 Study Session với SRS
- 🔄 Card Management (CRUD)
- 🔄 Statistics & Charts
- 🔄 Profile & Settings
- 🔄 Deck Details & Edit

## 🚦 Workflow Development

1. **Start Backend**: `cd .. && npm run dev` (trong thư mục MemoHub)
2. **Start Frontend**: `npm run dev` (trong thư mục client)
3. **Access**: http://localhost:3000

## 📝 Notes

- Frontend proxy tự động forward API calls đến backend
- JWT token được lưu trong localStorage
- Dark mode được handle bởi Tailwind CSS
- Mobile-first responsive design

## 🐛 Troubleshooting

### CORS Issues

Đảm bảo backend đã cấu hình CORS:

```js
// Backend src/server.ts
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

### API Connection Failed

- Kiểm tra backend đang chạy tại port 5000
- Kiểm tra `.env` có đúng VITE_API_URL
- Clear cache và restart Vite dev server
