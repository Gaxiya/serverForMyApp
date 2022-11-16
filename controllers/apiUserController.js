import {Profile}  from'../models/profile.js'
import mongoose from 'mongoose'
import tokenService from '../service/tokenService.js';
import UsersDto from './../dtos/users_dto.js';

const toid= mongoose.Types.ObjectId


const handleError = (res, error) => {
    res.status(500).send(error.message);
  }

export const getUsers= async (req, res) => {
  const {refreshToken} = req.cookies
  const tokenData= await tokenService.findToken(refreshToken)
  
  let ad = await Profile.find()
  let users=[]
  for (let user of ad) {
    user = new UsersDto(user)
    if(user.link!=`${tokenData.userId}`){
      users.push(user)
    }
    
  }
  res.send(users)
  }
  

// const deleteUser = (req, res) => {
//     const { id } = req.params;
//     Post
//     .findByIdAndDelete(id)
//     .then((post) => res.status(200).json(id))
//     .catch((error) => handleError(res, error));
//   }
  
//   const editUser = (req, res) => {
//     const { title, author, text } = req.body;
//     const { id } = req.params;
//     Post
//       .findByIdAndUpdate(id, { title, author, text }, { new: true })
//       .then((post) => res.json(post))
//       .catch((error) => handleError(res, error));
//   }
