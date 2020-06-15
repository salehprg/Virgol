import { authHeader, handleResponse } from '../_helper';
import Axios from 'axios';
import { authenticationService } from '_Services';
import { ApiConfig } from './ApiConfig';

export const adminService = {
    GetNewUsers,
    GetAllCategory,
    GetAllCourseInCat,
    GetAllTeachers,
    ConfirmUser,
    AddCategory,
    EditCategory,
    DeleteCategory,
    AddTeacher,
    EditTeacher,
    DeleteTeacher,
    AddCourse,
    EditCourse,
    DeleteCourse
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

async function PutData(MethodeName , Data) {

    var Result;

    const config = authHeader();

    console.log(Data);
    await Axios.put(ApiConfig.BaseUrl + ApiConfig.AdminUrl + MethodeName , Data , config)
    .then(response => {
        Result = response.data;
    })
    .catch(e => {
        console.log(e);
        Result = false;
    })

    return Result;
}

async function DeleteData(MethodeName , Data) {

    var Result;

    const config = authHeader();

    console.log(config);
    await Axios.delete(ApiConfig.BaseUrl + ApiConfig.AdminUrl + MethodeName , Data , config)
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

async function GetAllStudent() {

    return await GetData("GetAllStudent");
}


//#region Category

async function GetAllCategory() {

    return await GetData("GetAllCategory");
}

async function AddCategory(CategoryData){

    return await PutData("AddNewCategory" , CategoryData);
}

async function EditCategory(CategoryData){

    return await PostData("EditCategory" , CategoryData);
}

async function DeleteCategory(CategoryData){

    console.log(CategoryData);
    return await PostData("DeleteCategory" , CategoryData);
}

//#endregion

//#region Teachers

async function GetAllTeachers() {

    return await GetData("TeacherList");
}

async function AddTeacher(TeacherData){

    return await PutData("AddNewTeacher" , TeacherData);
}

async function EditTeacher(TeacherData){

    return await PostData("EditTeacher" , TeacherData);
}

async function DeleteTeacher(TeacherData){

    return await PostData("DeleteTeacher" , TeacherData);
}

//#endregion

//#region Course

async function AddCourse(CourseData){

    return await PutData("AddNewCourse" , CourseData);
}

async function EditCourse(CourseData){

    return await PostData("EditCourse" , CourseData);
}

async function DeleteCourse(CourseData){

    console.log(CourseData);
    return await PostData("DeleteCourse" , CourseData);
}

async function GetAllCourseInCat(CategoryId) {

    return await GetData("GetAllCourseInCat?CategoryId=" + CategoryId);
}

//#endregion

async function ConfirmUser(UserId) {

    return await PostData("ConfirmUsers?UserId="+UserId , 0);
}
