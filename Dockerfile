FROM node:16-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:16-alpine AS production-dependencies

WORKDIR /app
COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn --prod

FROM node:16-alpine as runner
WORKDIR /app
USER 1000
COPY --from=production-dependencies /app .
COPY --from=builder /app/dist dist
ENV NODE_ENV production
CMD ["node", "dist/index.js"]
