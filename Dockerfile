FROM node:14.9.0-alpine

WORKDIR /iTurbo
COPY package.json yarn.lock ./

RUN yarn install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]