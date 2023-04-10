const Controller = require('../controllers')
const cuisineRouter = require('./cuisineRouter')
const router = require('express').Router()

router.get('/',(req,res)=>{
    res.status(200).json({
        message:"masuk"
    })
})

router.use(cuisineRouter)

module.exports = router