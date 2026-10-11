FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public" \
  npx prisma generate \
  && npm run build
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
