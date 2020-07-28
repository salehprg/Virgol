import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import {school} from "../../assets/icons";
import Select from "react-select";

const renderTextBoxes = ({ input, meta, placeholder, icon, dir }) => {
    return (
        <div className={`w-5/6 mx-2 max-w-300 flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
            <span className={`bg-red-600 text-white text-sm px-3 py-1 ${meta.touched && meta.error ? 'block' : 'hidden'}`}>نامعتبر</span>
            <input
                {...input}
                className="w-full px-2 placeholder-grayish focus:outline-none"
                type="text"
                placeholder={placeholder}
                dir={dir}
            />
            {icon}
        </div>
    );
}

const EducationalForm = props => {

    const renderSelectableCategories = () => {
        if (!props.cats) return
        return props.cats.map(cat => {
            return { value: cat.id, label: cat.name }
        })
    }

    const handleSelectedCategory = selectedCategory => {
        props.select(selectedCategory);
    };

    const { handleSubmit, previousPage } = props
    return (
        <form className="w-full h-full flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="w-full m-auto flex flex-row-reverse flex-wrap justify-center items-center">
                <Field
                    name="schoolName"
                    placeholder="نام مدرسه"
                    component={renderTextBoxes}
                    icon={school("text-golden w-6 h-6")}
                    dir="rtl"
                />
                <Select
                    className="w-5/6 max-w-300 mx-3"
                    defaultValue={props.selected}
                    onChange={handleSelectedCategory}
                    options={renderSelectableCategories()}
                    isSearchable
                    placeholder="مقطع تحصیلی"
                />
            </div>
            <div className="my-8 w-full flex md:flex-row flex-col justify-center items-center">
                <button type="submit" className="md:px-16 px-32 md:my-0 my-2 mx-1 bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green py-2 rounded-lg focus:outline-none focus:shadow-outline">
                    بعدی
                </button>
                <button onClick={() => previousPage()} type="button" className="md:px-16 px-32 md:my-0 my-2 mx-1 bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green py-2 rounded-lg focus:outline-none focus:shadow-outline">
                    قبلی
                </button>
            </div>
        </form>
    )
}

const checkPersian = (value) => {
    return /^[)(پچجحخهعغآ؟.،آفقثصضشسیبلاتنمکگوئدذرزطظژ!!ؤإأءًٌٍَُِّ\s]+$/u.test(value)
}

const validate = (formValues) => {
    const errors = {}

    if (!checkPersian(formValues.schoolName)) errors.schoolName = true;

    return errors;
}

const formWrapped = reduxForm({
    form: 'signup',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(EducationalForm);

const mapStateToProps = state => {
    return {}
}

export default connect(mapStateToProps)(formWrapped);