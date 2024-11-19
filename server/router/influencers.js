const express = require("express");
const router = express.Router();

const {createinfluencer,updateinfluencer,get_all_influencers_details,getone_influencer_details,deleteinfluencer} = require("../controller/influencers");


router.post("/createinfluencer",createinfluencer);
router.put("/updateinfluencer/:id",updateinfluencer);
router.get('/getinfluencers',get_all_influencers_details);
router.get('/getinfluencer/:id',getone_influencer_details);
router.delete('/deleteinfluencer/:id',deleteinfluencer);


module.exports = router;