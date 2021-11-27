 const express = require('express');
const router = express.Router();
const {
    createCheck,
    getCheck,
    updateCheck,
    deleteCheck,
    GroupChecksByTag,
    verifyToken,
    
} = require('../controllers/checkController');

router.post(
    '/',
    verifyToken,
    createCheck,
);

router.get(
    '/:name',
    verifyToken,
    getCheck,
);

router.post(
    '/GroupChecksByTag',
    verifyToken,
    GroupChecksByTag,
);


router.put(
    '/:id',
    verifyToken,
    updateCheck,
);

router.delete(
    '/:id',
    verifyToken,
    deleteCheck,
);

module.exports = router;