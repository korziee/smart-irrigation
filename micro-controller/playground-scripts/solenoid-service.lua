local variables = require("variables")
local mcp23017 = require("mcp23017")

-- 0100000 is the default hardware address if A0,A1,A2 are biased to ground
local MCP23017_ADDRESS = 0x20
local GPPUB_REGISTER = 0x0d
local GPINTENB_REGISTER = 0x05
local INTCAPB_REGISTER = 0x11

-- given an ASCII decimal (0-255), converts to a binary string
function convert_byte_to_binary(byte)
  local t = {}
  for i = 7, 0, -1 do
    t[#t + 1] = math.floor(byte / 2 ^ i)
    byte = byte % 2 ^ i
  end
  return table.concat(t)
end

local function start_solenoid_service()
  print("Starting solenoid service")

  -- create instance for mcp23017
  local mcp = mcp23017(MCP23017_ADDRESS, variables.I2C_BUS_ID)
  -- Preparing input/output pins
  -- GP-A will control the solenoids (through the TIP120s)
  mcp:setMode(mcp.GPA, 7, mcp.OUTPUT)
  mcp:setMode(mcp.GPA, 6, mcp.OUTPUT)
  -- GP-B will listen for the switch inputs that decides for Auto/Off/On
  mcp:setMode(mcp.GPB, 0, mcp.INPUT)
  mcp:setMode(mcp.GPB, 1, mcp.INPUT)

  mcp:setPin(mcp.GPA, 7, mcp.HIGH)
  mcp:setPin(mcp.GPA, 6, mcp.HIGH)

  -- Sets the GPB side of the IC to have their inputs connected to a pull up resistor
  -- This means the input is pulled to 3.3v when its left floating
  -- So any checks for connection will be relative to ground, i.e. the pin outputs 0/false.
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.TRANSMITTER)
  i2c.write(variables.I2C_BUS_ID, GPPUB_REGISTER)
  i2c.write(variables.I2C_BUS_ID, 0x03)
  i2c.stop(variables.I2C_BUS_ID)

  -- Enable interrupts on INTB (pin 19) for GPB-0 and GPB-1
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.TRANSMITTER)
  i2c.write(variables.I2C_BUS_ID, GPINTENB_REGISTER)
  i2c.write(variables.I2C_BUS_ID, 0x03)
  i2c.stop(variables.I2C_BUS_ID)

  -- Setting pin 5 to be input, ready for interrupt
  gpio.mode(variables.SOLENOID_INTERRUPT_PIN, gpio.INT)

  -- Settup an interrupt on pin D4 on the falling edge. This is because the MCP23017 goes from high to low
  -- when an interrupt is triggered. The interrupt is cleared when the GPIO register is read. At which point
  -- the interrupt goes from 0 to 1.
  gpio.trig(
    variables.SOLENOID_INTERRUPT_PIN,
    "down",
    function()
      print("Interrupt triggered!")
      local gpb_state = mcp:readGPIO(mcp.GPB)
      print("GPB state (byte) = ", gpb_state)
      print("GPB state (binary) = ", convert_byte_to_binary(gpb_state))
    end
  )

  -- Read the INTCAPB to clear its current state, this is required as we are using interrupt-on-change for the interrupts
  -- and if we don't read the current state after setting up the interrupts, it will not allow flip flops between values.
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.TRANSMITTER)
  i2c.write(variables.I2C_BUS_ID, INTCAPB_REGISTER)
  i2c.stop(variables.I2C_BUS_ID)
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.RECEIVER)
  i2c.read(variables.I2C_BUS_ID, 1)
  i2c.stop(variables.I2C_BUS_ID)
end

return {
  start = start_solenoid_service
}
