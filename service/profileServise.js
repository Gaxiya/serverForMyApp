import toId  from'../helpers/toId.js';
import tokenService  from'./tokenService.js'
import {Profile}  from'../models/profile.js';
import ProfileDto from './../dtos/profile_dto.js';
import { v4 } from 'uuid';
import User from './../models/user.js';
import { Room } from './../models/room.js';

class ProfileService{
    async getProfile(token){
        try {
            const tokenData=await tokenService.findToken(token)
            const profileData=await  Profile.findOne({link:toId(tokenData.userId)})
            const profileDto= new ProfileDto(profileData)
            return profileDto
        } catch (error) {
            return null
        }
    }
    async deleteProfile(token){
        try {

            const tokenData = await tokenService.findToken(token)
            const data= await Profile.findOneAndDelete({link:toId(tokenData.userId)},{ useFindAndModify: false })
            console.log(data);
                return 'success'
        } catch (error) {
            return null
        }
    }
    async editProfile(tokenData, name,location,status,dateOfBirth,education,work){
        try {
            
            const profile=await Profile
            .findOneAndUpdate({link:toId(tokenData.userId)},
            {name:name,link:toId(tokenData.userId),location:location,
            status:status,dateOfBirth:dateOfBirth,education:education,work:work}
            ,{ useFindAndModify: false })
            const data = profile
            data.save()
            return data
        } catch (error) {
            return null
        }
    }
    async followProfile(followed,link){
        let profile = await Profile.findOne({link:link})
        let user = await User.findOne({_id:link})
        let followedUser=await User.findOne({_id:followed.profileId})
        if(!profile.followed.some(user => `${user.profileId }`===`${followed.profileId}`)){
            profile.followed.push(followed)
        }
        
        
        const data = await profile.save()
        return data
    }
    async unFollowProfile(followed,link){
        let profile = await Profile.findOne({link:link})
        
        const index = profile.followed.findIndex((fol)=>`${fol.profileId}`===`${followed.profileId}`)
       
        profile.followed.splice(index, 1);
        const data = profile.save()
        return data
    }
}

export default new ProfileService()
