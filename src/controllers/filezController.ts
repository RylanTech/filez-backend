import { RequestHandler } from "express";
import { verifyUser } from "../services/authService";
import { File } from "../models/files";
import { promisify } from "util";
const fs = require('fs');
import path from 'path';

export const getFileDetails: RequestHandler = async (req, res, next) => {
    let user = await verifyUser(req);
    if (user) {
        try {
            const files = await File.findAll({ where: { userId: user.userId }, limit: 250 })
            res.status(200).send(files)
        } catch {
            res.status(400).send("User error")
        }
    } else {
        res.status(401).send()
    }
};

export const deleteArray: RequestHandler = async (req, res, next) => {
    try {
        let user = await verifyUser(req);

        // Does the user exist? If yes, continue
        if (!user) {
            return res.status(403).send("No user signed in");
        }

        let reqDelArr = req.body;

        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(reqDelArr.map(async (id: number) => {
            let file = await File.findByPk(id);
            console.log(file);

            if (file) {
                let filePath = file.path;
                
                // Log the absolute path
                const parsedPath = path.parse(path.resolve(filePath));
                filePath = path.join(parsedPath.root, parsedPath.dir, 'uploads', parsedPath.base);
                console.log(parsedPath)

                // Check if the file exists before attempting to delete it
                if (fs.existsSync(filePath)) {
                    // Promisify the fs.unlink operation
                    const unlinkAsync = promisify(fs.unlink);
                    await unlinkAsync(filePath);
                }

                await File.destroy({ where: { fileId: id } });
            } else {
                await File.destroy({ where: { fileId: id } });
            }
        }));

        res.status(200).json({ message: 'Files deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};