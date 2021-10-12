        var voiceList       = document.querySelector('#voiceList');
        var btnGO           = document.querySelector('#btnGO');
        var exercise        = document.querySelector('#exercise');
        var timer_start_h   = document.querySelector('#timer_start_h');
        var timer_start_m   = document.querySelector('#timer_start_m');
        var timer_start_s   = document.querySelector('#timer_start_s');
        var timer_rest_h    = document.querySelector('#timer_rest_h');
        var timer_rest_m    = document.querySelector('#timer_rest_m');
        var timer_rest_s    = document.querySelector('#timer_rest_s');
        var synth = window.speechSynthesis;
        var voices = [];
        var restAlready = false;

        PopulateVoices();
        if(speechSynthesis !== undefined){
            speechSynthesis.onvoiceschanged = PopulateVoices;
        }

        btnGO.addEventListener('click', () => {
            timer_set_h = parseInt(document.getElementById("timer_start_h").value );
            timer_set_m = parseInt(document.getElementById("timer_start_m").value );
            timer_set_s = parseInt(document.getElementById("timer_start_s").value )+1;

            restAlready = false;
            runActivity(exercise.value + ' for ', timer_start_h.value, timer_start_m.value, timer_start_s.value);
        });

        function runActivity(msg, hh, mm, ss) {
            let lnTime = '';
            let toSpk;

            lnTime = formatSpeakTime (lnTime, hh, mm, ss);
            if (lnTime != '') {
                toSpk = speakLine(msg + lnTime);
                clearTimer();               // to pause timer on screen
                toSpk.onend = function(event) {
                    runTimer();
                }
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

        function speakLine(line) {
            var toSpeak = new SpeechSynthesisUtterance(line);
            var selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
            voices.forEach((voice)=>{
                if(voice.name === selectedVoiceName){
                    toSpeak.voice = voice;
                }
            });
            synth.speak(toSpeak);
            return (toSpeak);
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

        var timer_set_h = 0;
        var timer_set_m = 0;
        var timer_set_s = 0;
        var paused = false;
        var exerciseTimer;
        var stopWatch_hh = 0;
        var stopWatch_mm = 0;
        var stopWatch_ss = 0;
        var stopWatchStartTime;
        var stopWatch;
        
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
        
        if (timer_set_h === 0 &&
            timer_set_m === 0 &&
            timer_set_s === 0) {
                clearTimer();
                let temp_h = parseInt(document.getElementById("timer_rest_h").value );
                let temp_m = parseInt(document.getElementById("timer_rest_m").value );
                let temp_s = parseInt(document.getElementById("timer_rest_s").value );
                if (!restAlready && (temp_h || temp_m || temp_s)) {
                    timer_set_h = temp_h;
                    timer_set_m = temp_m;
                    timer_set_s = temp_s;
                    runActivity('Take rest for ', timer_rest_h.value, timer_rest_m.value, timer_rest_s.value);
                    restAlready = true;
                    document.getElementById("timerBlock").style.backgroundColor = "lightgreen";
                } else {
                    speakLine (exercise.value + ' finished');
                    document.getElementById("timerBlock").style.backgroundColor = "beige";
                }
        }
        else if (timer_set_s === 0) {
                timer_set_s = 59;
                
                    if (timer_set_m === 0) {
                    timer_set_m = 59;
                    timer_set_h -= 1;
                }
                else {
                    timer_set_m -= 1;
                }
            }
            else
            {
                timer_set_s -= 1;
            }
                        
        if (timer_set_h === 0 && timer_set_m === 0 && timer_set_s <= 5 && timer_set_s > 0)
            speakLine (timer_set_s);

        document.getElementById("timer").innerHTML= 
                ("0" + timer_set_h).substr(-2) + ":" +
                ("0" + timer_set_m).substr(-2) + ":" +
                ("0" + timer_set_s).substr(-2);

        }

        function clearTimer() {
            clearInterval(exerciseTimer);
        //    document.getElementById("GO").disabled = false;
        //    document.getElementById("show").click();
        }
