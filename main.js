
if (localStorage.getItem("lat")==null) {} else {
    getWX()
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
        getWX()
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
      navigator.geolocation.getCurrentPosition(success, error, options);
}


function getWX () {
    document.body.innerHTML=("<center><h1>Please wait...</h1></center>")
    fetch('https://api.openweathermap.org/data/2.5/weather?units=imperial&lat='+localStorage.getItem("lat")+'&lon='+localStorage.getItem("long")+'&appid=b4b150ac011d2c689bb0960425153055')
        .then(response => response.json())
        .then(data => showWX(data))
}


function showWX(w) {
    var l = w.name
    var temp = Math.floor(w.main.temp)
    if (w.wind.speed>20) {
        configS(l, "windy")
    }
    if (temp<10) {
        configS(l, "cold")
    } else if (temp>90) {
        configS(l, "hot")
    } else if (w.visibility<4000) {
        configS(l, "foggy")
    } else if (w.wind.speed>18) {
        configS(l, "windy")
    } else if (w.weather[0].main=="Clouds") {
        configS(l, "cloudy")
        if (w.clouds.all<90) {
            configS(l, "partly cloudy")
        }
    } else if (w.weather[0].main=="Sun") {
        configS(l, "sunny")
    } else if (w.weather[0].main=="Rain") {
        configS(l, "raining")
    } else if (w.weather[0].main=="Snow") {
        configS(l, "snowing")
    } else if (w.weather[0].main=="Extreme") {
        configS(l, "bad")
    } else {
        configS(l, w.weather[0].description)
    }
}


function configS(loca, cond) {
    document.body.innerHTML=('<div>Current Location: '+loca+ '. <a href="javascript:setGPS()">Reset</a></div><div class="container"><div class="center">     <h1>It is '+cond+'.</h1><p>Project by <a href="https://zzz.jacobdrath.co">Jacob Drath</a>.<br><a href="settings">Settings</a></div></div>')
}
