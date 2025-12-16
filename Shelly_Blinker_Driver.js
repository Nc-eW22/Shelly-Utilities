// Shelly Blinker Driver
// Blinks 3 times, then stays ON.
let CONFIG = {
  id: 0,          // Switch ID (0 for most devices)
  speed: 500,     // Speed in ms
  blinks: 3       // Number of blinks
};

let timer = null;

function runSequence() {
  let count = 0;
  // Clear any existing timer so they don't overlap
  if (timer) Timer.clear(timer);
  
  timer = Timer.set(CONFIG.speed, true, function() {
    Shelly.call("Switch.Toggle", { id: CONFIG.id });
    count++;
    
    // Stop after the sequence (blinks * 2 toggles)
    if (count >= (CONFIG.blinks * 2)) {
      Timer.clear(timer);
      timer = null;
      // Force ON at the end
      Shelly.call("Switch.Set", { id: CONFIG.id, on: true });
      print("Done: Light is ON");
    }
  });
}

// Create the 'listener'
HTTPServer.registerEndpoint("blink", function(req, res) {
  res.send("OK"); // Reply to the i4 immediately
  runSequence();  // Start the show
});
