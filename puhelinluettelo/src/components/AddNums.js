
const AddNums = (props) => {
    console.log("Creating new Nums...")
    
    return (
        <table>
            <tbody>
              <tr>
                <td>name:</td>
                <td><input value={props.newContact} onChange={props.handleInputChange}/></td> 
              </tr>
              <tr>
                <td>Number:</td>
                <td><input value={props.newNum} onChange={props.handleNumInput}/></td>
              </tr>
            </tbody>
        </table>
    )
}

export default AddNums