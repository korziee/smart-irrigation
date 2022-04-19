local server = require("http-server")
local sensor_service = require("sensor-service")
local variables = require("variables")
local fetch_config = require("fetch-config").fetch_config

-- Fetch config
-- Start server

fetch_config(
  variables.CONTROLLER_ID,
  function(config_data)
    server.start()
    sensor_service.start(config_data.soilSensorUpdateIntervalMs)
    -- TODO: create solenoid_service
    -- solenoid_service.start()
  end
)
