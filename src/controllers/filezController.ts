import { RequestHandler } from "express";
import { verifyUser } from "../services/authService";
import { File } from "../models/files";
const fs = require('fs');

export const getOneFileDetails: RequestHandler = async (req, res, next) => {

};

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

export const getAllFileDetails: RequestHandler = async (req, res, next) => {

};

export const deleteArray: RequestHandler = async (req, res, next) => {
    try {
        let user = await verifyUser(req);

        //Does the user exist? if yes contiune
        if (!user) {
            return res.status(403).send("No user signed in");
        }

        let reqDelArr = req.body

        reqDelArr.map(async (id: number) => {
            let file = await File.findByPk(id)

            if (file) {
                let filePath = file.path
                fs.unlink(filePath, () => {
                    console.log(`File deleted successfully.`);
                });
                File.destroy({where: {fileId: id}})
            } else {
                File.destroy({where: {fileId: id}})
            }
        })
        res.status(200).json({ message: 'File deleted successfully' });

    } catch (error) {
        res.status(500).send(error)
    }
};