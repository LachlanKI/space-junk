import axios from 'axios';

var instance = axios.create({
    xsrfCookieName: 'space-junkies',
    xsrfHeaderName: 'csrf-token'
});

export default instance;
