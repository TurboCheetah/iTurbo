FROM node:14

WORKDIR /iTurbo
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]