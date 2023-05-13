const apiKey = '4edd926bb76ff29ea1c821dc6c88a3ca'
let cityName ='Seatle'
//let cityName = $('input[type="search"]').val();
let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=Denver&appid=4edd926bb76ff29ea1c821dc6c88a3ca'

// /////////////////////////////////////////////////////
function fetchData() {
    return fetch(queryURL)
      .then(function(response) {
        if (response.status !== 200) {
          throw new Error('Error');
        } else {
          return response.json();
        }
      });
  }
  
  async function getData() {
    try {
      const weatherData = await fetchData();
      // Manipulate the weatherData or perform any other operations
      console.log(weatherData);
      console.log(weatherData.weather);
      console.log(weatherData.weather[0].icon);
    } catch (error) {
      console.log(error);
    }
  }

getData().humidity