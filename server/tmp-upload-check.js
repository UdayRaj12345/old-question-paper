require('dotenv').config();
const cloudinary = require('./config/cloudinary');
const { Readable } = require('stream');

const pdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000119 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n0\n%%EOF', 'utf8');

const uploadStream = cloudinary.uploader.upload_stream({
    folder: 'college_papers',
    resource_type: 'raw',
    type: 'upload',
    access_mode: 'public',
}, (err, result) => {
    if (err) {
        console.error('UPLOAD_ERROR', err);
        process.exit(1);
    }

    console.log(JSON.stringify({
        secure_url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
        type: result.type,
        format: result.format,
    }, null, 2));
});

Readable.from([pdfBuffer]).pipe(uploadStream);
