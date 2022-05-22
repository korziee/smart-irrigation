local my_string =
  'HTTP/1.1 200 OK\nserver: ecstatic-3.3.2\ncache-control: max-age=3600\nlast-modified: Sat, 21 May 2022 04:48:07 GMT\netag: W/"36803559-13636-2022-05-21T04:48:07.658Z"\ncontent-length: 13636\ncontent-type: application/octet-stream; charset=utf-8\nDate: Sat, 21 May 2022 04:48:14 GMT\nConnection: keep-alive\nKeep-Alive: timeout=5'

local header = my_string:lower()
local size = tonumber(header:match("\ncontent%-length: *(%d+)\r") or 0)
-- Matches: last-modified: Sat, 21 May 2022 04:48:07 gmt
local last_mod = header:match("last%-modified: %a+, %d+ %a+ %d+ %d+:%d+:%d+ gmt")

print("header", header)
print("size", size)
print("last_mod", last_mod)
