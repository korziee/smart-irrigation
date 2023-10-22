local shared = require("shared")

-- Returns:
-- {
--   "data": {
--       "controllerHeartbeat": {
--           "config": {
--               "id": "c71be267-198c-48e3-8fe1-d0af93827e66",
--               "soilSensorUpdateIntervalMs": 5000,
--               "controllerBatteryVoltageUpdateIntervalMs": 60000,
--               "devMode": {
--                 "enabled": true
--                 "ipAddress": "192.168.1.1"
--               }
--           }
--       }
--   }
-- }

return function(controller_id, callback)
  local mutation =
    '{"query":"mutation {controllerHeartbeat(controllerHeartbeatInput: { id: \\"' ..
    controller_id ..
      '\\"}) {  config {    id, soilSensorUpdateIntervalMs, controllerBatteryVoltageUpdateIntervalMs, devMode { enabled, ipAddress }  }}}","variables":{}}'

  http.post(
    shared.graphql_endpoint,
    "Content-Type: application/json\r\n",
    mutation,
    function(code, data)
      if (code < 0) then
        print("HTTP request failed")
        callback(nil)
      else
        print(code, data)
        local json = sjson.decode(data)
        callback(json.data.controllerHeartbeat.config)
      end
    end
  )
end
