# Study Timer

Web app bấm giờ học tập kiểu Pomodoro (25/5), gồm 2 phần:

- `backend/` — NestJS + Prisma + SQLite, chạy cổng **3001**
- `frontend/` — React (Vite) + TypeScript + Tailwind CSS, chạy cổng **5173**

## Chạy dự án

Terminal 1 (backend):

```bash
cd backend
npm install
npx prisma db push   # lần đầu, tạo SQLite
npm run start:dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm install
npm run dev
```

Mở http://localhost:5173

## API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/sessions` | Lưu phiên pomodoro hoàn thành |
| GET | `/api/sessions?date=YYYY-MM-DD` | List phiên theo ngày |
| GET | `/api/stats?from=&to=` | Tổng thời gian theo ngày & môn học |

## Cách dùng

1. Nhập môn học (VD: Toán)
2. Bấm **Bắt đầu** — đếm 25 phút; hết giờ tự lưu phiên và chuyển sang nghỉ 5 phút
3. Xem thống kê tổng thời gian + theo môn học ở màn hình chính
