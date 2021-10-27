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
    let t = document.querySelector("#DelId" + i)
    t.scrollIntoView({ inline: "start"})
//    document.getElementById("start" + i).style.display="none";
}

    function runRoutine(i) {
        
        
        console.log(url)
        window.location.href = url;
    }
