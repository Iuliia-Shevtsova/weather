
const cityName = document.getElementById('city').value;
const button = document.getElementById('search'); 
const weatherForecast = document.getElementById('info');
var latitude = '';
var longitude ='';
//var dailyWeatherURL ='';

/*****ASYNC FUNCTIONS******/
async function getJSON(url) {
    try {
        const response = await fetch(url);
        const responseJSON = response.json();
        console.log(responseJSON); //all data in the Object is shown in the console, can see names of objects inside
        return await responseJSON;
    } catch (error) {
        throw error;
    }
}

/*****HELPER FUNCTIONS******/
async function getCityCoord(url) {//create async function
    const dataObject = await getJSON(url);
    latitude = dataObject.coord.lat;
    longitude = dataObject.coord.lon;
    console.log(latitude);
    console.log(longitude);

    
    var html = ''; //data from 1st arraay of data, it's index = 0
    html +=`
        <p><strong>City: </strong>${dataObject.name}</p> 
        <p><strong>Country: </strong>${dataObject.sys.country}</p>
        <p><strong>Current weather: </strong>${dataObject.weather[0].description}</p>
        `;
    weatherForecast.innerHTML = html;

    return Promise.all([dataObject, latitude, longitude]);
}

async function getDailyWeather(data) {//create async function
    console.log(data);
    var dailyWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data[1] +'&lon=' + data[2] + '&units=metric&appid=e83fdeb92943c0451d9ba3b84ad16981';
    var dailyWeather = getJSON(dailyWeatherURL);
    return dailyWeather;
}

// function currentWeatherHTML(data) { //function for current weather, shows City and Country names, current weather   
//     console.log(data);
//     var html = ''; //data from 1st arraay of data, it's index = 0
//     html +=`
//         <p><strong>City: </strong>${data[0].name}</p> 
//         <p><strong>Country: </strong>${data[0].sys.country}</p>
//         <p><strong>Current weather: </strong>${data[0].weather[0].description}</p>
//         `;
//     weatherForecast.innerHTML = html;
// }  



function dailyWeatherHTML(data) { //function for daily weather  
    var html2 ='';
    var table = document.createElement('table'); //data from 2nd array of data, it's index = 1
    table.className = 'table';

    html2 +=` 
        <thead class="thead-light">
            <th>day</th>
            <th>min</th>
            <th>max</th>
            <th>weather</th>
        </thead>
        `;
    table.innerHTML = html2;
    weatherForecast.appendChild(table);
    
    var tbody = document.createElement('tbody'); 
    var html3 ='';

    for (let i=0; i<data.daily.length; i++){//data from 2nd array of data, it's index = 1
        html3 +=` 
            <tr>      
            <td>${i+1}</td>
            <td>${data.daily[i].temp.min}</td> 
            <td>${data.daily[i].temp.max}</td>
            <td><img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png"></img></td>
            </tr>  
        `;
    }

    tbody.innerHTML = html3;
    table.appendChild(tbody);
}

/*****EVENT LISTENER******/
button.addEventListener('click', (event) => {
    const cityName = document.getElementById('city').value;
    const currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ cityName + '&appid=e83fdeb92943c0451d9ba3b84ad16981';
    //const dailyWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude +'&lon=' + longitude + '&%20exclude=daily&appid=e83fdeb92943c0451d9ba3b84ad16981';
    //const dailyWeatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude +'&lon=' + longitude + '&units=metric&appid=e83fdeb92943c0451d9ba3b84ad16981';

    if (cityName.length == 0) {
        return window.alert('Enter name of the City');
    } else {
        
        getCityCoord(currentWeatherURL)
        //.then(currentWeatherHTML)
        .then(getDailyWeather)
        .then(dailyWeatherHTML)
        .catch ( e => {
            console.error(e);
            alert('City is not find.');
        });
    }
  });

