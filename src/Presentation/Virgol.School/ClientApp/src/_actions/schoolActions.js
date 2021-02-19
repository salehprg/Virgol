import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './schoolTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";
import { START, STOP } from "./workerTypes";
import { config } from "../config";

//#region Schools

export const GetSchoolInfo = (token,schoolId = 0) => async dispatch => {

    try {
        const response = await lms.get(`/School/GetSchoolInfo?schoolId=${schoolId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetSchoolInfo, payload: response.data })

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const getSchools = token => async dispatch => {

    try {
        const response = await lms.get('/School/GetSchools' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetSchools, payload: response.data })

        return true

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const CreateSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.put('/School/CreateSchool' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.CreateSchool, payload: response.data })

        return true

    } catch (e) {

        dispatch({ type: Type.CreateSchool, payload: null })
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))

        return false

    }

}

export const AddBulkSchool = (token, excel) => async dispatch => {

    try {
        const data = new FormData()
        data.append('Files', excel)

        dispatch({ type: START })
        const response = await lms.post("/School/AddBulkSchool", data, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.AddBulkSchool });
        history.push("/a/schools")
        dispatch(alert.success("فایل بارگیری شد"))

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
    }

}


export const EditSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })

        const response = await lms.post('/School/EditSchool' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        
        dispatch({ type: Type.EditSchool, payload: response.data })
        dispatch(alert.success("مدرسه با موفقیت ویرایش شد"))
        return true

    } catch (e) {
        dispatch({ type: STOP })
        if(e.response)
        {
        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }
    }

        return false

    }

}

export const RemoveSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.delete(`/School/RemoveSchool?schoolId=${formvalue}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("مدرسه با موفقیت حذف شد"))
        dispatch({ type: Type.RemoveSchool, payload: response.data })

        return true

    } catch (e) {

        dispatch({ type: STOP })
        if(e.response)
        {
            switch (e.response.status) {
                case 401:
                    dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                    history.push('/')
                    break;

                default:
                    dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
            }
        }
        return false

    }

}

//#endregion

//#region Base

export const getBases = token => async dispatch => {

    try {
        const response = await lms.get('/School/GetBases' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetBases, payload: response.data })

        return true

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const AddBaseToSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.put('/School/AddBaseToSchool' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(" مقطع تحصیلی با موفقیت اضافه شد"))
        dispatch({ type: Type.AddBaseToSchool, payload: response.data })

        return true

    } catch (e) {

        dispatch({ type: STOP })
        if(e.response)
        {
            switch (e.response.status) {
                case 401:
                    dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                    history.push('/')
                    break;

                default:
                    dispatch(alert.error(e.response.data))
            }
        }

        return false

    }

}

export const RemoveBaseFromSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.delete(`/School/RemoveBaseFromSchool?baseId=${formvalue}`  , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(" مقطع تحصیلی با موفقیت حذف شد"))
        dispatch({ type: Type.RemoveBaseFromSchool, payload: response.data })

        return true

    } catch (e) {

        if(e.response)
        {
        switch (e.response.status) {
                case 401:
                    dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                    //history.push('/')
                    break;

                default:
                    dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
            }
        }

        return false
    }

}

//#endregion

//#region StudyFields

export const getStudyfields = (token,baseId) => async dispatch => {

    try {
        const response = await lms.get(`/School/GetStudyFields?BaseId=${baseId}&schoolId` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetStudyFields, payload: response.data })

        return true

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }

}

export const GetSchool_StudyFields = (token,baseId,schoolId = 0) => async dispatch => {

    try {
        const response = await lms.get(`/School/GetSchool_StudyFields?BaseId=${baseId}&schoolId=${schoolId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetSchool_StudyFields, payload: response.data })

        return true

    } catch (e) {

        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        dispatch({ type: STOP })

    }

}

export const AddStudyFToSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.put('/School/AddStudyFToSchool' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(" رشته تحصیلی با موفقیت اضافه شد"))
        dispatch({ type: Type.AddStudyFToSchool, payload: response.data })

        return true

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error(e.response.data))
        

    }

}

export const RemoveStudyFFromSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch({ type: START })
        
        const response = await lms.delete(`/School/RemoveStudyFFromSchool?studyFId=${formvalue}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success(" رشته با موفقیت حذف شد"))
        dispatch({ type: Type.RemoveStudyFFromSchool, payload: response.data })

        return true

    } catch (e) {

        if(e.response)
        {
        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                //history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }
    }

        return false

    }

}

//#endregion


export const getAllGrades = token => async dispatch => {

    try {
        const response = await lms.get("/School/GradesList", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.getGrades, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const getAllClass = (token) => async dispatch => {

    try {
        const response = await lms.get("/School/ClassList?gradeId=-1", {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.getAllClass, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const getClassList = (token,gradeId) => async dispatch => {

    try {
        const response = await lms.get(`/School/ClassList?gradeId=${gradeId}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.ClassList, payload: response.data });
    } catch (e) {
        dispatch(alert.error("خطا دربرقراری اتصال"))
    }

}

export const addNewClass = (token, formValues,schoolId = 0) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.put(`/School/AddNewClass?schoolId=${schoolId}`, formValues ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch(alert.success("کلاس جدید افزوده شد"))
        dispatch({ type: Type.AddNewClass, payload: response.data });
    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در افزودن کلاس"))
    }

}

export const editClass = (token, classId , className) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.post(`/School/EditClass?classId=${classId}&className=${className}` , null , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.EditClass, payload: response.data})
        dispatch(alert.success("کلاس با موفقیت ویرایش گردید"))

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در ویرایش مقطع"))
    }

}

export const deleteClass = (token, classId) => async dispatch => {

    try {
        dispatch({ type: START })
        const response = await lms.delete(`/School/DeleteClass?classId=${classId}` ,{
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        history.goBack()
        dispatch(alert.success("کلاس با موفقیت حذف گردید"))
        dispatch({ type: Type.DeleteClass, payload: classId})

    } catch (e) {
        dispatch({ type: STOP })
        dispatch(alert.error("خطا در حذف کلاس"))
    }

}

export const GetClassesCommonLessons = (token,classIds) => async dispatch => {

    try {
        const response = await lms.post(`/School/GetClassesCommonLessons` , classIds , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: STOP })
        dispatch({ type: Type.GetClassesCommonLessons, payload: response.data })

        return true

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }
}

export const getLessons = (token,gradeId) => async dispatch => {

        try {
            const response = await lms.get(`/School/GetLessons?gradeId=${gradeId}` , {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
    
            dispatch({ type: STOP })
            dispatch({ type: Type.GetLessons, payload: response.data })
    
            return true
    
        } catch (e) {
            dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }
}

export const GetSchool_Grades = (token,studyFId,schoolId = 0) => async dispatch => {

    try {
        const response = await lms.get(`/School/GetSchool_Grades?StudyFieldId=${studyFId}&schoolId=${schoolId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch({ type: Type.GetSchool_Grades, payload: response.data })

        return true

    } catch (e) {
        dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
    }
}
