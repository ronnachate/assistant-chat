import axios from 'axios';

export const api_path = process.env.REACT_APP_API_GATEWAY_URL;

const httpClient = axios.create();

export default httpClient;
