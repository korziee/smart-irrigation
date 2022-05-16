local server = require("http-server")
local sensor_service = require("sensor-service")
local solenoid_service = require("solenoid-service")
local variables = require("variables")
local fetch_config = require("fetch-config")

-- Setup i2c here because its used in both sensor and solenoid service
i2c.setup(variables.I2C_BUS_ID, variables.I2C_SDA, variables.I2C_SCL, i2c.SLOW)

local function start(config)
  -- Gets the server ready for bi-directional communication
  server.start()
  sensor_service.start(config.soilSensorUpdateIntervalMs)
  solenoid_service.start()
end

fetch_config(variables.CONTROLLER_ID, start)
