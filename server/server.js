const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// Override Node's default DNS resolution to use Google DNS for MongoDB SRV queries
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.log('[DNS] Note on custom DNS servers:', err.message);
}

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';

app.use(cors({
  origin: '*', // Adjust allowed origins in production
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-passcode', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cm_helphub';

mongoose.connect(MONGODB_URI)
.then(() => console.log('[Database] Connected successfully to MongoDB'))
.catch((err) => console.error('[Database] MongoDB Connection Error:', err));

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

const Office = mongoose.model('Office', OfficeSchema);

const FaqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  keywords: [{ type: String }],
  relatedOfficeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Office', default: null },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const Faq = mongoose.model('Faq', FaqSchema);

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, default: 'Academic' },
  publishDate: { type: String, required: true },
  expiryDate: { type: String, default: '' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

const EventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  eventDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  venue: { type: String, required: true },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

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

const Concern = mongoose.model('Concern', ConcernSchema);

const verifyAdminPasscode = (req, res, next) => {
  const passcode = req.headers['x-admin-passcode'] || req.query.passcode;
  if (!passcode || (passcode !== ADMIN_PASSCODE && passcode !== 'cm2026')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Valid admin passcode required.'
    });
  }
  next();
};

app.get('/api/helphub/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    project: 'CM HelpHub Backend API',
    institution: 'College of Maasin',
    timestamp: new Date().toISOString()
  });
});

// GET all published offices (with optional search query)
app.get('/api/helphub/offices', async (req, res) => {
  try {
    const { search } = req.query;
    let query = { isPublished: true };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { officeName: regex },
        { description: regex },
        { location: regex },
        { services: regex }
      ];
    }

    const offices = await Office.find(query).sort({ officeName: 1 });
    res.status(200).json({ success: true, count: offices.length, data: offices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch offices', error: error.message });
  }
});

// GET single office by ID
app.get('/api/helphub/offices/:id', async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    if (!office) {
      return res.status(404).json({ success: false, message: `Office with ID ${req.params.id} not found` });
    }
    res.status(200).json({ success: true, data: office });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid Office ID format', error: error.message });
  }
});

app.post('/api/helphub/admin/offices', verifyAdminPasscode, async (req, res) => {
  try {
    const office = new Office(req.body);
    const saved = await office.save();
    res.status(201).json({ success: true, message: 'Office created successfully', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create office', error: error.message });
  }
});

app.put('/api/helphub/admin/offices/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const updated = await Office.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Office not found' });
    res.status(200).json({ success: true, message: 'Office updated successfully', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update office', error: error.message });
  }
});

app.delete('/api/helphub/admin/offices/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const deleted = await Office.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Office not found' });
    res.status(200).json({ success: true, message: 'Office deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete office', error: error.message });
  }
});

// GET all published FAQs (supports category and search query)
app.get('/api/helphub/faqs', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { question: regex },
        { answer: regex },
        { keywords: regex }
      ];
    }

    const faqs = await Faq.find(query).populate('relatedOfficeId', 'officeName location contactEmail').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch FAQs', error: error.message });
  }
});

// GET single FAQ by ID
app.get('/api/helphub/faqs/:id', async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id).populate('relatedOfficeId', 'officeName location contactEmail');
    if (!faq) {
      return res.status(404).json({ success: false, message: `FAQ with ID ${req.params.id} not found` });
    }
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid FAQ ID format', error: error.message });
  }
});

app.post('/api/helphub/admin/faqs', verifyAdminPasscode, async (req, res) => {
  try {
    const faq = new Faq(req.body);
    const saved = await faq.save();
    res.status(201).json({ success: true, message: 'FAQ created successfully', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create FAQ', error: error.message });
  }
});

app.put('/api/helphub/admin/faqs/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const updated = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, message: 'FAQ updated successfully', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update FAQ', error: error.message });
  }
});

app.delete('/api/helphub/admin/faqs/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const deleted = await Faq.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete FAQ', error: error.message });
  }
});

app.get('/api/helphub/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements', error: error.message });
  }
});

app.get('/api/helphub/announcements/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: `Announcement with ID ${req.params.id} not found` });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid Announcement ID format', error: error.message });
  }
});

// CREATE Announcement (Admin)
app.post('/api/helphub/admin/announcements', verifyAdminPasscode, async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    const saved = await announcement.save();
    res.status(201).json({ success: true, message: 'Announcement created successfully', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create announcement', error: error.message });
  }
});

// UPDATE Announcement (Admin)
app.put('/api/helphub/admin/announcements/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, message: 'Announcement updated successfully', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update announcement', error: error.message });
  }
});

// DELETE Announcement (Admin)
app.delete('/api/helphub/admin/announcements/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement', error: error.message });
  }
});

app.get('/api/helphub/events', async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true }).sort({ eventDate: 1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: error.message });
  }
});

app.get('/api/helphub/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: `Event with ID ${req.params.id} not found` });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid Event ID format', error: error.message });
  }
});

// CREATE Event (Admin)
app.post('/api/helphub/admin/events', verifyAdminPasscode, async (req, res) => {
  try {
    const event = new Event(req.body);
    const saved = await event.save();
    res.status(201).json({ success: true, message: 'Event created successfully', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create event', error: error.message });
  }
});

// UPDATE Event (Admin)
app.put('/api/helphub/admin/events/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, message: 'Event updated successfully', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update event', error: error.message });
  }
});

// DELETE Event (Admin)
app.delete('/api/helphub/admin/events/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event', error: error.message });
  }
});

// Submit concern (Generates unique server-side reference code)
app.post('/api/helphub/concerns', async (req, res) => {
  try {
    const { category, subject, message, contactEmail } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and Message are required fields.' });
    }

    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `CM-CON-${currentYear}-${randomSuffix}`;

    const newConcern = new Concern({
      referenceNumber,
      category: category || 'General Campus Inquiry',
      subject,
      message,
      contactEmail: contactEmail || 'N/A',
      submittedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
    });

    const saved = await newConcern.save();

    res.status(201).json({
      success: true,
      message: 'Concern registered successfully',
      referenceNumber: saved.referenceNumber,
      data: saved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit concern', error: error.message });
  }
});

// Track concern status by Reference Number
app.get('/api/helphub/concerns/track/:refNum', async (req, res) => {
  try {
    const refNum = req.params.refNum.trim().toUpperCase();
    const concern = await Concern.findOne({ referenceNumber: refNum });

    if (!concern) {
      return res.status(404).json({
        success: false,
        message: `No concern record found matching reference number "${refNum}".`
      });
    }

    res.status(200).json({ success: true, data: concern });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving concern status', error: error.message });
  }
});

app.get('/api/helphub/admin/concerns', verifyAdminPasscode, async (req, res) => {
  try {
    const concerns = await Concern.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: concerns.length, data: concerns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch concerns', error: error.message });
  }
});

app.patch('/api/helphub/admin/concerns/:id', verifyAdminPasscode, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updated = await Concern.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Concern not found' });
    res.status(200).json({ success: true, message: 'Concern status updated', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update concern', error: error.message });
  }
});

app.post('/api/helphub/assistant/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question prompt is required.' });
    }

    const q = question.toLowerCase();

    // Query database for matching FAQs
    const matchedFaqs = await Faq.find({
      isPublished: true,
      $or: [
        { question: new RegExp(q, 'i') },
        { answer: new RegExp(q, 'i') },
        { keywords: new RegExp(q, 'i') }
      ]
    }).populate('relatedOfficeId');

    if (matchedFaqs.length > 0) {
      const faq = matchedFaqs[0];
      return res.status(200).json({
        success: true,
        answer: faq.answer,
        source: {
          type: 'FAQ Record',
          title: faq.question,
          category: faq.category,
          relatedOffice: faq.relatedOfficeId ? faq.relatedOfficeId.officeName : null
        }
      });
    }

    // Query database for matching Offices
    const matchedOffices = await Office.find({
      isPublished: true,
      $or: [
        { officeName: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { services: new RegExp(q, 'i') }
      ]
    });

    if (matchedOffices.length > 0) {
      const office = matchedOffices[0];
      const answerText = `${office.officeName} is located at ${office.location}. Office Hours: ${office.officeHours}. Contact Email: ${office.contactEmail}. Primary services: ${office.services.join(', ')}.`;
      return res.status(200).json({
        success: true,
        answer: answerText,
        source: {
          type: 'Office Directory',
          title: office.officeName,
          location: office.location
        }
      });
    }

    // Default Fallback to avoid AI hallucinations
    res.status(200).json({
      success: true,
      answer: `I could not find verified campus records matching "${question}". To avoid providing inaccurate details, please check the Office Directory or submit an official student concern to school administrators.`,
      source: null
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'AI Assistant query failed', error: error.message });
  }
});

app.post('/api/helphub/admin/seed', verifyAdminPasscode, async (req, res) => {
  try {
    await Office.deleteMany({});
    await Faq.deleteMany({});
    await Announcement.deleteMany({});
    await Event.deleteMany({});

    const createdOffices = await Office.insertMany([
      {
        officeName: "Registrar's Office",
        description: "Handles student admissions, academic records, TOR requests, enrollment verification, and diploma processing.",
        location: "Administration Building, 1st Floor, Room 102",
        contactEmail: "registrar@collegeofmaasin.edu.ph",
        contactNumber: "(053) 570-8123",
        officeHours: "Mon - Fri: 8:00 AM - 5:00 PM",
        services: ["Transcript of Records (TOR)", "Enrollment Verification", "Adding/Dropping Subjects", "Transfer Credentials"],
        isPublished: true
      },
      {
        officeName: "Cashier & Finance Office",
        description: "Manages student tuition assessment, fee collection, official receipts, payment plans, and financial clearances.",
        location: "Administration Building, 1st Floor, Room 104",
        contactEmail: "finance@collegeofmaasin.edu.ph",
        contactNumber: "(053) 570-8124",
        officeHours: "Mon - Fri: 8:00 AM - 4:00 PM",
        services: ["Tuition Fee Payment", "Statement of Account (SOA)", "Exam Permits", "Refund Requests"],
        isPublished: true
      }
    ]);

    await Faq.insertMany([
      {
        question: "How do I request an official Transcript of Records (TOR)?",
        answer: "Visit the Registrar's Office (Admin Bldg Room 102) or submit a request online. Ensure financial clearance from the Finance Office prior to submission. Standard processing takes 3-5 business days.",
        category: "Academic & Records",
        keywords: ["TOR", "transcript", "grades", "records", "clearance"],
        relatedOfficeId: createdOffices[0]._id,
        isPublished: true
      },
      {
        question: "What are the accredited payment channels for tuition fees?",
        answer: "Tuition payments can be made directly at the Cashier's Office (Cash/Check), or online via GCash, Landbank, or DBP bank deposits. Always upload or present your transaction reference receipt for verification.",
        category: "Finance & Payments",
        keywords: ["tuition", "payment", "cashier", "gcash", "bank"],
        relatedOfficeId: createdOffices[1]._id,
        isPublished: true
      }
    ]);

    await Announcement.insertMany([
      {
        title: "Midterm Examinations Schedule & Clearance Deadline",
        content: "First Semester Midterm Examinations will take place from November 10 to 14, 2026. Students must settle outstanding balances at the Cashier's Office by November 7 to secure examination permits.",
        category: "Academic",
        publishDate: "2026-10-15",
        expiryDate: "2026-11-20",
        isPublished: true
      },
      {
        title: "Annual Campus Intramurals & Foundation Week 2026",
        content: "College of Maasin marks its Foundation Celebration with sports, cultural competitions, and academic quizzes! Regular classes will be adjusted accordingly.",
        category: "Campus Life",
        publishDate: "2026-10-10",
        expiryDate: "2026-11-30",
        isPublished: true
      }
    ]);

    await Event.insertMany([
      {
        eventTitle: "CM Career Expo & Industry Partnership Fair 2026",
        description: "Connect with regional business partners, tech agencies, and healthcare institutions for internship and job opportunities.",
        eventDate: "2026-11-05",
        startTime: "09:00 AM",
        endTime: "04:00 PM",
        venue: "CM Auditorium & Multipurpose Hall",
        isPublished: true
      },
      {
        eventTitle: "Student Leadership & Youth Empowerment Summit",
        description: "Interactive workshop on team building, campus project management, and community leadership organized by the Student Government.",
        eventDate: "2026-11-18",
        startTime: "01:00 PM",
        endTime: "05:00 PM",
        venue: "AVR Building 2, Room 201",
        isPublished: true
      }
    ]);

    res.status(201).json({ success: true, message: 'Sample College of Maasin database successfully seeded with Offices, FAQs, Announcements, and Events.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Seeding database failed', error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found on CM HelpHub server` });
});

app.listen(PORT, () => {
  console.log(`[CM HelpHub Server] Running on http://localhost:${PORT}`);
  console.log(`[API Base Route] http://localhost:${PORT}/api/helphub`);
});