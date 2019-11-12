import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-first-project.firebaseio.com/'
});

export default instance;