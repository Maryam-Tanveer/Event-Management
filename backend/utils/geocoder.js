// backend/utils/geocoder.js

const fetchFromNominatim = async (query) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EventManagementApp/1.0' // Nominatim requires a User-Agent
      }
    });

    if (!response.ok) {
      console.error('Nominatim API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error in fetchFromNominatim:', error.message);
    return null;
  }
};

const geocodeVenueAddress = async (venue, address) => {
  let query = '';
  if (venue && address) {
    query = `${venue}, ${address}`;
  } else if (venue) {
    query = venue;
  } else if (address) {
    query = address;
  } else {
    return null;
  }

  // Try with both first
  let result = await fetchFromNominatim(query);
  
  // If no result and we tried both venue and address, try just address
  if (!result && venue && address) {
      result = await fetchFromNominatim(address);
  }
  
  return result;
};

module.exports = {
  fetchFromNominatim,
  geocodeVenueAddress
};
