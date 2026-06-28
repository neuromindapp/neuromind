FROM node:20-alpine AS frontend
WORKDIR /app/frontend
ARG VITE_API_BASE_URL=/api
ARG VITE_PRIVY_APP_ID=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_PRIVY_APP_ID=$VITE_PRIVY_APP_ID
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM node:20-alpine AS docs
WORKDIR /app/docs
COPY docs/package*.json ./
RUN npm install
COPY docs ./
RUN npm run build

FROM caddy:2.8-alpine
COPY caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=frontend /app/frontend/dist /srv/frontend
COPY --from=docs /app/docs/dist /srv/docs

