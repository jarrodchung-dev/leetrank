FROM node:13.8.0-alpine

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm install
RUN npm install react-scripts@latest --global --silent

COPY . /usr/src/app

CMD ["npm", "start"]
