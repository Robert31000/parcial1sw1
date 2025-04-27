import axios from 'axios';
import { URL_API } from '../ConfigGlobal';



export const registerUser = async (data) => {
  const response = await API.post('/auth/register', data);
  return response.data;
};

// Config global de Axios
const API = axios.create({
  baseURL: `${URL_API}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Login
export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

//  Listar todos los proyectos
export const getProjects = async () => {
  const response = await API.get('/api/projects');
  return response.data;
};

//  Crear nuevo proyecto
export const createProject = async (data) => {
  const response = await API.post('/api/projects', data);
  return response.data;
};

//  Obtener proyecto por ID
export const getProjectById = async (id) => {
  const response = await API.get(`/api/projects/${id}`);
  return response.data;
};

export default API;
