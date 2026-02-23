const Hospital = require('../models/Hospital');

// GET /api/hospitals
// Query params: lat, lng, radius (km), speciality, q
exports.getHospitals = async (req, res) => {
  try {
    const { lat, lng, radius = 10, speciality, q } = req.query;

    const filter = {};

    if (speciality) {
      filter.specialities = speciality.toLowerCase();
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { 'address.city': regex },
        { 'address.state': regex },
        { 'address.pincode': regex },
      ];
    }

    let hospitals;

    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusInMeters = Number(radius) * 1000;

      hospitals = await Hospital.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },
            distanceField: 'distance',
            maxDistance: radiusInMeters,
            spherical: true,
            query: filter,
          },
        },
      ]);
    } else {
      hospitals = await Hospital.find(filter).lean();
    }

    res.json({ hospitals });
  } catch (err) {
    console.error('Get hospitals error:', err);
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
    res.json({ hospital });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hospital', error: err.message });
  }
};


