"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const models_1 = require("./models");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('uploads'));
// incoming requests
const cors = require('cors');
app.use(cors());
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Uploads will be stored in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        console.log(uniqueSuffix);
        cb(null, uniqueSuffix); // Use a timestamp + extension as the filename
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log(filename);
    res.sendFile(filename, { root: 'uploads' }, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    });
});
app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
        // let user: User | null = await verifyUser(req);
        // if (!user) {
        //   return res.status(403).send();
        // }
        if (!req.body) {
            return res.status(400).json({ error: "No file uploaded." });
        }
        const downloadURL = `/uploads/${req.file?.filename}`;
        res.status(200).json({ downloadURL });
    }
    catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Image upload failed." });
    }
});
app.use("/api/user", userRoutes_1.default);
app.use((req, res, next) => {
    res.status(404).send("error");
});
// Syncing DB
models_1.db.sync({ alter: false }).then(() => {
    console.info("Connected to the database!");
});
//for deployment change to 3000
app.listen(3001);
