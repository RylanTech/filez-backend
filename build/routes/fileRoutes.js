"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filezController_1 = require("../controllers/filezController");
const router = (0, express_1.Router)();
router.get('/', filezController_1.getFileDetails);
router.post('/deletearr', filezController_1.deleteArray);
exports.default = router;
