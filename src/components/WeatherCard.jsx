const WeatherCard = ({ weatherData, unitSymbol, windUnit }) => {
	if (!weatherData) return null;

	const {
		name,
		main: { temp, humidity, feels_like: feelsLike },
		weather,
		wind: { speed },
	} = weatherData;

	const displayTemp = Number(temp).toFixed(1);
	const displayFeelsLike = Number(feelsLike).toFixed(1);

	return (
		<div className="weather-card">
			<h2>{name}</h2>
			<div className="weather-icon">
				<img
					src={`https://openweathermap.org/img/w/${weather[0].icon}.png`}
					alt={weather[0].description}
				/>
				<p>{weather[0].description}</p>
			</div>
			<div className="weather-info">
				<p>Temperature: {displayTemp} {unitSymbol}</p>
				<p>Feels like: {displayFeelsLike} {unitSymbol}</p>
				<p>Humidity: {humidity}%</p>
				<p>Wind Speed: {Number(speed).toFixed(1)} {windUnit}</p>
			</div>
		</div>
	);
};

export default WeatherCard;