import React from "react";
import { connect } from 'react-redux';
import {Field, reduxForm, reset} from "redux-form";
import {briefcase, loading, slash} from "../../../../assets/icons";
import DeleteConfirm from "../../../modals/DeleteConfirm";
import Fieldish from "../../../field/Fieldish";
import BaseManager from "../../baseManager/BaseManager";

import {GetSchoolInfo , addNewClass , getClassList , GetSchool_Grades , GetSchool_StudyFields , getLessons } from "../../../../_actions/schoolActions"
import history from "../../../../history";
import { Link } from "react-router-dom";

class Grades extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount = async () => {
        if (this.props.history.action === 'POP' || !this.props.schoolLessonInfo ) {
            this.setState({ loading: true })
            await this.props.GetSchoolInfo(this.props.user.token);
            this.setState({ loading: false })
        }
    }

    onAdd = async (status , data) => {

        const myData = {
            gradeId : this.state.selectedGrade,
            className : data
        };
        
        switch (status) {
            
            case "class": 
                await this.props.addNewClass(this.props.user.token , myData)
                break;
        }

    }

    selectCat = async (id) => {
        this.setState({ selectedCat: id, selectedField: null, selectedGrade: null, selectedCourse: null })

        this.setState({loadingFields: true})
        await this.props.GetSchool_StudyFields(this.props.user.token , id);
        this.setState({loadingFields: false})
    }

    selectField = async (id) => {
        this.setState({ selectedField: id })

        this.setState({loadingGrades: true})
        await this.props.GetSchool_Grades(this.props.user.token , id);
        this.setState({loadingGrades: false})
    }

    selectGrade = async (id) => {
        this.setState({ selectedGrade: id })

        this.setState({loadingClasses: true})
        await this.props.getClassList(this.props.user.token , id);
        this.setState({loadingClasses: false})
    }

    selectClass = (id) => {
        this.setState({ selectedClass: id })
    }
    
    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        if(this.state.loading) 
            return "لودیمگ..."

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

                {(!this.props.schoolLessonInfo ? "... درحال بارگذاری اطلاعات" :
                <div className="w-full rounded-lg min-h-90 p-4 lg:col-span-3 col-span-1 border-2 border-dark-blue">
                    <div className="mt-8 overflow-auto">
                        
                        <BaseManager
                            schoolId={this.props.match.params.id}
                            editable={false}
                            classable={true}
                            onAdd={this.onAdd}
                            onEdit={(id) => history.push(`/class/${id}`)}
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
                            classes={this.props.classes}
                            selectedClass={this.state.selectedClass}
                            selectClass={this.selectClass}
                            loadingClasses={this.state.loadingClasses}
                        />
                        
                    </div>
                </div>
                )}
            </div>
        );
        // return (
        //     <div className="w-full mt-10">
        //         <PlusTable
        //             title="لیست معلمان"
        //             isLoading={this.state.loading}
        //             query={this.state.query}
        //             changeQuery={this.changeQuery}
        //             button={() => {
        //                 return (
        //                     <button className="px-6 py-1 border-2 border-sky-blue text-sky-blue rounded-lg">دانش آموزان جدید</button>
        //                 );
        //             }}
        //             headers={['نام پایه']}
        //             body={() => {
        //                 return (
        //                     <React.Fragment>
        //                         {
        //                             this.props.grades.map(x => {
        //                                 if(x.gradeName.includes(this.state.query))
        //                                 {
        //                                     return(
        //                                     <tr>
        //                                         <td className="py-4">{x.gradeName}</td>
        //                                         <td className="cursor-pointer" onClick={() => history.push(`/teacher/${x.id}`)}>
        //                                             {edit('w-6 text-white')}
        //                                         </td>            
        //                                     </tr>
        //                                     )
        //                                 }
        //                             })
        //                         }
        //                     </React.Fragment>
        //                 );
        //             }}
        //         />
        //     </div>
        // );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , schoolLessonInfo: state.schoolData.schoolLessonInfo ,
                                    newSchoolInfo: state.schoolData.newSchoolInfo ,
                                    classes :  state.schoolData.classes}
}

export default connect(mapStateToProps, { GetSchoolInfo , GetSchool_StudyFields , 
                                            GetSchool_Grades , getLessons , getClassList , addNewClass})(Grades);