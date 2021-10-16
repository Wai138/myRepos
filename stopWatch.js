var stopWatch_hh = 0;
var stopWatch_mm = 0;
var stopWatch_ss = 0;

var stopWatch;

startStopWatch ();

function startStopWatch () {
    stopStopWatch();
    stopWatch = setInterval(stopWatchFcn, 1000);
}

function stopStopWatch() {
    clearInterval(stopWatch);
}

function resetStopWatch() {
    stopStopWatch ();
    stopWatch_hh = 0;
    stopWatch_mm = 0;
    stopWatch_ss = 0;
    displayStopWatch ();
}

function stopWatchFcn() {
    if (stopWatch_ss < 59) stopWatch_ss += 1
        else {
            stopWatch_ss = 0;
            if (stopWatch_mm < 59) stopWatch_mm += 1
                else {
                    stopWatch_mm = 0;
                    stopWatch_hh += 1
                }
        }
    displayStopWatch ();
}

function displayStopWatch () {
    document.getElementById("stopWatch").innerHTML=
        ("0" + stopWatch_hh).substr(-2) + ":" +
        ("0" + stopWatch_mm).substr(-2) + ":" +
        ("0" + stopWatch_ss).substr(-2);
}

