# Polkadot Mempool Explorer

Mempool Explorer allow users to monitor pending transactions on [Polkadot](https://polkadot.network/). 

## Environment setup

 - Install [Node.js](https://nodejs.org/)
   - Recommended method is by using [NVM](https://github.com/creationix/nvm)
   - Recommended Node.js version is v14
 - Install [Docker](https://docs.docker.com/get-docker/)

 ### Windows
 - Install nvm windows https://github.com/coreybutler/nvm-windows
 - nvm install 14
 - npm install -g win-node-env

 ### Deploying in Linux(ubuntu 20)
 - https://github.com/muddlebee/dotfiles/blob/master/ubuntu-20/utility-nodejs.sh
 - add IP in .env file


## Get Started

In the project directory, you can run:

### `npm start:dev`

Runs the docker containers in the development mode.\
Open [localhost:8084](http://localhost:8084) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm down`

Stops containers and removes containers, networks, volumes, and images created by `npm start:dev`

### `npm restart`

Restarts `api` and `web` services.

### `npm logs`

Displays log output from all services.

### `npm web:rebuild`

Removes `web` container and build it again

### `npm api:rebuild`

Removes `api` container and build it again

### `npm api:restart`

Restarts `api` service.

### `npm web:restart`

Restarts `web` service.

### `npm api:logs`

Displays log output from `api` service.

### `npm web:logs`

Displays log output from `web` service.

### `npm polkadot-local:logs`

Displays log output from custom `polkadot-local` service.

### `npm polkadot-westend:logs`

Displays log output from custom `polkadot-westend` service.

### `npm polkadot-main:logs`

Displays log output from custom `polkadot-main` service.

## Contributing

### Code of Conduct

[Code of Conduct](CODE_OF_CONDUCT.md)

## License

Mempool Explorer is [Apache 2.0 licensed](LICENSE).
