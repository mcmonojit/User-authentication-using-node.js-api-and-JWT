const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify,(req,res) => {
    res.json({
        posts:{
            title:'I live in Hyderabad',
            description: 'Data which should not be accessed without permission'
        }
    });

});

module.exports = router;