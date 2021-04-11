import React from "react";
import { withTranslation } from 'react-i18next';
import BMCard from "./BMCard";
import SelectableCard from "./SelectableCard";
import {loading} from "../../../assets/icons";
import AddCategory from "./AddCategory";
import AddField from "./AddField";
import AddClass from "./AddClass";

class BaseManager extends React.Component {

    state = { addStatus: null , locked : false }

    UpdateLockState (Id) {
        
        var freeBase = this.props.categories.find(x => x.id === Id);

        if(freeBase && freeBase.baseName === "جلسات")
        {
            this.setState({locked : true})
            this.props.OnLockCall(true)
        }
        else
        {
            this.setState({locked : false})
            this.props.OnLockCall(false)
        }

        
    }

    onAddData = (data) => {
        this.props.onAdd(this.state.addStatus , data);
        this.onCancel();
    }

    onAdd = (addStatus) => {
        this.setState({ addStatus })
        // this.props.onAdd(addStatus);
    }

    onCancel = () => {
        this.setState({ addStatus: null })
    }

    OnSelectCat = (Id) => {
        this.props.selectCat(Id)
        this.UpdateLockState(Id)
    }

    renderCats = () => {
        const {selectedCat, categories, loadingCats } = this.props
        if (loadingCats) return <div className="centerize">{loading('tw-w-8 tw-text-grayish')}</div>
        if (categories.length === 0) return <p className="tw-text-grayish tw-text-center centerize tw-w-full">{this.props.t('noBase')}</p>
        return categories.map(cat => {
                return (
                    <SelectableCard
                        id={cat.id}
                        title={cat.baseName}
                        isSelected={cat.id === selectedCat}
                        select={Id => this.OnSelectCat(Id)}
                    />
                );
            })
    }

    renderFields = () => {
        const {selectedCat , selectField, selectedField, fields, loadingFields  } = this.props
        if (loadingFields) return <div className="centerize">{loading('tw-w-8 tw-text-grayish')}</div>
        if (!selectedCat) return <p className="tw-text-grayish tw-text-center centerize tw-w-full"> {this.props.t('selectBase')} </p>
        if (!fields || fields.length === 0)  return <p className="tw-text-grayish tw-text-center centerize tw-w-full"> {this.props.t('noField')} </p>
        
        return fields.map(field => {
            return (
                <SelectableCard
                    id={field.id}
                    title={field.studyFieldName}
                    isSelected={field.id === selectedField}
                    select={selectField}
                />
            );
        })
    }

    renderGrades = () => {
        const {selectedField , selectGrade, selectedGrade, grades, loadingGrades } = this.props
        if (loadingGrades) return <div className="centerize">{loading('tw-8 tw-text-grayish')}</div>
        if (!selectedField) return <p className="tw-text-grayish tw-text-center centerize tw-w-full"> {this.props.t('selectField')} </p>
        if (!grades || grades.length === 0) return <p className="tw-text-grayish tw-text-center centerize tw-w-full"> {this.props.t('noGrade')} </p>
        return grades.map(grade => {
            return (
                <SelectableCard
                    id={grade.id}
                    title={grade.gradeName}
                    isSelected={grade.id === selectedGrade}
                    select={selectGrade}
                />
            );
        })
    }

    renderCourses = () => {
        const {selectedGrade , selectCourse, selectedCourse, courses, loadingCourses } = this.props
        if (loadingCourses) return <div className="centerize">{loading('tw-w-8 tw-text-grayish')}</div>
        if (!selectedGrade) return <p className="tw-text-grayish tw-text-center centerize tw-w-full"> {this.props.t('selectGrade')} </p>
        if (courses.length === 0) return <p className="tw-text-grayish tw-text-center centerize tw-w-full"> {this.props.t('noLesson')} </p>


        return courses.map(course => {
            return (
                <SelectableCard
                    id={course.id}
                    title={course.lessonName}
                    isSelected={course.id === selectedCourse}
                    select={selectCourse}
                />
            );
        })
    }

    renderClasses = () => {
        const {selectedGrade , selectClass, selectedClass, classes, loadingClasses } = this.props
        if (loadingClasses) return <div className="centerize">{loading('tw-w-8 tw-text-grayish')}</div>
        if (!selectedGrade && !this.state.locked) return <p className="tw-text-grayish tw-text-center centerize tw-w-full"> {this.props.t('selectGrade')} </p>
        if (classes.length === 0 && !this.state.locked) return <p className="tw-text-grayish tw-text-center centerize tw-w-full"> {this.props.t('noClass')} </p>
        return classes.map(kelas => {


            return (
                <SelectableCard
                    id={kelas.id}
                    title={kelas.className}
                    isSelected={kelas.id === selectedClass}
                    select={selectClass}
                />
            );
        })
    }

    render() {
        const {editable, coManager, classable, classes, onEdit, selectedClass, categories, deleteCat, deleteField, fields, grades, courses, selectedCat, selectedCourse, selectedGrade, selectedField } = this.props
        // console.log(this.props.classes);

        return (
            <div className="tw-w-full tw-grid tw-grid-cols-4 tw-gap-6 tw-min-w-900">
                {this.state.addStatus === 'category' ? <AddCategory onAddBase={(dataIds) => this.onAddData(dataIds)} cancel={this.onCancel} /> : null}
                {this.state.addStatus === 'field' ? <AddField selectedBaseId={selectedCat} onAddField={(dataIds) => this.onAddData(dataIds)} cancel={this.onCancel} /> : null}
                {this.state.addStatus === 'class' ? <AddClass title={this.props.t('className')} onAddClass={(data) => this.onAddData(data)} cancel={this.onCancel} /> : null}
                {!classable ? 
                    <BMCard
                        title={this.props.t('lessons')}
                        editable={false}
                        isSelected={selectedCourse}
                        showAdd={selectedGrade}
                        listed={courses}
                        onAdd={() => this.onAdd('course')}
                        onCancel={this.onCancel}
                        addStatus={this.state.addStatus === 'course'}
                    >
                        {this.renderCourses()}
                    </BMCard>
                    : 
                    <BMCard
                        title={this.props.t('classes')}
                        editable={!coManager}
                        editIcon={true}
                        onEdit={onEdit}
                        isSelected={selectedClass}
                        showAdd={this.state.locked ? 0 : selectedGrade}
                        listed={classes}
                        onAdd={() => this.onAdd('class')}
                        onCancel={this.onCancel}
                        addStatus={this.state.addStatus === 'class'}
                    >
                        {this.renderClasses()}
                    </BMCard>
                }
                
                <BMCard
                    title={this.props.t('grades')}
                    editable={false }
                    isSelected={selectedGrade}
                    showAdd={selectedField}
                    listed={grades}
                    onAdd={() => this.onAdd('grade')}
                    onCancel={this.onCancel}
                    addStatus={this.state.addStatus === 'grade'}
                >
                    {this.renderGrades()}
                </BMCard>
                <BMCard
                    title={this.props.t('fields')}
                    editable={editable && !this.state.locked}
                    isSelected={selectedField}
                    showAdd={selectedCat}
                    deleteItem={deleteField}
                    listed={fields}
                    onAdd={() => this.onAdd('field' )}
                    onCancel={this.onCancel}
                    addStatus={this.state.addStatus === 'field'}
                >
                    {this.renderFields()}
                </BMCard>

                <BMCard
                    title={this.props.t('bases')}
                    editable={editable}
                    isSelected={selectedCat}
                    showAdd={true}
                    deleteItem={deleteCat}
                    listed={categories}
                    onAdd={() => this.onAdd('category')}
                    onCancel={this.onCancel}
                    addStatus={this.state.addStatus === 'category'}
                >
                    {this.renderCats()}
                </BMCard>
            </div>
        );
    }

}

export default withTranslation()(BaseManager);