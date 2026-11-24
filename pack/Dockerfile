FROM node:22-slim
RUN apt-get update && apt-get install -y --no-install-recommends tar && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY shared ./shared
COPY src ./src
RUN npx tsc
USER node
CMD ["node","dist/src/http.js"]
