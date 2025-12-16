/**
 * 💡 SHELLY UTILITY: Remote Blinker Driver
 * ========================================
 * Role:     Waits for a command, blinks the light, then forces it ON.
 * Usage:    Install this on the Light Relay (e.g., Shelly Plus 1).
 * Trigger:  Call this URL from your Shelly i4 / Motion Sensor:
 * * 👉 http://[TARGET_IP]/script/[SCRIPT_ID]/blink
 * * Example:  http://192.168.33.1/script/1/blink
 */

let CONFIG = {
  id: 0,          // Switch ID (0 for most devices)
  speed: 500,     // Blink speed in ms
  blinks: 3       // Number of blinks before staying ON
};

// --- LOGIC ---
let timer = null;

function runSequence() {
  let count = 0;
  if (timer) Timer.clear(timer);
  
  print("💡 Sequence Started: Blinking " + CONFIG.blinks + " times...");
  
  timer = Timer.set(CONFIG.speed, true, function() {
    Shelly.call("Switch.Toggle", { id: CONFIG.id });
    count++;
    
    // Stop after (blinks * 2) toggles
    if (count >= (CONFIG.blinks * 2)) {
      Timer.clear(timer);
      timer = null;
      // Force ON at the end
      Shelly.call("Switch.Set", { id: CONFIG.id, on: true });
      print("✅ Sequence Complete: Light is ON");
    }
  });
}

// --- ENDPOINT ---
HTTPServer.registerEndpoint("blink", function(req, res) {
  res.send("OK"); // Acknowledge instantly
  runSequence();
});

// --- SELF-DOCUMENTATION ---
// Prints the exact URL to the console when started
Shelly.call("Wifi.GetStatus", {}, function(res) {
  let ip = (res && res.sta_ip) ? res.sta_ip : "[DEVICE_IP]";
  let id = Shelly.getCurrentScriptId();
  print("---------------------------------------------------");
  print("✅ Blinker Driver Online.");
  print("📋 To trigger, set your Action URL to:");
  print("   http://" + ip + "/script/" + id + "/blink");
  print("---------------------------------------------------");
});
