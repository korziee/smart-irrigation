local variables = require("variables")

local graphql_endpoint = "http://" .. variables.SERVER_IP .. ":3000/graphql"

return {
  graphql_endpoint = graphql_endpoint
}
