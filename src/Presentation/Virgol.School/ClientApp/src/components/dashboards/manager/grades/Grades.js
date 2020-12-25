import React from "react";
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {Field, reduxForm, reset} from "redux-form";
import {briefcase, loading, slash} from "../../../../assets/icons";
import DeleteConfirm from "../../../modals/DeleteConfirm";
import Fieldish from "../../../field/Fieldish";
import BaseManager from "../../baseManager/BaseManager";

import {GetSchoolInfo , addNewClass , getClassList , getAllClass, GetSchool_Grades , GetSchool_StudyFields , getLessons } from "../../../../_actions/schoolActions"
import history from "../../../../history";
import { Link } from "react-router-dom";
import SelectableCard from "../../baseManager/SelectableCard";

class Grades extends React.Component {

    state = { loading: false, query: '' }

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.GetSchoolInfo(this.props.user.token);
        await this.props.getAllClass(this.props.user.token);
        this.setState({ loading: false })
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

    OnLock = (state) => {
        if(state)
        {
            this.selectGrade(0)
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
        history.push(`/class/${id}`)
    }
    
    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        if(this.state.loading)
            loading('w-10 text-grayish centerize')

        return (
            <div className="w-full mt-10 pb-10">
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title={this.props.t('deleteConfirm')}
                    confirm={this.confirmDelete}
                    cancel={() => this.setState({ showDeleteModal: false, deleteFieldId: null, deleteCatId: null })}
                /> 
                : 
                null
                }

                {(!this.props.schoolLessonInfo ? this.props.t('loading') :
                <div className="w-full rounded-lg min-h-90 lg:col-span-3 col-span-1">
                    <div className="mt-8 overflow-auto">
                        <BaseManager
                            OnLockCall={(state) => this.OnLock(state)}
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
                    <div className="w-full mt-8 p-4 bg-dark-blue rounded-xl">
                        <p className="text-right text-white"> {this.props.t('classList')} </p>
                        <div dir="rtl" className="w-full   grid all-classes">
                            {(this.props.allClass ?
                                    this.props.allClass.map(x => {
                                        return(
                                            <SelectableCard
                                                id={x.id}
                                                title={x.className}
                                                select={(id) => history.push(`/class/${id}`)}
                                            />
                                        )
                                    })
                                    :
                                    null
                            )}
                        </div>
                    </div>
                </div>
                )}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , schoolLessonInfo: state.schoolData.schoolLessonInfo ,
                                    classes :  state.schoolData.classes,
                                    allClass : state.schoolData.allClass}
}

const cwarpped = connect(mapStateToProps, { GetSchoolInfo , GetSchool_StudyFields , 
    GetSchool_Grades , getLessons , getClassList , getAllClass , addNewClass})(Grades);

export default withTranslation()(cwarpped);