document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = '95e0994f5f2e4efd8d8143103252405';
    const buscarBtn = document.getElementById('buscar-btn');
    const buscador = document.getElementById('buscador');

    // datos iniciales
    fetchWeatherData('San Vicente Del Raspeig');

    // botón de búsqueda
    buscarBtn.addEventListener('click', function () {
        const ciudad = buscador.value.trim();
        if (ciudad) {
            fetchWeatherData(ciudad);
        }
    });

    // Evento para la tecla Enter
    buscador.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const ciudad = buscador.value.trim();
            if (ciudad) {
                fetchWeatherData(ciudad);
            }
        }
    });

    function fetchWeatherData(ciudad) {
        // tiempo actual y pronóstico
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${ciudad}&days=3&aqi=no&alerts=no&lang=es`)
            .then(response => response.json())
            .then(data => {
                updateCurrentWeather(data);
                updateForecast(data);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('No se pudo obtener la información del clima. Por favor, intente con otra ciudad.');
            });

        // datos de ayer
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        fetch(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${ciudad}&dt=${yesterdayStr}`)
            .then(response => response.json())
            .then(data => {
                updateYesterdayData(data);
            })
            .catch(error => {
                console.error('Error fetching yesterday weather data:', error);
            });
    }

    function updateCurrentWeather(data) {
        // Actualizar ubicación
        document.getElementById('location').textContent = `${data.location.name}, ${data.location.country}`;

        // Actualizar información principal
        document.getElementById('temp').textContent = data.current.temp_c;
        document.getElementById('feelslike').textContent = data.current.feelslike_c;
        document.getElementById('humidity').textContent = data.current.humidity;
        document.getElementById('wind').textContent = data.current.wind_kph;
        document.getElementById('visibility').textContent = data.current.vis_km;
        document.getElementById('cloud').textContent = data.current.cloud;

        // Icono principal del clima
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.src = `https:${data.current.condition.icon}`;
        weatherIcon.alt = data.current.condition.text;

        // Sección HOY (resumen)
        document.getElementById('today-temp').textContent = data.current.temp_c;
        const todayIcon = document.getElementById('today-icon');
        todayIcon.src = `https:${data.current.condition.icon}`;
        todayIcon.alt = data.current.condition.text;

        // Sección HOY (detalles)
        const todayDetails = document.getElementById('today-details');
        todayDetails.innerHTML = `
            <p><strong>Condición:</strong> ${data.current.condition.text}</p>
            <p><strong>Máx/Mín:</strong> ${data.forecast.forecastday[0].day.maxtemp_c}°/${data.forecast.forecastday[0].day.mintemp_c}°</p>
            <p><strong>Lluvia:</strong> ${data.forecast.forecastday[0].day.totalprecip_mm}mm (${data.forecast.forecastday[0].day.daily_chance_of_rain}%)</p>
            <p><strong>Viento:</strong> ${data.current.wind_kph} km/h</p>
            <p><strong>Humedad:</strong> ${data.current.humidity}%</p>
            <p><strong>Índice UV:</strong> ${data.current.uv}</p>
            <p><strong>Amanecer:</strong> ${data.forecast.forecastday[0].astro.sunrise}</p>
            <p><strong>Atardecer:</strong> ${data.forecast.forecastday[0].astro.sunset}</p>
            <p><strong>Fase lunar:</strong> ${data.forecast.forecastday[0].astro.moon_phase}</p>
        `;

        // Pronóstico por horas (8 horas)
        const hourlyForecast = document.querySelector('.hourly-forecast');
        hourlyForecast.innerHTML = '';

        const hoursToShow = [0, 3, 6, 9, 12, 15, 18, 21];
        hoursToShow.forEach(hourIndex => {
            const hour = data.forecast.forecastday[0].hour[hourIndex];
            const hourElement = document.createElement('article');
            hourElement.innerHTML = `
                <p>${hour.time.split(' ')[1]}</p>
                <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
                <p>${hour.temp_c}°C</p>
            `;
            hourlyForecast.appendChild(hourElement);
        });
    }

    function updateForecast(data) {
        const tomorrow = data.forecast.forecastday[1];

        // Temperatura promedio y icono
        document.getElementById('tomorrow-temp').textContent = tomorrow.day.avgtemp_c;
        const tomorrowIcon = document.getElementById('tomorrow-icon');
        tomorrowIcon.src = `https:${tomorrow.day.condition.icon}`;
        tomorrowIcon.alt = tomorrow.day.condition.text;

        // Detalles
        const tomorrowForecast = document.getElementById('tomorrow-forecast');
        tomorrowForecast.innerHTML = `
            <p><strong>Condición:</strong> ${tomorrow.day.condition.text}</p>
            <p><strong>Máx/Mín:</strong> ${tomorrow.day.maxtemp_c}°/${tomorrow.day.mintemp_c}°</p>
            <p><strong>Lluvia:</strong> ${tomorrow.day.totalprecip_mm}mm (${tomorrow.day.daily_chance_of_rain}%)</p>
            <p><strong>Viento:</strong> ${tomorrow.day.maxwind_kph} km/h</p>
            <p><strong>Humedad:</strong> ${tomorrow.day.avghumidity}%</p>
            <p><strong>Índice UV:</strong> ${tomorrow.day.uv}</p>
            <p><strong>Amanecer:</strong> ${tomorrow.astro.sunrise}</p>
            <p><strong>Atardecer:</strong> ${tomorrow.astro.sunset}</p>
        `;
    }

    function updateYesterdayData(data) {
        const yesterday = data.forecast.forecastday[0];

        // Temperatura y icono
        document.getElementById('yesterday-temp').textContent = yesterday.day.avgtemp_c;
        const yesterdayIcon = document.getElementById('yesterday-icon');
        yesterdayIcon.src = `https:${yesterday.day.condition.icon}`;
        yesterdayIcon.alt = yesterday.day.condition.text;

        // Detalles
        const yesterdayComparison = document.getElementById('yesterday-comparison');
        yesterdayComparison.innerHTML = `
            <p><strong>Condición:</strong> ${yesterday.day.condition.text}</p>
            <p><strong>Máx/Mín:</strong> ${yesterday.day.maxtemp_c}°/${yesterday.day.mintemp_c}°</p>
            <p><strong>Lluvia:</strong> ${yesterday.day.totalprecip_mm}mm</p>
            <p><strong>Viento:</strong> ${yesterday.day.maxwind_kph} km/h</p>
            <p><strong>Humedad:</strong> ${yesterday.day.avghumidity}%</p>
            <p><strong>Visibilidad media:</strong> ${yesterday.day.avgvis_km} km</p>
            <p><strong>Horas de sol:</strong> ${yesterday.day.uv}</p>
        `;
    }
});
