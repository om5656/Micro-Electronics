const mongoose = require("mongoose")

const userSchema = new mongoose.SchemaType({
username:{
Type:String,
required:true,
trim:true

},
email:{
Type:String,
required:true,
unique:true
},
password:{
    Type:String,
required:true,
minlength:true
},
role:{
Type:String,
enum:["admin","user"],
default:"user"
},
},{timestamps:true})

const User = mongoose.model("User",userSchema);

module.exports = user;
