local variables = require("variables")

-- points to server based on ip/hostname in variables
-- http://plant-pal-server.mannan.local/graphql
local graphql_endpoint = "http://" .. variables.SERVER_IP .. "/graphql"

local function set_graphql_endpoint(endpoint)
  graphql_endpoint = endpoint
end

return {
  graphql_endpoint = graphql_endpoint,
  set_graphql_endpoint = set_graphql_endpoint
}
