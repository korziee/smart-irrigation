
local my_plants = {
  sunflower = "yellow",
  agapantha = "green",
  grass = "greenish",
  ["elephant ears"] = "green",
}


local my_plants_arr = {
  {"sunflower", "yellow"},
  {"agapantha", "green"},
  {"grass", "greenish"},
  {"elephant ears", "green"},
}

function get_my_plants(amount)
  local plants = {}

  for i=1, amount, 1 do
    table.insert(plants, {
      plant = my_plants_arr[i][1],
      colour = my_plants_arr[i][2]
    });
  end

  return plants
end

for key, value in ipairs(get_my_plants(3)) do
  print(key, value.plant, value.colour)
end