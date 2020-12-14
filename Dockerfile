FROM keymetrics/pm2:latest-stretch

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    python3-pip \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /iTurbo
COPY package*.json ./

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