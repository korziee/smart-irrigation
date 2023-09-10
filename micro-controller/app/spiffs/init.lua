-- load variables, 'SSID' and 'PASSWORD' declared and initialize in there
local variables = require("variables")

function startup()
  if file.open("init.lua") == nil then
    print("init.lua deleted or renamed")
    return
  end

  -- LFS not yet configured, load image
  if #node.LFS.list() == 0 and file.open(variables.LUA_IMAGE_NAME) then
    print("LFS not yet configured, reloading")
    file.close(variables.LUA_IMAGE_NAME)
    node.LFS.reload(variables.LUA_IMAGE_NAME)
    return
  end

  local ota_server_ip_address = ""

  -- contents of ota_server_ip_address.txt file are set when config is loaded
  -- if dev mode is true and ip address is set, it will be stored in this file
  if file.open("ota_server_ip_address.txt", "r") then
    -- read 16 bytes to cater for entire ipv4 address (192.xxx.xxx.xxx)
    ota_server_ip_address = file.read(15)
    file.close()
  end

  print("OTA SERVER IP ADDRESS" .. ota_server_ip_address)

  node.LFS.init_lfs()
  node.LFS.ota_lfs_loader(
    ota_server_ip_address,
    variables.LUA_IMAGE_OTA_PATH,
    variables.LUA_IMAGE_NAME,
    8080,
    function()
      node.LFS.main()
    end
  )

  file.close("init.lua")
end

-- Define WiFi station event callbacks
wifi_connect_event = function(T)
  print("Connection to AP(" .. T.SSID .. ") established!")
  print("Waiting for IP address...")
  if disconnect_ct ~= nil then
    disconnect_ct = nil
  end
end

wifi_got_ip_event = function(T)
  -- Note: Having an IP address does not mean there is internet access!
  -- Internet connectivity can be determined with net.dns.resolve().
  print("Wifi connection is ready! IP address is: " .. T.IP)
  print("Startup will resume momentarily, you have 3 seconds to abort.")
  tmr.create():alarm(3000, tmr.ALARM_SINGLE, startup)
end

wifi_disconnect_event = function(T)
  if T.reason == wifi.eventmon.reason.ASSOC_LEAVE then
    --the station has disassociated from a previously connected AP
    return
  end
  -- total_tries: how many times the station will attempt to connect to the AP. Should consider AP reboot duration.
  local total_tries = 75
  print("\nWiFi connection to AP(" .. T.SSID .. ") has failed!")

  --There are many possible disconnect reasons, the following iterates through
  --the list and returns the string corresponding to the disconnect reason.
  for key, val in pairs(wifi.eventmon.reason) do
    if val == T.reason then
      print("Disconnect reason: " .. val .. "(" .. key .. ")")
      break
    end
  end

  if disconnect_ct == nil then
    disconnect_ct = 1
  else
    disconnect_ct = disconnect_ct + 1
  end
  if disconnect_ct < total_tries then
    print("Retrying connection...(attempt " .. (disconnect_ct + 1) .. " of " .. total_tries .. ")")
  else
    wifi.sta.disconnect()
    print("Aborting connection to AP!")
    disconnect_ct = nil
  end
end

-- Register WiFi Station event callbacks
wifi.eventmon.register(wifi.eventmon.STA_CONNECTED, wifi_connect_event)
wifi.eventmon.register(wifi.eventmon.STA_GOT_IP, wifi_got_ip_event)
wifi.eventmon.register(wifi.eventmon.STA_DISCONNECTED, wifi_disconnect_event)

print("Connecting to WiFi access point...")
wifi.setmode(wifi.STATION)
wifi.sta.config({ssid = variables.SSID, pwd = variables.PASSWORD})
wifi.sta.sleeptype(wifi.MODEM_SLEEP)
-- wifi.sta.connect() not necessary because config() uses auto-connect=true by default
