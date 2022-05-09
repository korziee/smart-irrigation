return {
  SSID = "your SSID",
  PASSWORD = "the network password",
  SERVER_IP = "192.168.1.5",
  CONTROLLER_ID = "6068d395-a94a-4a1b-8977-519819475e65",
  -- IDs of the sensors associated with the zone that has this controller in it
  SENSOR_IDS = {
    ["09a51cc0-a543-41f2-af84-75324bb5d887"] = 0x28,
    ["3d95711a-676e-4138-ac26-382fad73ad72"] = 0x29
  },
  -- 2 refers to D2 on the NodeMCU board
  I2C_SDA = 2,
  -- 1 refers to D1 on the NodeMCU board
  I2C_SCL = 1
}
