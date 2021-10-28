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


function editClick() {

    let r, s;
    s = document.querySelector("#routineContainer").scrollTop;

    r = document.querySelectorAll(".spanStartDel");
    r.forEach(function (elm) {
        elm.style.position = "fixed";
    });

    r = document.querySelectorAll(".delIcon")
    r.forEach(function (elm) {
        elm.scrollIntoView({ inline: "start" });
    }); 
    document.getElementById("divEditDone").innerHTML = '<button id="Done" onclick="doneClick()">Done</button>';

    r = document.querySelectorAll(".spanStartDel");
    r.forEach(function (elm) {
        elm.style.position = "relative";

    });
    document.querySelector("#routineContainer").scrollTop = s;
}

function doneClick(sDId) {

    let r, s;
    s = document.querySelector("#routineContainer").scrollTop;

    r = document.querySelectorAll(".spanStartDel");
    r.forEach(function (elm) {
        elm.style.position = "fixed";
    });

    r = document.querySelectorAll(".routine")
    r.forEach(function (elm) {
            elm.scrollIntoView({ inline: "start" });
        }); 
    document.getElementById("divEditDone").innerHTML = '<button id="Edit" onclick="editClick()">Edit</button>'

    r = document.querySelectorAll(".spanStartDel");
    r.forEach(function (elm) {
        elm.style.position = "relative";
    });

    let elm = document.querySelectorAll(".routineButt");
    elm.forEach(function(s) {
        let j = s.id.length - sDId.length;
        let i = s.id.substr(-1 * j);
        console.log ('i:' + i + ' j:' + j + ' sDId:' + sDId.length + ' s.id:' + s.id.length)
        s.setAttribute('onclick',  'location.href=\'timer.html?selectedRoutineNo=' + i + '\'');
        s.style.color = "white";
        s.style.backgroundColor ="darkblue";
        s.innerText = 'Start';
    })
    document.querySelector("#routineContainer").scrollTop = s;
}

function shiftDel (i, sDId) {
    let s = document.getElementById(sDId + i);
    s.setAttribute('onclick',  'deleteRout(' + i +');');
    s.style.color = "yellow";
    s.style.backgroundColor = "red";
    s.innerText = 'DELETE';
//    let t = document.querySelector("#DelId" + i)
//    t.scrollIntoView({ inline: "start"})
//    document.getElementById("start" + i).style.display="none";
}

    function runRoutine(i) {
        
        
        console.log(url)
        window.location.href = url;
    }
