import axios from "axios";

export default axios.create({
    baseURL: window.location.protocol + '//' + window.location.host + '/api'
});