# 🏋️‍♂️ FitnessCal

## 📂 Cấu trúc thư mục

```bash
fitnessCal/
├── public/              # Chứa các file tĩnh (favicon, ảnh public, manifest, ...)
├── src/                 # Mã nguồn chính của ứng dụng
│   ├── api/             # Định nghĩa các hàm gọi API (login, booking, user, ...)
│   ├── assets/          # Tài nguyên tĩnh: hình ảnh, icon, font, ...
│   ├── axios/           # Config axios (axios instance + interceptors)
│   │   └── instance.ts
│   ├── components/      # Các component UI tái sử dụng (button, card, modal, ...)
│   ├── layouts/         # Layout tổng thể (MainLayout, AdminLayout, ManagerLayout)
│   ├── lib/             # Các hàm util, helper, config chung (format date, logger)
│   ├── pages/           # Các màn hình chính (Home, Login, Profile, Dashboard, ...)
│   ├── routes/          # Cấu hình router (React Router)
│   ├── schema/          # Validation schema (Yup)
│   ├── store/           # Global state management (Redux)
│   ├── styles/          # File CSS/SCSS global, biến màu sắc, theme
│   ├── types/           # Khai báo TypeScript types/interfaces cho toàn dự án
│   ├── App.tsx          # Component gốc của ứng dụng
│   └── main.tsx         # Entry point, mount React vào DOM
│
├── components.json      # Config của shadcn/ui (component library)
├── eslint.config.js     # Config ESLint cho linting
├── index.html           # File HTML gốc (chỉ có 1 root div)
├── package.json         # Khai báo dependencies & script của dự án
├── postcss.config.js    # Config PostCSS cho Tailwind
├── tailwind.config.js   # Config TailwindCSS (theme, plugin, content paths)
├── tsconfig.json        # Config TypeScript cho toàn dự án
├── vite.config.ts       # Config Vite (plugin, alias, build settings)
└── README.md            # Tài liệu dự án


🚀 Cách chạy dự án

1. Cài dependencies
   npm install

2. Chạy dev server
   npm run dev

App sẽ chạy tại http://localhost:5173

3. Build production
   npm run build

4. Preview build
   npm run preview
```
