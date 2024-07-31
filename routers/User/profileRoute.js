const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile, getUserName } = require('../../controllers/User/profileController');
const { verifyToken } = require('../../middleware/token');

// GET /api/profile
router.get('/', verifyToken, getProfile);

//GET /api/profile/name
router.get('/name', verifyToken, getUserName)

// PUT /api/profile/edit
router.put('/edit', verifyToken, updateProfile);

// DELETE /api/profile
router.delete('/', verifyToken, deleteProfile);

module.exports = router;