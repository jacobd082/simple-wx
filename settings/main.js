document.getElementById("showTemp").checked=(Boolean(Number(localStorage.getItem("showTemp"))))
function setTemp() {
  localStorage.setItem("showTemp",Number(document.getElementById("showTemp").checked))
  Toastify({
          text: "Saved!",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          gravity: "bottom"
        }).showToast();
}

document.getElementById("icon").checked=(Boolean(Number(localStorage.getItem("icon-show"))))
function setIcon() {
  localStorage.setItem("icon-show",Number(document.getElementById("icon").checked))
  Toastify({
          text: "Saved!",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          gravity: "bottom"
        }).showToast();
}

document.getElementById("showBG").checked=(Boolean(Number(localStorage.getItem("showBG"))))
function setBG() {
  localStorage.setItem("showBG",Number(document.getElementById("showBG").checked))
  if (localStorage.getItem("showBG")=="1") {
    document.getElementById("bg-opt").style.display="block"
  } else {
    document.getElementById("bg-opt").style.display="none"
  }
  Toastify({
          text: "Saved!",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          gravity: "bottom"
        }).showToast();
}

document.getElementById("AniBG").checked=(Boolean(Number(localStorage.getItem("AniBG"))))
function setBGA() {
  localStorage.setItem("AniBG",Number(document.getElementById("AniBG").checked))
  Toastify({
          text: "Saved!",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          gravity: "bottom"
        }).showToast();
}


document.getElementById("txtBG").checked=(Boolean(Number(localStorage.getItem("txtBG"))))
function txtBG() {
  localStorage.setItem("txtBG",Number(document.getElementById("txtBG").checked))
  Toastify({
          text: "Saved!",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          gravity: "bottom"
        }).showToast();
}

if (localStorage.getItem("showBG")=="1") {
  document.getElementById("bg-opt").style.display="block"
} else {
  document.getElementById("bg-opt").style.display="none"
}


function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}