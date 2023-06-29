require('dotenv').config()

const express = require("express");
const http = require("http");
const morgan = require("morgan");
const app = express()
const cors = require('cors')


const Contact = require('./models/mongo')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token("requestData",(req) => {
    return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :requestData"));

const getAllContacts = async () => {
      const contacts = await Contact.find({});
      const formattedContacts = contacts.map(contact => ({
        name: contact.name,
        number: contact.number
      }));
    console.log("getallcontacts", formattedContacts);
    return formattedContacts;
};

const getRandomID = (min,max) => {
    /* 
    Creates random id that does not exist in database from
    range of min and max parameters.

    Returns integer number
    */
    const persons = getAllContacts()
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

const nameIsUnique = async (name) => {
 
    const existingContact = await Contact.findOne({ name });
    return !existingContact; // Returns true if the contact doesn't exist

};

// -----GET all persons
app.get("/api/persons",(req,res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts)
    })
})
// -----GET id
app.get("/api/persons/:id", async (request, response) => {
    const id = request.params.id;
    console.log("ID", id);
    
    try {
        Contact.findById(id)
            .then(contact =>  {
                if (contact) {
                    response.json(contact)
                } else {
                    response.status(404).end()
                }
            })
    } catch (error) {
      console.error("Error occurred while finding contact:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  });
  
// -----GET info
app.get("/info", (req, res) => {
    const time = new Date();
    getAllContacts()
      .then(allpersons => {
        console.log("allpersons", allpersons);
        const numberOfContacts = allpersons.length;
        res.send(`<p>Phonebook has info for ${numberOfContacts} people</p>
                  <p>${time}</p>`);
      })
      .catch(error => {
        console.error("Error occurred while retrieving contacts:", error);
        res.status(500).send("Internal server error");
      });
  });

// -----DELETE person based on id
app.delete('/api/persons/:id',(req,res) => {
    const id = req.params.id;
    console.log("ID", id);    
    Contact.findByIdAndRemove(id)
        .then(result =>  {
            res.status(204).end()
            })
    .catch (error => next(error))
    });

// -----POST new person
app.post("/api/persons", (req, res) => {
    const person = req.body;
    console.log(person);
    
    if (!person.name || !person.number || person.name.trim() === '' || person.number.trim() === '') {
      return res.status(400).json({
        error: `Missing values name=${person.name} number=${person.number}`
      });
    }
  
    if (nameIsUnique(person.name)) {
      const contact = new Contact({
        name: person.name,
        number: person.number,
      });
  
      console.log("Person with new id", contact);
  
      contact.save()
        .then(savedContact => {
          console.log("Saved contact", savedContact);
          res.json(savedContact);
        })
        .catch(error => {
          console.error("Error occurred while saving contact:", error);
          res.status(500).json({ error: "Internal server error" });
        });
    } else {
      res.status(409).json({
        error: "Name already exists in the database"
      });
    }
  });
app.options("/api/persons", cors());



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })