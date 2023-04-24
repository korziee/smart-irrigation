local httpserver = require("httpserver")
local handlers = require("handlers")

local function get_handler_for_route(route)
  if route == "/test" then
    return handlers.test
  end

  if route == "/post" then
    return handlers.post
  end

  if route == "/update-solenoid" then
    return handlers.solenoid_state_change_handler
  end

  return handlers.default
end

local function on_request(req, res)
  print("+R", req.method, req.url, node.heap())

  local handler = get_handler_for_route(req.url)

  local data = ""

  req.ondata = function(self, chunk) -- luacheck: ignore
    print("+B", chunk and #chunk, node.heap())

    -- combine all chunks of data
    if chunk then
      data = data .. chunk
    end

    if not chunk then
      local handler_response = handler(data)
      local response = {}

      if handler_response then
        response = handler_response
      else
        response = {
          message = "Hello world from my custom http server, your message was: " .. data
        }
      end

      local response_json_string = sjson.encode(response)

      res:send("HTTP/1.1 200 OK" .. "\r\n")
      res:send("Content-Type: application/json" .. "\r\n")
      -- set content length (we could use Transfer-Encoding: chunked here, but this feels simpler as we know the response size upfront)
      res:send("Content-Length: " .. string.len(response_json_string) .. "\r\n")
      -- end headers (\r\n on empty line is term signal for headers)
      res:send("\r\n")

      -- send data
      res:send(response_json_string)
      res:finish()
    end
  end
end

local function start_server()
  httpserver.createServer(80, on_request)
end

return {
  start = start_server
}
