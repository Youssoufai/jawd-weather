import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './ForecastCard';
import {
	clearErrors,
	fetchWeatherByCity,
	fetchWeatherByCoords,
	refreshWeatherForUnit,
	setErrorMessage,
	toggleTheme,
	toggleUnit,
} from './store/weatherSlice';

const App = () => {
	const dispatch = useDispatch();
	const { weatherData, forecastData, loading, error, forecastError, theme, unit } =
		useSelector((state) => state.weather);

	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
	}, [theme]);

	const handleSearch = (city) => {
		dispatch(fetchWeatherByCity({ city }));
	};

	const handleUseLocation = () => {
		dispatch(clearErrors());

		if (!navigator.geolocation) {
			dispatch(setErrorMessage('Geolocation is not supported by this browser.'));
			return;
		}

		if (!window.isSecureContext) {
			dispatch(
				setErrorMessage(
					'Location needs a secure context (HTTPS or localhost). Open this app on localhost or HTTPS and try again.',
				),
			);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					await dispatch(
						fetchWeatherByCoords({
							lat: position.coords.latitude,
							lon: position.coords.longitude,
						}),
					).unwrap();
				} catch (requestError) {
					dispatch(
						setErrorMessage(
							requestError?.message ||
								'Unable to fetch weather for your location. Try again.',
						),
					);
				}
			},
			(locationError) => {
				const message =
					locationError.code === 1
						? 'Location access denied. Please allow permission and retry.'
						: locationError.code === 3
							? 'Location request timed out. Please retry.'
						: 'Unable to get your location. Try searching by city.';
				dispatch(setErrorMessage(message));
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	};

	const handleToggleTheme = () => {
		dispatch(toggleTheme());
	};

	const handleToggleUnit = () => {
		dispatch(toggleUnit());
		dispatch(refreshWeatherForUnit());
	};

	const unitSymbol = unit === 'metric' ? 'C' : 'F';
	const windUnit = unit === 'metric' ? 'm/s' : 'mph';

	return (
		<div className="app" data-theme={theme}>
			<div className="app-controls">
				<button type="button" className="theme-toggle" onClick={handleToggleTheme}>
					{theme === 'light' ? 'Dark mode' : 'Light mode'}
				</button>
				<button type="button" className="unit-toggle" onClick={handleToggleUnit}>
					{unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
				</button>
			</div>
			<h1>Weather App</h1>
			<SearchBar
				onSearch={handleSearch}
				onUseLocation={handleUseLocation}
				loading={loading}
			/>

			{loading && <div className="loading">Loading...</div>}
			{error && <div className="error">{error}</div>}
			{weatherData && (
				<WeatherCard
					weatherData={weatherData}
					unitSymbol={unitSymbol}
					windUnit={windUnit}
				/>
			)}
			{weatherData && forecastData.length > 0 && (
				<ForecastCard forecast={forecastData} unitSymbol={unitSymbol} />
			)}
			{forecastError && <div className="error forecast-error">{forecastError}</div>}
		</div>
	);
};

export default App;