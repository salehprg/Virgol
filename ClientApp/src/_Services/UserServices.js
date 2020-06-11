import { authHeader, handleResponse } from '../_helper';
import Axios from 'axios';
import { authenticationService } from '_Services';
import { ApiConfig } from './ApiConfig';

export const userService = {
    GetUserCategory,
    GetCourseIncategory
};

async function GetUserCategory() {

    var CategoryNames;

    const config = authHeader();

    await Axios.get(ApiConfig.BaseUrl + ApiConfig.UserUrl + "GetCetegoryNames" , config)
    .then(response => {
        CategoryNames = response.data;
    })
    .catch(e => {
        console.log(e);
        CategoryNames = false;
    })

    return CategoryNames;
}

async function GetCourseIncategory(categoryId) {

    var CourseNames;

    const config = authHeader();
    
    console.log(config);

    await Axios.get(ApiConfig.BaseUrl + ApiConfig.UserUrl + "GetCoursesInCategory?CategoryId=" + categoryId , config)
    .then(response => {
        CourseNames = response.data;
    })
    .catch(e => {
        console.log(e);
        CourseNames = false;
    })

    return CourseNames;




}

