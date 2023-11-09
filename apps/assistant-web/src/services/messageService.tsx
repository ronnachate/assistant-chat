import axios from 'axios';
import httpClient, { api_path } from './httpClient';
import { MessageDTO } from '@assistant-chat/dtos';
const _serverUrl = api_path;

const baseUrl = `${_serverUrl}/message-api/api/v1/messages`;

export const getMessages = async (
  assistantID: string,
  page = 1,
  limit = 100
) => {
  let url = `${baseUrl}?assistantID=${assistantID}&page=${page}&rows=${limit}`;
  try {
    console.log(url);
    const res = await httpClient.get(url);
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const newMessages = async (assistantID: string, content: string) => {
  let url = `${baseUrl}`;
  try {
    return axios
      .post(url, {
        assistantID,
        content,
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      });
  } catch (error) {
    return { error: true };
  }
};
