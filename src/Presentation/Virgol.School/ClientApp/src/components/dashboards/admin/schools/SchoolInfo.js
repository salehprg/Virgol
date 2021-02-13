import React from "react";
import { withTranslation } from 'react-i18next';
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
                extra={extra + "tw-max-w-350 tw-my-4"}
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
            <div onClick={() => this.setState({ showChangeName: false })} className="tw-w-screen tw-min-h-screen lg:tw-px-16 tw-px-2 tw-py-16 tw-relative tw-bg-bold-blue tw-grid lg:tw-grid-cols-4 tw-grid-cols-1 lg:tw-col-tw-gap-4 tw-col-tw-gap-4 tw-row-tw-gap-10">
                <div onClick={() => history.push('/a/schools')} className="tw-w-10 tw-h-10 tw-cursor-pointer tw-absolute tw-top-0 tw-left-0 tw-mt-4 tw-ml-4 tw-rounded-lg tw-border-2 tw-border-purplish">
                    {arrow_left('tw-w-6 centerize tw-text-purplish')}
                </div>
                {this.state.showDeleteModal ?
                <DeleteConfirm
                    title={this.props.t('deleteConfirm')}
                    confirm={this.confirmDelete}
                    cancel={() => this.setState({ showDeleteModal: false, deleteFieldId: null, deleteCatId: null })}
                /> 
                : 
                null
                }
                <div className="tw-w-full tw-relative tw-rounded-lg lg:tw-min-h-85 tw-text-center tw-min-h-0 tw-py-6 tw-px-4 tw-col-span-1 tw-border-2 tw-border-dark-blue">
                    {/*<div className="tw-absolute manager-options">*/}
                    {/*    {slash('tw-w-6 tw-text-white')}*/}
                    {/*</div>*/}
                    {briefcase('tw-w-1/5 tw-mb-2 tw-text-white tw-mx-auto')}
                    <p className="tw-text-white"> {this.props.t('managerInfo')} </p>
                    {this.state.loadingCats ? loading('tw-w-10 tw-text-grayish centerize')
                    : 
                    <form className="tw-text-center tw-mt-8 tw-w-full" onSubmit={this.props.handleSubmit(this.changeManagerInfo)}>
                        <div className="tw-w-full tw-flex tw-flex-row tw-justify-end tw-items-center tw-flex-wrap">
                            {/*<div style={{direction : "rtl"}} className="tw-text-white">*/}
                            {/*    <input checked="true" */}
                            {/*        type="radio" */}
                            {/*        value="Female" */}
                            {/*        name="gender" */}
                            {/*        className="form-radio"*/}
                            {/*        checked={this.state.selectedOption === "Female"}*/}
                            {/*        onChange={this.handleRadioBtnChng}*/}
                            {/*    /> دخترانه*/}

                            {/*    <input */}
                            {/*        className="tw-mr-4" */}
                            {/*        checked={this.state.selectedOption === "Male"}*/}
                            {/*        onChange={this.handleRadioBtnChng} */}
                            {/*        type="radio" */}
                            {/*        value="Male" */}
                            {/*        name="gender" */}
                            {/*    /> پسرانه*/}
                            {/*</div>*/}
                            <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                                <Field
                                    name="latinFirstname"
                                    type="text"
                                    placeholder={this.props.t('latinFirstName')}
                                    extra={"tw-w-1/2 tw-mr-1 tw-my-4"}
                                    component={this.renderInputs}
                                />
                                <Field
                                    name="firstName"
                                    dir="rtl"
                                    type="text"
                                    placeholder={this.props.t('firstName')}
                                    extra={"tw-w-1/2 tw-ml-1 tw-my-4"}
                                    component={this.renderInputs}
                                />
                            </div>
                            <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                                <Field
                                    name="latinLastname"
                                    type="text"
                                    extra={"tw-w-1/2 tw-mr-1 tw-my-4"}
                                    placeholder={this.props.t('latinLastName')}
                                    component={this.renderInputs}
                                />
                                <Field
                                    name="lastName"
                                    dir="rtl"
                                    type="text"
                                    placeholder={this.props.t('lastName')}
                                    extra={"tw-w-1/2 tw-ml-1 tw-my-4"}
                                    component={this.renderInputs}
                                />
                            </div>
                            <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                                <Field
                                    name="personalIdNumber"
                                    dir="ltr"
                                    type="text"
                                    placeholder={this.props.t('personelCode')}
                                    extra={"tw-w-1/2 tw-mr-1 tw-my-4"}
                                    component={this.renderInputs}
                                />
                                <Field
                                    name="melliCode"
                                    type="text"
                                    dir="ltr"
                                    placeholder={this.props.t('nationCode')}
                                    extra={"tw-w-1/2 tw-ml-1 tw-my-4"}
                                    component={this.renderInputs}
                                />
                            </div>
                            <Field
                                name="phoneNumber"
                                type="text"
                                dir="ltr"
                                placeholder={this.props.t('phoneNumber')}
                                extra={"tw-w-full tw-my-4"}
                                component={this.renderInputs}
                            />
                            <div className="tw-w-full tw-my-4 tw-flex tw-flex-row-reverse tw-justify-between tw-items-center">
                                <span className="tw-text-white"> {this.props.t('gender')} </span>
                                <span onClick={() => this.handleRadioBtnChng("Female")} className={`tw-w-2/5 tw-text-center tw-py-2 tw-cursor-pointer tw-border-2 ${this.state.selectedOption === 'Female' ? 'tw-border-redish tw-text-redish' : 'tw-border-grayish tw-text-grayish'}`}>زن</span>
                                <span onClick={() => this.handleRadioBtnChng("Male")} className={`tw-w-2/5 tw-text-center tw-py-2 tw-cursor-pointer tw-border-2 ${this.state.selectedOption === 'Male' ? 'tw-border-sky-blue tw-text-sky-blue' : 'tw-border-grayish tw-text-grayish'}`}>مرد</span>
                            </div>
                            <Field
                                name="password"
                                type="text"
                                dir="ltr"
                                placeholder={this.props.t('password')}
                                extra={"tw-w-full tw-my-4"}
                                component={this.renderInputs}
                            />
                            <Field
                                name="passwordagain"
                                type="text"
                                dir="ltr"
                                placeholder={this.props.t('confirmPassword')}
                                extra={"tw-w-full tw-my-4"}
                                component={this.renderInputs}
                            />
                        </div>
                        <div className="tw-w-full tw-mx-auto tw-max-w-350 tw-flex tw-flex-row tw-justify-between tw-items-center">
                            <button type="submit" className="tw-w-full tw-py-1 tw-mx-1 tw-rounded-lg tw-border-2 tw-border-transparent tw-bg-pinkish tw-text-white">
                                {this.props.t('save')}
                            </button>
                            {/*<button onClick={this.props.reset} className="tw-w-5/12 tw-py-1 tw-mx-1 tw-rounded-lg tw-border-2 tw-border-pinkish tw-text-pinkish">*/}
                            {/*    ریست*/}
                            {/*</button>*/}
                        </div>
                    </form>
                    }
                </div>

                {(this.state.loadingCats || this.props.schoolLessonInfo == null ? loading('tw-w-10 tw-text-grayish centerize')
                :
                <div className="tw-w-full tw-rounded-lg tw-min-h-90 tw-p-4 lg:tw-col-span-3 tw-col-span-1 tw-border-2 tw-border-dark-blue">
                    <div className="tw-flex lg:tw-flex-row-reverse tw-flex-col tw-justify-between">
                        <div>
                            <PencilText 
                                text={this.props.schoolLessonInfo.schoolModel.schoolName} 
                                className="tw-text-right tw-text-white lg:tw-text-2xl tw-text-lg"
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
                            {/*<Link className="tw-px-6 tw-py-1 tw-rounded-lg tw-border-2 tw-border-grayish tw-text-grayish" to="/a/schools">بازگشت</Link>*/}
                            <button onClick={this.redirect} className="tw-px-6 tw-py-1 lg:tw-mx-2 tw-mx-0 tw-mt-4 tw-rounded-lg tw-border-2 tw-border-greenish tw-text-greenish"> {this.props.t('enterAsManager')} </button>
                        </div>
                    </div>
                    <div className="tw-mt-8 tw-overflow-auto">
                        
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
                            OnLockCall={(e) => this.setState({lock : e})}
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
const cwrapped = connect(mapStateToProps, { GetSchoolInfo , GetSchool_StudyFields , RedirectAdmin, 
    GetSchool_Grades , getLessons , EditManager , EditSchool , AddBaseToSchool , RemoveBaseFromSchool , AddStudyFToSchool , RemoveStudyFFromSchool})(authWrapped);

export default withTranslation()(cwrapped);