# RT-SYR - Recruitments & Tenders Syria

A comprehensive bilingual (Arabic/English) platform for job postings, tender management, and applications built with Next.js 16 and NestJS.

## 🏗️ Architecture

This project follows a **monorepo structure** with:

- **Frontend**: Next.js 16 with App Router, Server Components, and next-intl for i18n
- **Backend**: NestJS with Prisma ORM and PostgreSQL
- **Storage**: Supabase Storage for file uploads
- **Auth**: JWT-based authentication with email OTP verification

## 📁 Project Structure

```
rt-syr-main-v2/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Shared utilities and API client
├── messages/               # i18n translations (en.json, ar.json)
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── profiles/      # User profiles
│   │   ├── companies/     # Companies management
│   │   ├── organizations/ # Organizations management
│   │   ├── jobs/          # Jobs posting
│   │   ├── tenders/       # Tenders posting
│   │   ├── applications/  # Applications management
│   │   ├── admin/         # Admin features
│   │   ├── reports/       # Reports system
│   │   └── storage/       # File storage
│   └── prisma/            # Database schema
└── docs/                   # Documentation
```

## ✨ Features

### Core Functionality

- ✅ Bilingual support (English & Arabic) with RTL layout
- ✅ User authentication with email OTP verification
- ✅ Role-based access control (User, Company, Organization, Admin)
- ✅ Job posting and browsing
- ✅ Tender posting and browsing
- ✅ Application management
- ✅ File uploads (licenses, resumes, logos, avatars)
- ✅ Admin dashboard with approvals and analytics
- ✅ Reports and notifications system

### Business Rules

- 🔒 Companies and organizations require admin approval before posting
- 📊 Free post limits: 2 jobs per company, 2 tenders per organization
- 📧 Email verification required before login
- 🔐 Strong password policy enforcement
- 🚫 Duplicate application prevention
- ⚠️ Fee disclaimer and report ad functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL 14+
- Supabase account (for storage)
- SMTP server (for emails)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd rt-syr-main-v2
```

2. **Install frontend dependencies**

```bash
npm install
# or
bun install
```

3. **Install backend dependencies**

```bash
cd backend
npm install
cd ..
```

4. **Configure environment variables**

Create `.env.local` in the root for frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Create `.env` in `backend/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rt_syr"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-key"
SMTP_HOST="smtp.example.com"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-password"
# ... see backend/.env.example for full list
```

5. **Setup database**

```bash
cd backend
npx prisma generate
npx prisma migrate dev
cd ..
```

### Running the Application

**Start backend (in one terminal):**

```bash
cd backend
npm run start:dev
```

Backend will run on `http://localhost:3001`

**Start frontend (in another terminal):**

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Client Requirements](./docs/client-requirements-todo.md)
- [Project Rules](./docs/project-rules.md)
- [Migration Plan](./nestjs.plan.md)

## 🔑 API Endpoints

See [Backend README](./backend/README.md) for complete API documentation.

Key endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/jobs` - List jobs (public)
- `GET /api/tenders` - List tenders (public)
- `POST /api/applications/jobs/:id/apply` - Apply to job

## 🎨 Frontend Components

The frontend uses:
- **Shadcn UI** for component library
- **Tailwind CSS** for styling
- **next-intl** for internationalization
- **React Hook Form** with Zod for form validation

Key components:
- `job-form` - Job posting form
- `tender-form` - Tender posting form
- `browse-selector` - Browse jobs/tenders switcher
- `nav-header` - Navigation with language toggle
- `report-form` - Report submission form

## 🌐 Internationalization

The app supports English (LTR) and Arabic (RTL) with:
- Locale-based routing (`/en/*` and `/ar/*`)
- RTL layout support
- Translated UI strings in `messages/en.json` and `messages/ar.json`

## 🔒 Authentication Flow

1. User signs up with email, password, and role
2. OTP sent to email (6-digit code, 15-minute expiration)
3. User verifies email with OTP
4. User can now login
5. JWT access token (15 min) and refresh token (7 days) issued
6. Frontend stores tokens and auto-refreshes on expiry

## 🛡️ Security

- JWT-based authentication
- Password hashing with bcrypt
- Email verification required
- Role-based access control
- File upload validation
- CORS protection
- SQL injection prevention (Prisma)
- XSS protection (validation pipes)

## 📦 Deployment

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
npm run build
npm run start
```

## 🧪 Testing

Backend tests:

```bash
cd backend
npm run test
npm run test:e2e
```

## 📝 Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code

### Backend

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and apply migration

## 🤝 Contributing

1. Follow coding standards in `docs/project-rules.md`
2. Update `docs/client-requirements-todo.md` for feature changes
3. Run linter before commits
4. Provide EN + AR translations for UI changes

## 📄 License

Private - RT-SYR Project

## 🐛 Known Issues

- Database migration from Supabase to PostgreSQL needs to be executed
- Some frontend components still need to be migrated from Supabase client to NestJS API
- End-to-end tests pending

## 🗺️ Roadmap

- [ ] Complete frontend-backend integration
- [ ] Data migration from Supabase
- [ ] Comprehensive testing suite
- [ ] API documentation with Swagger
- [ ] Performance optimization
- [ ] Production deployment

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.



