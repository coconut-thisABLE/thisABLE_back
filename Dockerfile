FROM node:16-alpine3.14

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
COPY package*.json /app
RUN npm install
ADD . /app
CMD [ "npm", "start" ]
