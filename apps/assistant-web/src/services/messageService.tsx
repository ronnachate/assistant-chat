import axios from 'axios';
import httpClient, { api_path } from './httpClient'
const _serverUrl = api_path;

const baseUrl = `${_serverUrl}/v1/messages`;
export const getMessages = async (assistantID: string, page = 1, limit = 100) => {
    let url = `${baseUrl}?assistantID=${assistantID}page=${page}&rows=${limit}`;
    try {
        const res = await httpClient.get(url)
        return res.data;
    } catch (error) {
        return { error: true};
    }
}

export const newMessages = async (assistantID: string, content: string) => {
    let url = `${baseUrl}`;
    try {
        return axios
        .post(`${baseUrl}`, {
            assistantID,
            content,
        })
        .then((response) => {
          if (response.data.id) {
            return response.data;
          }
          return null
        });
    } catch (error) {
        return { error: true};
    }
}