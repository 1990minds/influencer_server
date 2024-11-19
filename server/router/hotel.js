const express = require("express");
const router = express.Router();

const { createhotel,updatehotel,getAllHotels,getOnehotel,deletehotel } = require("../controller/hotel")

router.post("/createhotel",createhotel);
router.put("/updatehotel/:id",updatehotel);
router.get('/gethotel/:id',getOnehotel);
router.get('/gethotels',getAllHotels);
router.delete('/deletehotel/:id',deletehotel);


module.exports = router;