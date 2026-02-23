const axios = require('axios');
const Hospital = require('../models/Hospital');

// GET /api/hospitals
// Query params: lat, lng, radius (km), speciality, q
// Uses OpenStreetMap Overpass API (no API key needed) to search real hospitals.
// Does NOT store hospitals in your database.
exports.getHospitals = async (req, res) => {
  try {
    const { lat, lng, radius = 10, speciality, q } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: 'Latitude (lat) and longitude (lng) are required for hospital search.' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInMeters = Math.min(Number(radius) * 1000, 50000); // safety cap 50km

    // Build Overpass QL query: hospitals around point
    const overpassQuery = `[out:json];
      (
        node["amenity"="hospital"](around:${radiusInMeters},${latitude},${longitude});
        way["amenity"="hospital"](around:${radiusInMeters},${latitude},${longitude});
        relation["amenity"="hospital"](around:${radiusInMeters},${latitude},${longitude});
      );
      out center 40;`;

    const osmRes = await axios.post('https://overpass-api.de/api/interpreter', overpassQuery, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 15000,
    });

    const elements = Array.isArray(osmRes.data.elements) ? osmRes.data.elements : [];

    const textFilter = (value) => {
      if (!q) return true;
      const qLower = q.toLowerCase();
      return value && value.toLowerCase().includes(qLower);
    };

    const hospitals = elements
      .map((el) => {
        const tags = el.tags || {};

        // centre point for ways/relations
        const latVal = el.lat || el.center?.lat;
        const lonVal = el.lon || el.center?.lon;
        if (latVal == null || lonVal == null) return null;

        const name = tags.name || 'Unnamed Hospital';

        // Simple text filtering based on search query
        const city = tags['addr:city'] || '';
        const state = tags['addr:state'] || '';
        const postcode = tags['addr:postcode'] || '';
        const line1 =
          tags['addr:full'] ||
          [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ') ||
          tags['addr:street'] ||
          city ||
          'Address not available';

        const searchableString = [name, line1, city, state, postcode].filter(Boolean).join(' ');
        if (!textFilter(searchableString)) return null;

        // Simple speciality tagging: we just attach the selected speciality if any
        const specialities = speciality ? [String(speciality).toLowerCase()] : [];

        // Distance computation (haversine) in meters
        const toRad = (deg) => (deg * Math.PI) / 180;
        const R = 6371e3;
        const dLat = toRad(latVal - latitude);
        const dLon = toRad(lonVal - longitude);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(latitude)) * Math.cos(toRad(latVal)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return {
          _id: `${el.type}-${el.id}`, // synthetic ID for frontend keys
          name,
          address: {
            line1,
            line2: '',
            city,
            state,
            pincode: postcode,
            country: tags['addr:country'] || 'Unknown',
          },
          location: {
            type: 'Point',
            coordinates: [lonVal, latVal],
          },
          specialities,
          phone: tags.phone || '',
          website: tags.website || '',
          isEmergency24x7: false,
          rating: undefined,
          distance,
        };
      })
      .filter(Boolean);

    res.json({ hospitals });
  } catch (err) {
    console.error('Get hospitals error:', err.response?.data || err.message || err);
    res.status(500).json({ message: 'Failed to fetch hospitals', error: err.message || 'Unknown error' });
  }
};

// GET /api/hospitals/:id
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).lean();
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json({ hospital });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hospital', error: err.message });
  }
};

