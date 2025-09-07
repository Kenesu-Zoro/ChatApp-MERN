import express from "express";
import User from "../models/user.model.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.config.js";


export const signup = async(req, res) => {
    const { email, fullName, password } = req.body;

    try {
        if(!email || !fullName || !password) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address." });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                message: "User registered successfully",
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            })

        }else{
            return res.status(400).json({ message: "Invalid user data." });
        }
    
    } catch (error) {
        console.error("Error is Signup Controller" +error);
        res.status(500).json({ message: "Server error (signup)" });
    }
}

export const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email})

        if(!user){
            res.status(400).json({ message: "Invalid User credentials." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            res.status(400).json({ message: "Invalid User credentials." });
        }

        generateToken(user._id, res);

        res.status(200).json({
            message: "Login successful",
            ...user._doc,
            password: undefined,
        })
       

    } catch (error) {
        console.error("Error in Login Controller" +error);
        res.status(500).json({ message: "Server error (login)" });
    }
}

export const logout = async(req, res) => {
    try {
        res.cookie('jwtToken', '', {maxAge: 0});
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error in Logout Controller" +error);
        res.status(500).json({ message: "Server error (logout)" });
    }
}

export const updateProfile = async(req, res) => {
    try {
        const {profilePic} = req.body;

        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({ message: "Please provide profile picture." });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error in Update Profile Controller" +error);
        res.status(500).json({ message: "Server error (updateProfile)" });
    }
}

export const checkAuth = async(req, res) => {
    try {
        res.status(200).json({message: "check completed", user: req.user });
    } catch (error) {
        console.error("Error in Check Auth Controller" +error);
        res.status(500).json({ message: "Server error (checkAuth)" });
    }
}

