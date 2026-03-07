const axios = require('axios');
const Hospital = require('../models/Hospital');

// Haversine distance in meters
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371e3;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/hospitals
// Query params: lat, lng, radius (km), speciality, q
// Returns DB hospitals (bookable) merged with OSM hospitals (info-only).
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
    const radiusInMeters = Math.min(Number(radius) * 1000, 50000);

    // --- 1. DB hospitals (always bookable) ---
    const dbHospitals = await Hospital.find({ isInDatabase: true }).lean();
    const dbHospitalsFormatted = dbHospitals
      .map((h) => {
        const [lon, latH] = h.location.coordinates;
        const dist = haversine(latitude, longitude, latH, lon);
        const searchStr = [h.name, h.address?.line1, h.address?.city, h.address?.state].join(' ').toLowerCase();
        if (q && !searchStr.includes(q.toLowerCase())) return null;
        if (speciality && !h.specialities?.includes(speciality.toLowerCase())) return null;
        return {
          _id: h._id.toString(),
          name: h.name,
          description: h.description,
          address: h.address,
          location: h.location,
          specialities: h.specialities || [],
          categories: h.categories || [],
          phone: h.phone || '',
          email: h.email || '',
          website: h.website || '',
          isEmergency24x7: h.isEmergency24x7,
          rating: h.rating,
          distance: dist,
          timings: h.timings,
          appointmentDirection: h.appointmentDirection,
          timeSlots: h.timeSlots || [],
          isInDatabase: true,
          source: 'db',
        };
      })
      .filter(Boolean);

    const dbIds = new Set(dbHospitalsFormatted.map((h) => h.name.toLowerCase().trim()));

    // --- 2. OSM hospitals ---
    let osmHospitals = [];
    try {
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

      osmHospitals = elements
        .map((el) => {
          const tags = el.tags || {};
          const latVal = el.lat || el.center?.lat;
          const lonVal = el.lon || el.center?.lon;
          if (latVal == null || lonVal == null) return null;

          const name = tags.name || 'Unnamed Hospital';
          if (dbIds.has(name.toLowerCase().trim())) return null; // skip if already in DB

          const city = tags['addr:city'] || '';
          const state = tags['addr:state'] || '';
          const postcode = tags['addr:postcode'] || '';
          const line1 =
            tags['addr:full'] ||
            [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ') ||
            tags['addr:street'] || city || 'Address not available';

          const searchStr = [name, line1, city, state, postcode].join(' ').toLowerCase();
          if (q && !searchStr.includes(q.toLowerCase())) return null;

          const dist = haversine(latitude, longitude, latVal, lonVal);
          if (dist > radiusInMeters) return null;

          return {
            _id: `osm-${el.type}-${el.id}`,
            name,
            address: { line1, line2: '', city, state, pincode: postcode, country: tags['addr:country'] || '' },
            location: { type: 'Point', coordinates: [lonVal, latVal] },
            specialities: speciality ? [String(speciality).toLowerCase()] : [],
            categories: [],
            phone: tags.phone || '',
            website: tags.website || '',
            isEmergency24x7: false,
            distance: dist,
            timings: '',
            timeSlots: [],
            isInDatabase: false,
            source: 'osm',
          };
        })
        .filter(Boolean);
    } catch (osmErr) {
      console.warn('OSM fetch failed, returning only DB hospitals:', osmErr.message);
    }

    const hospitals = [...dbHospitalsFormatted, ...osmHospitals].sort(
      (a, b) => (a.distance || 0) - (b.distance || 0)
    );

    res.json({ hospitals });
  } catch (err) {
    console.error('Get hospitals error:', err.message);
    res.status(500).json({ message: 'Failed to fetch hospitals', error: err.message });
  }
};

// GET /api/hospitals/:id
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).lean();
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json({ hospital: { ...hospital, isInDatabase: true } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hospital', error: err.message });
  }
};

