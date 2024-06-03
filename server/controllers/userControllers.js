const bcrypt = require('bcryptjs')
const jwt=require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const {v4: uuid}=require("uuid")


const User = require('../models/userModel')
const HttpError = require("../models/errorModel")

// ========== REGISTER A NEw USER
// POST :api/users/register 
// UNPROTECTED


const registerUser= async (req,res,next)=>{
    try {
        const {name,email,password,password2}=req.body;
        if(!name ||  !email || !password){
            return next(new HttpError("Fill in all fields.",422))
        }

        const newEmail=email.toLowerCase()

        const emailExists=await User.findOne({email: newEmail})
        if(emailExists){
            return next(new HttpError("Email already exists.",422))

        }
        if((password.trim()).length < 6){
             return next(new HttpError("Password should be at least 6 characters.",422))
        }

        if(password != password2){
            return next(new HttpError("Password do not match.",422))
        }

      const salt = await bcrypt.genSalt(10)
      const hasheadPass = await bcrypt.hash(password,salt);
      const newUser= await User.create({name,email:newEmail,password:hasheadPass})
      res.status(201).json(`New User ${newUser.email} registered.`)

    } catch (error) {
        return next(new HttpError("User registration failed.",422))
        
    }
}













// ========== LOGIN REGISTER A  USER
// POST :api/users/login 
// UNPROTECTED

const loginUser= async (req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password ){
            return next(new HttpError("Fill in the filleds.",422))
        }
        const newEmail=email.toLowerCase();

        const user =await User.findOne({email:newEmail})
        if(!user){
            return next(new HttpError("Invalid Credential.",422))
        }

        const comparePass=await bcrypt.compare(password,user.password)
        if(!comparePass){
            return next(new HttpError("Invalid Credentials.",422))

        }

        const{_id: id, name}= user;
        const token = jwt.sign({id,name}, process.env.JWT_SECRET,{expiresIn:"1d"})

        res.status(200).json({token,id,name})
        
    } catch (error) {
        return next(new HttpError("Login Failed. please check your credentials.",422))
        
    }
}











// ========== USER PROFILE 
// POST :api/users/id
// PROTECTED

const getUser= async (req,res,next)=>{
   try {
    const {id} = req.params;
    const user=await User.findById(id).select('-password');
    if(!user){
        return next(new HttpError("User Not Found.",404))
    }
    res.status(200).json(user);
    
   } catch (error) {
    return next(new HttpError(error))
    
   }
}









// ========== CHANGE USER AVATAR (profile picture) 
// POST :api/users/change-avatar
// PROTECTED

const changeAvatar= async (req,res,next)=>{
    try {
       if(!req.files.avatar){
        return next(new HttpError("Please Choose the image.",422))
       }
        // find user from database
        const user = await User.findById(req.user.id)

        if(user.avatar){
            fs.unlink(path.join(__dirname,'..', 'uploads', user.avatar),(err)=>{
                if(err){
                    return next(new HttpError(err))

                }
            })
        }

        const {avatar}=req.files;

        if(avatar.size>500000){
            return next(new HttpError("Profile Picture is to big. Should be less than 500kb"),422)
        }

        let fileName;
        fileName=avatar.name;
        let splittedFileName=fileName.split('.')
        let newFilename = splittedFileName[0]+ uuid() + '.' + splittedFileName[splittedFileName.length -1];
        // let filePath = path.join(__dirname, '../uploads/' + newFilename);
        avatar.mv(path.join(__dirname,'..','uploads',newFilename),async (err)=>{
            if(err){
                return next(new HttpError(err))
            }
            const updatedAvatar = await User.findByIdAndUpdate(req.user.id,{avatar:newFilename},{new:true})
            if(!updatedAvatar){
                return next(new HttpError("Avatar couldn't be changed",422))
            }
            res.status(200).json(updatedAvatar)
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}










// ========== Edit USER detail (from profile)
// POST :api/users/edit-user
// PROTECTED

const editUser= async (req,res,next)=>{
    try {
        const {name,email,currentPassword,newPassword,confirmNewPassword}=req.body;
        if(!name || !email || !currentPassword || !newPassword){
              return next(new HttpError("Fill in all fields.",422))
        }

        // get user from database
        const user = await User.findById(req.user.id);
        if(!user){
            return next(new HttpError("User not found.",403))
        }

        // make sure new email doestnot exits
        const  emailExist = await User.findOne({email});
         if(emailExist && (emailExist.id !=req.user.id)){
            return next(new HttpError("Email is already exist.",422))
         }

        // compare the password 

        const validateUserPassword = await bcrypt.compare(currentPassword,user.password); 
        if(!validateUserPassword){
            return next(new HttpError("Invalid current password.",422))
        }

        // compare new password

        if(newPassword !== confirmNewPassword){
            return next(new HttpError("New password do not match.",422))
        }
      
        // hash new password
        const salt = await bcrypt.genSalt(10)
        const  hash = await bcrypt.hash(newPassword,salt);

        //update the user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id,{name,email,password:hash},{new:true})
        res.status(200).json(newInfo)


    } catch (error) {
        return next(new HttpError(error))
        
    }
}












// ========== GET AUTHORS
// POST :api/users/authors
// UNPROTECTED

const getAuthors= async (req,res,next)=>{
    try {
        const authors =await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports={registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors}