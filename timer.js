var voiceList       = document.querySelector('#voiceList');
var btnGO           = document.querySelector('#btnGO');
/*
var qs = (new URL(document.location)).searchParams;
var timer_exer_h   = parseInt(qs.get('th'));
var timer_exer_m   = parseInt(qs.get('tm'));
var timer_exer_s   = parseInt(qs.get('ts'));
var timer_rest_h    = parseInt(qs.get('rh'));
var timer_rest_m    = parseInt(qs.get('rm'));
var timer_rest_s    = parseInt(qs.get('rs'));
var exer_name        = qs.get('exer');
var exer_iter_remain   = parseInt(qs.get('exer_iter'));
*/


var Routine = JSON.parse(sessionStorage.getItem("Routine"));
var Sets = Routine.rSets;

var timer_exer_h, timer_exer_m, timer_exer_s;
var timer_rest_h, timer_rest_m, timer_rest_s;
var exer_name, exer_iter_remain;
//exer_name           = Sets[set_idx].Exercises[exer_idx].exer_name;
//exer_iter_remain    = Sets[set_idx].Exercises[exer_idx].exer_iter;

var exer_idx            = 0;
var set_idx             = 0;
var set_remain          = Sets.length;
var set_name            = Sets[set_idx].set_name;
var set_iter_remain     = Sets[set_idx].set_iter;
var exer_remain         = Sets[set_idx].Exercises.length;

var synth = window.speechSynthesis;
var voices = [];
var restAlready = false;

var timer_run_h = 0;
var timer_run_m = 0;
var timer_run_s = 0;
var paused = false;
var exerciseTimer;
var stopWatch_hh = 0;
var stopWatch_mm = 0;
var stopWatch_ss = 0;
var stopWatchStartTime;
var stopWatch;

var rout_total_time_h = 0;
var rout_total_time_m = 0;
var rout_total_time_s = 0;
var time_elapsed_h = 0;
var time_elapsed_m = 0;
var time_elapsed_s = 0;

calculate_total_time();

prepareNewExercise();

document.getElementById("rout_name").innerHTML = Routine.rout_name;
document.getElementById("exer_name").innerHTML = Sets[set_idx].Exercises[exer_idx].exer_name;
document.getElementById("exer_iter").innerHTML = Sets[set_idx].Exercises[exer_idx].exer_iter;
document.getElementById("exer_idx1").innerHTML = 1;
document.getElementById("set_name").innerHTML = Sets[set_idx].set_name;
document.getElementById("set_iter").innerHTML = Sets[set_idx].set_iter;
document.getElementById("set_iter_curr").innerHTML = 1;
document.getElementById("set_idx1").innerHTML = 1;
document.getElementById("num_of_exer").innerHTML = Sets[set_idx].Exercises.length;

PopulateVoices();
if(speechSynthesis !== undefined){
    speechSynthesis.onvoiceschanged = PopulateVoices;
}

btnGO.addEventListener('click', () => {
    timer_run_h = timer_exer_h;
    timer_run_m = timer_exer_m;
    timer_run_s = timer_exer_s;
    runActivity(exer_name + ' for ', timer_exer_h, timer_exer_m, timer_exer_s);
});

function runActivity(msg, hh, mm, ss) {
    let lnTime = '';
    let toSpk;
    clearTimer();               // to pause timer on screen

    lnTime = formatSpeakTime (lnTime, hh, mm, ss);
    if (lnTime != '') {
        speakLine(msg + lnTime, runTimer);
        }             
}

function formatSpeakTime (lnTime, hh, mm, ss) {
    if (hh > 0) {
        lnTime += hh + ' hour';
        if (hh > 1) lnTime += 's';
    }
    if (mm > 0) {
        if (lnTime && ss == 0) lnTime += ' and ' + mm + ' minute'
            else lnTime += ' ' + mm + ' minute';
        if (mm > 1) lnTime += 's';
    }
    if (ss > 0) {
        if (lnTime) lnTime += ' and ' + ss + ' second'
            else lnTime += ' ' + ss + ' second';
        if (ss > 1) lnTime += 's';
    }
    return (lnTime);
}

function speakLine(line, callback) {
    var toSpeak = new SpeechSynthesisUtterance(line);
    var selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
    voices.forEach((voice)=>{
        if(voice.name === selectedVoiceName){
            toSpeak.voice = voice;
        }
    });
    synth.speak(toSpeak);
    toSpeak.onend = function(event) {
        callback();
    }
}

function dummy () {
    return 1;
}

function PopulateVoices(){
    voices = synth.getVoices();
    var selectedIndex = voiceList.selectedIndex < 0 ? 0 : voiceList.selectedIndex;
    voiceList.innerHTML = '';
    voices.forEach((voice)=>{
        var listItem = document.createElement('option');
        listItem.textContent = voice.name;
        listItem.setAttribute('data-lang', voice.lang);
        listItem.setAttribute('data-name', voice.name);
        voiceList.appendChild(listItem);
    });
    voiceList.selectedIndex = selectedIndex;
}

//===============================================================

var clock     = setInterval(clockFcn, 1000);

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

function clockFcn() {
    let clock_date = new Date();

    document.getElementById("clockTime").innerHTML=
    ("0" + clock_date.getHours()).substr(-2) + ":" +
    ("0" + clock_date.getMinutes()).substr(-2) + ":" +
    ("0" + clock_date.getSeconds()).substr(-2);
}

function pauseResumeTimer() {
    if (paused === false) {
        paused = true;
        clearTimer();
    }
    else {
        paused = false;
        runTimer();
    }
}

function runTimer() {
        clearInterval(exerciseTimer);
        exerciseTimer = setInterval(exerciseTimerFcn, 1000);
}

function exerciseTimerFcn() {
    if (timer_run_h != 0 ||
        timer_run_m != 0 ||
        timer_run_s != 0) {
            minusOneSecond_fromTimerRun();
            minusOneSecond_fromRemainingTime();
            addOneSecond_toElapsedTime();
        }
            
    else { // countdown timer hit zero, need next action
        clearTimer();
        let temp_h = timer_rest_h;
        let temp_m = timer_rest_m;
        let temp_s = timer_rest_s;
        if (!restAlready && (temp_h || temp_m || temp_s)) { // take rest
            timer_run_h = temp_h;
            timer_run_m = temp_m;
            timer_run_s = temp_s;
            runActivity('Take rest for ', timer_rest_h, timer_rest_m, timer_rest_s);
            restAlready = true;
            document.getElementById("timerBlock").style.backgroundColor = "lightgreen";
        } 
        else { // one exercise including rest time is complete
            document.getElementById("timerBlock").style.backgroundColor = "rgb(209, 153, 255)";
            exer_iter_remain -= 1;
            if (exer_iter_remain > 0) { // do next exercise iteration
                resetRunningTimer();
                startExercise();
            }
            else {
                exer_remain--;
                if (exer_remain > 0) { // do next exercise
                    exer_idx++;
                    document.getElementById("exer_name").innerHTML = Sets[set_idx].Exercises[exer_idx].exer_name;
                    document.getElementById("exer_iter").innerHTML = Sets[set_idx].Exercises[exer_idx].exer_iter;
                    document.getElementById("exer_idx1").innerHTML = exer_idx + 1;
                    prepareNewExercise();
                    startExercise();
                }
                else { 
                    set_iter_remain--;
                    if (set_iter_remain > 0) { // do next set iteration
                        exer_remain = Sets[set_idx].Exercises.length;
                        exer_idx = 0;
                        prepareNewExercise();
                        speakLine('Repeat ' + set_name, startExercise);
                    }
                    else { 
                        set_remain--;
                        if (set_remain > 0) { // do next set
                            set_idx ++;
                            set_name        = Sets[set_idx].set_name;
                            set_iter_remain = Sets[set_idx].set_iter;
                            exer_remain     = Sets[set_idx].Exercises.length;
                            exer_idx = 0;
                            document.getElementById("set_name").innerHTML = Sets[set_idx].set_name;
                            document.getElementById("set_iter").innerHTML = Sets[set_idx].set_iter;
                            document.getElementById("set_iter_curr").innerHTML = Sets[set_idx].set_iter
                                                                                - set_iter_remain + 1;
                            document.getElementById("set_idx1").innerHTML = set_idx + 1;
                            document.getElementById("num_of_exer").innerHTML = Sets[set_idx].Exercises.length;
                            prepareNewExercise();
                            speakLine('Next is ' + set_name, startExercise);
                        }
                        else {
                            finishRoutine ();
                        }
                    }
                }
            }
        }
        return;
    }
                
    if (timer_run_h === 0 && timer_run_m === 0 && timer_run_s <= 5 && timer_run_s > 0)
        speakLine (timer_run_s, dummy);

    document.getElementById("timer").innerHTML= 
            ("0" + timer_run_h).substr(-2) + ":" +
            ("0" + timer_run_m).substr(-2) + ":" +
            ("0" + timer_run_s).substr(-2);
}

function resetRunningTimer () {
    timer_run_h = Sets[set_idx].Exercises[exer_idx].timer_exer_h;
    timer_run_m = Sets[set_idx].Exercises[exer_idx].timer_exer_m;
    timer_run_s = Sets[set_idx].Exercises[exer_idx].timer_exer_s;
}

function prepareNewExercise () {
    resetRunningTimer();
    timer_rest_h        = Sets[set_idx].Exercises[exer_idx].timer_rest_h;
    timer_rest_m        = Sets[set_idx].Exercises[exer_idx].timer_rest_m;
    timer_rest_s        = Sets[set_idx].Exercises[exer_idx].timer_rest_s;
    timer_exer_h        = Sets[set_idx].Exercises[exer_idx].timer_exer_h;
    timer_exer_m        = Sets[set_idx].Exercises[exer_idx].timer_exer_m;
    timer_exer_s        = Sets[set_idx].Exercises[exer_idx].timer_exer_s;
    exer_iter_remain    = Sets[set_idx].Exercises[exer_idx].exer_iter;
    exer_name           = Sets[set_idx].Exercises[exer_idx].exer_name;
}

function startExercise () {
    restAlready = false;
    document.getElementById('btnGO').click();
}

function finishRoutine () {
    speakLine (Routine.rout_name + ' finished', dummy);
}
function minusOneSecond_fromRemainingTime () {
    if (rout_total_time_s === 0) {
        rout_total_time_s = 59;
        
        if (rout_total_time_m === 0) {
        rout_total_time_m = 59;
        rout_total_time_h -= 1;
        } else rout_total_time_m -= 1;   
    }
    else rout_total_time_s -= 1;
    document.getElementById("time_remaining").innerHTML = rout_total_time_h + ':' 
                                                        + rout_total_time_m + ':' + rout_total_time_s;
}

function minusOneSecond_fromTimerRun () {
    if (timer_run_s === 0) {
        timer_run_s = 59;
        
        if (timer_run_m === 0) {
        timer_run_m = 59;
        timer_run_h -= 1;
        } else timer_run_m -= 1;   
    }
    else timer_run_s -= 1;
}

function clearTimer() {
    clearInterval(exerciseTimer);
//    document.getElementById("GO").disabled = false;
//    document.getElementById("show").click();
}

function calculate_total_time () {
    let temp_h, temp_m, temp_s;
    for (let i=0; i< Sets.length; i++) {
        temp_h = temp_m = temp_s = 0;
        for (let j=0; j<Sets[i].Exercises.length; j++) {
            temp_h += (Sets[i].Exercises[j].timer_exer_h + Sets[i].Exercises[j].timer_rest_h) 
                            * Sets[i].Exercises[j].exer_iter;
            temp_m += (Sets[i].Exercises[j].timer_exer_m + Sets[i].Exercises[j].timer_rest_m) 
                            * Sets[i].Exercises[j].exer_iter;
            temp_s += (Sets[i].Exercises[j].timer_exer_s + Sets[i].Exercises[j].timer_rest_s) 
                            * Sets[i].Exercises[j].exer_iter;
        }
        rout_total_time_h += temp_h * Sets[i].set_iter;
        rout_total_time_m += temp_m * Sets[i].set_iter;
        rout_total_time_s += temp_s * Sets[i].set_iter;
    }
    rout_total_time_m += Math.trunc (rout_total_time_s / 60);
    rout_total_time_s = rout_total_time_s % 60;
    rout_total_time_h += Math.trunc (rout_total_time_m / 60);
    rout_total_time_m = rout_total_time_m % 60;
    
    document.getElementById("time_remaining").innerHTML = rout_total_time_h + ':' 
                                                        + rout_total_time_m + ':' + rout_total_time_s;
}

function addOneSecond_toElapsedTime () {
    if (time_elapsed_s < 59)
        time_elapsed_s++
    else {
        time_elapsed_s = 0
        if (time_elapsed_m < 59)
        time_elapsed_m++
        else {
            time_elapsed_m = 0;
            time_elapsed_h++;
        }
    }
    document.getElementById("time_elapsed").innerHTML = time_elapsed_h + ':' 
                                                        + time_elapsed_m + ':' + time_elapsed_s;
}
