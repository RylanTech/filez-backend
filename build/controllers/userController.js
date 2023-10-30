"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCurrentUser = exports.deleteUser = exports.modifyUser = exports.getUser = exports.signInUser = exports.createUser = exports.allUser = void 0;
const users_1 = require("../models/users");
const auth_1 = require("../services/auth");
const authService_1 = require("../services/authService");
const allUser = async (req, res, next) => {
    let users = await users_1.User.findAll();
    res.status(200).json(users);
};
exports.allUser = allUser;
const createUser = async (req, res, next) => {
    //   let user = await verifyUser(req);
    //   if (user) {
    //     if (user.userType !== "admin") {
    //       return res.status(403).send("Not an Admin");
    //     };
    //     let newUser: User = req.body;
    //     if (newUser.email && newUser.password && newUser.name && newUser.userType) {
    //       // hashPass will go here
    //       let hashedPassword = await hashPassword(newUser.password);
    //       newUser.password = hashedPassword;
    //       let create = await User.create(newUser);
    //       res.status(200).json({
    //         email: create.email,
    //         userId: create.userId,
    //       });
    //     } else {
    //       res.status(400).send("Missing feilds");
    //     }
    //   } else {
    //     res.status(401).send("Not Authurized")
    //   }
    let newUser = req.body;
    if (newUser.email && newUser.password && newUser.name) {
        newUser.userType = 'admin';
        // hashPass will go here
        let hashedPassword = await (0, auth_1.hashPassword)(newUser.password);
        newUser.password = hashedPassword;
        let create = await users_1.User.create(newUser);
        res.status(200).json({
            email: create.email,
            userId: create.userId,
        });
    }
    else {
        res.status(400).send("Missing feilds");
    }
};
exports.createUser = createUser;
const signInUser = async (req, res, next) => {
    let validUser = await users_1.User.findOne({
        where: { email: req.body.email },
    });
    if (validUser) {
        // add authentication
        let matchPass = await (0, auth_1.comparePasswords)(req.body.password, validUser.password);
        if (matchPass) {
            // if pass matches, generate token
            let token = await (0, authService_1.signUserToken)(validUser);
            res.status(200).json({ token, userId: validUser.userId });
        }
        else {
            res.status(401).json("Password invalid");
        }
    }
    else {
        res.status(401).json("Email invalid");
    }
};
exports.signInUser = signInUser;
const getUser = async (req, res, next) => {
    // const currentDate = new Date().toISOString().slice(0, 10);
    let usr = req.params.id;
    let user = await users_1.User.findByPk(usr);
    res.status(200).json(user);
};
exports.getUser = getUser;
const modifyUser = async (req, res, next) => {
    try {
        let newUser = req.body;
        let user = await (0, authService_1.verifyUser)(req);
        //Does the user exist? if yes contiune
        if (!user) {
            return res.status(403).send("No user signed in");
        }
        let userId = parseInt(req.params.id);
        newUser.userId = userId;
        //Is the user making the edit the same user editing themselves? if yes continue
        if (user.userType === "admin") {
            let foundUser = await users_1.User.findByPk(userId);
            if (!foundUser) {
                return res.status(404).send();
            }
            if (newUser.password) {
                newUser.password = await (0, auth_1.hashPassword)(newUser.password);
            }
            else {
                newUser.password = foundUser.password;
            }
            if (!newUser.userType) {
                user.userType = "admin";
            }
            if (foundUser.dataValues.userId === parseInt(newUser.userId)) {
                await users_1.User.update(newUser, { where: { userId } });
                res.status(200).json();
            }
            else {
                res.status(400).send();
            }
        }
        else if (user.userId === userId) {
            let foundUser = await users_1.User.findByPk(userId);
            if (!foundUser) {
                return res.status(404).send();
            }
            if (newUser.password) {
                newUser.password = await (0, auth_1.hashPassword)(newUser.password);
            }
            else {
                newUser.password = foundUser.password;
            }
            newUser.userType = "user";
            if (foundUser.dataValues.userId === parseInt(newUser.userId)) {
                await users_1.User.update(newUser, { where: { userId } });
                res.status(200).json();
            }
            else {
                res.status(400).send();
            }
        }
        else {
            return res.status(403).send("Not the same user");
        }
    }
    catch {
        return res.status(500).send("Error modifing user");
    }
};
exports.modifyUser = modifyUser;
const deleteUser = async (req, res, next) => {
    let user = await (0, authService_1.verifyUser)(req);
    if (!user) {
        return res.status(403).send();
    }
    let userId = parseInt(req.params.id);
    let findUser = await users_1.User.findByPk(userId);
    //Is the user making the edit the same user editing themselves? if yes continue
    if (user.userType === "admin") {
        if (findUser) {
            await users_1.User.destroy({
                where: { userId: userId },
            });
            res.status(200).send("User deleted");
        }
        else {
            res.status(404).send("User not found");
        }
    }
    else if (user.userId === userId) {
        if (findUser) {
            await users_1.User.destroy({
                where: { userId: userId },
            });
            res.status(200).send("User deleted");
        }
        else {
            res.status(404).send("User not found");
        }
    }
    else {
        res.status(401).send("Unauthorized");
    }
    ;
};
exports.deleteUser = deleteUser;
const verifyCurrentUser = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const decoded = await (0, authService_1.verifyToken)(token);
        if (decoded && decoded.userId) {
            const user = await users_1.User.findByPk(decoded.userId);
            if (user) {
                return res.json(user);
            }
        }
    }
    return res.status(401).json("Invalid token or user not found");
};
exports.verifyCurrentUser = verifyCurrentUser;
