import personServices from '../services/persons';
import React from 'react'


const Contacts = ({contacts,handleDelete}) => {
  console.log("Setting up CONTACTS")
    return (
      <ul>
      {contacts.map(contact =>
        <li key={contact.id}>{contact.name} : {contact.number} 
        <button button_id={contact.id} onClick={() => handleDelete(contact.id)}>Delete</button>
        </li>)
      }
      </ul>
    )
  }


export default Contacts