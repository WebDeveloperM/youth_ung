# Admin Dashboard - Boshqaruv Paneli

Professional admin panel React, TypeScript, Tailwind CSS va Recharts bilan yaratilgan.

## 🚀 Xususiyatlari

### 📊 Dashboard (Boshqaruv Paneli)
- **Statistika kartalar**: Foydalanuvchilar, Loyihalar, Tadqiqotlar, Kunlik tashrif
- **O'sish ko'rsatkichlari**: Har bir metrika uchun foiz o'zgarish
- **Turli xil chartlar**:
  - Kunlik tashrif statistikasi (Area Chart)
  - Ma'lumotlar taqsimoti (Pie Chart)
  - Eng ko'p ko'rilgan sahifalar (Bar Chart)
  - Sahifa ko'rishlari tendensiyasi (Line Chart)
- **So'nggi faoliyat jadvali**: Barcha sahifalar bo'yicha batafsil statistika

### 👥 Foydalanuvchilar boshqaruvi
- **CRUD operatsiyalari**:
  - ✅ Yangi foydalanuvchi yaratish
  - ✅ Foydalanuvchi ma'lumotlarini o'zgartirish
  - ✅ Foydalanuvchini o'chirish
  - ✅ Foydalanuvchilarni qidirish
- **Foydalanuvchi rollari**: Admin, Moderator, Foydalanuvchi
- **Holat boshqaruvi**: Faol/Nofaol
- **Statistika**: Jami, Faol, Adminlar soni

### 📈 Analitika
- **Umumiy ko'rsatkichlar**: Ko'rishlar, Tashrif, O'rtacha vaqt, O'sish sur'ati
- **Chartlar**:
  - Haftalik tendensiya (Area Chart)
  - Soatlik faollik (Line Chart)
  - Sahifalar taqqoslash (Bar Chart)
- **Batafsil jadval**: Har bir sahifa uchun to'liq statistika
- **Performance metrikalari**: Eng ko'p ko'rilgan, Eng uzun vaqt, Eng yuqori konversiya

## 🛠️ Texnologiyalar

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Date Handling**: date-fns

## 📦 O'rnatish

### 1. Dependencies o'rnatish
```bash
npm install
```

### 2. Development server ishga tushirish
```bash
npm run dev
```

Server `http://localhost:5173` da ochiladi.

### 3. Production build
```bash
npm run build
```

Build fayllar `dist` papkasida saqlanadi.

### 4. Production preview
```bash
npm run preview
```

## 📁 Loyiha strukturasi

```
dashboard/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Asosiy layout (sidebar, header)
│   │   └── StatCard.tsx        # Statistika kartasi komponenti
│   ├── pages/
│   │   ├── Dashboard.tsx       # Bosh sahifa
│   │   ├── Users.tsx          # Foydalanuvchilar sahifasi
│   │   └── Analytics.tsx      # Analitika sahifasi
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── data/
│   │   └── mockData.ts        # Mock ma'lumotlar
│   ├── App.tsx                # Asosiy App komponenti
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Dizayn xususiyatlari

- **Modern va professional UI**
- **Responsive dizayn** - barcha ekran o'lchamlari uchun
- **Smooth animatsiyalar** va o'tishlar
- **Intuitive navigation** - qulay menyu tizimi
- **Color coding** - har xil holat va rollar uchun
- **Interactive charts** - Recharts yordamida
- **Custom scrollbar** - zamonaviy ko'rinish

## 📊 Ma'lumotlar

Hozirda loyiha mock ma'lumotlar bilan ishlaydi (`src/data/mockData.ts`). 
Real backend bilan integratsiya qilish uchun:

1. API service yarating
2. Mock ma'lumotlarni API chaqiruvlari bilan almashtiring
3. State management library qo'shing (Redux, Zustand, etc.)

## 🔐 Xavfsizlik

Production muhitda quyidagilarni qo'shing:
- Authentication tizimi
- Authorization va permission checks
- API security (JWT tokens)
- Input validation
- XSS va CSRF himoyasi

## 🚀 Kelajakdagi yaxshilanishlar

- [ ] Real-time ma'lumotlar yangilanishi
- [ ] Export functionality (PDF, Excel)
- [ ] Advanced filtering va sorting
- [ ] Dark mode
- [ ] Email notifications
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Multi-language support

## 📝 Litsenziya

Bu loyiha ochiq kod hisoblanadi va o'rganish maqsadlarida ishlatilishi mumkin.

## 👨‍💻 Dasturchi

Professional admin dashboard - Senior developer tomonidan yaratilgan

---

**Eslatma**: Bu loyiha demo maqsadida yaratilgan va mock ma'lumotlar bilan ishlaydi. Real production uchun backend integratsiya va xavfsizlik choralari qo'shilishi kerak.

