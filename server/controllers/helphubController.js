const { Office, Faq, Announcement, Event, Concern } = require('../models/schemas');

exports.getOffices = async (req, res) => {
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
    res.status(500).json({ success: false, message: 'Error retrieving offices', error: error.message });
  }
};

exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    if (!office) {
      return res.status(404).json({ success: false, message: `Office record with ID ${req.params.id} not found.` });
    }
    res.status(200).json({ success: true, data: office });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid ID format', error: error.message });
  }
};

exports.createOffice = async (req, res) => {
  try {
    const office = new Office(req.body);
    const saved = await office.save();
    res.status(201).json({ success: true, message: 'Office created successfully', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create office record', error: error.message });
  }
};

exports.updateOffice = async (req, res) => {
  try {
    const updated = await Office.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Office record not found' });
    }
    res.status(200).json({ success: true, message: 'Office updated successfully', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update office', error: error.message });
  }
};

exports.deleteOffice = async (req, res) => {
  try {
    const deleted = await Office.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Office record not found' });
    }
    res.status(200).json({ success: true, message: 'Office deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete office', error: error.message });
  }
};

exports.getFaqs = async (req, res) => {
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
    res.status(500).json({ success: false, message: 'Error retrieving FAQs', error: error.message });
  }
};

exports.getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id).populate('relatedOfficeId', 'officeName location contactEmail');
    if (!faq) {
      return res.status(404).json({ success: false, message: `FAQ record with ID ${req.params.id} not found.` });
    }
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid ID format', error: error.message });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const faq = new Faq(req.body);
    const saved = await faq.save();
    res.status(201).json({ success: true, message: 'FAQ created successfully', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create FAQ record', error: error.message });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const updated = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'FAQ record not found' });
    }
    res.status(200).json({ success: true, message: 'FAQ updated successfully', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update FAQ', error: error.message });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const deleted = await Faq.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FAQ record not found' });
    }
    res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete FAQ', error: error.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving announcements', error: error.message });
  }
};

exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid ID format', error: error.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    const saved = await announcement.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create announcement', error: error.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update announcement', error: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement', error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true }).sort({ eventDate: 1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving events', error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid ID format', error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const saved = await event.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create event', error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update event', error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event', error: error.message });
  }
};

exports.submitConcern = async (req, res) => {
  try {
    const { category, subject, message, contactEmail } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and Message are required fields.' });
    }

    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNum = `CM-CON-${currentYear}-${randomSuffix}`;

    const concern = new Concern({
      referenceNumber: refNum,
      category: category || 'General Inquiry',
      subject,
      message,
      contactEmail: contactEmail || 'N/A',
      submittedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
    });

    const saved = await concern.save();
    res.status(201).json({
      success: true,
      message: 'Concern registered successfully',
      referenceNumber: saved.referenceNumber,
      data: saved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record concern', error: error.message });
  }
};

exports.trackConcern = async (req, res) => {
  try {
    const refNum = req.params.refNum.trim().toUpperCase();
    const concern = await Concern.findOne({ referenceNumber: refNum });
    if (!concern) {
      return res.status(404).json({ success: false, message: `No concern record found matching reference code "${refNum}".` });
    }
    res.status(200).json({ success: true, data: concern });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error tracking concern status', error: error.message });
  }
};

exports.getAllConcerns = async (req, res) => {
  try {
    const concerns = await Concern.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: concerns.length, data: concerns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving concerns', error: error.message });
  }
};

exports.updateConcernStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updated = await Concern.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Concern record not found' });
    res.status(200).json({ success: true, message: 'Concern status updated', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update concern status', error: error.message });
  }
};

exports.askAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question prompt is required.' });
    }

    const q = question.toLowerCase();

    // Scan FAQs
    const matchedFaq = await Faq.findOne({
      isPublished: true,
      $or: [
        { question: new RegExp(q, 'i') },
        { answer: new RegExp(q, 'i') },
        { keywords: new RegExp(q, 'i') }
      ]
    }).populate('relatedOfficeId', 'officeName location');

    if (matchedFaq) {
      return res.status(200).json({
        success: true,
        answer: matchedFaq.answer,
        source: {
          type: 'FAQ Record',
          title: matchedFaq.question,
          category: matchedFaq.category
        }
      });
    }

    // Scan Offices
    const matchedOffice = await Office.findOne({
      isPublished: true,
      $or: [
        { officeName: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { services: new RegExp(q, 'i') }
      ]
    });

    if (matchedOffice) {
      return res.status(200).json({
        success: true,
        answer: `${matchedOffice.officeName} is located at ${matchedOffice.location}. Operating hours: ${matchedOffice.officeHours}. Contact Email: ${matchedOffice.contactEmail}. Core services: ${matchedOffice.services.join(', ')}.`,
        source: {
          type: 'Office Directory',
          title: matchedOffice.officeName,
          location: matchedOffice.location
        }
      });
    }

    // Default Fallback
    res.status(200).json({
      success: true,
      answer: `I could not find verified campus records matching "${question}". Please check the Office Directory or submit an official student concern to school administrators.`,
      source: null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Assistant engine error', error: error.message });
  }
};

exports.seedDatabase = async (req, res) => {
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

    res.status(201).json({ success: true, message: 'College of Maasin seed database initialized.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database seeding failed', error: error.message });
  }
};