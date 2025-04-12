const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateQRCode } = require('../utils/qrGenerator');

const router = express.Router();

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post('/', upload.single('pdf'), async (req, res) => {
    try {
        const { nanoid } = await import('nanoid');
        if (!req.file || req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Only PDF files are allowed' });
        }

        const fileId = nanoid(8);
        const newFileName = `${fileId}.pdf`;
        const newPath = path.join('uploads', newFileName);

        // Rename file
        fs.renameSync(req.file.path, newPath);

        const fileUrl = `${process.env.APP_HOST}/uploads/${newFileName}`;
        const qrPath = path.join('qr', `${fileId}.png`);
        const qrUrl = `${process.env.APP_HOST}/qr/${fileId}.png`;

        await generateQRCode(fileUrl, qrPath);

        res.json({
            id: fileId,
            pdfUrl: fileUrl,
            qrCodeUrl: qrUrl,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
