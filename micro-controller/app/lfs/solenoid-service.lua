local variables = require("variables")
local mcp23017 = require("mcp23017")

-- 0100000 is the default hardware address if A0,A1,A2 are biased to ground
local MCP23017_ADDRESS = 0x20
local GPPUB_REGISTER = 0x0d
local GPINTENB_REGISTER = 0x05
local INTCAPB_REGISTER = 0x11

local mcp_instance
local previous_gpb_state

local inputs = {}
local outputs = {}
local reverse_table = {}

for key, solenoid in pairs(variables.SOLENOIDS) do
  table.insert(outputs, solenoid.control_pin)

  for nested_key, value in pairs(solenoid.switch) do
    table.insert(inputs, value)

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

  for pin, values in pairs(reverse_table) do
    if bit.isset(diff, pin) then
      local solenoid_control_pin = variables.SOLENOIDS[values.solenoid].control_pin
      print("Switch state has changed")
      print(string.format("%4s%-12s= %s", "", "input pin", pin))
      print(string.format("%4s%-12s= %s", "", "solenoid", values.solenoid))
      print(string.format("%4s%-12s= %s", "", "output pin", solenoid_control_pin))

      if bit.isclear(current_gbp_state, pin) then
        if values.action == "forced_on" then
          print(string.format("%4s%-12s= %s (%s)", "", "operation", values.action, "high"))
          mcp_instance:setPin(mcp_instance.GPA, solenoid_control_pin, mcp_instance.HIGH)
        elseif values.action == "forced_off" then
          print(string.format("%4s%-12s= %s (%s)", "", "operation", values.action, "low"))
          mcp_instance:setPin(mcp_instance.GPA, solenoid_control_pin, mcp_instance.LOW)
        end
      else
        print(string.format("%4s%-12s= %s (%s)", "", "operation", "auto", "low"))
        mcp_instance:setPin(mcp_instance.GPA, solenoid_control_pin, mcp_instance.LOW)
      end
    end
  end
end

local function start_solenoid_service()
  print("Starting solenoid service")

  mcp_instance = mcp23017(MCP23017_ADDRESS, variables.I2C_BUS_ID)

  print("Setting up MCP23017 I/O")

  local output_byte = 255
  local input_byte = 0

  -- Outputs
  for _, pin in ipairs(outputs) do
    -- When setting outputs, the register is set to 0. 1 is high otherwise.
    -- So we are setting those bits in output byte to be 0
    output_byte = bit.clear(output_byte, pin)
  end

  -- Inputs
  for _, pin in ipairs(inputs) do
    input_byte = bit.set(input_byte, pin)
  end

  -- clean up globals after use
  inputs = nil
  outputs = nil

  print("INPUTS", input_byte)
  print("OUTPUTS", output_byte)

  -- Setup outputs on GP-A side
  mcp_instance:writeIODIR(mcp_instance.GPA, output_byte)
  -- Reset GP-A output state
  mcp_instance:writeGPIO(mcp_instance.GPA, 0x00)

  -- Setup inputs on GP-B side
  mcp_instance:writeIODIR(mcp_instance.GPB, input_byte)

  -- Sets the GPB side of the IC to have their inputs connected to a pull up resistor
  -- This means the input is pulled to 3.3v when its left floating
  -- So any checks for connection will be relative to ground, i.e. the pin outputs 0/false.
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.TRANSMITTER)
  i2c.write(variables.I2C_BUS_ID, GPPUB_REGISTER)
  i2c.write(variables.I2C_BUS_ID, input_byte)
  i2c.stop(variables.I2C_BUS_ID)

  -- Enable interrupts on INTB for inputs on GPB side
  i2c.start(variables.I2C_BUS_ID)
  i2c.address(variables.I2C_BUS_ID, MCP23017_ADDRESS, i2c.TRANSMITTER)
  i2c.write(variables.I2C_BUS_ID, GPINTENB_REGISTER)
  i2c.write(variables.I2C_BUS_ID, input_byte)
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
  -- todo (to support the physical switch to change solenoid)
  -- fetch current state of the GPB register
  -- if forced off, respond with { success: false, reason: "Solenoid forced off" }
  -- if forced on, respond with { success: false, reason: "Solenoid already forced-on" }
  -- otherwise, turn on solenoid, respond with { sucess: true}
  local solenoid = variables.SOLENOIDS[solenoid_id]

  if not solenoid then
    print("solenoid not found")
    return {
      success = false,
      message = "solenoid not found"
    }
  end

  if open then
    print("turning solenoid on")
    mcp_instance:setPin(mcp_instance.GPA, solenoid.control_pin, mcp_instance.HIGH)
  else
    print("turning solenoid off")
    mcp_instance:setPin(mcp_instance.GPA, solenoid.control_pin, mcp_instance.LOW)
  end

  return {
    success = true
  }
end

return {
  start = start_solenoid_service,
  handle_remote_solenoid_instruction = handle_remote_solenoid_instruction
}
