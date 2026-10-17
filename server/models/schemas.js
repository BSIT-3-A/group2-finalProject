const mongoose = require('mongoose');

const OfficeSchema = new mongoose.Schema({
  officeName: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  contactEmail: { type: String, required: true, trim: true, lowercase: true },
  contactNumber: { type: String, default: '' },
  officeHours: { type: String, default: 'Mon - Fri: 8:00 AM - 5:00 PM' },
  services: [{ type: String }],
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  keywords: [{ type: String }],
  relatedOfficeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Office', default: null },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, default: 'Academic' },
  publishDate: { type: String, required: true },
  expiryDate: { type: String, default: '' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const EventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  eventDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  venue: { type: String, required: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const ConcernSchema = new mongoose.Schema({
  referenceNumber: { type: String, required: true, unique: true, index: true },
  category: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  contactEmail: { type: String, default: 'N/A' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  submittedAt: { type: String, required: true },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = {
  Office: mongoose.model('Office', OfficeSchema),
  Faq: mongoose.model('Faq', FaqSchema),
  Announcement: mongoose.model('Announcement', AnnouncementSchema),
  Event: mongoose.model('Event', EventSchema),
  Concern: mongoose.model('Concern', ConcernSchema)
};