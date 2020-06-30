import Axios from "axios";
import { config } from "../assets/constants";

export default Axios.create({
    baseURL: 'https://localhost:5001/'
});