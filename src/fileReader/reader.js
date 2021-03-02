import axios from 'axios';

const readFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return await axios.post("https://us-central1-p5s-msg-pack.cloudfunctions.net/unpackFile", formData, config);
    
}



export default readFile;