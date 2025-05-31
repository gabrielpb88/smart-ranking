# Smart-ranking

## Description

This aplication was created to serve as portfólio to demonstrate experience with several technologies, architetures, frameworks, best practices and problem solve experience.

## Context

This repository is one of a multirepo application responsible for manage a Ranking and Tennis Matches.
For more information see the main repository at [Main Repository](https://github.com/gabrielpb88/smart-ranking)

This microservice is responsible to handle players and categories and was built using Nestjs, and the communication pattern used is through a messages broker (RabbitMQ)

## Dependencies

- MongoDB
- RabbitMQ

## Environment Variables

There is a file .env.example in the root folder of the project with all environment variables necessary to run the microservice

## Project setup

```bash
$ npm install
```

## Compile and run the project locally

You can run the application stand-alone with the following command, but remember that this microservice has dependencies already listed above.
You can find a docker-compose.yml in the main repository at [Main Repository](https://github.com/gabrielpb88/smart-ranking)

```bash
# watch mode
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## CI/CD

This repository uses GitHub Actions to run tests and build the Docker Image when necessary.

## Deployment

The deployment is being done through GitHub Actions in an AWS Cloud Service

## Stay in touch

- Github - [Gabriel Pereira Bastos](https://github.com/gabrielpb88)
- Email - [gabrielpb88@gmail.com](gabrielpb88@gmail.com)
- LinkedIn - [www.linkedin.com/in/gabriel-pereira-bastos](www.linkedin.com/in/gabriel-pereira-bastos)
