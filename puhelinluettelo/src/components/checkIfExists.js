const checkIfExists = (ogArray,newName) => {
    console.log(ogArray)
    const nameArray = ogArray.map(item => item.name);
    console.log("Checking if",newName,"exists in array")
    if (nameArray.includes(newName) || newName === "") {
      console.log("Exists == TRUE")
      return true
    }
    console.log("Exists == FALSE")
    return false
  
  }

export default checkIfExists