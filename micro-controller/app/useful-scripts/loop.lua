local values = {
  SOLENOIDS = {
    ["85734b02-7c54-424a-9a4c-ebb00a696855"] = {
      control_pin = 6,
      switch = {
        forced_on = 0,
        forced_off = 1
      }
    },
    ["a853bdc6-1301-49f9-ab2f-453bb2a3771b"] = {
      control_pin = 7,
      switch = {
        forced_on = 2,
        forced_off = 3
      }
    }
  }
}

local reversed_example = {
  [0] = {
    ["solenoid"] = "a853bdc6-1301-49f9-ab2f-453bb2a3771b",
    ["action"] = "forced_off"
  }
}

local inputs = {}
local outputs = {}
local reverse_table = {}

for key, solenoid in pairs(values.SOLENOIDS) do
  table.insert(outputs, solenoid.control_pin)

  for nested_key, value in pairs(solenoid.switch) do
    table.insert(inputs, value)

    reverse_table[value] = {
      ["solenoid"] = key,
      ["action"] = nested_key
    }
  end
end

for pin, value in pairs(reverse_table) do
  print(pin, value.solenoid, value.action)
end
