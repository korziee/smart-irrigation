local httpserver = require("httpserver")
local handlers = require("handlers")

local function get_handler_for_route(route)
  if route == "/test" then
    return handlers.test
  end

  if route == "/post" then
    return handlers.post
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
      handler(data)
      -- reply
      local response = "Hello world from my custom http server, your message was: " .. data

      -- send 200 OK
      res:send("HTTP/1.1 200 OK" .. "\r\n")
      -- set content length (we could use Transfer-Encoding: chunked here, but this feels simpler as we know the response size upfront)
      res:send("Content-Length: " .. string.len(response) .. "\r\n")
      -- end headers
      res:send("\r\n")

      -- send data
      res:send(response)
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
