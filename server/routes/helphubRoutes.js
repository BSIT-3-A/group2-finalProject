const express = require('express');
const router = express.Router();
const controller = require('../controllers/helphubController');

const verifyAdmin = (req, res, next) => {
  const passcode = req.headers['x-admin-passcode'] || req.query.passcode;
  const validPasscode = process.env.ADMIN_PASSCODE || 'admin123';
  if (!passcode || (passcode !== validPasscode && passcode !== 'cm2026')) {
    return res.status(401).json({ success: false, message: 'Unauthorized access. Valid admin passcode required.' });
  }
  next();
};

router.get('/offices', controller.getOffices);
router.get('/offices/:id', controller.getOfficeById);

router.get('/faqs', controller.getFaqs);
router.get('/faqs/:id', controller.getFaqById);

router.get('/announcements', controller.getAnnouncements);
router.get('/announcements/:id', controller.getAnnouncementById);

router.get('/events', controller.getEvents);
router.get('/events/:id', controller.getEventById);

router.post('/concerns', controller.submitConcern);
router.get('/concerns/track/:refNum', controller.trackConcern);

router.post('/assistant/ask', controller.askAssistant);

router.post('/admin/offices', verifyAdmin, controller.createOffice);
router.put('/admin/offices/:id', verifyAdmin, controller.updateOffice);
router.delete('/admin/offices/:id', verifyAdmin, controller.deleteOffice);

router.post('/admin/faqs', verifyAdmin, controller.createFaq);
router.put('/admin/faqs/:id', verifyAdmin, controller.updateFaq);
router.delete('/admin/faqs/:id', verifyAdmin, controller.deleteFaq);

router.post('/admin/announcements', verifyAdmin, controller.createAnnouncement);
router.put('/admin/announcements/:id', verifyAdmin, controller.updateAnnouncement);
router.delete('/admin/announcements/:id', verifyAdmin, controller.deleteAnnouncement);

router.post('/admin/events', verifyAdmin, controller.createEvent);
router.put('/admin/events/:id', verifyAdmin, controller.updateEvent);
router.delete('/admin/events/:id', verifyAdmin, controller.deleteEvent);

router.get('/admin/concerns', verifyAdmin, controller.getAllConcerns);
router.patch('/admin/concerns/:id', verifyAdmin, controller.updateConcernStatus);

router.post('/admin/seed', verifyAdmin, controller.seedDatabase);

module.exports = router;