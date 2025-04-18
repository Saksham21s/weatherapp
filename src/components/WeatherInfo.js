// WeatherInfo.js
import React from "react";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiNightClear } from "react-icons/wi";
import straightWind from "../assets/straight-wind.png";
import leftWind from "../assets/left-wind.png";
import rightWind from "../assets/right-wind.png";
import TemperatureChart from "./TemperatureChart";
import Loader from "./Loader";

const WeatherInfo = ({ weatherData, isDarkMode, locationName }) => {
    if (!weatherData || Object.keys(weatherData).length === 0) {
        return <Loader />;
    }

    const { current_weather, daily, hourly, timezone } = weatherData;

    const getDayOrNightInfo = () => {
        const now = new Date();
        const locationTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
        const hour = locationTime.getHours();
        if (hour >= 6 && hour < 18) {
            return { icon: <WiDaySunny className="day-night-icon" />, label: "Day" };
        } else {
            return { icon: <WiNightClear className="day-night-icon" />, label: "Night" };
        }
    };

    const getWeatherType = (weatherCode) => {
        const code = weatherCode ?? 0;
        const types = {
            0: "Sunny",
            1: "Cloudy",
            2: "Cloudy",
            3: "Cloudy",
            51: "Rainy",
            53: "Rainy",
            55: "Rainy",
            61: "Rainy",
            63: "Rainy",
            65: "Rainy",
            71: "Snowy",
            73: "Snowy",
            75: "Snowy",
            80: "Rainy",
            81: "Rainy",
            82: "Rainy",
            95: "Thunderstorm",
            96: "Thunderstorm",
            99: "Thunderstorm",
        };
        return types[code] || "Sunny";
    };

    const getWeatherIcon = (weatherCode) => {
        const code = weatherCode ?? 0;
        const icons = {
            0: <WiDaySunny className="weather-icon" />,
            1: <WiCloudy className="weather-icon" />,
            2: <WiCloudy className="weather-icon" />,
            3: <WiCloudy className="weather-icon" />,
            51: <WiRain className="weather-icon" />,
            53: <WiRain className="weather-icon" />,
            55: <WiRain className="weather-icon" />,
            61: <WiRain className="weather-icon" />,
            63: <WiRain className="weather-icon" />,
            65: <WiRain className="weather-icon" />,
            71: <WiSnow className="weather-icon" />,
            73: <WiSnow className="weather-icon" />,
            75: <WiSnow className="weather-icon" />,
            80: <WiRain className="weather-icon" />,
            81: <WiRain className="weather-icon" />,
            82: <WiRain className="weather-icon" />,
            95: <WiThunderstorm className="weather-icon" />,
            96: <WiThunderstorm className="weather-icon" />,
            99: <WiThunderstorm className="weather-icon" />,
        };
        return icons[code] || <WiDaySunny className="weather-icon" />;
    };

    const getWindDirectionImage = (windDirection) => {
        if ((windDirection >= 0 && windDirection < 45) || (windDirection >= 315 && windDirection <= 360)) {
            return straightWind;
        } else if (windDirection >= 45 && windDirection < 135) {
            return leftWind;
        } else if (windDirection >= 225 && windDirection < 315) {
            return rightWind;
        } else {
            return straightWind;
        }
    };

    const getHourlyForecastItems = () => {
        if (!hourly || !hourly.time || !hourly.windspeed_10m || !hourly.temperature_2m) {
            return [];
        }

        const now = new Date();
        const locationTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
        const locationNow = locationTime.getTime();

        const maxCards = window.innerWidth <= 480 ? 6 : 5;

        return hourly.time
            .map((time, index) => {
                const parsedTime = new Date(time);
                return {
                    time: parsedTime,
                    temperature: hourly.temperature_2m[index] ?? "--",
                    windspeed: hourly.windspeed_10m[index] ?? "--",
                    winddirection: hourly.winddirection_10m[index] ?? 0,
                    weathercode: hourly.weathercode[index] ?? 0,
                };
            })
            .filter((entry) => entry.time.getTime() > locationNow)
            .slice(0, maxCards);
    };

    const formatDate = () => {
        try {
            return new Date().toLocaleDateString("en-US", {
                timeZone: timezone,
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        } catch {
            return new Date().toLocaleDateString("en-US");
        }
    };

    const hourlyTemperatures = hourly?.temperature_2m?.slice(0, 24) || [];
    const hourlyTimes = hourly?.time?.slice(0, 24).map((time) => new Date(time).toLocaleTimeString("en-US", { hour: "numeric" })) || [];

    return (
        <div className={`weather-info-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
            <div className="top-cards">
                <div className="weather-card location-card">
                    <h2 className="location-name">{locationName || "Current Location"}</h2>
                    <div className="current-time">
                        {new Date().toLocaleTimeString("en-US", {
                            timeZone: timezone,
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                    <div className="day-night-indicator">
                        {getDayOrNightInfo().icon}
                        <p>{getDayOrNightInfo().label}</p>
                    </div>
                    <p className="current-date">{formatDate()}</p>
                </div>

                <div className="weather-card current-weather-card">
                    <h2>Current Weather</h2>
                    <div className="current-weather-content">
                        <div className="weather-details">
                            <div className="temperature">{current_weather?.temperature ?? "--"}°C</div>
                            {getWeatherIcon(current_weather?.weathercode)}
                            <div className="weather-type">{getWeatherType(current_weather?.weathercode)}</div>
                        </div>
                        <div className="chart-container">
                            <TemperatureChart hourlyTemperatures={hourlyTemperatures} hourlyTimes={hourlyTimes} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="forecast-container">
                <div className="weather-card daily-forecast-card">
                    <h2>Daily Forecast</h2>
                    <div className="daily-forecast-items">
                        {(daily?.time || []).slice(0, 5).map((time, index) => (
                            <div className="daily-forecast-item" key={time}>
                                {getWeatherIcon(daily?.weathercode?.[index])}
                                <div className="forecast-temp">{daily?.temperature_2m_max?.[index] ?? "--"}°C</div>
                                <div className="forecast-date">
                                    {new Date(time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="weather-card hourly-forecast-card">
                    <h2 id="hourly-forecast">Hourly Forecast</h2>
                    <div className="hourly-forecast-items">
                        {getHourlyForecastItems().map((hour, index) => (
                            <div className="hourly-forecast-item" key={index}>
                                <div className="hourly-time">
                                    {hour.time.toLocaleTimeString("en-US", { hour: "numeric" })}
                                </div>
                                {getWeatherIcon(hour.weathercode)}
                                <div className="hourly-temp">{hour.temperature}°C</div>
                                <div className="hourly-wind">
                                    <img src={getWindDirectionImage(hour.winddirection)} alt="Wind Direction" className="wind-icon" />
                                    <span>{hour.windspeed} km/h</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherInfo;
