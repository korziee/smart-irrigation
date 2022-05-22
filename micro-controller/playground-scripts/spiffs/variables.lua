return {
  SSID = "Billion_8700VAX_5GHz",
  PASSWORD = "0430911096",
  SERVER_IP = "192.168.1.201",
  LUA_IMAGE_OTA_PATH = "/micro-controller/playground-scripts/",
  LUA_IMAGE_NAME = "LFS_float_smart_irrigation.img",
  CONTROLLER_ID = "6068d395-a94a-4a1b-8977-519819475e65",
  SENSOR_IDS = {
    ["09a51cc0-a543-41f2-af84-75324bb5d887"] = 0x28,
    ["3d95711a-676e-4138-ac26-382fad73ad72"] = 0x29
  },
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
