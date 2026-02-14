require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;


const userSchema = new mongoose.Schema({
username: {
type: String,
required: true,
},
email: {
type: String,
required: true,
unique: true,
},
password: {
type: String,
required: true,
},
role: {
type: String,
default: "user",
},
}, { timestamps: true });

const User = mongoose.model("User", userSchema);


async function dbConnection() {
try {
await mongoose.connect(MONGO_URL);
console.log("Database Connected");
} catch (error) {
console.log(error);
}
}
dbConnection();


app.post("/register", async (req, res) => {
try {
const { username, email, password, role } = req.body;

if (!username || !email || !password) {
    return res.status(400).json({ msg: "Invalid Data" });
}

const existUser = await User.findOne({ email });
if (existUser) {
    return res.status(400).json({ msg: "Account Already Exists" });
}

const hashPassword = await bcrypt.hash(password, 10);

const user = await User.create({
    username,
    email,
    password: hashPassword,
    role,
});

res.status(201).json({
    msg: "User created successfully",
    data: user,
});

} catch (error) {
console.log(error);
res.status(500).json({ msg: "Server Error" });
}
});

app.post("/login", async (req, res) => {
try {
const { email, password } = req.body;

if (!email || !password) {
    return res.status(400).json({ msg: "Missing data" });
}

const user = await User.findOne({ email });
if (!user) {
    return res.status(404).json({ msg: "Account not found, please register" });
}

const matchPassword = await bcrypt.compare(password, user.password);
if (!matchPassword) {
    return res.status(400).json({ msg: "Invalid Password" });
}

res.status(200).json({
    msg: "Success Login",
});

} catch (error) {
console.log(error);
res.status(500).json({ msg: "Server Error" });
}
});


app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
