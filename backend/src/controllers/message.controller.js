import express from 'express';
import dotenv from "dotenv";
import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.config.js';
import { io,getRecieverSocketId  } from '../lib/socket.js';


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id : { $ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
       console.error("Error in getUsersForSidebar Controller" +error);
       res.status(500).json({ message: "Server error (getUsersForSidebar)" }); 
    }
};

export const  getMessagesWithUser = async (req, res) => {
    const {id: otherUserId} = req.params;
    const MyUserId = req.user._id;

    try {
        const messages = await Message.find({
            $or : [
                { senderId: MyUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: MyUserId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessagesWithUser Controller" +error);
        res.status(500).json({ message: "Server error (getMessagesWithUser)" });
    }
};

export const sendMessagesToUser = async (req, res) => {
  try {
      const {text, image} = req.body;
      const {id: receiverId} = req.params;
      const senderId = req.user._id;

      // if(!text || !image){
      //   return res.status(400).json({ message: "Message text or image is required" });
      //   }
  
     let imageUrl = null;
  
     if(image){
      try {
        const uploadedImage = await cloudinary.uploader.upload(image);
        imageUrl = uploadedImage.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary: " + error);
        return res.status(500).json({ message: "Image upload failed" }); 
      }
     }

     const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl
     });

     await newMessage.save();
     
     // realtime function with socket.io will go here

     const receiverSocketId = getRecieverSocketId(receiverId);
     if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage);
     }

    res.status(201).json(newMessage);


  } catch (error) {
    console.error("Error in sendMessagesToUser Controller" +error);
    res.status(500).json({ message: "Server error (sendMessagesToUser)" });
  }
};

