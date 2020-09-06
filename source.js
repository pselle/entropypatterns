// TODO draw the visualization
function drawViz(randomness) {
  // Sample randomness: 14cc25f8c8b7ffa8b47a036030f2d7ad0e97775a61c12752ad900d58de995a7e
  // Ideas: Based on the numbers present in the value
  // Based on the number of vowels in the value
  const regex = /[a-z]/gi;
  r = randomness.replaceAll(regex, '');
  r = Number(r)
  r = Math.log(r).toFixed(2)
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    ctx.fillRect(25, 25, 100, r);
    console.log(r)
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);
  }
}

// A global variable so we can abort the polling
var cancelPoll = false
// set a window timeout to update the pattern based
// on the value of data
function poll() {
  console.log('starting poll')
  const runPoll = function() {
    if (cancelPoll) {
      return
    }
    fetch("https://drand.cloudflare.com/public/latest")
    .then(response => response.json())
    .then(data => {
      // Have the random data, run an update function
      console.log(data.randomness)
      drawViz(data.randomness)
      setTimeout(runPoll, 2*1000)
    });
  }
  return runPoll()
}

poll()
