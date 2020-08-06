import React from "react";
import BMCard from "./BMCard";
import SelectableCard from "./SelectableCard";
import {loading} from "../../../assets/icons";
import AddCategory from "./AddCategory";
import AddField from "./AddField";

class BaseManager extends React.Component {

    state = { addStatus: null }

    onAdd = (addStatus) => {
        this.setState({ addStatus })
        this.props.onAdd(addStatus);
    }

    onCancel = () => {
        this.setState({ addStatus: null })
    }

    renderCats = () => {
        const { selectCat, selectedCat, categories, loadingCats } = this.props
        if (loadingCats) return <div className="centerize">{loading('w-8 text-grayish')}</div>
        if (categories.length === 0) return <p className="text-grayish text-center centerize w-full">هیچ مقطعی وجود ندارد</p>
        return categories.map(cat => {
                return (
                    <SelectableCard
                        id={cat.id}
                        title={cat.baseName}
                        isSelected={cat.id === selectedCat}
                        select={selectCat}
                    />
                );
            })
    }

    renderFields = () => {
        const {selectedCat , selectField, selectedField, fields, loadingFields } = this.props
        if (loadingFields) return <div className="centerize">{loading('w-8 text-grayish')}</div>
        if (!selectedCat) return <p className="text-grayish text-center centerize w-full">یک مقطع انتخاب کنید</p>
        if (fields.length === 0) return <p className="text-grayish text-center">این مقطع رشته ندارد</p>
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
        if (loadingGrades) return <div className="centerize">{loading('w-8 text-grayish')}</div>
        if (!selectedField) return <p className="text-grayish text-center centerize w-full">یک رشته انتخاب کنید</p>
        if (grades.length === 0) return <p className="text-grayish text-center">این رشته پایه ندارد</p>
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
        if (loadingCourses) return <div className="centerize">{loading('w-8 text-grayish')}</div>
        if (!selectedGrade) return <p className="text-grayish text-center centerize w-full">یک پایه انتخاب کنید</p>
        if (courses.length === 0) return <p className="text-grayish text-center">این رشته پایه ندارد</p>
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

    render() {
        const { editable, categories, deleteCat, deleteField, fields, grades, courses, selectedCat, selectedCourse, selectedGrade, selectedField } = this.props
        return (
            <div className="w-full grid grid-cols-4 gap-6 min-w-900">
                {this.state.addStatus === 'category' ? <AddCategory cancel={this.onCancel} /> : null}
                {this.state.addStatus === 'field' ? <AddField cancel={this.onCancel} /> : null}
                <BMCard
                    title="دروس"
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
                <BMCard
                    title="پایه ها"
                    editable={false}
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
                    title="رشته ها"
                    editable={editable}
                    isSelected={selectedField}
                    showAdd={selectedCat}
                    deleteItem={deleteField}
                    listed={fields}
                    onAdd={() => this.onAdd('field')}
                    onCancel={this.onCancel}
                    addStatus={this.state.addStatus === 'field'}
                >
                    {this.renderFields()}
                </BMCard>
                <BMCard
                    title="مقاطع"
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

export default BaseManager;