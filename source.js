function makePattern() {
  // Create a pattern, offscreen
  const patternCanvas = document.createElement("canvas");
  const patternContext = patternCanvas.getContext("2d");

  // Make some random values using the crypto API
  var array = new Uint8Array(2);
  window.crypto.getRandomValues(array);

  // Give the pattern a width and height of 50
  patternCanvas.width = array[0] / 2 > 15 ? array[0] / 2 : 10;
  console.log("Pattern width", patternCanvas.width);
  patternCanvas.height = array[1] / 2 > 5 ? array[1] / 2 : 10;
  console.log("Pattern height:", patternCanvas.height);

  // Give the pattern a background color and draw an arc
  patternContext.fillStyle = "#eee";
  patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
  patternContext.arc(0, 0, 25, 0, Math.cos(array[0]) * 2);
  patternContext.strokeStyle = color;
  patternContext.stroke();
  return patternCanvas;
}
function drawViz(randomness) {
  // Sample randomness: 14cc25f8c8b7ffa8b47a036030f2d7ad0e97775a61c12752ad900d58de995a7e
  const regex = /[a-z]/gi;
  const colorRegex = /[g-z]/gi;
  // Generate a number from the random value
  r = randomness.replaceAll(regex, "");
  // Generate a color from the random value
  color = "#" + randomness.replaceAll(colorRegex, "").slice(0,6);
  console.log("Color:", color);
  r = Math.log(r).toFixed(2);

  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    const pattern = ctx.createPattern(makePattern(color), "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.clearRect(45, 45, 60, 60);
    // ctx.strokeRect(50, 50, 50, 50);
  }
}

// A global variable so we can abort the polling
var cancelPoll = false;
var interval = 5;
// set a window timeout to update the pattern based
// on the value of data
function poll() {
  console.log("starting polling every " + interval + " seconds");
  const runPoll = function() {
    if (cancelPoll) {
      return;
    }
    fetch("https://drand.cloudflare.com/public/latest")
      .then(response => response.json())
      .then(data => {
        // Have the random data, run an update function
        console.log("Drand value: ", data.randomness);
        drawViz(data.randomness);
        setTimeout(runPoll, interval * 1000);
      });
  };
  return runPoll();
}

poll();
