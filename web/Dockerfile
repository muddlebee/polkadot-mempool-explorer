FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
# overwrite .env file from .env.docker
COPY .env.docker ./.env


RUN yarn install

CMD [ "yarn", "start" ]
