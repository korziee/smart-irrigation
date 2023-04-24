the lfs-files.lst file is used when you build LFS using docker

docker run --rm -ti -v /Users/koryporter/nodemcu-firmware:/opt/nodemcu-firmware -v /Users/koryporter/dev/smart-irrigation/micro-controller/app:/opt/lua marcelstoer/nodemcu-build lfs-image lfs-files.lst

it is relevant to the root folder, i.e. in this instance it is app.

# How is LFS working?

1. There is a script at the root of this repo called `start:micro-controller`
   - This is running a http-server, and a node script
   - The http-server is a pretty basic file server used by the micro-controller to get the LFS image
   - The node script watches the micro-controller/app folder for changes
     - on change, this script re-compiles the LFS image using the nodemcu docker image
2. Within the LFS image there is a file called `ota_lfs_loader.lua` which on restart, makes a GET request to the http-server and gets the LFS image
   - When it receives the image, it checks to see the last-modified header is the same as the previous request
     - if so, it continues the execution
     - otherwise, it writes the LFS image to disk, and then reloads the image (causing the MCU to restart). Upon restart, the whole process starts again, but this time it does not reload the image, instead it continues execution

## To improve

Right now, it takes ~32 seconds to reload an LFS image because it needs to restart twice and hence it needs to re-connect to wifi twice (restart -> wifi connect, pull new image, restart LFS, wifi connect, pull image, continue execution).

This could be improved by a polling solution, potentially using the `If-Modified-Since` header to only get a fresh LFS image, and in that case, it will reload the LFS image and then restart.
The tricky part with that will be around how memory is managed, because right now, when the main.lua file is loaded and the services are started, the heap is reduced, and there is not enough memory
available to reload the LFS image. Which is why there is currently a callback from the `ota_lfs_loader.lua` file to begin the program only when we are sure the LFS image does not need to be reloaded.

# FAQs

## How to modify config (variables.lua)

Use the `nodemcu-tool` cli to pull the current config, make the changes, upload new file, restart micro-controller

1. `yarn nodemcu-tool download variables.lua`
2. ... make changes ...
3. `yarn nodemcu-tool upload variables.lua`
4. ... restart device ...
