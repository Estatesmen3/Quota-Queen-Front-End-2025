import axios from 'axios';


console.log("import.meta.env.VITE_API_BASE_URL ", import.meta.env.VITE_API_BASE_URL)

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
