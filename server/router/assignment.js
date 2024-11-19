const express = require("express");
const router = express.Router();
const {create_assignment,update_assignment,get_all_assignments,get_one_assignment,delete_assignment } = require("../controller/assignment")


router.post("/createassignment",create_assignment);
router.put("/updateassignment/:id",update_assignment);
router.get('/getassignment/:id',get_one_assignment);
router.get('/getassignments',get_all_assignments);
router.delete('/deleteassignment/:id',delete_assignment);



module.exports = router;