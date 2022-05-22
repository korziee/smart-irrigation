-- given an ASCII decimal (0-255), converts to a binary string
local function convert_byte_to_binary(byte)
  local t = {}
  for i = 7, 0, -1 do
    t[#t + 1] = math.floor(byte / 2 ^ i)
    byte = byte % 2 ^ i
  end
  return table.concat(t)
end

print(convert_byte_to_binary(0x50))
