const express=require('express');
const router=express.Router();
const authmiddle=require('../middleware/authmiddleware');
const { body, validationResult } = require('express-validator');
const Notes=require('../models/Notes');


//Route 1: To get notes of particular user using post
router.get('/getnotes',authmiddle,async(req,res)=>{
    try {
        const data=await Notes.find({user:req.user.id});
        res.json(data); 
    }catch(err){
        console.error(err.message);
        res.status(500).send("Musibat ka jar get notes hai");
    }
})

//Route 2: To add a note
router.post('/addnotes',authmiddle,[
    body('title','Title must be 3 chars').isLength({min:3}),
    body('description','description can not be empty').exists(),
],
async(req,res)=>{
    //Throw error if there is problem in validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const {title, description, tag}= req.body;
        const note=new Notes({
            title, description, tag, user:req.user.id,
        })
        const saveNote=await note.save();
        res.json(saveNote);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Musibat ka jar get notes hai");
    }
})


//Route 3: Updating a existing note using put request. Login required

router.put('/update/:id',authmiddle, async(req,res)=>{
    const {title, description, tag}=req.body;
    try {
        //creating a new node
        const newnote={};
        if(title){newnote.title=title};
        if(description){newnote.description=description};
        if(tag){newnote.tag=tag};

        //checking weather note exist to corresponing id or not
        let note=await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).json({error:"Not found"});
        }

        //checking weather autherised user is updating its personal note
        if(note.user.toString() !== req.user.id){
            return res.status(401).json({error:"UnAutherized person"});
        }

        //After all check a true user wants to update note
        note= await Notes.findByIdAndUpdate(req.params.id, {$set:newnote}, {new:true});
        res.send(note);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Musibat ka jar update notes hai");
    }    
})

//Route 4: Delete a existing note using delete request. Login required

router.delete('/delete/:id',authmiddle, async(req,res)=>{
    try {
        //checking weather note exist to corresponing id or not
        let note=await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).json({error:"Not found"});
        }

        //checking weather autherised user is updating its personal note
        if(note.user.toString() !== req.user.id){
            return res.status(401).json({error:"UnAutherized person"});
        }

        //After all check a true user wants to delete note
        note= await Notes.findByIdAndDelete(req.params.id);
        res.json({"success":"Note deleted", note:note});
    }catch(err){
        console.error(err.message);
        res.status(500).send("Musibat ka jar delete notes hai");
    }    
})

module.exports=router;