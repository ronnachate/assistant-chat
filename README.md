# Description

Assistant chat, microservice pattern with docker, using monorepo with nx https://nx.dev/

## Installation

```bash
$ docker-compose build
```

## Running the app

```bash
# development
$ docker-compose up [-d for detash to background]
```

# Developent section
 ## Required Dependency
 - Postgresql
 - mongodb
 - seq (logger)
 - rabbitMQ
 - envoy( or other api gateway)
 
You can run required dependdency via docker-compose,
then stop api and webapp while dev

## Dev Installation

```bash
$ npm install
```

## Running the app

```bash
# single app
$ nx serve assistant-api

# multiple apps
$ nx run-many --parallel --target=serve --projects message-api,assistant-api,assistant-web
```