FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages

RUN npm ci
RUN npm run build

CMD ["npm", "run", "discord"]
