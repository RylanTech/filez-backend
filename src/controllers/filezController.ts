import { RequestHandler } from "express";
import { verifyUser } from "../services/authService";
import { File } from "../models/files";

export const getOneFileDetails: RequestHandler = async (req, res, next) => {

};

export const getFileDetails: RequestHandler = async (req, res, next) => {
    let user = await verifyUser(req);
    if (user) {
        try {
            const files = await File.findAll({where: { userId: user.userId}, limit: 250})
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