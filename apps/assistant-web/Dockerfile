FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:web


FROM node:18-alpine
ENV NODE_ENV=development

USER node
WORKDIR /app

COPY package.json ./

# only copy the files we need from the build stage
COPY --from=build /app/dist/apps/assistant-web ./

# install only production dependencies
RUN npm install --omit=dev

CMD ["npx", "http-server"]