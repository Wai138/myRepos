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
/*
var Routine = { 
    rout_name: "Hand Exercises",
    rSets: [
        {
            set_name: "Bench",
            set_iter: 1,
            Exercises: [
                {
                    exer_name: "Bench press",
                    exer_iter: 1,
                    timer_exer_h: 0,
                    timer_exer_m: 0,
                    timer_exer_s: 3,
                    timer_rest_h: 0,
                    timer_rest_m: 0,
                    timer_rest_s: 2
                },
                {
                    exer_name: "Butterfly chest expand",
                    exer_iter: 1,
                    timer_exer_h: 0,
                    timer_exer_m: 0,
                    timer_exer_s: 4,
                    timer_rest_h: 0,
                    timer_rest_m: 0,
                    timer_rest_s: 0
                }
            ]
        },
        {
            set_name: "Rubber band",
            set_iter: 1,
            Exercises: [
                {
                    exer_name: "Upper arm push",
                    exer_iter: 1,
                    timer_exer_h: 0,
                    timer_exer_m: 0,
                    timer_exer_s: 3,
                    timer_rest_h: 0,
                    timer_rest_m: 0,
                    timer_rest_s: 1
                },
                {
                    exer_name: "Waist level push",
                    exer_iter: 2,
                    timer_exer_h: 0,
                    timer_exer_m: 0,
                    timer_exer_s: 2,
                    timer_rest_h: 0,
                    timer_rest_m: 0,
                    timer_rest_s: 2
                }
            ]
        }                
    ]
}
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

prepareNewExercise();

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
        timer_run_s != 0) 
            minusOneSecond_fromTimerRun();
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
            exer_iter_remain -= 1;
            if (exer_iter_remain > 0) { // do next exercise iteration
                resetRunningTimer();
                startExercise();
            }
            else {
                exer_remain--;
                if (exer_remain > 0) { // do next exercise
                    exer_idx++;
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
                        console.log('set remain:' +  set_remain)
                        if (set_remain > 0) { // do next set
                            set_idx ++;
                            set_name        = Sets[set_idx].set_name;
                            set_iter_remain = Sets[set_idx].set_iter;
                            exer_remain     = Sets[set_idx].Exercises.length;
                            exer_idx = 0;
                            prepareNewExercise();
                            speakLine('Next is ' + set_name, startExercise);
                        }
                        else {
                            console.log('finished...')
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
    document.getElementById("timerBlock").style.backgroundColor = "beige";
}
function minusOneSecond_fromTimerRun () {
    if (timer_run_s === 0) {
        timer_run_s = 59;
        
            if (timer_run_m === 0) {
            timer_run_m = 59;
            timer_run_h -= 1;
        }
        else {
            timer_run_m -= 1;
        }
    }
    else
    {
        timer_run_s -= 1;
    }
}

function clearTimer() {
    clearInterval(exerciseTimer);
//    document.getElementById("GO").disabled = false;
//    document.getElementById("show").click();
}
