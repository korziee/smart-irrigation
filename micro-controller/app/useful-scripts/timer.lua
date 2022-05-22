gpio.mode(4, gpio.INPUT, gpio.FLOAT)

mytimer = tmr.create()
mytimer:register(250, tmr.ALARM_AUTO, function() print("Pin (4) reading: ", gpio.read(4)) end)
mytimer:start()