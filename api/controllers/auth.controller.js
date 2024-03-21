import User from "../models/user.models.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//Auth controller for signup
export const signup = async (req,res,next) => {

    const {username,email,password} = req.body;
    // Si il y'as pas de username et l'email et le password ou bien si le userame ou bien email ou bien 
    // password sont vide
    if(!username && !email && !password || username==='' || email===''|| password==='') {
      next(errorHandler(400,'All fields are required'));
    }

    //Password crypted in the backend
    const hashedPassword = bcryptjs.hashSync(password,10);

const newUser = new User ({
    username,
    email,
    password:hashedPassword,
});
//Send error to the user
try {
    await newUser.save();
res.json('Signup successful');
}catch (error) {
  next(error);
}

};

//Auth controller for signin
export const signin = async (req,res,next) => {

  const {email,password} = req.body;
  // si il y'as pas de username ou bien password ou bien username et vide ou bien password et vide
  if(!email || !password || email ==='' || password ==='' ) {
    next (errorHandler(400,'All fields are required'));
  }
  try {
    const validUser = await User.findOne({email});
    if(!validUser) {
     return next(errorHandler(404, 'User not found'))
    }
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword){
      return next(errorHandler(400,'Invalid Password'))
    }
    // on cree le token du user
     const token = jwt.sign(
      //Sauvegarder id du user  et encrypter la valeur id du user 
      {id : validUser._id , isAdmin : validUser.isAdmin }, process.env.JWT_SECRET);
        // separer le password du rest
      const {password : pass, ... rest} =validUser._doc;


      res.status(200).cookie('access_token',token,{
        // making our cookie secure
        httpOnly: true
      }).json(rest);
      
     

  }catch (error) {
    next(error);
  }
}


export const google = async (req,res ,next) =>{
  const {email , name , googlePhotoUrl} = req.body;
  try{
    const user = await User.findOne({email});
    if(user) {
      const token =jwt.sign({id:user._id , isAdmin : user.isAdmin},process.env.JWT_SECRET);
      const {password,...rest}= user._doc;
      res.status(200).cookie('access_token',token,{
        httpOnly :true ,

      }).json(rest);
    }  else {
      //Generer deux passwords 
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
      const newUser = new User ({
        //Generer username par exemple mehdiben => Mehdiben1254
        username :name.toLowerCase().split('').join('')+ Math.random().toString(9).slice(-4) ,
        email , 
        password : hashedPassword,
        profilePicture : googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({id : newUser._id , isAdmin :newUser.isAdmin} , process.env.JWT_SECRET);
      const { password , ...rest } = newUser._doc;
      res.status(200).cookie('access_token' ,token , {
        httpOnly : true , 
      })
      .json(rest);

    }

  }catch (error) {
    next(error)
  }
}