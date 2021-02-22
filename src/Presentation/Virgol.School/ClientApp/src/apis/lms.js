import axios from "axios";
import { config } from "../config";

var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

export default axios.create({
    baseURL: baseUrl + 'api/'
});