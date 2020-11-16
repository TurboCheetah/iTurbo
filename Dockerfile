FROM keymetrics/pm2:latest-alpine

WORKDIR /iTurbo
COPY package*.json ./
COPY ecosystem.config.js ./

ENV PM2_ENV dev
RUN npm install
COPY . .
CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "$PM2_ENV"]