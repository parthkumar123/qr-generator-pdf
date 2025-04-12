const QRCode = require('qrcode');

async function generateQRCode(text, outputPath) {
    return new Promise((resolve, reject) => {
        QRCode.toFile(outputPath, text, {
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        }, function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = { generateQRCode };
