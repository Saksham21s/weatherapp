export const geocodeCity = async (cityOrLatitude, longitude) => {
  let url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityOrLatitude}`;
  if (longitude) {
      url = `https://geocoding-api.open-meteo.com/v1/search?latitude=${cityOrLatitude}&longitude=${longitude}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Geocode API Response:", data);
  return data;
};

export const getWeatherData = async (latitude, longitude) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max&current_weather=true&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error("Network response was not ok");
  }
  return response.json();
};