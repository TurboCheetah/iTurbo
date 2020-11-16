FROM keymetrics/pm2:latest-alpine

WORKDIR /iTurbo
COPY package*.json ./
COPY ecosystem.config.js ./

RUN npm install
COPY . .
ARG PM2_ENV
ENV PM2_ENV "$PM2_ENV"
RUN echo "Running in ${PM2_ENV} mode"
CMD [ "pm2-runtime", "start", "ecosystem.config.js --env ${PM2_ENV}"]