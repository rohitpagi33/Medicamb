const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // We embed hospital info directly so you don't need a hospital table
    hospital: {
      name: { type: String, required: true },
      addressLine1: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    patientName: { type: String, required: true },
    patientEmail: { type: String },
    patientPhone: { type: String },
    date: { type: Date, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed'],
      default: 'scheduled',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Appointment', appointmentSchema);


