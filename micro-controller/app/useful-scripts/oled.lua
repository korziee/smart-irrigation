local sla = 0x78
print("before")
local disp =
  u8g2.ssd1306_i2c_128x64_noname(
  0,
  sla,
  function()
    print("Inside callback ")
  end
)
disp:clearBuffer()
disp:setContrast(255)
disp:setFont(u8g2.font_6x10_tf)
disp:setFontRefHeightExtendedText()
disp:setDrawColor(1)
disp:setFontPosTop()
disp:setFontDirection(0)
disp:drawCircle(20, 25, 10)

print("here")
