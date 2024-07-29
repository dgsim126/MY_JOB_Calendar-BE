const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile } = require('../../controllers/User/profileController');
const { verifyToken } = require('../../middleware/token');

// GET /api/profile
router.get('/', verifyToken, getProfile);

// PUT /api/profile/edit
router.put('/edit', verifyToken, updateProfile);

// DELETE /api/profile
router.delete('/', verifyToken, deleteProfile);

module.exports = router;