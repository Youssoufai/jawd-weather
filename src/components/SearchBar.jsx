import { useState } from 'react';

const SearchBar = ({ onSearch, onUseLocation, loading }) => {
	const [city, setCity] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		const trimmedCity = city.trim();

		if (!trimmedCity) {
			return;
		}

		onSearch(trimmedCity);
		setCity('');
	};

	return (
		<form onSubmit={handleSubmit} className="search-bar">
			<input
				type="text"
				placeholder="Enter city name..."
				value={city}
				onChange={(event) => setCity(event.target.value)}
				className="search-input"
				disabled={loading}
			/>
			<button type="submit" className="search-button">
				Search
			</button>
			<button
				type="button"
				className="location-button"
				onClick={onUseLocation}
				disabled={loading}
			>
				Use My Location
			</button>
		</form>
	);
};

export default SearchBar;