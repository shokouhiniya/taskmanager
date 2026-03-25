# Stage 1: Build frontend
FROM hub.megan.ir/node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM hub.megan.ir/node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Production
FROM hub.megan.ir/node:18-alpine
RUN apk add --no-cache nginx supervisor

# Setup nginx
COPY nginx.conf /etc/nginx/http.d/default.conf
RUN rm -f /etc/nginx/http.d/default.conf.bak

# Copy frontend build to nginx
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy backend
WORKDIR /app/backend
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/package.json ./

# Supervisor config to run both nginx and node
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
