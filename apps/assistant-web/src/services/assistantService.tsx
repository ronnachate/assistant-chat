import axios from 'axios';
import { ASSISTANT_KEY } from '../constant/generic';
import httpClient, { api_path } from './httpClient';
import { v4 as uuidv4 } from 'uuid';

const _serverUrl = api_path;

const baseUrl = `${_serverUrl}/v1/assistants`;

export const newAssistant = async () => {
  const deviceToken = uuidv4();
  //reuquest to create new assistant
  return axios
    .post(`${baseUrl}`, {
      deviceToken,
    })
    .then((response) => {
      if (response.data.id) {
        localStorage.setItem(ASSISTANT_KEY, response.data.id);
        return response.data.id;
      }
      return null
    });
};

export const getAssistantID = async () => {
  const assistantID = localStorage.getItem(ASSISTANT_KEY);
  if (!assistantID) {
    return await newAssistant();
  }
  return assistantID;
};
