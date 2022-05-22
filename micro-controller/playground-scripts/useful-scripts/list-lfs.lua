do
  for _, module in ipairs(node.LFS.list()) do
    print("Module", module)
  end
end

do
  for _, module in pairs(file.list()) do
    print("Module", _, module)
  end
end

file.remove("init-old.lua")
file.rename("init.lua", "init-old.lua")


file.put


print(file.getcontents('last_mo.txt'))

file.putcontents('last_mod.txt', last_mod)