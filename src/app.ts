import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import multer from 'multer';
import { verifyUser } from './services/authService';
import { db } from './models';
import userRoutes from './routes/userRoutes'
import { User } from './models/users';
import { File } from './models/files';
import fileRoutes from './routes/fileRoutes'

const fs = require("fs")

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'))
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// incoming requests
const cors = require('cors');
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Uploads will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Use a timestamp + extension as the filename
  },
});
const upload = multer({ storage: storage });

 
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(filename, { root: 'uploads' }, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send('File not found');
    }
  });
});

app.post("/api/upload", upload.single('file'), async (req, res) => {

  const fileName = req.body.filename
  let fileDes = req.body.filedes

  try {
    let user: User | null = await verifyUser(req);
    if (!user) {
      return res.status(403).send();
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const downloadURL = `uploads/${req.file.filename}`;

    // The file is now guaranteed to be uploaded and ready to use
    let stats = fs.statSync(downloadURL);
    let size = stats.size

    if (fileDes === "null") {
      fileDes = null
    }

    console.log(fileName)

    const fileInfo: any = {
      name: fileName,
      path: downloadURL,
      description: fileDes,
      uploadDate: Date.now(),
      size: size,
      userId: user.userId
    }

    try {
      const object = await File.create(fileInfo)
      res.status(200).json(object);
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  } catch (error) {
    console.error("Error uploading:", error);
    res.status(500).json({ error: "upload failed." });
  }
});

app.use("/api/file", fileRoutes)
app.use("/api/user", userRoutes)

app.use(( req: Request, res: Response, next: NextFunction ) => {
  res.status(404).send("error");
})


// Syncing DB
db.sync({ alter:false }).then(() => {
  console.info("Connected to the database!")
});

//for deployment change to 3000
app.listen(3001);