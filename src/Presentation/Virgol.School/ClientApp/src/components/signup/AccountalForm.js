import React from 'react'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import {face, loading, person, phone} from "../../assets/icons";

const renderTextBoxes = ({ input, meta, placeholder, icon, dir }) => {
    return (
        <div className={`w-5/6 mx-2 max-w-300o flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
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

const PersonalForm = props => {

    const { handleSubmit } = props
    return (
        <form className="w-full h-full flex flex-col items-center" onSubmit={handleSubmit}>
            <div className="w-full m-auto flex flex-row-reverse flex-wrap justify-center items-center">
                <Field
                    name="latinFirstName"
                    placeholder="نام لاتین"
                    component={renderTextBoxes}
                    icon={face("text-golden w-6 h-6")}
                    dir="ltr"
                />
                <Field
                    name="latinLastName"
                    placeholder="نام خانوادگی لاتین"
                    component={renderTextBoxes}
                    icon={person("text-golden w-6 h-6")}
                    dir="ltr"
                />
                <Field
                    name="phoneNumber"
                    placeholder="شماره همراه"
                    component={renderTextBoxes}
                    icon={phone("text-golden w-6 h-6")}
                    dir="ltr"
                />
                <Field
                    name="fatherPhoneNumber"
                    placeholder="شماره همراه پدر"
                    component={renderTextBoxes}
                    icon={phone("text-golden w-6 h-6")}
                    dir="ltr"
                />
            </div>
            <div className="my-8 w-full flex md:flex-row flex-col justify-center items-center">
                <button type="submit" className="md:px-16 px-32 md:my-0 my-2  mx-1 bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green py-2 rounded-lg focus:outline-none focus:shadow-outline">
                    {props.isThereLoading && props.loadingComponent === 'register' ? loading("w-8 h-8 text-dark-green") : 'ثبت نام'}
                </button>
                <button onClick={() => props.previousPage()} type="button" className="md:px-16 px-32 md:my-0 my-2  mx-1 bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green py-2 rounded-lg focus:outline-none focus:shadow-outline">
                    قبلی
                </button>
            </div>
        </form>
    )
}

const checkEnglish = (value) => {
    return /^[a-zA-Z]+$/.test(value);
}

const checkPhoneNumber = (value) => {
    return /^(\+98|0098|98|0)?9\d{9}$/.test(value);
}

const validate = (formValues) => {
    const errors = {}

    if (!checkEnglish(formValues.latinFirstName) || !formValues.latinFirstName) {
        errors.latinFirstName = true;
    }
    if (!checkEnglish(formValues.latinLastName) || !formValues.latinLastName) {
        errors.latinLastName = true;
    }
    if (!checkPhoneNumber(formValues.phoneNumber)) {
        errors.phoneNumber = true;
    }
    if (!checkPhoneNumber(formValues.fatherPhoneNumber)) {
        errors.fatherPhoneNumber = true;
    }

    return errors;
}

const formWrapped = reduxForm({
    form: 'signup',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate
})(PersonalForm);

const mapStateToProps = state => {
    return {
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps)(formWrapped);