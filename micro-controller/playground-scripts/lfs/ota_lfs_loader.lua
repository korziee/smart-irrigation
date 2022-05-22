--
-- NOTE: this was inherited from the lua examples in the nodemcu docs
--
-- If you have the LFS _init loaded then you invoke the provision by
-- executing LFS.HTTP_OTA('your server','directory','image name', 'port', 'on_start_program').  Note
-- that is unencrypted and unsigned. But the loader does validate that
-- the image file is a valid and complete LFS image before loading.
--
-- NOTE: on_start_program is a callback provided by the calling function here. It's used because if we start loadin
-- in all the modules and trying to reload the LFS image the MCU runs out of memory. So instead, we wait until
-- we've made sure to pull the latest LFS image, reload, and then run again.
-- TODO: this isn't really efficient as it involves connecting to wifi twice
--

local host, dir, image, port, on_finished = ...

local doRequest, firstRec, subsRec, finalise
local n, total, size = 0, 0

doRequest = function(socket, hostIP) -- luacheck: no unused
  if hostIP then
    -- Using net over tls here, no reason for tls
    local con = net.createConnection()
    -- Note that the current dev version can only accept uncompressed LFS images
    con:on(
      "connection",
      function(sck)
        local request =
          table.concat(
          {
            "GET " .. dir .. image .. " HTTP/1.1",
            "User-Agent: ESP8266 app (linux-gnu)",
            "Accept: application/octet-stream",
            "Accept-Encoding: identity",
            "Host: " .. host,
            "Connection: close",
            "",
            ""
          },
          "\r\n"
        )
        -- print(request)
        sck:send(request)
        sck:on("receive", firstRec)
      end
    )
    con:connect(port, hostIP)
  end
end

firstRec = function(sck, rec)
  -- Process the headers; only interested in content length
  local i = rec:find("\r\n\r\n", 1, true) or 1
  local header = rec:sub(1, i + 1):lower()
  size = tonumber(header:match("\ncontent%-length: *(%d+)\r") or 0)
  print(rec:sub(1, i + 1))

  if size > 0 then
    local last_mod = header:match("last%-modified: %a+, %d+ %a+ %d+ %d+:%d+:%d+ gmt")
    local current_last_mod = file.getcontents("last_mod.txt")

    if current_last_mod == last_mod then
      print("Last modified is same, skipping LFS reload")
      sck:on("receive", nil)
      sck:close()
      on_finished()
      return
    else
      print("Last modified is different, storing and continuing")
      file.putcontents("last_mod.txt", last_mod)
    end

    sck:on("receive", subsRec)
    file.open(image, "w")
    subsRec(sck, rec:sub(i + 4))
  else
    sck:on("receive", nil)
    sck:close()
    print("GET failed")
    on_finished()
  end
end

subsRec = function(sck, rec)
  total, n = total + #rec, n + 1
  if n % 4 == 1 then
    sck:hold()
    node.task.post(
      0,
      function()
        sck:unhold()
      end
    )
  end
  uart.write(0, ("%u of %u, "):format(total, size))
  file.write(rec)
  if total == size then
    finalise(sck)
  end
end

finalise = function(sck)
  file.close()
  sck:on("receive", nil)
  sck:close()
  local s = file.stat(image)
  if (s and size == s.size) then
    collectgarbage()
    collectgarbage()
    print("Reloading LFS image")
    node.LFS.reload(image)
  else
    print "Invalid save of image file"
    on_finished()
  end
end

net.dns.resolve(host, doRequest)
