# syntax=docker/dockerfile:1

# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

ENV NODE_ENV production

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json yarn.lock ./
COPY .yarn ./.yarn/
COPY .yarnrc.yml ./
COPY tsconfig.json ./

COPY packages/server/package.json packages/server/package.json
COPY packages/prisma/ packages/prisma/

# Only install prisma + server deps
RUN yarn workspaces focus @smart-irrigation/prisma @smart-irrigation/server

COPY packages/server packages/server

# Creates a "dist" folder with the production build
RUN yarn workspace @smart-irrigation/server build

WORKDIR /usr/src/app/packages/server

# Start the server using the production build
CMD [ "./start.sh" ]
