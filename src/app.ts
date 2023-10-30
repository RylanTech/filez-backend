import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import { verifyUser } from './services/authService';
import { db } from './models';
import userRoutes from './routes/userRoutes'

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'))

// incoming requests
const cors = require('cors');
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Uploads will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    console.log(uniqueSuffix)
    cb(null, uniqueSuffix); // Use a timestamp + extension as the filename
  },
});
const upload = multer({ storage: storage });

 
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log(filename)
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
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Image upload failed." });
  }
});

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