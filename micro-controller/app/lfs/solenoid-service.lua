local variables = require("variables")
local mcp23017 = require("mcp23017")

-- 0100000 is the default hardware address if A0,A1,A2 are biased to ground
local MCP23017_ADDRESS = 0x20
local GPPUB_REGISTER = 0x0d
local GPINTENB_REGISTER = 0x05
local INTCAPB_REGISTER = 0x11

local mcp_instance
local previous_gpb_state

-- TODO: is there a better way to do this?
local reverse_table = {}
for key, solenoid in pairs(variables.SOLENOIDS) do
  for nested_key, value in pairs(solenoid.switch) do
    reverse_table[value] = {
      ["solenoid"] = key,
      ["action"] = nested_key
    }
  end
end

local function handle_switch_interrupt()
  print("Interrupt triggered!")
  local current_gbp_state = mcp_instance:readGPIO(mcp_instance.GPB)
  local diff = bit.bxor(previous_gpb_state, current_gbp_state)
  previous_gpb_state = current_gbp_state
  print("Current state", current_gbp_state)
  print("GBP diff", diff)

  -- TODO: test if this works as expected
  for pin, values in pairs(reverse_table) do
    if bit.isset(diff, pin) and bit.isclear(current_gbp_state, pin) then
      print("Pin has changed state")
      print("     pin: ", pin)
      print("     operation: ", values.action)
      print("     solenoid: ", values.solenoid)
      -- based on operation, update solenoid and ping remote server
      break
    end
  end
end

local function start_solenoid_service()
  print("Starting solenoid service")

  mcp_instance = mcp23017(MCP23017_ADDRESS, variables.I2C_BUS_ID)

  -- GP-A will control the solenoids (through the TIP120s)
  -- sets the entire GPA register to be outputs.
  mcp_instance:writeIODIR(mcp_instance.GPA, 0x00)
  -- sets pins 6 and 7 to be high
  mcp_instance:writeGPIO(mcp_instance.GPA, 0xc0 --[[ 11000000 ]])

  -- GP-B will listen for the switch inputs that decides for Auto/Off/On
  -- sets the entire GPB register to be inputs.
  mcp_instance:writeIODIR(mcp_instance.GPB, 0xff)

  -- Sets the GPB side of the IC to have their inputs connected to a pull up resistor
  -- This means the input is pulled to 3.3v when its left floating
  -- So any checks for connection will be relative to ground, i.e. the pin outputs 0/false.
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.TRANSMITTER)
  i2c.write(variables.I2C_BUS_ID, GPPUB_REGISTER)
  i2c.write(variables.I2C_BUS_ID, 0xff)
  i2c.stop(variables.I2C_BUS_ID)

  -- TODO: make this programmatic
  -- Enable interrupts on INTB (pin 19) for GPB-0-3
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.TRANSMITTER)
  i2c.write(variables.I2C_BUS_ID, GPINTENB_REGISTER)
  i2c.write(variables.I2C_BUS_ID, 0x0f)
  i2c.stop(variables.I2C_BUS_ID)

  -- Setting pin 5 to be input, ready for interrupt
  gpio.mode(variables.SOLENOID_INTERRUPT_PIN, gpio.INT)

  -- Settup an interrupt on pin D4 on the falling edge. This is because the MCP23017 goes from high to low
  -- when an interrupt is triggered. The interrupt is cleared when the GPIO register is read. At which point
  -- the interrupt goes from 0 to 1.
  gpio.trig(variables.SOLENOID_INTERRUPT_PIN, "down", handle_switch_interrupt)

  -- Read the INTCAPB to clear its current state, this is required as we are using interrupt-on-change for the interrupts
  -- and if we don't read the current state after setting up the interrupts, it will not allow flip flops between values.
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.TRANSMITTER)
  i2c.write(variables.I2C_BUS_ID, INTCAPB_REGISTER)
  i2c.stop(variables.I2C_BUS_ID)
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.RECEIVER)
  print("INTCAPB REG: ", string.byte(i2c.read(variables.I2C_BUS_ID, 1)))
  i2c.stop(variables.I2C_BUS_ID)

  previous_gpb_state = mcp_instance:readGPIO(mcp_instance.GPB)
  print("GPB state at boot: ", previous_gpb_state)
end

local function handle_remote_solenoid_instruction(solenoid_id, open)
  print("solenoid_state_change_handler called", solenoid_id, open)
  -- fetch current state of the GPB register
  -- if forced off, respond with { success: false, reason: "Solenoid forced off" }
  -- if forced on, respond with { success: false, reason: "Solenoid already forced-on" }
  -- otherwise, turn on solenoid, respond with { sucess: true}
  local solenoid_pin = variables.SOLENOIDS[solenoid_id]

  -- mcp:setPin(mcp.GPA, solenoid_pin, state and mcp.HIGH or mcp.LOW)
end

return {
  start = start_solenoid_service,
  handle_remote_solenoid_instruction = handle_remote_solenoid_instruction
}
