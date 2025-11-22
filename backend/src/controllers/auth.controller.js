import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.model.js";
import bcrypt from "bcrypt"
import "dotenv/config"

export const signup = async (req, res) => { 
    let { fullName, email, password } = req.body;
    fullName = fullName.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields required"
            })
        }

        //! Email Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (email.startsWith(".") || email.endsWith(".")) {
            return res.status(400).json({ error: "Email cannot start or end with a dot" });
        }

        if (email.includes("..")) {
            return res.status(400).json({ error: "Email cannot contain consecutive dots" });
        }

        const [local, domain] = email.split("@");
        if (!domain) {
            return res.status(400).json({ error: "Email must contain a domain" });
        }

        if (domain.startsWith("-") || domain.endsWith("-")) {
            return res.status(400).json({ error: "Domain cannot start or end with a hyphen" });
        }

        if (domain.includes("--")) {
            return res.status(400).json({ error: "Domain cannot contain consecutive hyphens" });
        }

        if (!domain.includes(".")) {
            return res.status(400).json({ error: "Domain must contain at least one dot" });
        }

        const tld = domain.split(".").pop();
        if (tld.length < 2 || tld.length > 10) {
            return res.status(400).json({ error: "Invalid top-level domain" });
        }

        //! Password Validation
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one number" });
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one special character" });
        }

        if (/\s/.test(password)) {
            return res.status(400).json({ error: "Password cannot contain spaces" });
        }

        if (/(.)\1\1/.test(password)) {
            return res.status(400).json({ error: "Password cannot contain three repeating characters" });
        }

        const weakPatterns = [
            "password", "qwerty", "12345", "12345678", "admin",
            "letmein", "welcome", "iloveyou", "abc123"
        ];
        for (let word of weakPatterns) {
            if (password.toLowerCase().includes(word)) {
                return res.status(400).json({ error: "Password is too weak" });
            }
        }

        //Check already existed user
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        //Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new instance of model
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                message: "User added successfully",
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

            //send welcome email to user:
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
            } catch (error) {
                console.error("Failed to send welcome email: ", error);
            }

        } else {
            console.log(newUser);
            return res.status(400).json({
                message: "Invalid user data"
            })
        }

    } catch (err) {
        console.log("Error in signup controller: ", err);
        res.status(500).json(
            { message: "Internal server error" }
        )
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                meassage: "All fields required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                meassage: "Invalid credentials email"
            });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            console.log("email");
            res.status(400).json({
                meassage: "Invalid credentials password"
            });
        }

        //Valid user:
        generateToken(user._id, res);
        res.status(201).json({
            message: "User logged in successfully",
            _id: User._id,
            fullName: User.fullName,
            email: User.email,
            profilePic: User.profilePic,
        })
    } catch (err) {
        console.log("Error in login controller: ", err);
        res.status(500).json(
            { message: "Internal server error" }
        )
    }

}

export const logout = (_, res) => {
    try {
        res.cookie("jwtToken", null, { maxAge: 0 });
        res.status(201).json({
            message: "User logged out successfully",
        })
    } catch (err) {
        console.log("Error in logout controller: ", err);
        res.status(500).json(
            { message: "Internal server error" }
        )
    }
}