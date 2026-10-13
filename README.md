# NyaySaathi Legal Consultancy Website

Full-stack website built with Next.js and an Express/Prisma API backed by PostgreSQL.

## Local development

Frontend:

```bash
npm ci
npm run dev
```

Backend (requires PostgreSQL and a `backend/.env` with `DATABASE_URL` and `JWT_SECRET`):

```bash
cd backend
npm ci
npx prisma generate
npm run dev
```

The frontend runs on `http://localhost:3000`; the API runs on `http://localhost:5000`.

## Production deployment

Production runs on an Ubuntu VPS with Docker Compose, PostgreSQL, Nginx, and Certbot. The deployment instructions, environment-variable reference, GitHub Actions setup, backup commands, and troubleshooting notes are in [the Ubuntu Docker deployment guide](docs/DOCKER_UBUNTU_DEPLOYMENT_GUIDE.md).
