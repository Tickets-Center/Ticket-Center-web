# ──────────────────────────────────────────────────────────────────────────────
# Ticket Center — Web  (React + Vite → Nginx static)
# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Build
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline

# Build-time env vars (VITE_ prefix makes them public)
# Pass these with: docker build --build-arg VITE_API_BASE_URL=https://api.example.com ...
ARG VITE_API_BASE_URL=http://localhost:8000/api
ARG VITE_REVERB_APP_KEY=ticketcenter-key
ARG VITE_REVERB_HOST=localhost
ARG VITE_REVERB_PORT=8080
ARG VITE_REVERB_SCHEME=http

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY
ENV VITE_REVERB_HOST=$VITE_REVERB_HOST
ENV VITE_REVERB_PORT=$VITE_REVERB_PORT
ENV VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME

COPY . .
RUN npm run build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Serve with Nginx
# ──────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
