import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {account, face, locationIcon, person, school, verified} from "../../assets/icons";
import Select from "react-select";

const EducationalForm = props => {

    const renderTextBoxes = ({ input, meta, placeholder, icon, dir }) => {
        return (
            <div className={`w-5/6 mx-2 max-w-300o flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
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

    const renderSelectableCategories = () => {
        return [
            { value: '1', label: 'اول دبستان' },
            { value: '2', label: 'دوم دبستان' },
            { value: '3', label: 'سوم دبستان' },
            { value: '4', label: 'چهارم دبستان' },
            { value: '5', label: 'پنجم دبستان' },
            { value: '6', label: 'ششم دبستان' },
            { value: '7', label: 'هفتم' },
            { value: '8', label: 'هشتم' },
            { value: '9', label: 'نهم' },
            { value: '10', label: 'دهم' },
            { value: '11', label: 'یازدهم' },
            { value: '12', label: 'دوازدهم' },
        ]
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
                    className="w-5/6 max-w-300o mx-3"
                    value={props.selectedCategory}
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

const validate = (formValues) => {
    const errors = {}

    if (!formValues.schoolName) errors.schoolName = true;

    return errors;
}

export default reduxForm({
    form: 'signup',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(EducationalForm)