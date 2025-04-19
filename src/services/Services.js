import axios from 'axios';
import { API_URL } from '../../ConfigGlobal';

const AUTH_API = `${API_URL}auth/`;
const ROOMS_API = `${API_URL}rooms/`;

export const register = (userData) => axios.post(`${AUTH_API}register`, userData);
export const login = (userData) => axios.post(`${AUTH_API}login`, userData);

export const createRoom = (token, roomName) =>
  axios.post(
    `${ROOMS_API}create`,
    { room_name: roomName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  export const joinRoom = (token, roomCode) =>
    axios.post(
      `${ROOMS_API}join`,
      { roomCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
