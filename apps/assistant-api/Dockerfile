FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:assistant-api

FROM node:18-alpine
ENV NODE_ENV=development
ENV PORT=3001
EXPOSE ${PORT}

USER node
WORKDIR /app

COPY package.json ./

# only copy the files we need from the build stage
COPY --from=build /app/dist/apps/assistant-api ./

# install only production dependencies
RUN npm install --omit=dev

CMD ["node", "main"]