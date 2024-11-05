const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const helmet = require('helmet')

const app = express();
const port = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from public folder
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

// Configure Content Security Policy
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "chrome-extension://285b543b-3fcc-4b45-be94-0fc63c1dd719"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            frameSrc: ["'self'"],
           
            // Add more directives as needed
        },
    })
);

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'File Processing API',
        version: '1.0.0',
        description: 'API to upload, process, and download files',
      },
    },
    apis: ['./server.js'],  // Path to the API documentation in your project
  };
  
  
// Function to replace fields in the target content
function replaceFields(sourceContent, targetContent, frontEndData) {
    const sourceLines = sourceContent.split('\n');
    const targetLines = targetContent.split('\n');

    const field1 = sourceLines[0].substring(16, 34).trim();
    const field2 = sourceLines[1].substring(5, 42).trim();
    const field3 = sourceLines[2].substring(16, 41).trim();
    const field4 = sourceLines[0].substring(24, 34).trim();
    const field5 = sourceLines[1].substring(5, 17).trim();

    const field6 = frontEndData.FirstName || "";
    const field7 = frontEndData.LastName || "";

    targetLines[0] = targetLines[0].substring(0, 16) + field1 + targetLines[0].substring(33);
    targetLines[1] = targetLines[1].substring(0, 8) + field2 + targetLines[1].substring(45);
    targetLines[2] = targetLines[2].substring(0, 16) + field3 + targetLines[2].substring(41);

    targetLines[1] = targetLines[1].substring(0, 248) + field4 + targetLines[1].substring(257);
    targetLines[1] = targetLines[1].substring(0, 1555) + field5 + targetLines[1].substring(1568);

    targetLines[1] = targetLines[1].substring(0, 632) + field7 + targetLines[1].substring(field7.length + 632);
    targetLines[1] = targetLines[1].substring(0, 672) + field6 + targetLines[1].substring(field6.length + 672);

    return targetLines.join('\n');
}

// Endpoint to handle file uploads and processing
app.post('/process-Beqr', upload.fields([{ name: 'sourceFile' }, { name: 'targetFile' }]), (req, res) => {
    const sourceFilePath = req.files['sourceFile'][0].path;
    const targetFilePath = req.files['targetFile'][0].path;

    const frontEndData = {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName
    };

    const sourceContent = fs.readFileSync(sourceFilePath, 'utf-8');
    const targetContent = fs.readFileSync(targetFilePath, 'utf-8');
    
    const newContent = replaceFields(sourceContent, targetContent, frontEndData);

    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename="updated_target.txt"');
    res.setHeader('Content-Type', 'text/plain');
    res.send(newContent);

    // Clean up uploaded files
    fs.unlinkSync(sourceFilePath);
    fs.unlinkSync(targetFilePath);
});


   
app.post('/process-trr', (req, res) => {
      
 
    const { MBI,  surname, firstname, effectiveDate, contractNumber, PBP, dob , genderCode, signatureDate } = req.body;

    // Format the effectiveDate and dob
    const formattedEffectiveDate = effectiveDate.replace(/-/g, ''); // Format date as YYYYMMDD
    const formattedDob = dob.replace(/-/g, ''); // Format date as YYYYMMDD
    const formattedSignatureDate = signatureDate.replace(/-/g,'');

    let fileContent = `2GP3GP4GP11 SWIFT       TAYLOR  119530402TH17482320000  01161 202501010010 202310230                               H1748   2023100601N00000000.0000000.00UJ N006Y 19.22.56.782491        000                                                           0000.00 0000.00 0000.00 0000.00                                                                    0000.00            ENROLL ACCEPTED                                                                                  Y             0317975024HCF054028567441\n`;

    // Replace values at the specified positions
    fileContent = replaceAtPosition(fileContent, MBI, 0, 11);
    fileContent = replaceAtPosition(fileContent, surname, 12, 24);
    fileContent = replaceAtPosition(fileContent, firstname, 24, 31);
    fileContent = replaceAtPosition(fileContent, formattedDob, 33, 41);
    fileContent = replaceAtPosition(fileContent, contractNumber, 42, 47);
    fileContent = replaceAtPosition(fileContent, formattedEffectiveDate, 62, 70);
    fileContent = replaceAtPosition(fileContent, PBP, 71, 74);
    fileContent = replaceAtPosition(fileContent, genderCode, 32, 33);
    fileContent = replaceAtPosition(fileContent, formattedSignatureDate,75, 83);

    // Save the file content to a .txt file
    const filePath = path.join(__dirname, 'trr.txt');
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            return res.status(500).send('Error saving the file');
        }
        res.download(filePath, 'trr.txt', (err) => {
            if (err) {
                return res.status(500).send('Error downloading the file');
            }
        });
    });
});


app.post('/process-dis-trr', (req, res) => {
      
 
    const { MBI,  surname, firstname, effectiveDate, contractNumber, PBP, dob , genderCode, signatureDate,effectiveDateDis } = req.body;

    // Format the effectiveDate and dob
    const formattedEffectiveDate = effectiveDate.replace(/-/g, ''); // Format date as YYYYMMDD
    const formattedDob = dob.replace(/-/g, ''); // Format date as YYYYMMDD
    const formattedSignatureDate = signatureDate.replace(/-/g,'');
    const formattedeffectiveDateDis = effectiveDateDis.replace(/-/g,'');
    let fileContent = `2GP3GP4GP11 SWIFT       TAYLOR  119530402TH17482320000  01161 202501010010 202310230                               H1748   2023100601N00000000.0000000.00UJ N006Y 19.22.56.782491        000                                                           0000.00 0000.00 0000.00 0000.00                                                                    0000.00            ENROLL ACCEPTED                                                                                  Y             0317975024HCF054028567441\n`;

    // Replace values at the specified positions
    fileContent = replaceAtPosition(fileContent, MBI, 0, 11);
    fileContent = replaceAtPosition(fileContent, surname, 12, 24);
    fileContent = replaceAtPosition(fileContent, firstname, 24, 31);
    fileContent = replaceAtPosition(fileContent, formattedDob, 33, 41);
    fileContent = replaceAtPosition(fileContent, contractNumber, 42, 47);
    fileContent = replaceAtPosition(fileContent, formattedEffectiveDate, 62, 70);
    fileContent = replaceAtPosition(fileContent, PBP, 71, 74);
    fileContent = replaceAtPosition(fileContent, genderCode, 32, 33);
    fileContent = replaceAtPosition(fileContent, formattedSignatureDate,75, 83);
    fileContent = replaceAtPosition(fileContent, formattedSignatureDate,84, 92);


    // Save the file content to a .txt file
    const filePath = path.join(__dirname, 'trr.txt');
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            return res.status(500).send('Error saving the file');
        }
        res.download(filePath, 'trr.txt', (err) => {
            if (err) {
                return res.status(500).send('Error downloading the file');
            }
        });
    });
});

// Helper function to replace content at specific positions
function replaceAtPosition(str, replacement, start, end) {
    let temp = " ".repeat((end - start) - replacement.length);
    return str.substring(0, start) + replacement+ temp + str.substring(end);
}




// Start the server
app.listen(PORT, () => {
   
});
