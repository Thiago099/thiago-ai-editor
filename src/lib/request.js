import axios from 'axios';

async function sendPostRequest(url, data) {
  try {
    const response = await axios.post(url, data, {
      timeout: 0 
    });
    return response.data;
  } catch (error) {
    console.error('Error sending POST request:', error);
    throw error;
  }
}
async function sendGetRequest(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error sending POST request:', error);
    throw error;
  }
}

class Request{
    static async Get(url){
        return await sendGetRequest(url)
    }
    static async Post(url, data){
        return await sendPostRequest(url, data)
    }
}

export { Request }