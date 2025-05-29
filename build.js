const chokidar = require("chokidar");
const { exec } = require("child_process");
const path = require("path");

// Run commands in sequence
const runCommands = () => {
  console.log("Building styles...");

  // Run Tailwind CSS build
  exec(
    "npx tailwindcss -i src/styles.css -o src/styles.processed.css",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running Tailwind CSS build: ${error}`);
        return;
      }
      console.log("Tailwind CSS build completed");

      // Run ng build after Tailwind
      exec("ng build", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error running ng build: ${error}`);
          return;
        }
        console.log("Angular build completed");
      });
    }
  );
};

// Watch for changes in CSS files
const watcher = chokidar.watch(["src/**/*.css", "src/**/*.scss"], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
});

// Run initial build
runCommands();

// Watch for changes
watcher
  .on("change", (path) => {
    console.log(`File ${path} has been changed`);
    runCommands();
  })
  .on("error", (error) => console.error(`Watcher error: ${error}`));
