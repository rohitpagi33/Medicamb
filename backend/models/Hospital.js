const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true }, // e.g. "09:00 AM"
  totalSlots: { type: Number, default: 10 },
  bookedSlots: { type: Number, default: 0 },
}, { _id: false });

const hospitalSchema = new mongoose.Schema(
  {
    // If coming from Google Places
    googlePlaceId: { type: String, index: true },

    name: { type: String, required: true },
    description: { type: String },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: 'India' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      // [longitude, latitude]
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    specialities: [{ type: String }], // e.g. ['general', 'surgery', 'cancer']
    categories: [{ type: String }], // e.g. ['Multi-Specialty', 'Pediatric', 'Ortho']
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    isEmergency24x7: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5 },
    placeUrl: { type: String },

    // Admin-managed fields
    timings: { type: String, default: 'Mon-Sat: 8:00 AM - 8:00 PM' }, // general opening hours
    appointmentDirection: { type: String }, // instructions for booking e.g. "Walk-in or call ahead"
    timeSlots: [timeSlotSchema], // available appointment time slots
    isInDatabase: { type: Boolean, default: true }, // marks this hospital as bookable
  },
  { timestamps: true },
);

hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);

