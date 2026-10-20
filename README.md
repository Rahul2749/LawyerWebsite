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

Appointment tracking requires PostgreSQL and the backend to be running. If you use
the existing local database container, start Docker Desktop and run
`docker start lawyer-postgres`. You can then start the API from the project root
with `npm run dev:backend`, alongside the frontend's `npm run dev`.

Run `npm run test:tracking` to check the tracking API and OTP email/verification
behavior without sending emails or accessing a real database.

## Production deployment

SEO implementation notes, deployment checks, and the step-by-step Google Search Console setup are in [the SEO and Search Console guide](docs/SEO_AND_GOOGLE_SEARCH_CONSOLE.md). Run `npm run build` followed by `npm run test:seo` to crawl and validate the production output locally.

Production runs on an Ubuntu VPS with Docker Compose, PostgreSQL, Nginx, and Certbot. The deployment instructions, environment-variable reference, GitHub Actions setup, backup commands, and troubleshooting notes are in [the Ubuntu Docker deployment guide](docs/DOCKER_UBUNTU_DEPLOYMENT_GUIDE.md).
