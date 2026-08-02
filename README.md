# Weather App Tutorial Project

This project implements the Weather App flow from Dr. Isah Charles Saidu's tutorial: fetching API data and displaying dynamic content in React.

## Implemented Tutorial Sections

1. Project setup for React development (using Vite in this workspace).
2. Component structure:
	- Search bar component
	- Weather card component
3. API data fetching in the app component.
4. Styling for UI and states.
5. Optional 5-day forecast component scaffold.

## Project Structure

- src/components/SearchBar.jsx
- src/components/WeatherCard.jsx
- src/ForecastCard.jsx
- src/App.jsx
- src/index.css

## API Key Setup

Create or update `.env` with:

VITE_WEATHER_API_KEY=your_openweathermap_api_key

Compatibility fallback is also supported:

REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key

## Run the Application

Install dependencies:

npm install

Start dev server:

npm run dev

Build for production:

npm run build

Lint code:

npm run lint

## Notes

- The original tutorial uses Create React App commands, while this implementation uses Vite.
- Application behavior and component responsibilities still align with the tutorial objectives.
