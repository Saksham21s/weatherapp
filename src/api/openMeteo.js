// const LOCATIONIQ_API_KEY = 'pk.d0ed6b1595d8f38a4d986e2aeb0b5bff';

// export const geocodeCity = async (cityOrLatitude, longitude) => {
//   let url;
//   if (longitude) {
//     // Reverse geocoding (coordinates to address)
//     url = `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${cityOrLatitude}&lon=${longitude}&format=json`;
//   } else {
//     // Forward geocoding (city name to coordinates)
//     url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${cityOrLatitude}&format=json`;
//   }

//   const response = await fetch(url);
//   if (!response.ok) {
//     const errorDetails = await response.text();
//     throw new Error(`Network response was not ok: ${response.status} - ${errorDetails}`);
//   }
//   return response.json();
// };


// export const getWeatherData = async (latitude, longitude) => {
//   const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max&current_weather=true&timezone=auto`;
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   return response.json();
// };

// api/openMeteo.js
export const geocodeCity = async (cityOrLatitude, longitude) => {
  let url;
  const API_KEY = 'pk.d0ed6b1595d8f38a4d986e2aeb0b5bff';
  
  if (longitude) {
    // Reverse geocoding (coordinates to address)
    url = `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${cityOrLatitude}&lon=${longitude}&format=json`;
  } else {
    // Forward geocoding (city name to coordinates)
    url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${cityOrLatitude}&format=json&limit=1`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const getWeatherData = async (latitude, longitude) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max&current_weather=true&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};