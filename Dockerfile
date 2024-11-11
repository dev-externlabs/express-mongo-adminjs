FROM node:alpine

RUN mkdir /home/node-app

WORKDIR /home/node-app

COPY package.json package.json
COPY package-lock.json package-lock.json

COPY . .
RUN npm install
RUN npm run build
ENV NODE_ENV development
CMD ["node", "dist/src/index.js"]
