import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const followedProfile = new Schema({
  profileName:{
    type: String,
    required:true
  },
  profileId:{
    type:mongoose.Types.ObjectId,
    required:true
    ,ref:'User'
  }
})
const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref:'User'
  },
  status:{type:String},
  followed:[followedProfile ],
  dateOfBirth:{
    type: Date
  },
  education:{
    type:String
  },
  work:{
    type:String
  },
  location:{
    type:Object,
    city:{type:String},
    country:{type:String}
  },
  ava:{
    type:String
  }

});

export const Profile=mongoose.model('Profile',profileSchema);
export const FollowedProfile=mongoose.model('FollowedProfile',followedProfile)
