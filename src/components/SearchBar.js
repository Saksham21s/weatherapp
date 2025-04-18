// SearchBar.js
import React, { useState, useEffect } from "react";
import { geocodeCity } from "../api/openMeteo";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const SearchBar = ({ onSearch, onDarkModeToggle, darkMode }) => {
    const [city, setCity] = useState("");
    const [modeText, setModeText] = useState(darkMode ? "Light Mode" : "Dark Mode");

    useEffect(() => {
        const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
        if (savedDarkMode !== null && savedDarkMode !== darkMode) {
            onDarkModeToggle(savedDarkMode);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
        setModeText(darkMode ? "Light Mode" : "Dark Mode");
    }, [darkMode]);

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleCitySearch = async () => {
        if (!city.trim()) return;
        try {
            const geocodeData = await geocodeCity(city);
            if (Array.isArray(geocodeData)) {
                const firstResult = geocodeData[0];
                const { lat, lon, display_name } = firstResult;
                const locationName = display_name.split(",")[0]; // Get just the city name
                onSearch(lat, lon, locationName);
            } else {
                console.error("City not found");
            }
        } catch (error) {
            console.error("Error fetching geocode data:", error);
        }
    };

    const handleCurrentLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const geocodeData = await geocodeCity(latitude, longitude);
                        if (geocodeData.address) {
                            const locationName = geocodeData.address.city ||
                                geocodeData.address.town ||
                                geocodeData.address.village ||
                                "Current Location";
                            onSearch(latitude, longitude, locationName);
                        } else {
                            onSearch(latitude, longitude, "Current Location");
                        }
                    } catch (error) {
                        onSearch(latitude, longitude, "Current Location");
                    }
                },
                (error) => {
                    console.error("Error getting current location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const handleToggleChange = (e) => {
        onDarkModeToggle(e.target.checked);
    };

    return (
        <div className="search-bar-container">
            <div className="toggle-button">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={handleToggleChange}
                    />
                    <span className="slider round"></span>
                </label>
                <div className="mode-text-container">
                    <p className="mode-text">{modeText}</p>
                </div>
            </div>
            <div className="search-input">
                <input
                    type="text"
                    className="city-input"
                    placeholder="search your preferred city..."
                    value={city}
                    onChange={handleCityChange}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleCitySearch();
                        }
                    }}
                />
                <FaSearch
                    className="search-icon"
                    onClick={handleCitySearch}
                    style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "rgb(94, 130, 244)"
                    }}
                />
            </div>
            <div className="current-location-button" onClick={handleCurrentLocationClick}>
                <FaMapMarkerAlt className="location-icon" />
                <p className="location-text">Current Location</p>
            </div>
        </div>
    );
};

export default SearchBar;
