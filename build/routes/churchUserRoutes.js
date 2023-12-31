"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const churchUserController_1 = require("../controllers/churchUserController");
const searchController_1 = require("../controllers/searchController");
const router = (0, express_1.Router)();
router.get('/', churchUserController_1.allUser);
router.get('/:id', churchUserController_1.getUser);
router.get("/apikey", churchUserController_1.getAPIKey);
router.post('/verify/:id', churchUserController_1.vrfyUser);
router.post('/create-account', churchUserController_1.createUser);
router.put('/edit-account/:id', churchUserController_1.modifyUser);
router.post('/signin', churchUserController_1.signInUser);
router.delete('/delete-account/:id', churchUserController_1.deleteUser);
router.get("/verify-current-user", churchUserController_1.verifyCurrentUser);
router.post("/search/:query", searchController_1.searchUser);
exports.default = router;
