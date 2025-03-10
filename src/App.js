import React, { useState, useEffect } from "react";
import { getWeatherData, geocodeCity } from "./api/openMeteo";
import SearchBar from "./components/SearchBar";
import WeatherInfo from "./components/WeatherInfo";
import Loader from "./components/Loader";
import "./style/style.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState("Dehradun, Uttarakhand, India");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const data = await getWeatherData(30.3165, 78.0322);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching initial weather data:", error);
      }
      setLoading(false);
    };
    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSearch = async (latitude, longitude) => {
    setLoading(true);
    try {
      const data = await getWeatherData(latitude, longitude);
      setWeatherData(data);

      const geocodeData = await geocodeCity(latitude, longitude);
      if (geocodeData.results && geocodeData.results.length > 0) {
        const { name, admin1, country } = geocodeData.results[0];
        setLocationName(`${name}, ${admin1}, ${country}`);
      } else {
        setLocationName("Location not found");
      }
    } catch (error) {
      console.error("Error fetching weather data after search:", error);
    }
    setLoading(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="app-container">
      <SearchBar onSearch={handleSearch} onDarkModeToggle={handleDarkModeToggle} darkMode={darkMode} />
      {loading ? <Loader /> : weatherData && <WeatherInfo weatherData={weatherData} locationName={locationName} isDarkMode={darkMode} />}
    </div>
  );
};

export default App;