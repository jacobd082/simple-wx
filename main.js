// Copyright (c) Jacob Drath 2022

if (navigator.onLine==false) {
    Toastify({
        text: "No internet connection",
        style: {
          background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
        },
        gravity: "bottom"
      }).showToast();
}


if (localStorage.getItem("lat")==null) {} else {
    getWX()
}


function setZIP() {
    document.getElementById("zipr").innerHTML=("<img src='load.gif' width='40px'>Please wait...")
    fetch('https://api.openweathermap.org/geo/1.0/zip?zip='+document.getElementById("zip").value+','+document.getElementById("zip-c").value+'&appid=b4b150ac011d2c689bb0960425153055')
        .then(response => response.json())
        .then(data => handleZIP(data))
}
function handleZIP(e) {
    if (e.name==undefined) {
        document.getElementById("zipr").innerHTML=("<p style='color: red;'>ZIP Code is invalid</p>")
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
        document.getElementById("zipr").innerHTML=("<p>Location was saved as "+e.name+". Weather will open shortly... <img src='load.gif' width='40px'></p>")
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
    document.body.innerHTML=("<center><h1>Please wait... <img src='load.gif' width='40px'></h1><p>If this page stays, visit <a href='https://github.com/jacobd082/wx/issues/5#issuecomment-1159279625'>this help article</a></p></center>")
    fetch('https://api.openweathermap.org/data/2.5/weather?units=imperial&lat='+localStorage.getItem("lat")+'&lon='+localStorage.getItem("long")+'&appid=b4b150ac011d2c689bb0960425153055')
        .then(response => response.json())
        .then(data => showWX(data))
}


function showWX(w) {
    var l = w.name
    var temp = Math.floor(w.main.temp)
    if (localStorage.getItem("icon-show")=="1") {
        icon = "<img src='http://openweathermap.org/img/wn/"+w.weather[0].icon+"@2x.png' width='60px'><br>"
    } else {
        icon = ""
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
    }
    else if (w.weather[0].main=="Rain") {
        configS(l, "raining", temp, icon)
    } else if (w.weather[0].main=="Snow") {
        configS(l, "snowing", temp, icon)
    } else if (w.visibility<4000) {
        configS(l, "foggy", temp, icon)
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
    if (localStorage.showTemp==undefined) {localStorage.setItem("showTemp", "0")}
    showTemp = ""
    if (localStorage.showTemp=="1") {
        showTemp = "<p>The temperature is "+temp+"</p>"
    }
    document.body.innerHTML=('<div>Current Location: '+loca+ '. <a href="javascript:resetLoca()">Reset</a></div><div class="container"><div class="center">     <img src="Logo.png" width="15px"><span style="font-size:15px;margin: 0;">Simple Weather</span><br>'+icon+'<h1 style="margin-top: 2px;">It is '+cond+'.</h1>'+showTemp+'<p>Project by <a href="https://zzz.jacobdrath.co">Jacob Drath</a>.<br><a id="settings" href="settings">Settings</a></div></div>')

    // iOS config
    var a = location.href; 
    var b = a.substring(a.indexOf("?")+1);
    if (b=="ios=true") {
        document.getElementById("settings").style.display=("none")
    }
}


function resetLoca() {
    localStorage.removeItem("long")
    localStorage.removeItem("lat")
    window.open(window.location.href, "_self")
}