import axios from 'axios';

export const api_path = process.env.NX_API_GATEWAY_URL;

const httpClient = axios.create();

export default httpClient;
