import {FollowedProfile}  from'../models/profile.js'
import toId  from'../helpers/toId.js'
import tokenService  from'../service/tokenService.js'
import profileServise  from'../service/profileServise.js'




export const handleError = (res, error) => {
  console.log(error);
  res.send( "error").status(500);
}

export const getProfile = async (req, res) => {
  try {
    const {refreshToken} = req.cookies
    const data = await profileServise.getProfile(refreshToken)
    if(!data){
      res.status(500)
    }
    res.send(data)
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteProfile = async (req, res) => {
  try {
    const {refreshToken} = req.cookies
    const data = await profileServise.deleteProfile(refreshToken)
    if(!data){
      res.status(500).send('error')
    }
    res.status(200).send("success")
  } catch (error) {
    handleError(res, error)
  }
}


export const addorEditProfile = async(req, res) => {
  try {
    const { name,location,status,dateOfBirth,education,work} = req.body;
    const {refreshToken} = req.cookies
    const tokenData= await tokenService.findToken(refreshToken)
    const editData = await profileServise.editProfile(tokenData, name,location,status,dateOfBirth,education,work)
    res.send(editData)
  } catch (error) {
    handleError(res, error)
  }

}
export const addFollowedtoProfile = async (req, res) => {
  try {
    const { profileName,profileId} = req.body;
    const followed=new FollowedProfile({profileName:profileName,profileId:toId(profileId)})
    const {refreshToken} = req.cookies
    const tokenData= await tokenService.findToken(refreshToken)
    const profileData = await profileServise.followProfile(followed,toId(tokenData.userId))
    res.send(profileData)
  } catch (error) {
    handleError(res, error)
  }
}
export const deleteFollowedtoProfile = async (req, res) => {
  try {
    const {profileName,profileId} = req.body;
    const followed=new FollowedProfile({profileName:profileName,profileId:toId(profileId)})
    const {refreshToken} = req.cookies
    const tokenData= await tokenService.findToken(refreshToken)
    const profileData = await profileServise.unFollowProfile(followed,toId(tokenData.userId))
    res.send(profileData)
  } catch (error) {
    handleError(res, error)
  }
}


