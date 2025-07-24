const getENV=()=>{
    const value = import.meta.env.VITE_API_URL;
    console.log(value) 
    return value
}

export default getENV