var voiceList       = document.querySelector('#voiceList');
var btnGO           = document.querySelector('#btnGO');

var qs = (new URL(document.location)).searchParams;
let selectedRoutine = 'Routine' + qs.get('selectedRoutineNo')

var Routine = JSON.parse(sessionStorage.getItem(selectedRoutine));
var Sets = Routine.rSets;

var timer_exer_h, timer_exer_m, timer_exer_s;
var timer_rest_h, timer_rest_m, timer_rest_s;
var exer_name, exer_iter_remain;

var exer_idx, set_idx;
var set_remain, exer_remain, set_iter_remain, set_name;

var synth = window.speechSynthesis;
var voices = [];
var restAlready;

var timer_run_h;
var timer_run_m;
var timer_run_s;
var paused;
var exerciseTimer;

var rout_total_time_h;
var rout_total_time_m;
var rout_total_time_s;
var time_elapsed_h;
var time_elapsed_m;
var time_elapsed_s;

init ();
loadExerciseContainer();
hightlightExercise();
window.onscroll=stop();
PopulateVoices();
if(speechSynthesis !== undefined){
    speechSynthesis.onvoiceschanged = PopulateVoices;
}

function init () {

    exer_idx = set_idx  = 0;
    set_remain          = Sets.length;
    set_name            = Sets[set_idx].set_name;
    set_iter_remain     = Sets[set_idx].set_iter;
    exer_remain         = Sets[set_idx].Exercises.length;

    paused      = false;
    restAlready = false;
        
    rout_total_time_h   = rout_total_time_m = rout_total_time_s = 0;
    time_elapsed_h      = time_elapsed_m    = time_elapsed_s    = 0;

    calculate_total_time();
    displayRemainingAndElapsedTime();

    prepareNewExercise();
/*
    timer_run_h = timer_exer_h;
    timer_run_m = timer_exer_m;
    timer_run_s = timer_exer_s;
*/
    document.getElementById("rout_name").innerHTML  = Routine.rout_name;
    document.getElementById("num_of_set").innerHTML = Sets.length;

    document.getElementById("exer_idx1").innerHTML  = 1;
    document.getElementById("set_idx1").innerHTML   = 1;

    document.getElementById("num_of_exer").innerHTML = Sets[set_idx].Exercises.length;
}

btnGO.addEventListener('click', () => {
    init ();
    startExercise();
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

function scrollToNextExercise () {
    let exerId = 'exer' + exer_idx;
    let elm = document.getElementById(exerId);
    elm.scrollIntoView();
}
function removeHighlight () {
    let idx = exer_idx - 1;
    let exerId = 'exer' + idx;
    let elm = document.getElementById(exerId);
    elm.style.backgroundColor = "white";
}

function hightlightExercise() {
    let exerId = 'exer' + exer_idx;
    let elm = document.getElementById(exerId);
    elm.style.backgroundColor = "rgb(209, 153, 255)";
}

function loadExerciseContainer () {
    document.getElementById('exerciseContainer').innerHTML = '';

    for (i=0;i<Sets[set_idx].Exercises.length;i++){
        let currExer  = Sets[set_idx].Exercises[i];
        let duration  = ("0" + currExer.timer_exer_h).substr(-2) + ":" +
                        ("0" + currExer.timer_exer_m).substr(-2) + ":" +
                        ("0" + currExer.timer_exer_s).substr(-2);
        let rest_time = ("0" + currExer.timer_rest_h).substr(-2) + ":" +
                        ("0" + currExer.timer_rest_m).substr(-2) + ":" +
                        ("0" + currExer.timer_rest_s).substr(-2);

        let butn = `<table id="exer` + i + `" class="exerciseItem" style="width:100vw;">
        <tr style="white-space: nowrap;">
            <td style="line-height: 0.5;text-align:left;font-weight: bold; font-size: 1.3em;width: 100vw";>` + currExer.exer_name + `</td>
        </tr>
        <tr style="line-height: 0.5;">
            <td style="text-align:left;width:33.3333%;">Duration: 
                <span style="font-weight: bold;">` + duration + `</span></td>
            <td style="text-align:center;width:33.3333%;"></td>
            <td style="text-align:left;width:33.3333%;">Rest: 
                <span>` + rest_time + `</span></td>
        </tr>
        <tr style="line-height: 0.5;">
            <td style="text-align:left;">Execute Count: <span>` 
                + Sets[set_idx].Exercises[i].exer_iter + `</span></td>
        </tr>
    </table>`;
        document.getElementById('exerciseContainer').innerHTML += butn;
    }
}

//===============================================================

var clock     = setInterval(clockFcn, 1000);

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
            displayRemainingAndElapsedTime();
        }
            
    else { // countdown timer hit zero, need next action
        clearTimer();
        if (!restAlready && (timer_rest_h || timer_rest_m || timer_rest_s)) { // take rest
            timer_run_h = timer_rest_h;
            timer_run_m = timer_rest_m;
            timer_run_s = timer_rest_s;
            runActivity('Take rest for ', timer_rest_h, timer_rest_m, timer_rest_s);
            restAlready = true;
            document.getElementById("timerBlock").style.backgroundColor = "lightgreen";
        } 
        else { // one exercise including rest time is complete
            exer_iter_remain -= 1;
            if (exer_iter_remain > 0) { // do next exercise iteration
                refreshTimerSection ();

                resetRunningTimer();
                startExercise();
            }
            else {
                exer_remain--;
                if (exer_remain > 0) { // do next exercise
                    exer_idx++;
                    prepareNewExercise();
                    removeHighlight();
                    scrollToNextExercise();
                    hightlightExercise();

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
                            set_idx++;
                            set_name        = Sets[set_idx].set_name;
                            set_iter_remain = Sets[set_idx].set_iter;

                            exer_remain     = Sets[set_idx].Exercises.length;
                            exer_idx = 0;
                            prepareNewExercise();
                            loadExerciseContainer();
                            hightlightExercise();
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

function prepareNewExercise () {
    resetRunningTimer();
    updateTimerInfo();

    exer_iter_remain    = Sets[set_idx].Exercises[exer_idx].exer_iter;
    exer_name           = Sets[set_idx].Exercises[exer_idx].exer_name;

    refreshTimerSection();
}

function resetRunningTimer () {
    timer_run_h = Sets[set_idx].Exercises[exer_idx].timer_exer_h;
    timer_run_m = Sets[set_idx].Exercises[exer_idx].timer_exer_m;
    timer_run_s = Sets[set_idx].Exercises[exer_idx].timer_exer_s;
}

function updateTimerInfo () {
    timer_rest_h        = Sets[set_idx].Exercises[exer_idx].timer_rest_h;
    timer_rest_m        = Sets[set_idx].Exercises[exer_idx].timer_rest_m;
    timer_rest_s        = Sets[set_idx].Exercises[exer_idx].timer_rest_s;
    timer_exer_h        = Sets[set_idx].Exercises[exer_idx].timer_exer_h;
    timer_exer_m        = Sets[set_idx].Exercises[exer_idx].timer_exer_m;
    timer_exer_s        = Sets[set_idx].Exercises[exer_idx].timer_exer_s;
}

function refreshTimerSection () {
    document.getElementsByClassName("set_name")[0].innerHTML       = Sets[set_idx].set_name;
    document.getElementsByClassName("set_name")[1].innerHTML       = Sets[set_idx].set_name;
    document.getElementById("set_iter").innerHTML       = Sets[set_idx].set_iter;
    document.getElementById("set_iter_curr").innerHTML  = Sets[set_idx].set_iter
                                                            - set_iter_remain + 1;

    document.getElementById("exer_idx1").innerHTML      = exer_idx + 1;
    document.getElementById("exer_name").innerHTML      = Sets[set_idx].Exercises[exer_idx].exer_name;
    document.getElementById("exer_iter").innerHTML      = Sets[set_idx].Exercises[exer_idx].exer_iter;
    document.getElementById("exer_iter_curr").innerHTML = Sets[set_idx].Exercises[exer_idx].exer_iter
                                                            - exer_iter_remain + 1;

    document.getElementsByClassName("set_idx1").innerHTML = set_idx + 1;
    document.getElementById("num_of_exer").innerHTML = Sets[set_idx].Exercises.length;
}

function startExercise () {
    restAlready = false;
/*    timer_run_h = timer_exer_h;
    timer_run_m = timer_exer_m;
    timer_run_s = timer_exer_s;
*/
    document.getElementById("timerBlock").style.backgroundColor = "rgb(209, 153, 255)";

    runActivity(exer_name + ' for ', timer_exer_h, timer_exer_m, timer_exer_s);

//    document.getElementById('btnGO').click();
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
}

function displayRemainingAndElapsedTime () {
    document.getElementById("time_remaining").innerHTML = 
                                ("0" + rout_total_time_h).substr(-2) + ":" +
                                ("0" + rout_total_time_m).substr(-2) + ":" +
                                ("0" + rout_total_time_s).substr(-2);
    document.getElementById("time_elapsed").innerHTML = 
                                ("0" + time_elapsed_h).substr(-2) + ":" +
                                ("0" + time_elapsed_m).substr(-2) + ":" +
                                ("0" + time_elapsed_s).substr(-2);
}