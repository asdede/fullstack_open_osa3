const express = require("express");
const http = require("http");
var morgan = require("morgan");
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(cors())


morgan.token("requestData",(req) => {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :requestData"));


let persons = [
    {
        id:1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id:2,
        name:"Ada Lovelance",
        number: "39-44-5323523"
    },
    {
        id:3,
        name: "Dan Ambrov",
        number: "12-43-234345"
    },
    {
        id:4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]


const getRandomID = (min,max) => {
    /* 
    Creates random id that does not exist in database from
    range of min and max parameters.

    Returns integer number
    */
    let id = 1
    while (persons.some(person => person.id === id)) {
        console.log("Id exists in database");
        min = Math.ceil(min);
        max = Math.ceil(max);
        id = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    console.log(`Id created, new id ${id}`)
    return id
}

const nameIsUnique = (name) => {
    /* 
    Iterates over persons and
    checks if name is unique and returns:
    False if not
    True if is.
    */
   if (persons.some(person => person.name === name)){
    return false
   }
   return true

}

// -----GET all persons
app.get("/persons",(req,res) => {
    res.json(persons)
})
// -----GET id
app.get("/persons/:id",(request,response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// -----GET info
app.get("/info",(req,res) => {
    const time = new Date()
    const numberOfContacts = persons.length
    res.send(`<p> Phonebook has info for ${numberOfContacts} people
              <p>${time}</p>` )
})
// -----DELETE person based on id
app.delete('/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

// -----POST new person
app.post("/persons",(req,res) => {


    const person = req.body;
    console.log(person)
    if (!person.name || !person.number || person.name.trim() === '' || person.number.trim() === '') {
        return res.status(400).json({
            error:`Missing values name=${person.name} number=${person.number} `
        })
    }
    if (nameIsUnique(person.name)){
        person.id = getRandomID(0,999999);
        persons = persons.concat(person)
        console.log("Person with new id",person)
        res.json(person)

    } else {
        res.status(409).json({
            error: "Name already exists in database"
        });
    }
})


const PORT = process.env.PORT || 3001

app.listen(PORT);

console.log(`server runnin on port ${PORT}`)
