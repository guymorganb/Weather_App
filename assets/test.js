const apiKey = '4edd926bb76ff29ea1c821dc6c88a3ca'       // link to maybe an external document?
//
//let cityName =' denver ' // link to the input box and trim it let  // let 
//let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`

let forecast = $('#daysContainer');
let searchHistory = $('hr');
let timer = 'null'
//let followMeOnInstagram = "https://www.instagram.com/guymorganb/"
// /////////////////////////////////////////////////////

async function getData(url){
    try{
        let response = await fetch(url)
        let weatherData = await response.json()
        return weatherData;
    }catch(error){
        console.log('Error:', error)
    }
}
// adds to local storage and generates a key automatically for sorting later
function putIntoLocalStorage(elementToStore){
    if(localStorage.length <= 8){
        let key = localStorage.length
        localStorage.setItem(key, elementToStore)
    }else(alert('To store other Cities please clear the list'))
}
// validate input against existing localStorage element to avoid duplicates
function checkInput(someInput){
    const isValid = /[a-zA-Z]/.test(someInput);
    if(!isValid){
        alert('Invalid input: AlphaNumeric Chars only, with no whitespace.')
        return
    }   
    else if(someInput == ''){
        alert('Invalid Input, spaces not allowed')
        return
    }    
    for(let i = 0; i <= localStorage.length; i++){
        let currentEntry = localStorage.getItem(localStorage.key(i))
    if (currentEntry == someInput){
        alert("Please input a non-duplicate entry")
        return
    }
    }putIntoLocalStorage(someInput)
    cleanUpDynamicElements()
    
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${someInput}&appid=${apiKey}`
    findCityData(queryURL)
}
function cleanUpDynamicElements(){
    for(let i = 0; i <= localStorage.length; i++){
        $('.city').remove()
    }timer = setTimeout(getFromLocalStorage,100)
}

// pulls data from local storage
function getFromLocalStorage(){ 
    if(localStorage.length <= 8){
    for(let i = 0; i < localStorage.length; i++){
        let cityName = localStorage.getItem(localStorage.key(i))
        let cityButton = $(`<button type="button" class="city">${cityName}</button>`)
        let redBtn = $(`<button type="button" class="delete">x</button>`)
        cityButton.append(redBtn)
        $('.clear').before(cityButton)
    }
    }
}
function clearAll(){
    localStorage.clear()
    $('input[type="search"]').focus()
    $('input[type="search"]').val('')
    cleanUpDynamicElements()
}
// function to remove items from local storage
function removeSingleElement(event){
    let redBtn = $(event.target);
    let buttonToRemove = redBtn.closest('.city')
    let cityValueString = buttonToRemove.text()
    cityValueString = cityValueString.slice(0, cityValueString.length-1)
    for(let i = 0; i < localStorage.length; i++){
        let itemToRemove = localStorage.getItem(localStorage.key(i))
        if(cityValueString == itemToRemove){
            localStorage.removeItem(localStorage.key(i))
            console.log('this ran')
        }
    }
    buttonToRemove.remove()
}

function init(){
    let srcBtn = $('.search')
    srcBtn.on('click', function (event){
        event.stopPropagation()
        event.preventDefault()
        let cityName = $('input[type="search"]').val().trim()
        
        checkInput(cityName)
        $('input[type="search"]').focus()
        $('input[type="search"]').val('')
    })
}
function findCityData (url){ getData(url).then(function(weatherData){
    console.log( weatherData)
    let lat = weatherData.coord.lat
    let long = weatherData.coord.lon
    let queryURL2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}`
    async function getFutureCast(){
        try{
            let response = await fetch(queryURL2)
            let futureCast = await response.json()
            // set the current weather here
            let currCity = weatherData.name;
            // future: add timezone offset to display localtime
            // dayjs.utc().format() 
            // console.log(dayjs.utc().format('M/D/YYYY hh:mm:ss'))
            // let timeZoneOffset = weatherData.sys.timezone
            // let localTime = dayjs(weatherData.coord.dt).format('hh:mm:ss')
            // console.log(localTime)
            let currDate = dayjs(weatherData.coord.dt).format('M/D/YYYY') 
            let currIcon = weatherData.weather[0].icon
            let currAlt = weatherData.weather[0].description
            let currTemp = parseFloat((weatherData.main.temp - 273.15)*(9/5)+32).toFixed(2)
            let currWind = weatherData.wind.speed
            let currhumidity = weatherData.main.humidity
            let currDisplay = $(`
            <div id="time">
             <h1 id="currentTown">${currCity}</h1>
              <span id="emoji">${currDate}
                <a class="aTag">
                 <img class="icon" src="http://openweathermap.org/img/wn/${currIcon}@2x.png" height="35px" alt="${currAlt}">
                </a>
              </span>
            </div>
            <ul id="status">
                <li id="temp">Temp: ${currTemp}ºF</li>
                <li id="wind">Wind: ${currWind} MPH</li>
                <li id="humidity">Humidity: ${currhumidity}%</li>
            </ul>`)
            $('#townData').append(currDisplay);
            return futureCast
        }
        catch(error){
            console.log('Error', error)
        }
    }
    // get the future cast
    getFutureCast().then(function(futureCast){
        console.log(futureCast)
         // sorts the list inside the json object in asscending order by the dt_txt property
         futureCast.list.sort(function(a, b) {     
            a.dt_txt - b.dt_txt;            
           });
           console.log(futureCast.list.length)
           for(let i=6; i<futureCast.list.length; i+=8){
            // loops through the futureCast of 5 days and append items from api
            let date = dayjs(futureCast.list[i].dt_txt).format('M/D/YYYY')
            let icon = futureCast.list[i].weather[0].icon
            let alt = futureCast.list[i].weather[0].description
            let temp = parseFloat(((futureCast.list[i].main.temp - 273.15)*(9/5)+32).toFixed(2))
            let windSpeed = parseFloat((futureCast.list[i].wind.speed).toFixed(2))
            let humidity = parseInt((futureCast.list[i].main.humidity))
            let weather5DayDisplay = $(`
            <div class="days">
             <h3>${date}<h3>
             <img class="icon" src="http://openweathermap.org/img/wn/${icon}@2x.png" height="35px" alt="${alt}">
             <ul id="status">
                <li id="temp">Temp: ${temp}ºF</li>
                <li id="wind">Wind: ${windSpeed} MPH</li>
                <li id="humidity">Humidity: ${humidity}%</li>
            </ul>
            </div>`)
            forecast.append(weather5DayDisplay)
           }
        })
////The weather entries duplicate when a new city is entered, you gotta clear the dynamically created elements when a new city is entered
})
}


document.addEventListener('DOMContentLoaded', function(){
    getFromLocalStorage()
    init()
    $(document).on('click', '.delete', removeSingleElement);
    $('.clear').click(clearAll)
})