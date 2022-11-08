const express = require('express');
const User = require("../modules/User");
const router = express.Router();
// Read Users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } 
    catch(err) {
        res.json({message: err});
    }
});
// Read A Specific User
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.json({message: err});
    }
});
// Create A User Profile
router.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });
    try {
        const savedUser = await user.save();
        res.json({savedUser});
    } catch (err) {
        res.json({message : err});
    }
});
// Update A User
router.patch("/:userId", async(req, res) => {
    try {
        const updatedUser = await User.updateOne(
            {_id : req.params.userId},
            {$set : {name : req.body.name}}
        );
        res.json(updatedUser);
    } catch (err) {
        res.json({message: err});
    }
});

// Delete A User
router.delete("/:userId", async (req, res) => {
    try {
        const removedUser = await User.remove({_id : req.params.userId});
        res.json(removedUser);
    } catch (err) {
        res.json({message: err});
    }
});

module.exports = router;