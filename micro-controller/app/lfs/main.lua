local server = require("http-server")
local shared = require("shared")
local sensor_service = require("sensor-service")
local solenoid_service = require("solenoid-service")
local variables = require("variables")
local fetch_config = require("fetch-config")

-- Setup i2c here because its used in both sensor and solenoid service
i2c.setup(variables.I2C_BUS_ID, variables.I2C_SDA, variables.I2C_SCL, i2c.SLOW)

local function start(config)
  if config.devMode.enabled == true then
    if type(config.devMode.ipAddress) == "string" then
      print("dev mode is on and IP address is " .. config.devMode.ipAddress)
      shared.set_graphql_endpoint("http://" .. config.devMode.ipAddress .. ":3000/graphql")
      -- write down dev mode ip address...
      -- "w" file open will open, create if not exists, and truncate if does exist
      if file.open("ota_server_ip_address.txt", "w") then
        print("writing dev mode ip address to ota_server_ip_address.txt file")
        file.write(config.devMode.ipAddress)
        file.close()
      end
    else
      print("expected to find devMode ip address as string, expect found " .. type(config.devMode.ipAddress))
    end
  else
    print("dev mode is off")
    if file.open("ota_server_ip_address.txt", "w+") then
      print("clearing ota_server_ip_address.txt file")
      file.close()
    end
  end

  -- Gets the server ready for bi-directional communication
  server.start()
  sensor_service.start(config.soilSensorUpdateIntervalMs)
  solenoid_service.start()
end

fetch_config(variables.CONTROLLER_ID, start)
