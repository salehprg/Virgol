import Axios from "axios";
import { config } from "../assets/constants";

export default Axios.create({
    baseURL: config.url.APU_URL
});