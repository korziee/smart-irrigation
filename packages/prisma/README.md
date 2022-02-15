# prisma

This package exists to abstract the fact that prisma does not support PnP yet.

Run `yarn db:pull` to update the prisma schema
Run `yarn db:generate` to update the prisma client

I have had to "unplug" prisma based off of https://github.com/prisma/prisma/issues/1439#issuecomment-910768604. This means it is the only package using node_modules.

## Usage

`import { PrismaClient } from "@smart-irrigation/prisma-client"`
