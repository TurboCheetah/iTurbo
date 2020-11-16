FROM keymetrics/pm2:latest-alpine

ARG YOUTUBE_DL_OVERWRITE=
HEALTHCHECK --interval=10m --timeout=10s --retries=1 CMD [ "$(wget -qO- https://duckduckgo.com 2>/dev/null)" != "" ] || exit 1
ENV LOG=yes \
    AUTOUPDATE=no \
    GOTIFYURL= \
    GOTIFYTOKEN=
ENTRYPOINT ["/entrypoint.sh"]
COPY entrypoint.sh /
RUN apk add -q --progress --update --no-cache ca-certificates ffmpeg python3 && \
    rm -rf /var/cache/apk/*
RUN apk add -q --progress --update --no-cache --virtual deps wget gnupg && \
    ln -s /usr/bin/python3 /usr/local/bin/python && \
    LATEST=${YOUTUBE_DL_OVERWRITE:-latest} && \
    wget -q https://yt-dl.org/downloads/$LATEST/youtube-dl -O /usr/local/bin/youtube-dl && \
    wget -q https://yt-dl.org/downloads/$LATEST/youtube-dl.sig -O /tmp/youtube-dl.sig && \
    gpg --keyserver keyserver.ubuntu.com --recv-keys 'ED7F5BF46B3BBED81C87368E2C393E0F18A9236D' && \
    gpg --verify /tmp/youtube-dl.sig /usr/local/bin/youtube-dl && \
    SHA256=$(wget -qO- https://yt-dl.org/downloads/$LATEST/SHA2-256SUMS | head -n 1 | cut -d " " -f 1) && \
    [ $(sha256sum /usr/local/bin/youtube-dl | cut -d " " -f 1) = "$SHA256" ] && \
    apk del deps && \
    rm -rf /var/cache/apk/* /tmp/youtube-dl.sig && \
    chown 1000 /entrypoint.sh /usr/local/bin/youtube-dl && \
    chmod 500 /entrypoint.sh && \
    chmod 700 /usr/local/bin/youtube-dl

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /iTurbo
COPY package*.json ./
COPY ecosystem.config.js ./

RUN npm install
COPY . .
ARG PM2_ENV
ENV PM2_ENV "$PM2_ENV"
ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY
ENV PM2_PUBLIC_KEY "$PM2_PUBLIC_KEY"
ENV PM2_SECRET_KEY "$PM2_SECRET_KEY"
RUN echo "Running in $PM2_ENV mode"
CMD pm2-runtime start ecosystem.config.js --env $PM2_ENV