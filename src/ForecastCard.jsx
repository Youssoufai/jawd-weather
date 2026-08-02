const ForecastCard = ({ forecast, unitSymbol }) => {
	if (!forecast || forecast.length === 0) {
		return null;
	}

	const getDayName = (dateString) => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const date = new Date(dateString);
		return days[date.getDay()];
	};

	return (
		<div className="forecast-container">
			<h3>5-Day Forecast</h3>
			<div className="forecast-list">
				{forecast.map((day) => (
					<div key={day.date} className="forecast-card">
						<p className="forecast-day">{getDayName(day.date)}</p>
						<img
							src={`https://openweathermap.org/img/w/${day.icon}.png`}
							alt={day.description}
						/>
						<p className="forecast-temp">{Number(day.temp).toFixed(1)} {unitSymbol}</p>
						<p className="forecast-desc">{day.description}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default ForecastCard;