import React from "react";
import { connect } from 'react-redux';
import {Field, reduxForm, reset} from "redux-form";
import {briefcase, loading, slash} from "../../../../assets/icons";
import Fieldish from "../../../field/Fieldish";
import BaseManager from "../../baseManager/BaseManager";
import {GetSchoolInfo  , GetSchool_Grades , GetSchool_StudyFields 
        , getLessons , EditSchool , AddBaseToSchool  , RemoveBaseFromSchool , AddStudyFToSchool , RemoveStudyFFromSchool} from "../../../../_actions/schoolActions"
import {EditManager , RedirectAdmin} from '../../../../_actions/adminActions'
import {Link} from "react-router-dom";
import Modal from "../../../modals/Modal";
import DeleteConfirm from "../../../modals/DeleteConfirm";

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

    }

    // getFields = async () => {
    //     console.log("test")
    //     await this.props.getStudyfields(this.props.user.token , this.state.selectedCat);
    //     if (!this.props.bases) return null
    //     return this.props.studyFields.find(el => el.catId === this.state.selectedCat).fields
    // }

    // getGrades = () => {
    //     if (!this.state.selectedField && (!this.state.selectedCat || this.state.fields.find(el => el.catId === this.state.selectedCat).fields.length !== 0)) return null
    //     return this.state.grades.find(el => el.catId === this.state.selectedCat).grades
    // }

    // getCourses = () => {
    //     if (!this.state.selectedGrade) return null
    //     return this.state.courses.find(el => (el.fieldId === -1 || el.fieldId === this.state.selectedField) && el.gradeId === this.state.selectedGrade).courses
    // }

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

    renderInputs = ({ input, meta, dir, type, placeholder }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir={dir}
                placeholder={placeholder}
                extra="w-full max-w-350 my-4 md:mx-4 lg:mx-0 mx-0"
            />
        );
    }

    changeManagerInfo = async (formValues) => {
        if (formValues.password !== formValues.passwordagain) {
            formValues.password = null;
        }
        formValues.schoolId = parseInt(this.props.match.params.id);
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
            <div className="w-screen min-h-screen p-10 relative bg-bold-blue grid lg:grid-cols-4 grid-cols-1 lg:col-gap-4 xl:col-gap-10 col-gap-10 row-gap-10">
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title="آیا از عمل حذف مطمئن هستید؟ تمامی درس های زیرمجموعه پاک خواهند شد و این عمل قابلیت بازگشت ندارد!"
                    confirm={this.confirmDelete}
                    cancel={() => this.setState({ showDeleteModal: false, deleteFieldId: null, deleteCatId: null })}
                /> 
                : 
                null
                }
                <div className="w-full relative rounded-lg lg:min-h-90 text-center min-h-0 py-6 px-4 col-span-1 border-2 border-dark-blue">
                    <div className="absolute manager-options">
                        {slash('w-6 text-white')}
                    </div>
                    {briefcase('w-1/5 mb-2 text-white mx-auto')}
                    <p className="text-white">اطلاعات مدیر</p>
                    {this.state.loadingCats ? loading('w-10 text-grayish centerize')
                    : 
                    <form className="text-center mt-8 w-full" onSubmit={this.props.handleSubmit(this.changeManagerInfo)}>
                        <div className="w-full flex flex-row justify-center items-center flex-wrap">
                            <Field
                                name="firstName"
                                dir="rtl"
                                type="text"
                                placeholder="نام"
                                component={this.renderInputs}
                            />
                            <Field
                                name="lastName"
                                dir="rtl"
                                type="text"
                                placeholder="نام خانوادگی"
                                component={this.renderInputs}
                            />
                            <Field
                                name="personalIdNumber"
                                dir="ltr"
                                type="text"
                                placeholder="شماره پرسنلی"
                                component={this.renderInputs}
                            />
                            <Field
                                name="melliCode"
                                type="text"
                                dir="ltr"
                                placeholder="کد ملی"
                                component={this.renderInputs}
                            />
                            <Field
                                name="phoneNumber"
                                type="text"
                                dir="ltr"
                                placeholder="شماره همراه"
                                component={this.renderInputs}
                            />
                            <Field
                                name="password"
                                type="text"
                                dir="ltr"
                                placeholder="گذرواژه"
                                component={this.renderInputs}
                            />
                            <Field
                                name="passwordagain"
                                type="text"
                                dir="ltr"
                                placeholder="تکرار گذرواژه"
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
                    <div className="flex flex-row-reverse justify-between">
                        <div>
                            <p className="text-right text-white text-2xl">{this.props.schoolLessonInfo.schoolModel.schoolName}</p>
                            <p className="text-right text-white">#{this.props.schoolLessonInfo.schoolModel.schoolIdNumber}</p>
                        </div>
                        <div>
                            <Link className="px-6 py-1 rounded-lg border-2 border-grayish text-grayish" to="/a/schools">بازگشت</Link>
                            <button onClick={this.redirect} className="px-6 py-1 mx-2 rounded-lg border-2 border-greenish text-greenish">ورود به عنوان مدیر مدرسه</button>
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

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo , 
        newSchoolInfo: state.schoolData.newSchoolInfo , 
        schoolLessonInfo : state.schoolData.schoolLessonInfo,
        initialValues: {
            firstName: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.firstName : null,
            lastName: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.lastName : null,
            personalIdNumber: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerDetail.personalIdNumber : null,
            melliCode: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.melliCode : null,
            phoneNumber: state.schoolData.schoolLessonInfo ? state.schoolData.schoolLessonInfo.managerInfo.phoneNumber : null,
        }
    }
}

const formWrapped = reduxForm({
    form: 'editSchoolManager',
    enableReinitialize : true
}, mapStateToProps)(SchoolInfo)

export default connect(mapStateToProps, { GetSchoolInfo , GetSchool_StudyFields , RedirectAdmin, 
                                        GetSchool_Grades , getLessons , EditManager , EditSchool , AddBaseToSchool , RemoveBaseFromSchool , AddStudyFToSchool , RemoveStudyFFromSchool})(formWrapped);