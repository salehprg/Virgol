import { authHeader, handleResponse } from '../_helper';
import Axios from 'axios';
import { authenticationService } from '_Services';
import { ApiConfig } from './ApiConfig';

export const adminService = {
    GetNewUsers,
    GetAllCategory,
    GetAllCourseInCat,
    ConfirmUser
};

async function GetData(MethodeName) {

    var Result;

    const config = authHeader();

    await Axios.get(ApiConfig.BaseUrl + ApiConfig.AdminUrl + MethodeName , config)
    .then(response => {
        Result = response.data;
    })
    .catch(e => {
        console.log(e);
        Result = false;
    })

    return Result;
}

async function PostData(MethodeName , Data) {

    var Result;

    const config = authHeader();

    await Axios.post(ApiConfig.BaseUrl + ApiConfig.AdminUrl + MethodeName , Data , config)
    .then(response => {
        Result = response.data;
    })
    .catch(e => {
        console.log(e);
        Result = false;
    })

    return Result;
}

async function GetNewUsers() {

    return await GetData("GetNewUsers");
}

async function GetAllCategory() {

    return await GetData("GetAllCategory");
}

async function GetAllCourseInCat(CategoryId) {

    return await GetData("GetAllCourseIncat?" + CategoryId);
}

async function ConfirmUser(UserId) {

    return await PostData("ConfirmUsers?UserId="+UserId , 0);
}
