tmr.create():alarm(
  3000,
  tmr.ALARM_SINGLE,
  function()
    print("Kory - 1")
    i2c.setup(0, 2, 1, i2c.SLOW)
    local sla = 0x3c
    print("Kory - 2")
    local disp =
      u8g2.ssd1306_i2c_128x64_noname(
      0,
      sla,
      function()
        print("Inside callback ")
      end
    )
    print("Kory - 3")
    disp:clearBuffer()
    disp:setContrast(255)
    disp:setFont(u8g2.font_6x10_tf)
    disp:setFontRefHeightExtendedText()
    disp:setDrawColor(1)
    disp:setFontPosTop()
    disp:setFontDirection(0)
    disp:drawCircle(20, 25, 10)

    print("Kory - 4")
  end
)
