return {
  SSID = "your SSID",
  PASSWORD = "the network password",
  SERVER_IP = "192.168.1.5",
  CONTROLLER_ID = "6068d395-a94a-4a1b-8977-519819475e65",
  -- Path to the LUA image on host machine
  LUA_IMAGE_OTA_PATH = "/micro-controller/app/",
  -- Name of the LUA image on host machine
  LUA_IMAGE_NAME = "LFS_float_smart_irrigation.img",
  -- IDs of the sensors associated with the zone that has this controller in it
  SENSOR_IDS = {
    ["09a51cc0-a543-41f2-af84-75324bb5d887"] = 0x28,
    ["3d95711a-676e-4138-ac26-382fad73ad72"] = 0x29
  },
  -- Solenoid ID to MCP23017 mapping
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
  },
  I2C_BUS_ID = 0,
  I2C_SDA = 2,
  I2C_SCL = 1,
  SOLENOID_INTERRUPT_PIN = 5
}
