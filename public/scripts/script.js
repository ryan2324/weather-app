const bgImgContainer = $('.bgImgContainer')
const backgroundImage = $('#bg-img');
backgroundImage.css({'display': 'none'})
const txtContainer = $('.txtContainer')
const skeletonLoading = $('.skeletonLoading')
const reminder = $('.reminder')

const tempToggle = `
    <label class="tempSwitch">
        <p id="f">F°</p>
        <p id="c">C°</p>
        <input id='tempToggle' type="checkbox">
        <span><i class="fa-solid fa-temperature-full"></i></span>
    </label>`

const date = new Date();
const time = `${date.getHours()}:${date.getMinutes()} `
const itsDayTime = date.getHours() >= 5 && date.getHours() < 16;
bgImgContainer.css({"background-color": itsDayTime ? '#ffecb1': '#277082'})
let currentPosition = ''

const showPosition = (position) =>{
    currentPosition = position; 
    fethcApi()
    backgroundImage.css({'display': 'block'})
    skeletonLoading.css({'display': 'none'})
    reminder.css({"display": 'none'})
    txtContainer.append('<div class="weatherContainer"><h2 id="weather"></h2><img src="" id="icon"/></div>')
    txtContainer.append(`<div class='tempContainer'><p id="temp"></p>${tempToggle}</div>`)
    txtContainer.append('<p id="city"></p>')
}
const showError = (error) =>{
    fethcApi()
    backgroundImage.css({'display': 'block'})
    skeletonLoading.css({'display': 'none'})
    reminder.css({"display": 'none'})
    txtContainer.append('<div class="weatherContainer"><h2 id="weather"></h2><img src="" id="icon"/></div>')
    txtContainer.append(`<div class='tempContainer'><p id="temp"></p>${tempToggle}</div>`)
    txtContainer.append('<p id="city"></p>')
}
const getLocation = () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition, showError)
    }
    
}
getLocation()
const fethcApi = async () =>{
    const api = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${14.5995}&lon=${120.9842}&appid=4bbbfe8512b230689fa7e5c261939d06`)
    const weather =  $('#weather');
    const icon = $('#icon');
    const temp = $('#temp');
    const city = $('#city');
    const sky = api.data.weather[0].description;
    let tempInKelvin = api.data.main.feels_like - 273.15;
    const tempToggleBtn = $('#tempToggle')
    tempToggleBtn.on('click', (e) =>{
        if(e.target.checked){
            tempInKelvin = (tempInKelvin * (9 / 5)) + 32
            temp.text(`${parseFloat(tempInKelvin).toFixed(0)}°`)
            return
        }
        tempInKelvin = api.data.main.feels_like - 273.15;
        temp.text(`${parseFloat(tempInKelvin).toFixed(0)}°`)
    })
    const currentCity = api.data.name
    const weatherIcon = api.data.weather[0].icon
    const cloudy = sky === 'broken clouds' || sky === 'overcast clouds';
    console.log(api.data)
    if(cloudy && itsDayTime ){
        bgImgContainer.css({'background-color': '#dce5da'})
        weather.text('Cloudy')
        backgroundImage.attr('src', './assets/cloudy-day.jpg')
    }else if(cloudy && !itsDayTime){
        weather.text('Cloudy')
        backgroundImage.attr('src', './assets/cloudy-night.jpg')
    }else if(sky === 'scattered clouds' && itsDayTime){
        weather.text('Few Clouds')
        backgroundImage.attr('src', './assets/few-clouds-day.jpg')
    }else if(sky === 'scattered clouds' && !itsDayTime){
        weather.text('Few Clouds')
        backgroundImage.attr('src', './assets/few-clouds-night.jpg')
    }
    else if(sky === 'few clouds' && !itsDayTime){
        backgroundImage.attr('src', './assets/few-clouds-night.jpg')
        weather.text('Few Clouds')
    }else if(sky === 'few clouds' && itsDayTime){
        backgroundImage.attr('src', './assets/few-clouds-day.jpg')
        weather.text('Few Clouds')
    }else if(sky === 'clear sky' && itsDayTime){
        bgImgContainer.css({'background-color': '#ffecb1'})
        backgroundImage.attr('src', './assets/clear-sky-day.jpg')
        weather.text('Clear Sky')
    }else if(sky === 'clear sky' && !itsDayTime){
        backgroundImage.attr('src', './assets/clear-sky-night.jpg')
        weather.text('Clear Sky')
    }else if(api.data.weather[0].main === 'Rain' || api.data.weather[0].main === 'Drizzle' && itsDayTime){
        backgroundImage.attr('src', './assets/rainy-day.jpg')
        weather.text('Rainy Day')
    }else if(api.data.weather[0].main === 'Rain' || api.data.weather[0].main === 'Drizzle' && !itsDayTime){
        backgroundImage.attr('src', './assets/rainy-night.jpg')
        bgImgContainer.css({'background-color': '#3598ad'})
        weather.text('Rainy')
    }else if(api.data.weather[0].main === 'Thunderstorm' && itsDayTime){
        backgroundImage.attr('src', './assets/thunder-day.jpg')
        weather.text(sky)
    }else if(api.data.weather[0].main === 'Thunderstorm' && !itsDayTime){
        backgroundImage.attr('src', './assets/thunder-night.jpg')
        weather.text(sky)
    }
    temp.text(`${parseFloat(tempInKelvin).toFixed(0)}°`)
    city.text(currentCity)
    icon.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}@2x.png` )
}
