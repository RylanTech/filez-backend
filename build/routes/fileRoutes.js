"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filezController_1 = require("../controllers/filezController");
const router = (0, express_1.Router)();
router.get('/', filezController_1.getFileDetails);
exports.default = router;
