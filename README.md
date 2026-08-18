# phototest
Para validar y hacer pruebas sobre despliegue sencillo

# Desarrollo local

## Backend
```bash
cd backend
pnpm install
cp .env.example .env  # Editar con tu DATABASE_URL de Supabase
pnpm run start:dev
```

## Frontend
```bash
cd frontend
pnpm install
pnpm run start
```
