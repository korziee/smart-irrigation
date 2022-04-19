local variables = require("variables")
local shared = require("shared")

-- TODO: verify that this is the correct bus ID.
local BUS_ID = 0

-- initialize i2c
i2c.setup(BUS_ID, variables.I2C_SDA, variables.I2C_SCL, i2c.FAST)

local function send_sensor_value_to_server(sensor_id, value)
  local body = {
    query = "mutation CreateSensorReading($input: SensorReadingInput!) {  sensorReading(sensorReadingInput: $input) {    id  }}",
    variables = {
      input = {
        sensorId = sensor_id,
        reading = value
      }
    }
  }

  http.post(
    shared.graphql_endpoint,
    "Content-Type: application/json\r\n",
    sjson.encode(body),
    function(code, data)
      if (code < 0) then
        print("HTTP request failed")
        callback(nil)
      else
        print(code, data)
      end
    end
  )
end

local function get_sensor_value(sensor_id)
  i2c.start(BUS_ID)

  local sensor_address = variables.SENSOR_IDS[sensor_id]
  local ack = i2c.address(BUS_ID, sensor_address, i2c.RECEIVER)

  if not ack then
    print("No I2C acknowledge received for BUS_ID = " .. BUS_ID .. " and sensor address = " .. sensor_address)
    return nil
  end
  -- Read data for variable number of bytes.
  -- TODO: verify that 1 byte is enough?
  local data = i2c.read(BUS_ID, 1)
  i2c.stop(BUS_ID)

  return data
end

local function start_watching_sensors(interval)
  -- TODO: setup timer
  -- TODO: setup loop for all sensors
  -- Arrays start at 1 in Lua
  local value = get_sensor_value("09a51cc0-a543-41f2-af84-75324bb5d887")
  print("Value", value)
  -- TODO: replace "20" with the actual value here
  send_sensor_value_to_server("09a51cc0-a543-41f2-af84-75324bb5d887", 20)
  -- TODO: verify that output is integer, if not convert to integer
end

return {
  start = start_watching_sensors
}
