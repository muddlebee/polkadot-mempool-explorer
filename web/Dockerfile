FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
# overwrite .env file from .env.docker
COPY .env.docker ./.env


RUN npm install

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

CMD [ "npm", "run", "start" ]
