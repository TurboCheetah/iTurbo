FROM keymetrics/pm2:latest-alpine

ENV NODE_ENV "production"
ARG PM2_ENV
ENV PM2_ENV "$PM2_ENV"
ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY
ENV PM2_PUBLIC_KEY "$PM2_PUBLIC_KEY"
ENV PM2_SECRET_KEY "$PM2_SECRET_KEY"
WORKDIR /iTurbo
COPY package.json yarn.lock ./

RUN yarn install
COPY . .
EXPOSE 5000
RUN echo "Running in $PM2_ENV mode"
CMD pm2-runtime start ecosystem.config.js --env $PM2_ENV