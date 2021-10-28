var clock     = setInterval(clockFcn, 1000);

function clockFcn() {
    let clock_date = new Date();

    document.getElementById("clockTime").innerHTML=
                        ("0" + clock_date.getHours()).substr(-2) + ":" +
                        ("0" + clock_date.getMinutes()).substr(-2) + ":" +
                        ("0" + clock_date.getSeconds()).substr(-2);
}

function deleteRout (i) {
    document.getElementById("row"+i).remove();
}

function editClick(sDIdLit) {
    let d = document.querySelector('.routineDel');
    var routineDelWidth = d.offsetWidth;

    let r, s;
    s = document.querySelector("#routineContainer").scrollTop;

    r = document.querySelectorAll(".delIcon")
    r.forEach(function (elm) {
        elm.scrollIntoView({ inline: "start" });
    }); 
    document.getElementById("divEditDone").innerHTML 
            = '<button id="Done" onclick="doneClick(\'' + sDIdLit + '\')">Done</button>';

    document.querySelector("#routineContainer").scrollTop = s;
    $('.routineButt').css('margin-left', '-=' + routineDelWidth + 'px');
}

function doneClick(sDIdLit) {

    let d = document.querySelector('.routineDel');
    var routineDelWidth = d.offsetWidth;

    let r, s;
    s = document.querySelector("#routineContainer").scrollTop;

    r = document.querySelectorAll(".routine")
    r.forEach(function (elm) {
            elm.scrollIntoView({ inline: "start" });
        }); 

    document.getElementById("divEditDone").innerHTML 
        = '<button id="Edit" onclick="editClick(\'' + sDIdLit + '\')">Edit</button>'

    let elm = document.querySelectorAll(".routineButt");
    elm.forEach(function(s) {
        let j = s.id.length - sDIdLit.length;
        let i = s.id.substr(-1 * j);
        s.setAttribute('onclick',  'location.href=\'timer.html?selectedRoutineNo=' + i + '\'');
        s.style.color = "white";
        s.style.backgroundColor ="darkblue";
        s.innerText = 'Start';
    })

    $('.routineButt').css('margin-left', '+=' + routineDelWidth + 'px');
    document.querySelector("#routineContainer").scrollTop = s;
}

function dispDelBtn (i, sDIdLit) {
    let s = document.getElementById(sDIdLit + i);
    s.setAttribute('onclick',  'deleteRout(' + i +');');
    s.style.color = "yellow";
    s.style.backgroundColor = "red";
    s.innerText = 'DELETE';
}

function runRoutine(i) {
    window.location.href = url;
}
