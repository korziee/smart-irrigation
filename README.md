# Setup

1. Setup Environment Variables
2. Yarn Install
3. Run `yarn dlx @yarnpkg/sdks` to update your local yarn config with the editor tools

# Folders

## /micro-controller

Holds all of the logic to control the ESP8266 running NodeMCU. This is all lua, see the [NodeMCU docs](https://nodemcu.readthedocs.io) for more information.

There is a README in this folder that elaborates on how the project uses LFS (Lua File Store).

## /packages/client

React FE used to remotely monitor and control the MCUs.

## /packages/server

NodeJS backend written in TypeScript over the NestJS framework. Monitors, stores sensor data, configures, and controls the MCUs.

## /packages/prisma

Holds the Prisma ORM configuration and generated types.

# Getting Started

Run `yarn start:dev` to start both the client and server
Run `yarn start:micro-controller` to start the LFS builder and remote http-server used by the MCUs for OTA LFS updates.

# Deploying (CapRover)

You will need to have `caprover` CLI installed and be logged into the caprover instance.

Run `yarn deploy:server` to begin the deployment

# Connecting to db

The db is running in caprover, and port 5050 has been mapped to port 5432 internally, so to connect to it run:

`pgcli 'postgresql://postgres:$pw@192.168.1.253:5050/postgres'`

## Notes

You will need to first check in your changes to `main`
Caprover will pull the latest change, build the docker image based on `Dockerfile`, and then start the container which runs `start.sh` (migrates + starts nest app)
There is a port mapping in caprover to map port 3000 to 8081 so that the FE can consume it
