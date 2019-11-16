exports.loggedInUserProfile = (req,res)=>{
    req.profile.password = undefined;
    return res.status(200).json({user:req.profile})
}