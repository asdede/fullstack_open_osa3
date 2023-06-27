
const Search = (props) => {
    return(
        <div>
            <p>Search: </p>
            <input value={props.filter} onChange={props.handleFilter}></input>
        </div>
    )
}
export default Search