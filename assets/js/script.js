let weatherSelect = document.querySelector('.weather-select');
let weatherData = document.querySelector('.weather-data');
let title = document.querySelector(".wd-title");

cities = [
    {
        "lat":44.179249,
        "lng":28.649940
    },
    {
        "lat":44.439663,
        "lng":26.096306
    },
    {
        "lat":46.770439,
        "lng":23.591423
    },
]

titles = [
    'Vreme Constanta, Romania','Vreme Bucuresti, Romania','Vreme Cluj-Napoca, Romania'
]

function getWeather(lat,lng){
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        let date = Math.floor((new Date()).getTime() / 1000);
        request.open("GET", `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=airTemperature,pressure,humidity,precipitation,windSpeed&start=${date}&end=${date}`);
        request.setRequestHeader('Authorization', 'bd6044dc-df6b-11ec-becb-0242ac130002-bd6045c2-df6b-11ec-becb-0242ac130002');
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader("server", "gunicorn/19.9.0");
        request.send();
        request.onload = () => {
            if(request.status == 200) {
                data = JSON.parse(request.response);
                resolve(data);
            }
        }
    });
}

async function loadData(i){
    lat = cities[i]['lat'];
    lng = cities[i]['lng'];
    data =  await getWeather(lat,lng);
    return data;
}

function renderData(data){
    let humidity = data['hours'][0]['humidity']['noaa'];
    let airTemperature = data['hours'][0]['airTemperature']['noaa'];
    let windSpeed = data['hours'][0]['windSpeed']['noaa'];
    let precipitation = data['hours'][0]['precipitation']['noaa'];
    let airPressure = data['hours'][0]['pressure']['noaa'];
    let longitude = data['meta']['lng'];
    let latitude = data['meta']['lat'];
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    let date = today.toLocaleDateString("en-US", options);
    
    let datArray = [
        humidity,airTemperature,windSpeed,precipitation,airPressure,longitude,latitude,date
    ]
    
    let documentBlocks = document.querySelectorAll('.item.multiple-desktop');
    documentBlocks.forEach((element, index) => {
        span = element.querySelector('.item-content');
        span.innerHTML = datArray[index];
    });
}

async function handleInput(e){
    option = document.querySelector('.ws-select').value;
    if(option != 0) {
       data = await loadData(option-1);
       renderData(data);
       weatherData.style.display="block";
       weatherSelect.style.display="none";
       title.innerHTML = titles[option-1];
    }else{
        alert("Eroare! Nu ati selectat niciun oras");
    } 
}

let wsButton = document.querySelector('.ws-button');
wsButton.addEventListener('click',handleInput);

// IN CAZUL IN CARE API UL ESTE APELAT DE MAI MULT DE 10 ORI FOLOSESTI ASTA
// let data;
// if(1) {
//     data = {
//         "hours": [
//             {
//                 "airTemperature": {
//                     "dwd": 21.72,
//                     "noaa": 24.08,
//                     "sg": 21.72
//                 },
//                 "humidity": {
//                     "dwd": 71.34,
//                     "noaa": 47.4,
//                     "sg": 71.34
//                 },
//                 "precipitation": {
//                     "dwd": 0.0,
//                     "noaa": 0.0,
//                     "sg": 0.0
//                 },
//                 "pressure": {
//                     "dwd": 1017.08,
//                     "noaa": 1016.42,
//                     "sg": 1017.08
//                 },
//                 "time": "2022-06-17T12:00:00+00:00",
//                 "windSpeed": {
//                     "icon": 5.94,
//                     "noaa": 6.07,
//                     "sg": 5.94
//                 }
//             }
//         ],
//         "meta": {
//             "cost": 1,
//             "dailyQuota": 10,
//             "end": "2022-06-17 12:28",
//             "lat": 44.179249,
//             "lng": 28.64994,
//             "params": [
//                 "airTemperature",
//                 "pressure",
//                 "humidity",
//                 "precipitation",
//                 "windSpeed"
//             ],
//             "requestCount": 1,
//             "start": "2022-06-17 12:00"
//         }
//     }
// }
