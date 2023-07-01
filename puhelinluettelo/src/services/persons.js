import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    console.log(newObject)
    const request = axios.post(baseUrl,newObject)
    return request
    .then(response => response.data)
    .catch(error => {
        console.error(error);
        throw error;
    });
}

const update = (id,newObject) => {
    const request = axios.put(`${baseUrl}/${id}`,newObject)
    return request.then(response => response.data)
}

const del = (id) => {
    console.log("Tried to delete")
    const request = axios.delete(baseUrl+"/"+id)
    return request.then(response => response.data)

}


export default {
    getAll: getAll,
    create: create,
    del: del
}