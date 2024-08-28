## Description

Nest api project for apply digital. STACK: nestjs, postgres, docker, npnm

The easy way to run the project and test it, It's to run with docker:

- Download the project and then:

```bash
$ docker-compose up
```

- Enter to http://localhost:3000/api/docs to see the documentation.
- The firts request should be the fetch-all route, to call the contentful api and populate the DB.
- In order to get the report module, you will need to use an apikey, which is in the docker-compose environments.
  To set up the apkey you will need to use a browser extension to insert the apikey. Or just use Postman.
Curl example: 
```bash
curl --location 'http://localhost:3000/reports/deleted-percentage' \
--header 'apikey: 142caef0dd6c387225f6659c'
```
- Additionaly, the docker runs an pgadmin image if you want to access to the databse.

## Installation
In order to use pnpm you will need to intall like:
```bash
$ npm install pnpm -g
```

Then, install the project dependencies.

```bash
$ pnpm install
```

## Running the app
- Create a file .env and load the environment from the docker-compose file

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```