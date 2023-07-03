import { useState,useEffect } from 'react';
import Contacts from './components/Contacts';
import checkIfExists from './components/checkIfExists';
import AddNums from './components/AddNums';
import Search from './components/Search';
import personServices from './services/persons'

const App = () => {

  const hook =() => {
    console.log("effect");
    personServices
      .getAll()
      .then(response => {
        console.log(response)
        setPersons(response)
      })
  }

  useEffect(hook,[])

  const [persons, setPersons] = useState([])
  const [newContact, setNewContact] = useState("")
  const [newNum,setNewNum] = useState("");
  const [filter,setFilter] = useState("");
  const [[errorMsg,msgCode],setErrorMsg] = useState([null,null]);
  
  const addContact = (event) => {
    event.preventDefault();
  
    if (checkIfExists(persons,newContact)) {
      const msg = "Name already exists in database: " + String(newContact) + "\nOr name is blank"
      setErrorMsg([msg,2])
      setTimeout(() => {
        setErrorMsg([null,null])
      },5000)
      return;
    }


    const phonebookObject = {
        name: newContact,
        number: newNum
      };

      personServices.create(phonebookObject)
      .then(response => {
        console.log(response);
        setPersons(persons.concat(phonebookObject));
        setNewContact("");
        setNewNum("");
        setErrorMsg(["Added person " + newContact, 1]);
        setTimeout(() => {
          setErrorMsg([null, null]);
        }, 5000);
      })
      .catch(error => {
        console.error(error);
        const msg = error.response ? error.response.statusText : "Something went wrong";
        setErrorMsg([msg,2]);
        setTimeout(() => {
          setErrorMsg([null, null]);
        }, 5000);
      });
  };  

  const Notification = ({ message,msgCode }) => {
    if (message === null) {
      return null
    }
    const errorStyle = {
      color:"red",
      fontstyle:"italic",
      fontSize:16,
      background:"lightgrey",
      borderStyle:"solid",
      borderRadius:5,
      padding:10
    }
    const msgStyle = {
      color:"green",
      fontstyle:"italic",
      fontSize:16,
      background:"lightgrey",
      borderStyle:"solid",
      borderRadius:5,
      padding:10

    }
    let divStyle = null

    if (msgCode === 1) {
      divStyle = msgStyle
    } else {
      divStyle = errorStyle
    }
    console.log(divStyle)
    return (
      <div style={divStyle}>
      {message}
    </div>
    );
  }

  const handleDelete = (id) => {
    console.log("Confirmating delete of id:",id);
    let name = persons.find(person => person.id === id)
    console.log(name.name)
    if (window.confirm("Do you really want to delete: " + name.name)) {
    
    personServices.del(id)
      .then(response => {
        console.log("Contact deleted",response)
        setErrorMsg(["Person succesfully deleted " + name.name,1])
        setPersons(persons.filter(person => person.id !== id));
        setTimeout(() => {
          setErrorMsg([null,null])
        },5000)
      })
      .catch(error => {
        console.error(error);
        setErrorMsg(["Something went wrong",2]);
        setTimeout(() => {
          setErrorMsg([null, null]);
        }, 5000);
      });
  };  
    
  };

  const numsToShow = filter
  ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  : persons;

  const handleNumInput = (event) => {
    console.log(event.target.value);
    setNewNum(event.target.value);
  }

  const handleFilter = (event) => {
    const inputValue = event.target.value;
    console.log("filter changed")
    console.log(event.target.value)
    setFilter(inputValue);
  };

  const handleInputChange = (event) => {
    console.log("handling input change")
    console.log(event.target.value)
    const value = event.target.value;
    console.log(value)
    setNewContact(value)
  }

  return (
    <div>
      <Search filter={filter} handleFilter={handleFilter}/>
      <h2>Phonebook</h2>
      <Notification message={errorMsg} msgCode={msgCode}/>
      <form onSubmit={addContact}>
        <AddNums newContact={newContact} handleInputChange={handleInputChange}
              newNum={newNum} handleNumInput={handleNumInput}/>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Contacts contacts={numsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App
