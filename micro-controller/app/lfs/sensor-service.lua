local variables = require("variables")
local shared = require("shared")

local OP_READ_MOISTURE_SENSOR = 0x05
local OP_LED_OFF = 0x00
local OP_LED_ON = 0x01

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
    function(code)
      if (code < 0) then
        print("HTTP request failed", code)
      else
        -- NOTE: uncomment this line for debugging.
        print("HTTP Request Succeeded", code)
      end
    end
  )
end

local function write_to_device(device_address, command)
  i2c.start(variables.I2C_BUS_ID)

  local writeAcknowledgement = i2c.address(variables.I2C_BUS_ID, device_address, i2c.TRANSMITTER)

  if not writeAcknowledgement then
    -- turn on to debug unconnected i2c
    -- print("No write I2C acknowledge received for sensor address = " .. device_address)
    return nil
  end

  i2c.write(variables.I2C_BUS_ID, command)
  i2c.stop(variables.I2C_BUS_ID)

  return true
end

local function read_from_device(device_address)
  -- Instructs the ATTINY85 to take a sensor reading.
  if not write_to_device(device_address, OP_READ_MOISTURE_SENSOR) then
    -- If unable to acknowledge, return early.
    return nil
  end

  i2c.start(variables.I2C_BUS_ID)

  local readAcknowledgement = i2c.address(variables.I2C_BUS_ID, device_address, i2c.RECEIVER)

  if not readAcknowledgement then
    print("No read I2C acknowledge received for sensor address = " .. device_address)
    return nil
  end

  -- Read data, we only need to read the first byte because sensor only
  -- calcultes moisture between 0-255
  local data = i2c.read(variables.I2C_BUS_ID, 1)
  i2c.stop(variables.I2C_BUS_ID)

  return string.byte(data)
end

-- Returns a 0-255 OR nil value depending on the moisture level of the soil
-- or nil if there was an error with the i2c bus.
local function get_sensor_value(sensor_address)
  write_to_device(sensor_address, OP_LED_ON) -- turn LED on
  local value = read_from_device(sensor_address) -- read value
  write_to_device(sensor_address, OP_LED_OFF) -- turn LED off

  return value
end

local function start_watching_sensors(interval)
  mytimer = tmr.create()

  mytimer:register(
    interval,
    tmr.ALARM_AUTO,
    function()
      for sensor_id in pairs(variables.SENSOR_IDS) do
        local sensor_address = variables.SENSOR_IDS[sensor_id]
        local sensor_value = get_sensor_value(sensor_address)

        if sensor_value ~= nil then
          print(string.format("%s -> sensor value = %d", sensor_id, sensor_value))
          send_sensor_value_to_server(sensor_id, sensor_value)
        end
      end
    end
  )

  mytimer:start()
end

local function read_battery_voltage(interval)
  battery_tmr = tmr.create()

  battery_tmr:register(
    interval,
    tmr.ALARM_AUTO,
    function()
      res_one = 8130
      res_two = 14920

      -- NodeMCU saturates (gives 1024 reading) ADC at 3.13 volts instead of 3.3v
      saturation_voltage = 3.13

      adc_value = adc.read(0)

      -- scale ADC reading to volts
      vvd = (adc_value / 1024) * saturation_voltage

      -- uses the voltage div formula to vind vs (voltage source)
      vs = (vvd * (res_one + res_two)) / res_two

      print(string.format("ADC reading = %d", adc_value))
      print(string.format("Vvd = %f", vvd))
      print(string.format("Vsource = %f", vs))

      -- todo: send this to server
      local body = {
        query = "mutation CreateVoltageReading($input: ControllerVoltageReadingInput!) { controllerVoltageReading( controllerVoltageReadingInput: $input) }",
        variables = {
          input = {
            controllerId = variables.CONTROLLER_ID,
            volts = vs
          }
        }
      }

      http.post(
        shared.graphql_endpoint,
        "Content-Type: application/json\r\n",
        sjson.encode(body),
        function(code)
          if (code < 0) then
            print("create voltage reading failed", code)
          else
            -- NOTE: uncomment this line for debugging.
            print("create voltage reading succeeded", code)
          end
        end
      )
    end
  )

  battery_tmr:start()
end

return {
  start = start_watching_sensors,
  start_battery_watcher = read_battery_voltage
}
