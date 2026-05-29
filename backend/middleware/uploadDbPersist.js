const fs = require('fs');
const { UploadedFile } = require('../models/associations');

const dbPersistUploads = async (req, res, next) => {
  const filesToSave = [];
  
  if (req.file) {
    filesToSave.push(req.file);
  }
  
  if (req.files && Array.isArray(req.files)) {
    filesToSave.push(...req.files);
  }

  for (const file of filesToSave) {
    try {
      // Exclude standard bulk product CSV files from being stored in database
      if (file.mimetype === 'text/csv' || file.fieldname === 'file') {
        continue;
      }

      // Verify the file exists on local disk
      if (!fs.existsSync(file.path)) {
        continue;
      }

      const fileData = fs.readFileSync(file.path);

      // Upsert the uploaded file details and binary data in the database
      await UploadedFile.upsert({
        filename: file.filename,
        mimeType: file.mimetype,
        data: fileData
      });
      
      console.log(`Successfully persisted file in database: ${file.filename}`);
    } catch (err) {
      console.error(`Failed to persist file ${file?.filename} to database:`, err);
    }
  }
  
  next();
};

module.exports = dbPersistUploads;
