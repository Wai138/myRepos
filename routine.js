var clock     = setInterval(clockFcn, 1000);

function clockFcn() {
    let clock_date = new Date();

    document.getElementById("clockTime").innerHTML=
                        ("0" + clock_date.getHours()).substr(-2) + ":" +
                        ("0" + clock_date.getMinutes()).substr(-2) + ":" +
                        ("0" + clock_date.getSeconds()).substr(-2);
}

function deleteRout (i) {
    console.log('i is:' + i)
    document.getElementById("row"+i).remove();
}


function editClick() {

    let r = document.querySelectorAll(".delIcon")
    r.forEach(function (elm) {
        elm.scrollIntoView({ inline: "start" });
    }); 
    document.getElementById("divEditDone").innerHTML = '<button id="Done" onclick="doneClick()">Done</button>'

}
function doneClick() {

    let r = document.querySelectorAll(".routine")
    r.forEach(function (elm) {
            elm.scrollIntoView({ inline: "start" });
        }); 
    document.getElementById("divEditDone").innerHTML = '<button id="Edit" onclick="editClick()">Edit</button>'

}

function shiftDel (i) {
    let r, s, t;
/*    r = document.getElementById("routineContainer")
    r.style.position = "fixed";
    s = document.getElementById("row" + i)
    s.style.position = "relative"

    s = document.getElementById("row0")
    s.style.position = "fixed"
    s = document.getElementById("row1")
    s.style.position = "fixed"
    t = document.querySelector("#div" + i)
    t.style.position = "static"
*/    t = document.querySelector("#DelId" + i)
    t.scrollIntoView({ inline: "start"})
    console.log('shiftDel:' + i)
/*  s = document.getElementById("row" + i)
    s.style.position = "inherit"
    r = document.getElementById("routineContainer")
    r.style.position = "relative";
*/
}

    function runRoutine(i) {
        
        
        console.log(url)
        window.location.href = url;
    }
