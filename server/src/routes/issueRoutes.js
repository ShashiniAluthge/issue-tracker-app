const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// GET routes
router.get('/', issueController.getAllIssues);
router.get('/status', issueController.getIssueStatus);
router.get('/:id', issueController.getIssueById);


// POST route
router.post('/', issueController.createIssue);

// PUT route
router.put('/:id', issueController.updateIssue);

// DELETE route
router.delete('/:id', issueController.deleteIssue);


module.exports = router;