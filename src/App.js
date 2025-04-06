import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getWeatherData, geocodeCity } from "./api/openMeteo";
import SearchBar from "./components/SearchBar";
import WeatherInfo from "./components/WeatherInfo";
import Loader from "./components/Loader";
import FormPage from "./components/FormPage";
import "./style/style.css";

const Home = ({ handleSearch, handleDarkModeToggle, darkMode, loading, weatherData, locationName }) => (
  <div className="app-container">
    <SearchBar onSearch={handleSearch} onDarkModeToggle={handleDarkModeToggle} darkMode={darkMode} />
    {loading ? <Loader /> : weatherData && <WeatherInfo weatherData={weatherData} locationName={locationName} isDarkMode={darkMode} />}
  </div>
);

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState("Dehradun, Uttarakhand, India");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Default coordinates for Dehradun
        const lat = 30.3165;
        const lon = 78.0322;
        
        // Fetch weather data
        const weather = await getWeatherData(lat, lon);
        setWeatherData(weather);
        
        // Fetch location name
        const geoData = await geocodeCity(lat, lon);
        if (geoData.address) {
          const { city, town, village, county, state, country } = geoData.address;
          const name = city || town || village || "Unknown Location";
          const region = state || county || "";
          setLocationName(`${name}${region ? `, ${region}` : ''}${country ? `, ${country}` : ''}`);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
      setLoading(false);
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleSearch = async (latitude, longitude, name = null) => {
    setLoading(true);
    try {
      // Fetch weather data first
      const data = await getWeatherData(latitude, longitude);
      setWeatherData(data);
      
      // If name was provided (from SearchBar), use that
      if (name) {
        setLocationName(name);
      } else {
        // Otherwise fetch location name
        const geoData = await geocodeCity(latitude, longitude);
        if (geoData.address) {
          const { city, town, village, county, state, country } = geoData.address;
          const locationName = city || town || village || "Current Location";
          const region = state || county || "";
          setLocationName(`${locationName}${region ? `, ${region}` : ''}${country ? `, ${country}` : ''}`);
        } else {
          setLocationName("Current Location");
        }
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLocationName("Location not found");
    }
    setLoading(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home 
            handleSearch={handleSearch} 
            handleDarkModeToggle={handleDarkModeToggle} 
            darkMode={darkMode} 
            loading={loading} 
            weatherData={weatherData} 
            locationName={locationName} 
          />}
        />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </Router>
  );
};

export default App;