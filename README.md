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
