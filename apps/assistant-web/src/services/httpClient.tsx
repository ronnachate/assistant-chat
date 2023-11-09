import axios from 'axios';


// export const api_path = process.env.NX_API_GATEWAY_URL;
export const api_path = 'http://localhost:4001';

const httpClient = axios.create();

export default httpClient;
