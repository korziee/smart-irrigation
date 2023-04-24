import { watch } from "fs";
import { exec } from "node:child_process";

const scripts = `${__dirname}/micro-controller/app`;

let lastChange = 0;

async function watcher() {
  console.log("Watching", scripts);
  watch(scripts, { recursive: true }, (event, file) => {
    // Skip LFS image changes
    if (file === "LFS_float_smart_irrigation.img") {
      return;
    }

    // Skip test files
    if (file.includes("useful-scripts")) {
      return;
    }

    // Skip spiffs files, these are uploaded manually
    if (file.includes("spiffs")) {
      return;
    }

    const now = performance.now();

    // Debounce the change, something in VSCode makes the lua file save twice (probs the extensions)
    if (now - lastChange < 500) {
      return;
    }

    // set last change so we can check again in the next debounce
    lastChange = now;

    console.log("Starting LFS Build, triggered by: ", file);

    // build LFS image using docker
    exec(
      "docker run --rm -e IMAGE_NAME=smart_irrigation -v /Users/koryporter/nodemcu-firmware:/opt/nodemcu-firmware -v /Users/koryporter/dev-personal/smart-irrigation/micro-controller/app:/opt/lua marcelstoer/nodemcu-build lfs-image lfs-files.lst",
      {
        encoding: "utf-8",
      },
      (err, stdout, stderr) => {
        if (err || stderr) {
          const error = err ?? stderr;
          if (
            !error
              .toString()
              .includes(
                `The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested`
              )
          ) {
            console.error("Something went wrong when creating LFS image");
            console.error(err, stderr);
            return;
          }
        }
        console.log(stdout);
        console.log("Finished");
      }
    );
  });
}

try {
  watcher();
} catch (e) {
  console.error("Error running the micro-controller watch script");
}
