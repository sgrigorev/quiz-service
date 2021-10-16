FROM node:14-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf && npm install --only=development

COPY . .

RUN npm run build

FROM node:14

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
