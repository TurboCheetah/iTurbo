FROM node:16.4.2-alpine

WORKDIR /iTurbo
COPY package.json yarn.lock ./

RUN yarn install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]