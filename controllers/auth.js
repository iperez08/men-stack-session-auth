import express from "express"
import bcrypt, { hash } from "bcrypt"

import User from "../models/user.js"

const authRouter = express.Router()

authRouter.get("/create-user", async (req, res) => {
    res.render("auth/create-user.ejs")
})

authRouter.get("/sign-in", async (req, res) => {
    res.render("auth/sign-in.ejs")
})

authRouter.get("/sign-out", async (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

authRouter.post("/create-user", async (req, res) => {

    const user = await User.findOne({ username: req.body.username })

    if (user) {
        res.send('User already exists')
    }

    // Check if the password matches confirm password
    if (req.body.password !== req.body.confirmPassword) {
        res.send('Password does not match Confirm Password')
    }



    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    // validation logic
    const newUser = await User.create(req.body)
    if (newUser) {
        res.redirect(`/auth/sign-in`)
      }
      else {
        res.send('Error creating a user.')
      }
})


authRouter.post("/sign-in", async (req, res) => {
    try {

        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            res.send("This user does not exist.");
        }


        const validPassword = bcrypt.compareSync(req.body.password, user.password)
        
        if (!validPassword) {
            res.send("Password was wrong!")
        }

        req.session.user = {
            username: user.username,
        }

        res.redirect("/")

    } catch (error) {
        console.error("Not able to sign in", error)
    }
})
export default authRouter