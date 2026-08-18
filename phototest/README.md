# Backend
cd backend
pnpm install
cp .env.example .env  # Edit with your Supabase DATABASE_URL
pnpm run start:dev

# Frontend
cd frontend
pnpm install
pnpm run start
