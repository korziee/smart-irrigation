backend_meta = require "lc-i2c4bit"
lc_meta = require "liquidcrystal"


-- create display object
lc = lc_meta(backend_meta{sda=1, scl=2, busid=0x27}, false, true, 20)
backend_meta = nil
lc_meta = nil
-- define custom characters
lc:customChar(0, {0,14,31,31,4,4,5,2})
lc:customChar(1, {4,6,5,5,4,12,28,8})
lc:customChar(2, {14,31,17,17,17,17,17,31})
lc:customChar(3, {14,31,17,17,17,17,31,31})
lc:customChar(4, {14,31,17,17,31,31,31,31})
lc:customChar(5, {14,31,31,31,31,31,31,31})
lc:clear() -- clear display
lc:blink(true) -- enable cursor blinking
lc:home() -- reset cursor position
lc:write("hello", " ", "world") -- write string
lc:cursorMove(1, 2) -- move cursor to second line
lc:write("umbrella", 0, 32, "note", 1) -- mix text strings and characters

-- tmr.delay(2000 * 1000)

-- lc:display(false)

-- tmr.delay(2000 * 1000)

-- lc:display(true)


-- copied from the internets: https://gist.github.com/marcelstoer/59563e791effa4acb65f
function debounce (func)
  local last = 0
  local delay = 50000 -- 50ms * 1000 as tmr.now() has μs resolution

  return function (...)
      local now = tmr.now()
      local delta = now - last
      if delta < 0 then delta = delta + 2147483647 end; -- proposed because of delta rolling over, https://github.com/hackhitchin/esp8266-co-uk/issues/2
      if delta < delay then return end;

      last = now
      return func(...)
  end
end


-- use pin 1 as the input pulse width counter
local pin, counter = 4, 0
gpio.mode(pin,gpio.INT)
local function pin1cb(level, when, count)
  print(level, when, count)
  counter = counter + 1
  lc:home()
  lc:write("Count: ", tostring(counter))
  -- gpio.trig(pin, level == gpio.HIGH  and "down" or "up")
end
gpio.trig(pin, "down", debounce(pin1cb))
