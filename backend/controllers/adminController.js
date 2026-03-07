const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// ---- Hospital CRUD ----

// GET /api/admin/hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({}).sort({ createdAt: -1 }).lean();
    res.json({ hospitals });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch hospitals', error: err.message });
  }
};

// POST /api/admin/hospitals
exports.createHospital = async (req, res) => {
  try {
    const {
      name, description, address, location, specialities, categories,
      phone, email, website, isEmergency24x7, rating,
      timings, appointmentDirection, timeSlots,
    } = req.body;

    if (!name || !address?.line1 || !location?.coordinates) {
      return res.status(400).json({ message: 'name, address.line1, and location.coordinates are required.' });
    }

    const hospital = await Hospital.create({
      name, description, address, location, specialities: specialities || [],
      categories: categories || [], phone, email, website,
      isEmergency24x7: isEmergency24x7 || false, rating,
      timings, appointmentDirection, timeSlots: timeSlots || [],
      isInDatabase: true,
    });

    res.status(201).json({ hospital });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create hospital', error: err.message });
  }
};

// PUT /api/admin/hospitals/:id
exports.updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json({ hospital });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update hospital', error: err.message });
  }
};

// DELETE /api/admin/hospitals/:id
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json({ message: 'Hospital deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete hospital', error: err.message });
  }
};

// PATCH /api/admin/hospitals/:id/slots
exports.updateSlots = async (req, res) => {
  try {
    const { timeSlots } = req.body;
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: { timeSlots } },
      { new: true }
    );
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json({ hospital });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update slots', error: err.message });
  }
};

// ---- User Management ----

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// GET /api/admin/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    const appointments = await Appointment.find({ user: user._id }).sort({ date: -1 }).lean();
    res.json({ user, appointments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, email } },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Also delete user's appointments
    await Appointment.deleteMany({ user: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [userCount, hospitalCount, appointmentCount] = await Promise.all([
      User.countDocuments(),
      Hospital.countDocuments(),
      Appointment.countDocuments(),
    ]);
    res.json({ userCount, hospitalCount, appointmentCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};
