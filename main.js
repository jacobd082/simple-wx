// Copyright (c) Jacob Drath 2022



if (localStorage.getItem("lat")==null) {} else {
    getWX()
}


function setZIP() {
    document.getElementById("zip").style.borderBottom="2px solid black"
    document.getElementById("zip-c").style.borderBottom="2px solid black"
    if (document.getElementById("zip-c").value=="not-selected") {
        document.getElementById("zipr").innerHTML=("<p style='color: red;'>Please select your country</p>")
        document.getElementById("zip-c").style.borderBottom="2px solid red"
    } else {
        document.getElementById("zipr").innerHTML=("<img src='load.png' width='40px'>Please wait...")
        fetch('https://api.openweathermap.org/geo/1.0/zip?zip='+document.getElementById("zip").value+','+document.getElementById("zip-c").value+'&appid=b4b150ac011d2c689bb0960425153055')
            .then(response => response.json())
            .then(data => handleZIP(data))
    }
}
function handleZIP(e) {
    if (e.name==undefined) {
        document.getElementById("zipr").innerHTML=("<p style='color: red;'>ZIP Code is invalid</p>")
        document.getElementById("zip").style.borderBottom="2px solid red"
        Toastify({
            text: "ZIP code is invalid.",
            style: {
              background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            },
            gravity: "bottom"
          }).showToast();
    } else {
        localStorage.setItem("unit", document.getElementById("unit-b").value)
        localStorage.setItem("long", e.lon)
        localStorage.setItem("lat", e.lat)
        document.getElementById("zipr").innerHTML=("<p>Location was saved as "+e.name+". Weather will open shortly... <img src='load.png' width='40px'></p>")
        Toastify({
            text: "Location was saved. Please wait...",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            gravity: "bottom"
          }).showToast();
        setTimeout(function(){
            window.open(window.location.href, "_self")
        }, 2000);
    }
}

function setGPS() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      function success(pos) {
        var crd = pos.coords;
      
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        localStorage.setItem("long",crd.longitude)
        localStorage.setItem("lat",crd.latitude)
        //localStorage.setItem("unit", document.getElementById("unit-a").value)
        getWX()
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        //alert("There was an error getting your location. Please make sure it is on and try again.")
        Toastify({
            text: "There was an error getting your location. Please make sure it is on and try again.",
            style: {
              background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            },
            gravity: "bottom"
          }).showToast();
      }
      
      navigator.geolocation.getCurrentPosition(success, error, options);
}


function getWX () {
    //document.body.style.background=("")
    document.body.innerHTML=("<div class='center'><img src='load.png' width='70px' style='background: white; border-radius: 20px;'></div>")
    if (navigator.onLine==false) {
        document.body.innerHTML=("<center><h1>No Internet...</h1><p>Your weather will appear when your Internet connection is restored.</p></center>")
        Toastify({
            text: "No internet connection",
            style: {
              background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            },
            gravity: "bottom"
          }).showToast();
    }
    fetch('https://api.openweathermap.org/data/2.5/weather?units=imperial&lat='+localStorage.getItem("lat")+'&lon='+localStorage.getItem("long")+'&appid=b4b150ac011d2c689bb0960425153055')
        .then(response => response.json())
        .then(data => showWX(data))
}


function showWX(w) {
    sessionStorage.setItem("debug--loadedData", JSON.stringify(w))
    var l = w.name + " (" + w.sys.country
    if (localStorage.unit=="metric") {
        l += " - <a href='settings/unit.html'>C</a>)"
    } else {
        l += " - <a href='settings/unit.html'>F</a>)"
    }
    var temp = Math.floor(w.main.temp)
    if (localStorage.getItem("icon-show")=="1") {
        icon = "<img src='http://openweathermap.org/img/wn/"+w.weather[0].icon+"@2x.png' width='60px'><br>"
    } else {
        icon = ""
    }
    if ((w.visibility<6000)) {
        icon += "<p style='color: orange;'><b>Low Visibility</b><br>Visibility is below 6 miles</p>"
    }
    if ((w.main.humidity>75)) {
        icon += "<p style='color: orange;'><b>High Humidity</b><br>Humidity is " + w.main.humidity + "%</p>"
    }
    if ((w.weather[0].main=="Tornado")) {
        icon += "<p style='color: red;'><b>Tornado</b><br>There is an active tornado in your area. Please seek shelter. <a href='https://www.weather.gov/safety/tornado-during'>What to do in a tornado.</a></p>"
    }
    if ((w.weather[0].main=="Ash")) {
        icon += "<p style='color: red;'><b>Volcanic Ash</b><br>Limit your time outdoors and use a dust mask or cloth mask as a last resort if you must be outside. Avoid areas downwind and river valleys downstream of the volcano. <a href='https://www.ready.gov/volcanoes'>Learn more...</a></p>"
    }
    if ((w.weather[0].main=="Sand")) {
        icon += "<p style='color: red;'><b>Sand / Dust Whirls</b><br>A Dust Whirl was reported in your area. Please stay inside. Dust Whirls usually last a few minutes, and do not cause very much harm.</p>"
    }
    if ((w.weather[0].main=="Extreme")) {
        icon += "<p style='color: red;'><b>There is extreme weather in your area</b></p>"
    }
    if (temp<10) {
        if (localStorage.getItem("unit")=="imperial") {
            configS(l, "cold", temp, icon)
        }
    }

    if (temp>95) {
        if (localStorage.getItem("unit")=="imperial") {
            configS(l, "hot", temp, icon)
        }
    } else if (w.weather[0].main=="thunderstorm") {
        configS(l, "thundering", temp, icon)
    } else if (w.weather[0].main=="Rain") {
        configS(l, "raining", temp, icon)
    } else if (w.weather[0].main=="Drizzle") {
        configS(l, "raining", temp, icon)
    } else if (w.weather[0].main=="Snow") {
        configS(l, "snowing", temp, icon)
    } else if (w.weather[0].main=="Smoke") {
        configS(l, "smokey", temp, icon)
    } else if (w.weather[0].main=="Mist") {
        configS(l, "misting", temp, icon)
    } else if (w.weather[0].main=="Haze") {
        configS(l, "hazy", temp, icon)
    } else if (w.weather[0].main=="Dust") {
        configS(l, "dusty", temp, icon)
    } else if ((w.visibility<4000) || (w.weather[0].main=="Fog")) {
        configS(l, "foggy", temp, icon)
    } else if (w.weather[0].main=="Sand") {
        configS(l, "sandy", temp, icon)
    } else if (w.weather[0].main=="Ash") {
        configS(l, "volcanic", temp, icon)
    } else if (w.weather[0].main=="Squall") {
        configS(l, "a squall", temp, icon)
    } else if (w.weather[0].main=="Tornado") {
        configS(l, "not good", temp, icon)
    } else if (w.wind.speed>25) {
        configS(l, "windy", temp, icon)
    } else if (w.weather[0].main=="Clouds") {
        configS(l, "cloudy", temp, icon)
        if (w.clouds.all<90) {
            configS(l, "partly cloudy", temp, icon)
        }
    } else if (w.weather[0].description=="clear sky") {
        if (Math.round((new Date()).getTime() / 1000)<w.sys.sunset) {
            configS(l, "sunny", temp, icon)
        } else {
            configS(l, "dark", temp, icon)
        }
    } else if (w.weather[0].main=="Extreme") {
        configS(l, "bad", temp, icon)
    } else {
        configS(l, w.weather[0].description, temp, icon)
    }


    if (Math.round((new Date()).getTime() / 1000)>w.sys.sunset) {
        document.body.style.background=("black")
        document.body.style.color=("white")
    }
}


function configS(loca, cond, temp, icon) {
    sessionStorage.setItem("cond", cond)
    if (localStorage.showTemp==undefined) {localStorage.setItem("showTemp", "0")}
    showTemp = ""
    if (localStorage.showTemp=="1") {
        if (localStorage.getItem("unit")=="metric") {
            temp = Math.floor((temp - 32) * 5 / 9)
        }
        showTemp = "<p>The temperature is "+temp+"</p>"
    }
    document.body.innerHTML=('<div>Current Location: '+loca+ '. <a href="javascript:resetLoca()">Reset</a></div><div class="container"><div class="center" id="center" style="max-width: 300px;">     <img src="Small-Logo.png" width="15px"><span style="font-size:15px;margin: 0;">Simple Weather</span><br>'+icon+'<h1 style="margin-top: 2px;">It is '+cond+'.</h1>'+showTemp+'<p>Project by <a href="https://zzz.jacobdrath.co">Jacob Drath</a>.<br><a id="settings" href="settings">Settings</a><div id="debug" style="background: gray;"><p>DEBUG MENU</p><table><tr><td>weatherAvailable</td><td><b>true</b></td></tr><tr><td>weatherData</td><td><a href="javascript:seeData()">See data...</a></td></tr><tr><td>showTemp</td><td><b>'+String(Boolean(Number(localStorage.showTemp)))+'</b></td></tr><tr><td>showIcon</td><td><b>'+String(Boolean(Number(localStorage.getItem("icon-show"))))+'</b></td></tr><tr><td>backgroundColor</td><td><input id="bgColor" type="color" oninput="setBGcolor()"></td></tr><tr><td>latitude</td><td>'+localStorage.lat+'</td></tr><tr><td>longitude</td><td>'+localStorage.long+'</td></tr></table></div></div></div>')
    document.title="It is "+cond+" | Simple Weather"
    document.getElementById("debug").style.display=("none")
    var url_string = window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get("ref");
    if (c=="404") {
        Toastify({
            text: "Page not found",
            style: {
            background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            },
            gravity: "bottom"
        }).showToast();
    }
    // iOS config
    var a = location.href; 
    var b = a.substring(a.indexOf("?")+1);
    if (b=="ios=true") {
        document.getElementById("settings").style.display=("none")
    }


    if (localStorage.showBG=="1") {
        if (localStorage.AniBG=="1") {
            cmd("load backgrounds/ani_bg")
        } else {
            cmd("load backgrounds/backgrounds")
        }
        if (localStorage.txtBG=="1") {
            document.getElementById("center").style.backgroundColor=("white")
            document.getElementById("center").style.padding=("10px")
            document.getElementById("center").style.color=("black")
            document.getElementById("center").style.borderRadius=("10px")
        }
    }
}


function setBGcolor() {
    document.body.style.background=(document.getElementById("bgColor").value)
}

function seeData() {
    //window.open("data:text/text,"+sessionStorage.getItem("debug--loadedData"))
    document.body.innerHTML=(sessionStorage.getItem("debug--loadedData"))
}

function resetLoca() {
    localStorage.removeItem("long")
    localStorage.removeItem("lat")
    window.open(window.location.href, "_self")
}



function checkInternet() {
    if (sessionStorage.getItem("noInternetAlertShown")=="1") {
        if (navigator.onLine) {
            Toastify({
                text: "Internet was found again...",
                avatar: "load.png",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                gravity: "bottom"
              }).showToast();
            sessionStorage.clear()
            setTimeout(function(){
                window.open(window.location.href, "_self")
            }, 1800);
        }
    } else {
        if (navigator.onLine==false) {
            Toastify({
                text: "No internet connection",
                style: {
                  background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                },
                duration: -1,
                close: true,
                gravity: "bottom"
              }).showToast();
              sessionStorage.setItem("noInternetAlertShown", "1")
        }
    }
    setTimeout(function(){
        checkInternet()
    }, 2000);
}

checkInternet()

function after(a, b) {
    return a.substring(a.indexOf(b)+1);
}

let cmdtime = 0

function toasterror(a) {
    Toastify({
        text: a,
        style: {
          background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
          "font-family": "IBM Plex Mono, monospace"
        },
        gravity: "bottom"
      }).showToast();
}


function cmd(cmd) {
    if (cmd==null) {
        toasterror("Canceled")
    } else {
        if (cmd.startsWith("bg")) {
            console.log(after(cmd, " "))
            if (after(cmd, " ").trim() == "bg") {
                toasterror("ERROR: Missing value. \n> bg #color#\n_____^^^^^^^")
            } else {
                document.body.style.background=(after(cmd, " "))
            }
        } else if (cmd == "reset-location") {
            resetLoca()
        } else if (cmd.startsWith("fgc")) {
            console.log(after(cmd, " "))
            if (after(cmd, " ").trim() == "fgc") {
                toasterror("ERROR: Missing value. \n> fgc #color#\n______^^^^^^^")
            } else {
                document.body.style.color=(after(cmd, " "))
            }
        } else if (cmd.startsWith("set")) {
            configS("Custom (via debug)", after(cmd, " "), "70", "The following was set via debug")
        } else if (cmd.startsWith("load")) { 
            fetch(after(cmd, " ")+".sw")
                .then((response) => response.json())
                .then((data) => URLmod(data));

        } else if (cmd.startsWith("if rain")) {
            if (sessionStorage.getItem("cond")=="raining") {
                callCmd(after(after(cmd, " "), " "))
            }
        } else if (cmd.startsWith("if clear")) {
            if ((sessionStorage.getItem("cond")=="sunny") || (sessionStorage.getItem("cond")=="dark")) {
                callCmd(after(after(cmd, " "), " "))
            }
        } else if (cmd.startsWith("if cold")) {
            if ((sessionStorage.getItem("cond")=="cold")) {
                callCmd(after(after(cmd, " "), " "))
            }
        } else if (cmd.startsWith("if hot")) {
            if ((sessionStorage.getItem("cond")=="hot")) {
                callCmd(after(after(cmd, " "), " "))
            }
        } else if (cmd.startsWith("if cloudy")) {
            if ((sessionStorage.getItem("cond")=="partly cloudy") || (sessionStorage.getItem("cond")=="cloudy")) {
                callCmd(after(after(cmd, " "), " "))
            }
        } else if (cmd.startsWith("if snow")) {
            if ((sessionStorage.getItem("cond")=="snowing")) {
                callCmd(after(after(cmd, " "), " "))
            }
        } else if (cmd.startsWith("if storm")) {
            if ((sessionStorage.getItem("cond")=="thundering")) {
                callCmd(after(after(cmd, " "), " "))
            }
        } else if (cmd.startsWith("alert")) {
            toasterror(after(cmd, " "))
        } else {
            let lengthOfCmd = cmd.length
            let str = '^'.repeat(lengthOfCmd);
            toasterror("Command not found:\n> "+cmd+"\n__"+str)
        }
    }
}

function callCmd(c) {
    cmd(c)
}


function URLmod(data) {
    data.cmds.forEach(cm => {
        cmd(cm)
    });
}



// define a handler
function doc_keyUp(e) {
    if (e.ctrlKey && e.key == 'c') {
        cmdtime += 1
        if (cmdtime % 2 == 0) {
            let cmdtxt = prompt("Command Prompt:")
            cmd(cmdtxt)
        }
    }
    else if (e.ctrlKey && e.key === 'd') {
        if (document.getElementById("debug").style.display=="block") {
            console.log("DEBUG MODE OFF")
            document.getElementById("debug").style.display=("none")
        } else {
            console.log("DEBUG MODE ON")
            document.getElementById("debug").style.display=("block")
        }
    }
}
// register the handler 
document.addEventListener('keyup', doc_keyUp, false);
