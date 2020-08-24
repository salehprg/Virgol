import React from "react";
import { connect } from 'react-redux';
import {Field, reduxForm, reset} from "redux-form";
import {arrow_left, briefcase, loading, slash} from "../../../../assets/icons";
import Fieldish from "../../../field/Fieldish";
import BaseManager from "../../baseManager/BaseManager";
import {GetSchoolInfo  , GetSchool_Grades , GetSchool_StudyFields 
        , getLessons , EditSchool , AddBaseToSchool  , RemoveBaseFromSchool , AddStudyFToSchool , RemoveStudyFFromSchool} from "../../../../_actions/schoolActions"
import {EditManager , RedirectAdmin} from '../../../../_actions/adminActions'
import {Link} from "react-router-dom";
import Modal from "../../../modals/Modal";
import DeleteConfirm from "../../../modals/DeleteConfirm";
import PencilText from '../../../field/PencilText';
import { validator } from "../../../../assets/validator";
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import history from "../../../../history";

class SchoolInfo extends React.Component {

    state = {
        categories: [{id: 1, name: 'متوسطه اول'}, {id: 2, name: 'متوسطه دوم نظری'}],
        fields: [
            {id: 1, catId: 1, fields: []} ,
            {id: 2, catId: 2, fields: [{id: 1, name: 'ریاضی'}, {id: 2, name: 'تجربی'}]}
        ],
        grades: [
            {id: 1, catId: 1, grades: [{id: 1, name: 'هفتم'}, {id: 2, name: 'هشتم'}, {id: 3, name: 'نهم'}]},
            {id: 2, catId: 2, grades: [{id: 4, name: 'دهم'}, {id: 5, name: 'یازدهم'}, {id: 6, name: 'دوازدهم'}]}
        ],
        courses: [
            {id: 1, fieldId: 1, gradeId: 4, courses: [{id: 1, name: 'ریاضی 1'}]},
        ],
        selectedOption : "",
        selectedCat: null,
        selectedField: null,
        selectedGrade: null,
        selectedCourse: null,
        loadingCats: false,
        loadingFields: false,
        loadingGrades: false,
        loadingCourses: false,
        showDeleteModal: false,
        deleteCatId: null,
        deleteFieldId: null
    }

    componentDidMount = async () => {
        
        this.setState({loadingCats: true})
        await this.props.GetSchoolInfo(this.props.user.token , this.props.match.params.id);
        this.setState({loadingCats: false})

        this.setState({selectedOption : this.props.schoolLessonInfo.schoolModel.sexuality == 0 ? "Female" : "Male"})
    }

    handleRadioBtnChng = (gender) =>{
        this.setState({selectedOption : gender});
    }

    onEditSchool = async() =>{
        const data = {
            id : parseInt(this.props.match.params.id),
            schoolName : this.state.schoolName,
            schoolIdNumber : this.state.schoolCode
        }
        await this.props.EditSchool(this.props.user.token , data)
    }

    selectCat = async (id) => {
        this.setState({ selectedCat: id, selectedField: null, selectedGrade: null, selectedCourse: null })

        this.setState({loadingFields: true})
        await this.props.GetSchool_StudyFields(this.props.user.token , id , this.props.match.params.id);
        this.setState({loadingFields: false})
    }

    selectField = async (id) => {
        this.setState({ selectedField: id })

        this.setState({loadingGrades: true})
        await this.props.GetSchool_Grades(this.props.user.token , id, this.props.match.params.id);
        this.setState({loadingGrades: false})
    }

    selectGrade = async (id) => {
        this.setState({ selectedGrade: id })

        this.setState({loadingCourses: true})
        await this.props.getLessons(this.props.user.token , id);
        this.setState({loadingCourses: false})
    }

    selectCourse = (id) => {
        this.setState({ selectedCourse: id })
    }

    redirect = async () => {
        await this.props.RedirectAdmin(this.props.user.token , parseInt(this.props.match.params.id))
    }

    renderInputs = ({ input, meta, dir, type, placeholder  , extra }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir={dir}
                placeholder={placeholder}
                extra={extra + "max-w-350 my-4"}
            />
        );
    }

    changeManagerInfo = async (formValues) => {
        if (formValues.password !== formValues.passwordagain) {
            formValues.password = null;
        }
        formValues.schoolId = parseInt(this.props.match.params.id);
        formValues.schoolSexuality = (this.state.selectedOption === "Male" ? 1 : 0)

        await this.props.EditManager(this.props.user.token , formValues)
    }

    onAdd = async (status , dataIds) => {

        const data = {
            schoolId : parseInt(this.props.match.params.id),
            dataIds : dataIds
        };
        
        switch (status) {
            
            case "category": 
                this.setState({ selectedCat:null, selectedField: null, selectedGrade: null, selectedCourse: null })
    
                await this.props.AddBaseToSchool(this.props.user.token , data)
                break;

            case "field": 
                this.setState({ selectedField: null, selectedGrade: null, selectedCourse: null })

                await this.props.AddStudyFToSchool(this.props.user.token , data)

                // this.setState({loadingFields: true})
                // await this.props.GetSchool_StudyFields(this.props.user.token , this.state.selectedCat);
                // this.setState({loadingFields: false})
                break;
        }

    }

    confirmDelete = async () => {

        if (this.state.deleteCatId) {
            await this.props.RemoveBaseFromSchool(this.props.user.token , this.state.deleteCatId)
            this.setState({ selectedCat: null, selectedField: null, selectedGrade: null, selectedCourse: null })
        } else {
            await this.props.RemoveStudyFFromSchool(this.props.user.token , this.state.deleteFieldId)
            this.setState({ selectedField: null, selectedGrade: null, selectedCourse: null })
        }
    }

    render() {
        return (
            <div onClick={() => this.setState({ showChangeName: false })} className="w-screen min-h-screen lg:px-16 px-2 py-16 relative bg-bold-blue grid lg:grid-cols-4 grid-cols-1 lg:col-gap-4 col-gap-4 row-gap-10">
                <div onClick={() => history.push('/a/schools')} className="w-10 h-10 cursor-pointer absolute top-0 left-0 mt-4 ml-4 rounded-lg border-2 border-purplish">
                    {arrow_left('w-6 centerize text-purplish')}
                </div>
                {this.state.showDeleteModal ?
                <DeleteConfirm
                    title="آیا از عمل حذف مطمئن هستید؟ تمامی درس های زیرمجموعه پاک خواهند شد و این عمل قابلیت بازگشت ندارد!"
                    confirm={this.confirmDelete}
                    cancel={() => this.setState({ showDeleteModal: false, deleteFieldId: null, deleteCatId: null })}
                /> 
                : 
                null
                }
                <div className="w-full relative rounded-lg lg:min-h-85 text-center min-h-0 py-6 px-4 col-span-1 border-2 border-dark-blue">
                    {/*<div className="absolute manager-options">*/}
                    {/*    {slash('w-6 text-white')}*/}
                    {/*</div>*/}
                    {briefcase('w-1/5 mb-2 text-white mx-auto')}
                    <p className="text-white">اطلاعات مدیر</p>
                    {this.state.loadingCats ? loading('w-10 text-grayish centerize')
                    : 
                    <form className="text-center mt-8 w-full" onSubmit={this.props.handleSubmit(this.changeManagerInfo)}>
                        <div className="w-full flex flex-row justify-end items-center flex-wrap">
                            {/*<div style={{direction : "rtl"}} className="text-white">*/}
                            {/*    <input checked="true" */}
                            {/*        type="radio" */}
                            {/*        value="Female" */}
                            {/*        name="gender" */}
                            {/*        className="form-radio"*/}
                            {/*        checked={this.state.selectedOption === "Female"}*/}
                            {/*        onChange={this.handleRadioBtnChng}*/}
                            {/*    /> دخترانه*/}

                            {/*    <input */}
                            {/*        className="mr-4" */}
                            {/*        checked={this.state.selectedOption === "Male"}*/}
                            {/*        onChange={this.handleRadioBtnChng} */}
                            {/*        type="radio" */}
                            {/*        value="Male" */}
                            {/*        name="gender" */}
                            {/*    /> پسرانه*/}
                            {/*</div>*/}
                            <div className="w-full flex justify-between items-center">
                                <Field
                                    name="latinFirstname"
                                    type="text"
                                    placeholder="نام لاتین"
                                    extra={"w-1/2 mr-1 my-4"}
                                    component={this.renderInputs}
                                />
                                <Field
                                    name="firstName"
                                    dir="rtl"
                                    type="text"
                                    placeholder="نام"
                                    extra={"w-1/2 ml-1 my-4"}
                                    component={this.renderInputs}
                                />
                            </div>
                            <div className="w-full flex justify-between items-center">
                                <Field
                                    name="latinLastname"
                                    type="text"
                                    extra={"w-1/2 mr-1 my-4"}
                                    placeholder="نام خانوادگی لاتین "
                                    component={this.renderInputs}
                                />
                                <Field
                                    name="lastName"
                                    dir="rtl"
                                    type="text"
                                    placeholder="نام خانوادگی"
                                    extra={"w-1/2 ml-1 my-4"}
                                    component={this.renderInputs}
                                />
                            </div>
                            <div className="w-full flex justify-between items-center">
                                <Field
                                    name="personalIdNumber"
                                    dir="ltr"
                                    type="text"
                                    placeholder="شماره پرسنلی"
                                    extra={"w-1/2 mr-1 my-4"}
                                    component={this.renderInputs}
                                />
                                <Field
                                    name="melliCode"
                                    type="text"
                                    dir="ltr"
                                    placeholder="کد ملی"
                                    extra={"w-1/2 ml-1 my-4"}
                                    component={this.renderInputs}
                                />
                            </div>
                            <Field
                                name="phoneNumber"
                                type="text"
                                dir="ltr"
                                placeholder="شماره همراه"
                                extra={"w-full my-4"}
                                component={this.renderInputs}
                            />
                            <div className="w-full my-4 flex flex-row-reverse justify-between items-center">
                                <span className="text-white">جنسیت</span>
                                <span onClick={() => this.handleRadioBtnChng("Female")} className={`w-2/5 text-center py-2 cursor-pointer border-2 ${this.state.selectedOption === 'Female' ? 'border-redish text-redish' : 'border-grayish text-grayish'}`}>زن</span>
                                <span onClick={() => this.handleRadioBtnChng("Male")} className={`w-2/5 text-center py-2 cursor-pointer border-2 ${this.state.selectedOption === 'Male' ? 'border-sky-blue text-sky-blue' : 'border-grayish text-grayish'}`}>مرد</span>
                            </div>
                            <Field
                                name="password"
                                type="text"
                                dir="ltr"
                                placeholder="گذرواژه"
                                extra={"w-full my-4"}
                                component={this.renderInputs}
                            />
                            <Field
                                name="passwordagain"
                                type="text"
                                dir="ltr"
                                placeholder="تکرار گذرواژه"
                                extra={"w-full my-4"}
                                component={this.renderInputs}
                            />
                        </div>
                        <div className="w-full mx-auto max-w-350 flex flex-row justify-between items-center">
                            <button type="submit" className="w-full py-1 mx-1 rounded-lg border-2 border-transparent bg-pinkish text-white">
                                ذخیره
                            </button>
                            {/*<button onClick={this.props.reset} className="w-5/12 py-1 mx-1 rounded-lg border-2 border-pinkish text-pinkish">*/}
                            {/*    ریست*/}
                            {/*</button>*/}
                        </div>
                    </form>
                    }
                </div>

                {(this.state.loadingCats || this.props.schoolLessonInfo == null ? loading('w-10 text-grayish centerize')
                :
                <div className="w-full rounded-lg min-h-90 p-4 lg:col-span-3 col-span-1 border-2 border-dark-blue">
                    <div className="flex lg:flex-row-reverse flex-col justify-between">
                        <div>
                            <PencilText 
                                text={this.props.schoolLessonInfo.schoolModel.schoolName} 
                                className="text-right text-white lg:text-2xl text-lg"
                                show={this.state.showChangeName}
                                showBox={() => this.setState({ showChangeName: true })}
                                value={this.state.className}
                                changeValue={(schoolName) => this.setState({ schoolName })}
                                ChangeCode={(code) => this.setState({ schoolCode : code })}
                                submit={this.onEditSchool}
                                schoolData={true}
                                schoolCode={this.props.schoolLessonInfo.schoolModel.schoolIdNumber}
                            />
                        </div>
                        <div>
                            {/*<Link className="px-6 py-1 rounded-lg border-2 border-grayish text-grayish" to="/a/schools">بازگشت</Link>*/}
                            <button onClick={this.redirect} className="px-6 py-1 lg:mx-2 mx-0 mt-4 rounded-lg border-2 border-greenish text-greenish">ورود به عنوان مدیر مدرسه</button>
                        </div>
                    </div>
                    <div className="mt-8 overflow-auto">
                        
                        <BaseManager
                            schoolId={this.props.match.params.id}
                            editable={true}
                            onAdd={this.onAdd}
                            deleteCat={(id) => this.setState({ showDeleteModal: true, deleteCatId: id })}
                            deleteField={(id) => this.setState({ showDeleteModal: true, deleteFieldId: id })}
                            categories={this.props.schoolLessonInfo.bases}
                            selectedCat={this.state.selectedCat}
                            selectCat={this.selectCat}
                            loadingCats={this.state.loadingCats}
                            fields={this.props.schoolLessonInfo.studyFields}
                            selectedField={this.state.selectedField}
                            selectField={this.selectField}
                            loadingFields={this.state.loadingFields}
                            grades={this.props.schoolLessonInfo.grades}
                            selectedGrade={this.state.selectedGrade}
                            selectGrade={this.selectGrade}
                            loadingGrades={this.state.loadingGrades}
                            courses={this.props.newSchoolInfo.lessons}
                            selectedCourse={this.state.selectedCourse}
                            selectCourse={this.selectCourse}
                            loadingCourses={this.state.loadingCourses}
                        />
                        
                    </div>
                </div>
                )}
            </div>
        );
    }

}

const validate = formValues => {
    const errors = {}

    if (formValues.password) {
        if(formValues.password != formValues.passwordagain) errors.password = true
    }
    // if (!formValues.latinLastname) errors.latinLastname = true
    // if (!formValues.latinFirstname) errors.latinFirstname = true
    if (!validator.checkMelliCode(formValues.melliCode)) errors.melliCode = true
    if (!formValues.phoneNumber || !validator.checkPhoneNumber(formValues.phoneNumber)) errors.phoneNumber = true
    if (!formValues.personalIdNUmber) errors.personalIdNUmber = true

    return errors;
}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo , 
        newSchoolInfo: state.schoolData.newSchoolInfo , 
        schoolLessonInfo : state.schoolData.schoolLessonInfo,
        initialValues: {
            firstName: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.firstName : null,
            latinFirstname: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.latinFirstname : null,
            latinLastname: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.latinLastname : null,
            lastName: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.lastName : null,
            personalIdNumber: state.schoolData.schoolLessonInfo ? (state.schoolData.schoolLessonInfo.managerDetail ? state.schoolData.schoolLessonInfo.managerDetail.personalIdNumber : null) : null,
            melliCode: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.melliCode : null,
            phoneNumber: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.phoneNumber : null,
        }
    }
}

const formWrapped = reduxForm({
    form: 'editSchoolManager',
    enableReinitialize : true,
    validate
}, mapStateToProps)(SchoolInfo)

const authWrapped = protectedAdmin(formWrapped)

export default connect(mapStateToProps, { GetSchoolInfo , GetSchool_StudyFields , RedirectAdmin, 
                                        GetSchool_Grades , getLessons , EditManager , EditSchool , AddBaseToSchool , RemoveBaseFromSchool , AddStudyFToSchool , RemoveStudyFFromSchool})(authWrapped);