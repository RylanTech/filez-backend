"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const authService_1 = require("./services/authService");
const models_1 = require("./models");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const files_1 = require("./models/files");
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const path = require('path');
const fs = require("fs");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('uploads'));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const uploadsDirectory = path.join(__dirname, 'uploads');
// incoming requests
const cors = require('cors');
app.use(cors());
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Uploads will be stored in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix); // Use a timestamp + extension as the filename
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const storageDestination = 'uploads';
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(filename, { root: 'uploads' }, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    });
});
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(storageDestination, filename);
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Send the file for download
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
        });
    }
    else {
        // File not found
        res.status(404).send('File not found');
    }
});
app.post("/api/upload", upload.single('file'), async (req, res) => {
    const fileName = req.body.filename;
    let fileDes = req.body.filedes;
    try {
        let user = await (0, authService_1.verifyUser)(req);
        if (!user) {
            return res.status(403).send();
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }
        const downloadURL = `uploads/${req.file.filename}`;
        // The file is now guaranteed to be uploaded and ready to use
        let stats = fs.statSync(downloadURL);
        let size = stats.size;
        if (fileDes === "null") {
            fileDes = null;
        }
        const fileInfo = {
            name: fileName,
            path: req.file.filename,
            description: fileDes,
            uploadDate: Date.now(),
            size: size,
            userId: user.userId
        };
        try {
            const object = await files_1.File.create(fileInfo);
            res.status(200).json(object);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }
    catch (error) {
        console.error("Error uploading:", error);
        res.status(500).json({ error: "upload failed." });
    }
});
app.use("/api/file", fileRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use((req, res, next) => {
    res.status(404).send("error");
});
// Syncing DB
models_1.db.sync({ alter: false }).then(() => {
    console.info("Connected to the database!");
});
//for deployment change to 3000
const server = app.listen(3001, () => {
    server.timeout = 600000; // 10 minutes
    console.log("Running - 10 minute max upload");
});
