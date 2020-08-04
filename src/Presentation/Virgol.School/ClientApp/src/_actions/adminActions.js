import lms from "../apis/lms";
import history from "../history";
import { alert } from "./alertActions";
import * as Type from './adminTypes'
import * as authType from './authTypes'
import { worker } from "./workerActions";

//#region News

export const getNews = token => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get('/Admin/GetNews' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)


        dispatch({ type: Type.GetNews, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const CreateNews = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.put('/Admin/CreateNews' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.CreateNews, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const EditNews = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.post('/Admin/EditNews' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.EditNews, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const RemoveNews = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.delete('/Admin/RemoveNews' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.RemoveNews, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

//#endregion

//#region Manager

export const getManagers = token => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get('/Admin/GetManagers' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.GetManagers, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const AddNewManager = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.put('/Admin/AddNewManager' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.AddNewManager, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const EditManager = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.post('/Admin/EditManager' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.EditManager, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const RemoveManager = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.delete('/Admin/RemoveManager' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.RemoveManager, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

//#endregion

//#region Schools

export const GetSchoolInfo = (token,schoolId) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get(`/Admin/GetSchoolInfo?schoolId=${schoolId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.GetSchoolInfo, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const getSchools = token => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get('/Admin/GetSchools' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.GetSchools, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const AddNewSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.put('/Admin/AddNewSchool' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.AddNewSchool, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const EditSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        dispatch(worker.start)

        const response = await lms.post('/Admin/EditSchool' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        
        dispatch({ type: Type.EditSchool, payload: response.data })
        dispatch(alert.success("مدرسه با موفقیت ویرایش شد"))
        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const RemoveSchool = (token ,formvalue) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.delete('/Admin/RemoveSchool' , formvalue , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.RemoveSchool, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

//#endregion

export const getBases = token => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get('/Admin/GetBases' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.GetBases, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const getStudyfields = (token,baseId) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get(`/Admin/GetStudyFields?BaseId=${baseId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.GetStudyFields, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const getGrades = (token,studyFId) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get(`/Admin/GetGrade?StudyFieldId=${studyFId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.GetGrade, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const getLessons = (token,gradeId) => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get(`/Admin/GetLessons?gradeId=${gradeId}` , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.GetLessons, payload: response.data })

        return true

    } catch (e) {

        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const getDashboardInfo = token => async dispatch => {

    try {
        dispatch(worker.start)
        
        const response = await lms.get('/Admin/getDashboardInfo' , {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        dispatch(worker.stop)
        dispatch({ type: Type.getDashboardInfo, payload: response.data })

        return true

    } catch (e) {

        console.log(e)
        switch (e.response.status) {
            case 401:
                dispatch(alert.error("اجازه دسترسی به این صفحه را ندارید"))
                history.push('/')
                break;

            default:
                dispatch(alert.error("خطایی در برقراری اتصال رخ داد"))
        }

        return false

    }

}

export const logout = () => {
    history.push('/')
    return { type: authType.LOGOUT }
}