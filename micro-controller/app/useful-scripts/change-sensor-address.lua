local variables = require("variables")

local function change_sensor_address()
  local BUS_ID = 0
  local CURRENT_ADDRESS = 0x28
  local DESIRED_ADDRESS = 0x29

  local CHANGE_ADDRESS_OP = 0x03

  i2c.setup(BUS_ID, variables.I2C_SDA, variables.I2C_SCL, i2c.FAST)

  i2c.start(BUS_ID)
  i2c.address(BUS_ID, CURRENT_ADDRESS, i2c.TRANSMITTER)
  i2c.write(BUS_ID, CHANGE_ADDRESS_OP)
  i2c.write(BUS_ID, DESIRED_ADDRESS)
  i2c.stop(BUS_ID)

  i2c.start(BUS_ID)
  i2c.address(BUS_ID, DESIRED_ADDRESS, i2c.RECEIVER)
  local val = i2c.read(BUS_ID, DESIRED_ADDRESS)
  i2c.stop(BUS_ID)

  if not val then
    print("Address change unsuccessful")
  else
    print("Address change successful")
  end
end

return {
  change_sensor_address = change_sensor_address
}
