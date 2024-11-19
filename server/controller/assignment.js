const Assignment = require("../model/assignment");

exports.create_assignment = async(req,res)=>{
    console.log("Here creating Assignment With Below Details",req.body);
    try{
        const new_assignment = new Assignment(req.body);
        await new_assignment.save();
        res.status(201).json({ msg: "Assignment created successfully" });

    }
    catch(error){
        console.log(error);
        res.status(401).json({ err: "Somthing Went Wrong !", error });
    }
};

exports.update_assignment = async(req,res)=>{
    console.log("Here updating Assignment Triggered With Below Details",req.body);
    try {
      
        const new_Assignment = await Assignment.findByIdAndUpdate(
          req.params.id,  
          req.body,       
          { new: true }     
        );
        if (!new_Assignment) {
          return res.status(404).json({ msg: "Assignment not found" });
        }
        res.json({ msg: "Updated successfully", new_Assignment });
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong!", error });
      }
};

exports.get_all_assignments = async (req, res) => {
    console.log("Getting all Assignments Details, function Triggered");
    try {
      const assignments = await Assignment.find().populate('cafe influencer'); // Use populate if you want referenced data
      res.status(200).json(assignments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Something went wrong!", error });
    }
  };
  

exports.get_one_assignment = async(req,res)=>{
    try {
        const assignment = await Assignment.findById({ _id: req.params.id }).populate('cafe influencer');
    
        res.status(201).json(assignment);
      }
    catch(error){
        console.log(error);
        res.status(500).json({ msg: "Something went wrong!", error });
    

}
};

exports.delete_assignment = async (req, res) => {
    console.log("Delete Function Triggered");
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) {
            return res.status(404).json({ msg: "Assignment not found" });
        }
        res.status(200).json({
            msg: "Assignment data deleted successfully",
            deleted_Assignment: assignment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something Went Wrong!" });
    }
};