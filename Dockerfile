# Backend Dockerfile
FROM hub.megan.ir/node:18-alpine

WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./
RUN npm config set registry https://hub.megan.ir/npm
RUN npm install
COPY backend/ ./
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
