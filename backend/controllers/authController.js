import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';


export const register = async (req, res)=>{

    const{name, email, password, address} = req.body;
   
    if(!name || !email || !password || !address){

        return res.json({success: false, message: 'Missing Details'})
    }

    try {

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false, message: "User already exists"});
        }

        const hashedPassword =  await bcrypt.hash(password, 10);

        const user = new userModel({
            name, 
            email, 
            password:hashedPassword, 
            address,
            roles: ['Customer'], // Assign default role
        });
        await user.save();
        
        const token = jwt.sign(
            {id: user._id, roles: user.roles}, 
            process.env.JWT_SECRET, 
            {expiresIn: '7d'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success:true, roles: user.roles});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async (req,res) => {
    const{email, password} = req.body;

    if(!email || !password){
        return res.json({success:false, message:'Email and password are required'});

    }

    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({succes:false, message:'Invalid email'});

        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({succes:false, message:'Invalid password'});
        }

        const token = jwt.sign(
            {id: user._id, roles: user.roles}, 
            process.env.JWT_SECRET, 
            {expiresIn: '7d'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success:true, roles: user.roles});


    } catch (error) {
        return res.json({success:false, message:error.message});
    }
}

export const logout = async (req, res) =>{
    try {

        res.clearCookie('token' , {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        })

        return res.json({succes:true, message: "Logged Out"})
        
    } catch (error) {
        return res.json({success:false, message:error.message});

    }
}


export const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not logged in' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

