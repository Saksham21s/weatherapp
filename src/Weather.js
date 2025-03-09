import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/weather.css';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Varanasi');
  const [latitude, setLatitude] = useState(25.3176);
  const [longitude, setLongitude] = useState(82.9739);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,windspeed_10m&current_weather=true`
        );
        setWeatherData(response.data);
        setError(null);
      } catch (err) {
        setError('Could not fetch weather data. Please check your network or city name.');
        console.error(err);
      }
    };
    fetchWeatherData();
  }, [latitude, longitude]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const geocodingResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      if (geocodingResponse.data.results && geocodingResponse.data.results.length > 0) {
        setLatitude(geocodingResponse.data.results[0].latitude);
        setLongitude(geocodingResponse.data.results[0].longitude);
        setError(null);
      } else {
        setError('City not found.');
      }
    } catch (err) {
      setError('Error geocoding city. Please try again.');
      console.error(err);
    }
  };

  const getWeatherIcon = (weatherCode) => {
    if ([1, 2, 3].includes(weatherCode)) return <WiCloudy className="weather-icon" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return <WiRain className="weather-icon" />;
    if ([71, 73, 75].includes(weatherCode)) return <WiSnow className="weather-icon" />;
    if ([95, 96, 99].includes(weatherCode)) return <WiThunderstorm className="weather-icon" />;
    if (weatherCode === 0) return <WiDaySunny className="weather-icon" />;
    return <WiDaySunny className="weather-icon" />;
  };

  const filteredHourlyData = () => {
    if (!weatherData || !weatherData.hourly) return [];
    const { time, temperature_2m, weathercode } = weatherData.hourly;
    const startIndex = time.findIndex((t) => new Date(t).getHours() === 0);
    return time
      .slice(startIndex)
      .filter((_, index) => index % 3 === 0)
      .slice(0, 8)
      .map((time, index) => ({
        time,
        temperature: temperature_2m[startIndex + index * 3],
        weathercode: weathercode[startIndex + index * 3],
      }));
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!weatherData) return <div className="loading">Loading...</div>;

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather in {city}</h1>
      <div className="search-bar">
        <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city" className="city-input" />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className="weather-content">
        <div className="current-weather">
          {weatherData.current_weather && (
            <>
              <div className="current-icon">{getWeatherIcon(weatherData.current_weather.weathercode)}</div>
              <p className="temperature">{weatherData.current_weather.temperature}°C</p>
              <p className="wind-speed">Wind Speed: {weatherData.current_weather.windspeed} km/h</p>
            </>
          )}
        </div>
        <div className="hourly-forecast">
          <h2>Hourly Forecast</h2>
          <div className="hourly-row">
            {filteredHourlyData().map((hour, index) => (
              <div key={index} className="hourly-item">
                <p className="hourly-time">{new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="hourly-icon">{getWeatherIcon(hour.weathercode)}</div>
                <p className="hourly-temp">{hour.temperature}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;