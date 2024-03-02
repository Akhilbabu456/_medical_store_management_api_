const express = require("express")
const bcrypt = require("bcryptjs")
const protect = require("../middleware/authMiddleware")
const User = require("../models/userModel")
const Medicine = require("../models/medicineModel")
const generateToken = require("../config/generateToken")
const router = express.Router()

router.post("/", async(req,res)=>{
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please Enter all the fields")
    }

    const userExist = await User.findOne({email})

    if(userExist){
        res.status(400)
        throw new Error("User already exists")
    }

    const saltRound = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, saltRound)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(200)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Failed to create the user")
    }
})

router.post("/login", async(req,res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email})

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if(user && isPasswordMatch){
        res.json({
            _id: user._id,
            email: user.email,
            password: user.password,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

router.get("/user", protect, async(req,res)=>{
    try{
       const medicineList = await Medicine.find({})

       if(medicineList){
        res.status(200)
            res.json({
                Medicine: medicineList
            })
       }else{
        res.status(200)
        res.json({
            message: "No medicine added"
        })
       }
    }catch(err){
       res.status(400)
       res.send(err.message)
    }
})

router.post("/user",protect,async(req,res)=>{
    const{name , type , stock} = req.body

    try{
       const medicine = await Medicine.create({
        name,
        type,
        stock
       })

       if(medicine){
        res.status(200)
        res.json({
            medName: medicine.name,
            medType: medicine.type,
            stock: medicine.stock,
            message: "Medicine added successfully"
        })
       }else{
        res.status(400)
        res.json({
            message: "No medicine added"
        })
       }

       
    }catch(err){
        res.status(400)
        res.json({
            message: err.message
        })
    }
})

router.put("/user/:id", protect, async(req,res)=>{
    const{name , type , stock} = req.body
    const id = req.params.id

    try{
      const medicine = await Medicine.findByIdAndUpdate({_id:id}, {
        name,
        type,
        stock
      })

      if(medicine){
         res.status(200)
         res.json({
           message: "Updated successfully"
         })
      }else{
        res.status(400)
        res.json({
            message: "Not updated"
        })
      }
    }catch(err){
       res.status(400)
       res.json({
        message: err.message
       })
    }
})

router.delete("/user/:id", protect, async(req,res)=>{
    const id = req.params.id

    const medicine = await Medicine.deleteOne({_id : id})

    if(medicine){
        res.status(200)
        res.json({
            message: "Deleted successfully"
        })
    }else{
        res.status(400)
        res.json({
            message: "Invalid"
        })
    }
})

router.get("/user/search", protect, async(req,res)=>{
    const name = req.query.name
    const regex = new RegExp(name, 'i')

    const result = await Medicine.find({ $or: [{ name: regex }, { type: regex }] });

    if(result.length == 0){
        res.status(400)
        res.json({
            message: "No result Found"
        })
    }else{
        res.status(200)
        res.json({
           searchResult: result 
        })
    }
})



module.exports = router