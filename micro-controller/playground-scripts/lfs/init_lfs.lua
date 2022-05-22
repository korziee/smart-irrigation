--
-- File: _init.lua
--[[

  This is a template for the LFS equivalent of the SPIFFS init.lua.

  It is a good idea to such an _init.lua module to your LFS and do most of the LFS
  module related initialisaion in this. This example uses standard Lua features to
  simplify the LFS API.
---------------------------------------------------------------------------------]]
local lfsindex = node.LFS and node.LFS.get or node.flashindex
local G = _ENV or getfenv()
local lfs_t = node.LFS
G.LFS = lfs_t

--[[-------------------------------------------------------------------------------
  The second section adds the LFS to the require searchlist, so that you can
  require a Lua module 'jean' in the LFS by simply doing require "jean". However
  note that this is at the search entry following the FS searcher, so if you also
  have jean.lc or jean.lua in SPIFFS, then this SPIFFS version will get loaded into
  RAM instead of using. (Useful, for development).

  See docs/en/lfs.md and the 'loaders' array in app/lua/loadlib.c for more details.

---------------------------------------------------------------------------------]]
package.loaders[3] = function(module) -- loader_flash
  return lfs_t[module]
end

--[[----------------------------------------------------------------------------
  These replace the builtins loadfile & dofile with ones which preferentially
  load from the filesystem and fall back to LFS.  Flipping the search order
  is an exercise left to the reader.-
------------------------------------------------------------------------------]]
local lf = loadfile
G.loadfile = function(n)
  if file.exists(n) then
    return lf(n)
  end
  local mod = n:match("(.*)%.l[uc]a?$")
  local fn = mod and lfsindex(mod)
  return (fn or error(("Cannot find '%s' in FS or LFS"):format(n))) and fn
end

-- Lua's dofile (luaB_dofile) reaches directly for luaL_loadfile; shim instead
G.dofile = function(n)
  return assert(loadfile(n))()
end
