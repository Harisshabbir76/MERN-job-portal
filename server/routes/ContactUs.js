const express=require('express');
const ContactUs=require('../models/ContacUs');

const router = express.Router();

router.post('/contact-us', async (req, res)=>{
    const {name,email,message}=req.body;

    try{
        const newContact = new ContactUs({name, email, message});

        await newContact.save();
        res.json({message: "message sent successfully"})
    }catch(err){
        res.status(400).json({error:"Error sending message"});
    }
    })

module.exports =router