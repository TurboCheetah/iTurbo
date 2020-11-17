FROM keymetrics/pm2:8-alpine

RUN apk add --update --no-cache make python2 && ln -sf python2 /usr/bin/python
RUN python2 -m ensurepip
RUN pip2 install --no-cache --upgrade pip setuptools

WORKDIR /iTurbo
COPY package*.json ./

RUN npm install
RUN rm ./node_modules/distube/youtube-dl/youtube-dl
COPY youtube-dl ./node_modules/distube/youtube-dl/
RUN chmod +x ./node_modules/distube/youtube-dl/youtube-dl
COPY . .
ARG PM2_ENV
ENV PM2_ENV "$PM2_ENV"
ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY
ENV PM2_PUBLIC_KEY "$PM2_PUBLIC_KEY"
ENV PM2_SECRET_KEY "$PM2_SECRET_KEY"
RUN echo "Running in $PM2_ENV mode"
CMD pm2-runtime start ecosystem.config.js --env $PM2_ENV