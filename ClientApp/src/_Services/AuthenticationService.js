import { BehaviorSubject } from 'rxjs';
import Axios from 'axios';
import { ApiConfig } from './ApiConfig';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    GetAllCategory,
    Register,
    UploadFile,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

async function login(username, password) {

    let result;

    const params = {
        "Username" : username,
        "Password" : password
    }

    //Url config and other config automatically get from ApiConfig.js
    await Axios.post(ApiConfig.BaseUrl + ApiConfig.UserUrl + "LoginUser" , params, {
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(LoginRes => {
        localStorage.setItem('currentUser', JSON.stringify(LoginRes));
        currentUserSubject.next(LoginRes);
        result = "خوش آمدید";
    })
    .catch(e => {
        console.log(e);
        //Toastr["error"]("نام کاربری یا رمز عبور اشتباه است");
        result = e;
    });

    return result;
}

async function Register(UserInfo , Password) {

    let result;

    //Url config and other config automatically get from ApiConfig.js
    await Axios.put(ApiConfig.BaseUrl + ApiConfig.UserUrl + "RegisterNewUser?Password=" + Password , UserInfo, {
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(Result => {
        result = true;
    })
    .catch(e => {
        console.log(e);
        //Toastr["error"]("نام کاربری یا رمز عبور اشتباه است");
        result = e;
    });

    return result;
}

async function UploadFile(Identifier , File) {

    let form = new FormData();
    form.append('user', "Document");
    form.append('file', File);

    let result;

    //Url config and other config automatically get from ApiConfig.js
    await Axios.post(ApiConfig.BaseUrl + ApiConfig.UserUrl + "UploadDocuments?Mellicode=" + Identifier , form, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    })
    .then(Result => {
        result = true;
    })
    .catch(e => {
        console.log(e);
        //Toastr["error"]("نام کاربری یا رمز عبور اشتباه است");
        result = e;
    });

    return result;
}


async function GetAllCategory() {

    let result;

    //Url config and other config automatically get from ApiConfig.js
    await Axios.get(ApiConfig.BaseUrl + ApiConfig.UserUrl + "GetAllCategory", {
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(Result => {
        result = Result.data;
    })
    .catch(e => {
        console.log(e);
        //Toastr["error"]("نام کاربری یا رمز عبور اشتباه است");
        result = e;
    });

    return result;
}

function logout() {
    console.log("logout");
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}