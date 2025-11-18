# 🎯 LOGIC CHUYỂN TRẠNG THÁI CARD - SUMMARY

## Công thức đơn giản

### ✅ **ĐÃ THUỘC** = `interval >= 7` VÀ `ease_factor >= 2.0`

### Quá trình chuyển đổi

```
[Thẻ Mới]  →  [Đang Học]  →  [Đã Thuộc]
interval=0     1-6 ngày      7+ ngày
```

## Timeline thực tế (nhấn "Tốt" mỗi lần)

- **Ngày 1**: interval = 0 → 1 (Mới → Đang học)
- **Ngày 2**: interval = 1 → 3 (Đang học)
- **Ngày 5**: interval = 3 → 5 (Đang học)
- **Ngày 10**: interval = 5 → 8 (✅ **ĐÃ THUỘC**)
- **Ngày 18**: interval = 8 → 22 (Đã thuộc)
- **Ngày 40**: interval = 22 → 60 (Đã thuộc)

⏱️ **Tổng**: ~4-5 lần review, mất ~10-17 ngày

## 4 nút đánh giá

1. **Lại** (Grade 0): Reset về 0, ôn sau 10 phút
2. **Khó** (Grade 1): Giảm interval 50%
3. **Tốt** (Grade 2): Tăng interval chuẩn (x1.5 hoặc x2.5)
4. **Dễ** (Grade 3): Tăng interval nhanh (x2.5+)

## Cải thiện UI đã làm

✅ Badge trạng thái (Mới/Đang học/Đã thuộc)
✅ Progress bar tiến độ đến 7 ngày
✅ Thông báo "🎉 Bạn đã thuộc từ này!" khi đạt interval >= 7
✅ Giải thích chi tiết sau mỗi review
✅ Tooltip cho từng nút đánh giá
✅ Color-coded card list với border trái
✅ Stats breakdown: Tổng/Đã thuộc/Đang học/Mới

## File tham khảo chi tiết

📄 `WORKFLOW_LOGIC.md` - Giải thích đầy đủ với ví dụ code
