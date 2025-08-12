const getENV=(key:string):string=>{
    const value = import.meta.env[key as keyof ImportMetaEnv];
    console.log("value",value) 
    return value
}


export const envConfig = {
    apiUrl:getENV("VITE_API_URL"),
    cloudinaryBaseUrl:getENV("VITE_CLOUDINARY_BASE_URL")
}
