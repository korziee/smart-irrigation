local solenoid_service = require("solenoid-service")

local handlers

do
  local function default_handler(request_data)
    print("I am the default handler" .. request_data)
  end

  local function test_handler(request_data)
    print("You have reached the test handler")

    local json = sjson.decode(request_data)

    for k, v in pairs(json) do
      print(k, v)
    end
  end

  local function make_post(request_data)
    -- Note: HTTPS doesn't seem to work, could be a memory issue. No biggie as we'll only be using http
    http.post(
      -- Post testing service, dump can be seen here: https://ptsv2.com/t/6r6ef-1649629712/d/4647935857917952
      "http://ptsv2.com/t/6r6ef-1649629712/post",
      "Content-Type: application/json\r\n",
      request_data,
      function(code, data)
        if (code < 0) then
          print("HTTP request failed")
        else
          print(code, data)
        end
      end
    )
  end

  local function solenoid_state_change_handler(request_data)
    -- { solenoidId: string, open: boolean }
    local json = sjson.decode(request_data)

    -- TODO: test if this works
    solenoid_service.handle_remote_solenoid_instruction(json.solenoidId, json.open)
  end

  handlers = {
    default = default_handler,
    test = test_handler,
    post = make_post,
    solenoid_state_change_handler = solenoid_state_change_handler
  }
end

return handlers
