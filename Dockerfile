FROM node:current-alpine
LABEL authors="RahmanYILMAZ"

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "build"]