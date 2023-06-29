const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI
console.log(url)

console.log("Connecting mongoose...")

mongoose.connect(url)
    .then(result => {
        console.log("connected!")
    })
    .catch((error) => {
        console.log("error connecting databese",error.message)
    })



const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
})

console.log("contactSchema succesful")

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Contact', contactSchema)