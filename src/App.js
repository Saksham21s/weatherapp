import React, { useState, useEffect } from "react";
import { getWeatherData, geocodeCity } from "./api/openMeteo";
import SearchBar from "./components/SearchBar";
import WeatherInfo from "./components/WeatherInfo";
import "./style/style.css";

const App = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [locationName, setLocationName] = useState("Dehradun, Uttarakhand, India");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true"; // Get stored preference
    });

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const data = await getWeatherData(30.3165, 78.0322);
                setWeatherData(data);
            } catch (error) {
                console.error("Error fetching initial weather data:", error);
            }
        };
        fetchWeatherData();
    }, []);

    useEffect(() => {
        // Apply dark mode class to body and store the preference
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleSearch = async (latitude, longitude) => {
        try {
            const data = await getWeatherData(latitude, longitude);
            setWeatherData(data);

            // Fetch location name using reverse geocoding
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
    };

    const handleDarkModeToggle = () => {
        console.log("Dark mode toggled. Current state:", darkMode);
        setDarkMode(prevMode => !prevMode); // Toggle dark mode state
    };

    return (
        <div className="app-container">
            <SearchBar 
                onSearch={handleSearch} 
                onDarkModeToggle={handleDarkModeToggle} 
                darkMode={darkMode} 
            />
            {weatherData && (
                <WeatherInfo 
                    weatherData={weatherData} 
                    locationName={locationName} 
                    isDarkMode={darkMode} 
                />
            )}
        </div>
    );
};

export default App;
