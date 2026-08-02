Weather App - Added Functionality

This project is a React weather application that fetches live weather data from OpenWeatherMap and displays dynamic results in the UI.

Added features:
- Search weather by city name.
- Fetch current weather data from OpenWeatherMap.
- Display weather details such as temperature, feels like, humidity, wind speed, and description.
- Show a 5-day forecast using forecast API data.
- Use my location feature to get local weather through browser geolocation.
- Dark and light theme toggle that changes the app appearance, including the page background.
- Celsius/Fahrenheit unit conversion with live refetching of weather data.
- Redux state management for weather data, forecast data, theme, and unit settings.
- Responsive layout and styled UI for desktop and mobile screens.

Notes:
- The app requires an OpenWeatherMap API key in the .env file.
- Geolocation works best on localhost or HTTPS because browsers block location access on insecure pages.
- The app is built with Vite and React.
