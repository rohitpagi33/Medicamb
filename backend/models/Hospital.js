const mongoose = require('mongoose');

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
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    isEmergency24x7: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5 },
    placeUrl: { type: String },
  },
  { timestamps: true },
);

hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);

