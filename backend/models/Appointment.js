const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
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


