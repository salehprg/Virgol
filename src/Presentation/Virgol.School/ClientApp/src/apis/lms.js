import Axios from "axios";
import { config } from "config.js";

export default Axios.create({
    baseURL: config.url.API_URL
});