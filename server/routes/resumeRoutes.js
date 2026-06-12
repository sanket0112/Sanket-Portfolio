const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/download', (req, res) => {
    // Correct path relative to the server folder: ../client/public/assets/resume.pdf
    const file = path.join(__dirname, '../../client/public/assets/resume.pdf');
    res.download(file, 'Sanket_Resume.pdf', (err) => {
        if (err) {
            console.error("Error downloading file:", err);
            res.status(404).send("Resume file not found. Ensure it is placed in client/public/assets/");
        }
    });
});

module.exports = router;
