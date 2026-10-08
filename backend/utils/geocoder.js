const https = require("https");

/**
 * OpenStreetMap Nominatim se coordinates fetch karne ka helper
 */
const fetchFromNominatim = (query) => {
  return new Promise((resolve) => {
    if (!query || !query.trim()) return resolve(null);

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      query.trim()
    )}`;

    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "EventManagementApp/1.0 (contact@eventmanagement.local)",
          Accept: "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const lat = parseFloat(parsed[0].lat);
              const lon = parseFloat(parsed[0].lon);
              if (!isNaN(lat) && !isNaN(lon)) {
                return resolve({
                  latitude: lat,
                  longitude: lon,
                  displayName: parsed[0].display_name,
                });
              }
            }
            resolve(null);
          } catch (e) {
            resolve(null);
          }
        });
      }
    );

    req.on("error", () => resolve(null));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });
  });
};

/**
 * Smart candidate search query generation
 */
const generateCandidateQueries = (venue, address) => {
  const candidates = [];
  const v = (venue || "").trim();
  const a = (address || "").trim();

  // 1. Venue + Full Address
  if (v && a) {
    candidates.push(`${v}, ${a}`);

    // Comma-separated address parts parse karo (e.g., city, country)
    const parts = a.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      const cityOrLast = parts[parts.length - 1].replace(/\d+/g, "").trim();
      if (cityOrLast) candidates.push(`${v}, ${cityOrLast}`);

      if (parts.length > 2) {
        const secondLast = parts[parts.length - 2].replace(/\d+/g, "").trim();
        if (secondLast) candidates.push(`${v}, ${secondLast}`);
      }
    }

    // Venue common suffixes remove karke check karo (e.g. "Arts Council")
    const simplifiedVenue = v.replace(/Arts Council|Convention Center|Hall/gi, "").trim();
    if (simplifiedVenue !== v && parts.length > 1) {
      const city = parts[parts.length - 1].replace(/\d+/g, "").trim();
      if (city) candidates.push(`${simplifiedVenue}, ${city}`);
    }
  }

  // 2. Just Venue
  if (v) candidates.push(v);

  // 3. Just Address
  if (a) candidates.push(a);

  return [...new Set(candidates.filter(Boolean))];
};

/**
 * Geocode venue & address using OpenStreetMap Nominatim
 */
const geocodeVenueAddress = async (venue, address) => {
  const candidates = generateCandidateQueries(venue, address);
  if (candidates.length === 0) return null;

  for (let i = 0; i < candidates.length; i++) {
    if (i > 0) {
      // Respect Nominatim rate limits between attempts
      await new Promise((r) => setTimeout(r, 600));
    }
    const result = await fetchFromNominatim(candidates[i]);
    if (result) {
      return result;
    }
  }

  return null;
};

module.exports = {
  fetchFromNominatim,
  geocodeVenueAddress,
};
