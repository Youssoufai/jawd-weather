import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const API_KEY =
	import.meta.env.VITE_WEATHER_API_KEY ||
	import.meta.env.REACT_APP_WEATHER_API_KEY;

const selectFiveDayForecast = (forecastList) => {
	const today = new Date().toISOString().split('T')[0];
	const bestByDate = new Map();

	for (const entry of forecastList) {
		const [datePart, timePart] = entry.dt_txt.split(' ');

		if (datePart === today) {
			continue;
		}

		const hour = Number(timePart.split(':')[0]);
		const score = Math.abs(hour - 12);
		const existing = bestByDate.get(datePart);

		if (!existing || score < existing.score) {
			bestByDate.set(datePart, { score, entry });
		}
	}

	return [...bestByDate.entries()]
		.sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
		.slice(0, 5)
		.map(([date, { entry }]) => ({
			date,
			icon: entry.weather[0].icon,
			description: entry.weather[0].description,
			temp: entry.main.temp,
		}));
};

const fetchCurrentAndForecast = async ({ query, unit }) => {
	if (!API_KEY) {
		throw new Error('Missing API key. Add VITE_WEATHER_API_KEY in .env');
	}

	const weatherParams = new URLSearchParams({ ...query, appid: API_KEY, units: unit });
	const weatherResponse = await fetch(`${WEATHER_URL}?${weatherParams.toString()}`);

	if (!weatherResponse.ok) {
		const errorData = await weatherResponse.json();
		throw new Error(errorData.message || 'City not found');
	}

	const weather = await weatherResponse.json();

	let forecast;
	let forecastError = null;

	try {
		const forecastParams = new URLSearchParams({ ...query, appid: API_KEY, units: unit });
		const forecastResponse = await fetch(`${FORECAST_URL}?${forecastParams.toString()}`);

		if (!forecastResponse.ok) {
			throw new Error('Failed to load forecast data');
		}

		const forecastApiData = await forecastResponse.json();
		forecast = selectFiveDayForecast(forecastApiData.list);
	} catch {
		forecast = [];
		forecastError = 'Current weather loaded, but forecast is unavailable.';
	}

	return { weather, forecast: forecast || [], forecastError };
};

export const fetchWeatherByCity = createAsyncThunk(
	'weather/fetchByCity',
	async ({ city }, { getState }) => {
		const { unit } = getState().weather;
		return fetchCurrentAndForecast({ query: { q: city }, unit });
	},
);

export const fetchWeatherByCoords = createAsyncThunk(
	'weather/fetchByCoords',
	async ({ lat, lon }, { getState }) => {
		const { unit } = getState().weather;
		return fetchCurrentAndForecast({ query: { lat: String(lat), lon: String(lon) }, unit });
	},
);

export const refreshWeatherForUnit = createAsyncThunk(
	'weather/refreshForUnit',
	async (_, { getState }) => {
		const { weatherData, unit } = getState().weather;

		if (!weatherData) {
			return null;
		}

		if (weatherData.coord?.lat && weatherData.coord?.lon) {
			return fetchCurrentAndForecast({
				query: {
					lat: String(weatherData.coord.lat),
					lon: String(weatherData.coord.lon),
				},
				unit,
			});
		}

		return null;
	},
);

const weatherSlice = createSlice({
	name: 'weather',
	initialState: {
		weatherData: null,
		forecastData: [],
		loading: false,
		error: null,
		forecastError: null,
		theme: 'light',
		unit: 'metric',
	},
	reducers: {
		toggleTheme: (state) => {
			state.theme = state.theme === 'light' ? 'dark' : 'light';
		},
		toggleUnit: (state) => {
			state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
		},
		setErrorMessage: (state, action) => {
			state.error = action.payload;
		},
		clearErrors: (state) => {
			state.error = null;
			state.forecastError = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWeatherByCity.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.forecastError = null;
			})
			.addCase(fetchWeatherByCity.fulfilled, (state, action) => {
				state.loading = false;
				state.weatherData = action.payload.weather;
				state.forecastData = action.payload.forecast;
				state.forecastError = action.payload.forecastError;
			})
			.addCase(fetchWeatherByCity.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Unable to fetch weather';
				state.weatherData = null;
				state.forecastData = [];
				state.forecastError = null;
			})
			.addCase(fetchWeatherByCoords.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.forecastError = null;
			})
			.addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
				state.loading = false;
				state.weatherData = action.payload.weather;
				state.forecastData = action.payload.forecast;
				state.forecastError = action.payload.forecastError;
			})
			.addCase(fetchWeatherByCoords.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Unable to fetch weather';
				state.weatherData = null;
				state.forecastData = [];
				state.forecastError = null;
			})
			.addCase(refreshWeatherForUnit.pending, (state) => {
				if (state.weatherData) {
					state.loading = true;
					state.error = null;
					state.forecastError = null;
				}
			})
			.addCase(refreshWeatherForUnit.fulfilled, (state, action) => {
				state.loading = false;
				if (action.payload) {
					state.weatherData = action.payload.weather;
					state.forecastData = action.payload.forecast;
					state.forecastError = action.payload.forecastError;
				}
			})
			.addCase(refreshWeatherForUnit.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Unable to refresh weather';
			});
	},
});

export const { toggleTheme, toggleUnit, setErrorMessage, clearErrors } =
	weatherSlice.actions;

export default weatherSlice.reducer;
