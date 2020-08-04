import React from "react";
import { connect } from 'react-redux';
import {Field, reduxForm} from "redux-form";
import {briefcase, loading, slash} from "../../../../assets/icons";
import Fieldish from "../../../field/Fieldish";
import BaseManager from "../../baseManager/BaseManager";
import {GetSchoolInfo , getBases , getGrades , getStudyfields , getLessons , AddNewSchool , EditSchool , EditManager} from "../../../../_actions/adminActions"
import {Link} from "react-router-dom";

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
    }

    componentDidMount = async () => {
        
        this.setState({loadingCats: true})
        await this.props.getBases(this.props.user.token);
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
        await this.props.getStudyfields(this.props.user.token , id);
        this.setState({loadingFields: false})
    }

    selectField = async (id) => {
        this.setState({ selectedField: id })

        this.setState({loadingGrades: true})
        await this.props.getGrades(this.props.user.token , id);
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

    renderInputs = ({ input, meta, type, placeholder }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="ltr"
                placeholder={placeholder}
                extra="w-full max-w-350 my-4 md:mx-4 lg:mx-0 mx-0"
            />
        );
    }

    changeManagerInfo = (formValues) => {

    }

    onAdd = (status) => {

        switch (status) {
            case "category": this.setState({ selectedCat:null, selectedField: null, selectedGrade: null, selectedCourse: null })
        }

    }

    render() {
        return (
            <div className="w-screen min-h-screen p-10 relative bg-bold-blue grid lg:grid-cols-4 grid-cols-1 lg:col-gap-4 xl:col-gap-10 col-gap-10 row-gap-10">
                <div className="w-full relative rounded-lg lg:min-h-90 text-center min-h-0 py-6 px-4 col-span-1 border-2 border-dark-blue">
                    <div className="absolute manager-options">
                        {slash('w-6 text-white')}
                    </div>
                    {briefcase('w-1/5 mb-2 text-white mx-auto')}
                    <p className="text-white">اطلاعات مدیر</p>
                    <form className="text-center mt-8 w-full" onSubmit={this.props.handleSubmit(this.changeManagerInfo)}>
                        <div className="w-full flex flex-row justify-center items-center flex-wrap">
                            <Field
                                name="firstName"
                                type="text"
                                placeholder="نام"
                                component={this.renderInputs}
                            />
                            <Field
                                name="lastName"
                                type="text"
                                placeholder="نام خانوادگی"
                                component={this.renderInputs}
                            />
                            <Field
                                name="personalCode"
                                type="text"
                                placeholder="شماره پرسنلی"
                                component={this.renderInputs}
                            />
                            <Field
                                name="melliCode"
                                type="text"
                                placeholder="کد ملی"
                                component={this.renderInputs}
                            />
                            <Field
                                name="phoneNumber"
                                type="text"
                                placeholder="شماره همراه"
                                component={this.renderInputs}
                            />
                        </div>
                        <div className="w-full mx-auto max-w-350 flex flex-row justify-between items-center">
                            <button type="submit" className="w-5/12 py-1 mx-1 rounded-lg border-2 border-transparent bg-pinkish text-white">
                                ذخیره
                            </button>
                            <button className="w-5/12 py-1 mx-1 rounded-lg border-2 border-pinkish text-pinkish">
                                ریست
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-full rounded-lg min-h-90 p-4 lg:col-span-3 col-span-1 border-2 border-dark-blue">
                    <div className="flex flex-row-reverse justify-between">
                        <div>
                            <p className="text-right text-white text-2xl">شهید هاشمی نژاد 1</p>
                            <p className="text-right text-white">#546253</p>
                        </div>
                        <div>
                            <Link className="px-6 py-1 rounded-lg border-2 border-grayish text-grayish" to="/a/schools">بازگشت</Link>
                        </div>
                    </div>
                    <div className="mt-8 overflow-auto">
                        <BaseManager
                            editable={true}
                            onAdd={this.onAdd}
                            categories={this.props.schoolLessonInfo.bases}
                            selectedCat={this.state.selectedCat}
                            selectCat={this.selectCat}
                            loadingCats={this.state.loadingCats}
                            fields={this.props.schoolLessonInfo.studies}
                            selectedField={this.state.selectedField}
                            selectField={this.selectField}
                            loadingFields={this.state.loadingFields}
                            grades={this.props.schoolLessonInfo.grades}
                            selectedGrade={this.state.selectedGrade}
                            selectGrade={this.selectGrade}
                            loadingGrades={this.state.loadingGrades}
                            courses={this.props.schoolInfo.lessons}
                            selectedCourse={this.state.selectedCourse}
                            selectCourse={this.selectCourse}
                            loadingCourses={this.state.loadingCourses}
                        />
                    </div>
                </div>
            </div>
        );
    }

}

const formWrapped = reduxForm({
    form: 'editSchoolManager'
})(SchoolInfo)

const mapStateToProps = state => {
    return {user: state.auth.userInfo , schoolInfo: state.adminData.schoolInfo , schoolLessonInfo : state.adminData.schoolLessonInfo}
}

export default connect(mapStateToProps, { GetSchoolInfo ,getBases , getStudyfields , getGrades , getLessons , EditManager , EditSchool })(formWrapped);