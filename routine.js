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
    let e, rect, a, b;
//    var routineDelWidth;

/*    console.log('EditClick')
    d = document.querySelector('.routineDel');
    routineDelWidth = d.offsetWidth;
    rect = d.getBoundingClientRect();
    console.log('routineDel before:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));
*/
    e = document.querySelector('.routineButt');
//    routineDelWidth = e.offsetWidth;
    rect = e.getBoundingClientRect();
//    console.log('routineButt before:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));

    b = Math.round(rect.right);

    let r, s;
    s = document.querySelector("#routineContainer").scrollTop;

    r = document.querySelectorAll(".delIcon")
    r.forEach(function (elm) {
        elm.scrollIntoView({ inline: "start" });
    }); 
    document.getElementById("divEditDone").innerHTML 
            = '<button id="Done" onclick="doneClick(\'' + sDIdLit + '\')">Done</button>';


/*    d = document.querySelector('.routineDel');
    routineDelWidth = d.offsetWidth;
    rect = d.getBoundingClientRect();
    console.log('routineDel after:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));
*/
    e = document.querySelector('.routineButt');
//    routineDelWidth = e.offsetWidth;
    rect = e.getBoundingClientRect();
//    console.log('routineButt after:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));

    a = Math.round(rect.right);

    document.querySelector("#routineContainer").scrollTop = s;
    $('.routineButt').css('margin-left', '-=' + (a - b) + 'px');

/*    d = document.querySelector('.routineDel');
    routineDelWidth = d.offsetWidth;
    rect = d.getBoundingClientRect();
    console.log('routineDel last:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));

    e = document.querySelector('.routineButt');
    routineDelWidth = e.offsetWidth;
    rect = e.getBoundingClientRect();
    console.log('routineButt last:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));
*/                
}

function doneClick(sDIdLit) {

    let e, rect, a, b;
    var routineDelWidth;
/*
    console.log('doneClick')
    d = document.querySelector('.routineDel');
    routineDelWidth = d.offsetWidth;
    rect = d.getBoundingClientRect();
    console.log('routineDel before:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));
*/
    e = document.querySelector('.routineButt');
//    routineDelWidth = e.offsetWidth;
    rect = e.getBoundingClientRect();
//    console.log('routineButt before:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));

    b = Math.round(rect.right)

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
/*
    d = document.querySelector('.routineDel');
    routineDelWidth = d.offsetWidth;
    rect = d.getBoundingClientRect();
    console.log('routineDel after:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));
*/
    e = document.querySelector('.routineButt');
//    routineDelWidth = e.offsetWidth;
    rect = e.getBoundingClientRect();
//    console.log('routineButt after:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));
    
    a = Math.round(rect.right);

    $('.routineButt').css('margin-left', '+=' + (b - a) + 'px');

    document.querySelector("#routineContainer").scrollTop = s;

/*    d = document.querySelector('.routineDel');
    routineDelWidth = d.offsetWidth;
    rect = d.getBoundingClientRect();
    console.log('routineDel last:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));

    e = document.querySelector('.routineButt');
    routineDelWidth = e.offsetWidth;
    rect = e.getBoundingClientRect();
    console.log('routineButt last:', routineDelWidth, Math.round(rect.top), Math.round(rect.right), Math.round(rect.bottom), Math.round(rect.left));
*/                
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
