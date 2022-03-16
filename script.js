const cityDiv = document.getElementById('city');
const tempDiv = document.getElementById('temp');
const weatherDiv = document.getElementById('weather');
const highTempDiv = document.getElementById('high');
const lowTempDiv = document.getElementById('low');
const forecast0 = document.getElementById('0');
const forecast1 = document.getElementById('1');
const forecast2 = document.getElementById('2');
const forecast3 = document.getElementById('3');
const forecast4 = document.getElementById('4');
const forecast5 = document.getElementById('5');
const forecast6 = document.getElementById('6');
const forecast7 = document.getElementById('7');

//detailed info
const dTempDiv = document.getElementById('detailedTemp');
const feelsLikeDiv = document.getElementById('feels-like');
const cloudsDiv = document.getElementById('clouds');
const sunsetDiv = document.getElementById('sunset');
const sunriseDiv = document.getElementById('sunrise');
const humidityDiv = document.getElementById('humidity');
const cloudPercDiv = document.getElementById('cloudPerc');
const windSpeedDiv = document.getElementById('wind_speed');
const uviDiv = document.getElementById('uvi');

const API_KEY = '109d6fc9488b0e09125f891fd49dbe5b';

function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) =>{
        console.log(success);


        let {latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
            showSnowData(data);
            showDetailedData(data);
        })
    })
}

function showWeatherData(data){

    tempDiv.innerText = Math.round(data.current.temp) + '°';

    weatherDiv.innerText = data.current.weather[0].description;
}

function toInches(mm){
    return mm / 25.4;
}


function showSnowData(data){
    let descriptions = [];
    let dates = [];

    for (let i = 0; i < data.daily.length; i++) {
        let stamp = data.daily[i].dt;
        let date = new Date(stamp*1000);

        descriptions.push(data.daily[i].weather[0].description);
        dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
        
        let forecast = document.getElementById(i.toString());
        forecast.innerText = dates[i];

        let snowfall = toInches(data.daily[i].snow).toFixed(2);

        if (isNaN(snowfall)){
            snowfall = 0;
        }

        forecast.innerText += '\n' + descriptions[i] + ' · ' + snowfall + '"' + "  ";

        if (descriptions[i].includes('rain')){
            forecast.innerHTML += "<i id='rain' class='bx bx-cloud-light-rain' ></i>";
        }
        if (descriptions[i].includes('snow')){
            forecast.innerHTML += "<i id='snow' class='bx bx-cloud-snow' ></i>";
        }

        if (descriptions[i].includes('cloud')){
            forecast.innerHTML += "<i id='cloudy' class='bx bx-cloud' ></i>";
        }
        
        if (descriptions[i].includes('sky' || 'sun')){
            forecast.innerHTML += "<i id='clear' class='bx bx-sun' ></i>";
        }
    }

}

function showDetailedData(data){
    dTempDiv.innerText = Math.round(data.current.temp) + '°';
    feelsLikeDiv.innerText = Math.round(data.current.feels_like) + '°';

    let riseUnix = data.current.sunrise;
    let setUnix = data.current.sunset;

    let sunriseTime = new Date(riseUnix * 1000);
    let sunsetTime = new Date(setUnix * 1000);

    function formatTime(date){
        var hours = date.getHours();
        var minutes = date.getMinutes();

        var ampm = hours >= 12 ? 'pm' : 'am';

        hours %= 12;
        hours = hours ? hours : 12;

        minutes = minutes < 10 ? '0'+ minutes: minutes;

        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    sunriseDiv.innerText = formatTime(sunriseTime);
    sunsetDiv.innerText = formatTime(sunsetTime);

    humidityDiv.innerText = data.current.humidity + "%";
    cloudPercDiv.innerText = data.current.clouds + "%";
    windSpeedDiv.innerText = Math.floor(data.current.wind_speed);
    uviDiv.innerText = data.current.uvi;

}