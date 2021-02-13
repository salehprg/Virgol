import React from "react";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import {getAllGrades} from "../../../../_actions/managerActions"
import BaseManager from '../../baseManager/BaseManager'
import history from "../../../../history";

class Grades extends React.Component {

    state = {
        categories: [{id: 1, baseName: 'متوسطه اول'}, {id: 2, baseName: 'متوسطه دوم نظری'}],
        fields: [
            {id: 1, catId: 1, fields: []} ,
            {id: 2, catId: 2, fields: [{id: 1, studyFieldName: 'ریاضی'}, {id: 2, studyFieldName: 'تجربی'}]}
        ],
        grades: [
            {id: 1, catId: 1, grades: [{id: 1, gradeName: 'هفتم'}, {id: 2, gradeName: 'هشتم'}, {id: 3, gradeName: 'نهم'}]},
            {id: 2, catId: 2, grades: [{id: 4, gradeName: 'دهم'}, {id: 5, gradeName: 'یازدهم'}, {id: 6, gradeName: 'دوازدهم'}]}
        ],
        classes: [
            {id: 1, fieldId: 1, gradeId: 1, classes: [{id: 1, name: '101'}]},
        ],
        selectedCat: null,
        selectedField: null,
        selectedGrade: null,
        selectedClass: null,
        loadingCats: false,
        loadingFields: false,
        loadingGrades: false,
        loadingClasses: false,
        showDeleteModal: false,
        deleteCatId: null,
        deleteFieldId: null,
        deleteClassModal: null
    }

    getFields = () => {
        return this.state.fields
    }

    getGrades = () => {
        if (!this.state.selectedField && (!this.state.selectedCat || this.state.fields.find(el => el.catId === this.state.selectedCat).fields.length !== 0)) return null
        return this.state.grades.find(el => el.catId === this.state.selectedCat).grades
    }

    getClasses = () => {
        if (!this.state.selectedGrade) return null
        return this.state.classes.find(el => (el.fieldId === -1 || el.fieldId === this.state.selectedField) && el.gradeId === this.state.selectedGrade).classes
    }

    selectCat = async (id) => {
        this.setState({ selectedCat: id, selectedField: null, selectedGrade: null, selectedCourse: null })

        this.setState({loadingFields: true})
        // await this.props.getStudyfields(this.props.user.token , id);
        this.setState({loadingFields: false})
    }

    selectField = async (id) => {
        this.setState({ selectedField: id })

        this.setState({loadingGrades: true})
        // await this.props.getGrades(this.props.user.token , id);
        this.setState({loadingGrades: false})
    }

    selectGrade = async (id) => {
        this.setState({ selectedGrade: id })

        this.setState({loadingCourses: true})
        // await this.props.getLessons(this.props.user.token , id);
        this.setState({loadingCourses: false})
    }

    selectClass = (id) => {
        this.setState({ selectedClass: id })
    }

    render() {
        if(this.state.loading) return this.props.t('loading')
        return (
            <div className="tw-mt-10 tw-w-full tw-overflow-auto">
                <BaseManager
                    editable={false}
                    classable={true}
                    onEdit={(id) => history.push(`/class/${id}`)}
                    categories={this.state.categories}
                    selectedCat={this.state.selectedCat}
                    selectCat={this.selectCat}
                    loadingCats={this.state.loadingCats}
                    fields={this.getFields()}
                    selectedField={this.state.selectedField}
                    selectField={this.selectField}
                    loadingFields={this.state.loadingFields}
                    grades={this.getGrades()}
                    selectedGrade={this.state.selectedGrade}
                    selectGrade={this.selectGrade}
                    loadingGrades={this.state.loadingGrades}
                    classes={this.getClasses()}
                    selectedClass={this.state.selectedClass}
                    selectClass={this.selectClass}
                    loadingClasses={this.state.loadingClasses}
                />                
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo}
}

const cwrapped = connect(mapStateToProps, { getAllGrades })(Grades);

export default withTranslation()(cwrapped)