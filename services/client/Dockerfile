FROM node:13.8-alpine

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm ci
RUN npm install react-scripts@latest --g --silent

COPY . /usr/src/app

CMD ["npm", "start"]
