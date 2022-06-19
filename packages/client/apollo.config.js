const path = require("path");

module.exports = {
  client: {
    excludes: ["**/generated/graphql.tsx"],
    service: {
      name: "my-service",
      localSchemaFile: path.resolve(
        __dirname,
        "../server/generated/schema.graphql"
      ),
    },
  },
};
