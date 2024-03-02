const mongoose = require("mongoose")

const medicineSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("medicine", medicineSchema)