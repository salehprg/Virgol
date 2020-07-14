import React from "react";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import {fadeError, register} from "../actions";
import {face, person, upload, uploadDone, verified} from "../assets/icons";
import {Link} from "react-router-dom";

class SignUp extends React.Component {

    renderTextBoxes = ({ input, meta, placeholder, icon }) => {
        return (
            <div className={`w-5/6 flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
                <input
                    {...input}
                    className="w-full px-2 placeholder-grayish focus:outline-none"
                    type="text"
                    placeholder={placeholder}
                />
                {icon}
            </div>
        );
    }

    renderDocumentInputs = ({ placeholder, input: {value: omitValue, ...inputProps }, meta, ...props }) => {

        let borderColor = 'border-dark-blue';
        let iconColor = 'text-dark-blue';

        if (!meta.error) {
            borderColor = 'border-green-500'
        }

        if (meta.error && meta.submitFailed) {
            borderColor = 'border-red-500'
            iconColor = 'text-red-500'
        }

        return (
            <React.Fragment>
                <input
                    {...inputProps}
                    {...props}
                    className="hidden"
                    type="file"
                    id={placeholder}
                />
                <label className={`md:w-1/2 w-5/6 py-2 my-3 border-2 flex flex-row justify-center items-center ${borderColor}`}
                       htmlFor={placeholder}
                >
                    {meta.error ? upload("w-8 h-8 mr-2 " + iconColor) : uploadDone("w-8 h-8 mr-2 text-green-500")}
                    {placeholder}
                </label>
            </React.Fragment>
        );
    }

    onSubmit = (formValues) => {
        console.log(formValues)
        // this.props.register(formValues);
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-blueish flex flex-col justify-center items-center">
                <span
                    className={`absolute top-0 bg-red-500 hover:bg-red-700 cursor-pointer text-white text-center px-4 py-2 mt-12 transform duration-300 origin-top ${this.props.isThereError ? 'scale-y-100' : 'scale-y-0'}`}
                    onClick={() => this.props.fadeError()}
                >
                            Error message
                </span>
                <div className="md:w-650 w-screen md:h-800 md:min-h-0 min-h-screen bg-white md:rounded-lg rounded-none flex justify-center">
                    <form
                        onSubmit={this.props.handleSubmit(this.onSubmit)}
                        className="w-5/6 flex flex-col justify-between items-center"
                    >
                        <div className="w-full flex-grow flex md:flex-row-reverse flex-col">
                            <div className="md:w-1/2 w-full flex flex-col items-center">
                                <span className="text-2xl mt-4 mb-8">اطلاعات فردی</span>
                                <Field
                                    name="firstName"
                                    placeholder="نام"
                                    component={this.renderTextBoxes}
                                    icon={face("text-golden w-6 h-6")}
                                />
                                <Field
                                    name="lastName"
                                    placeholder="نام خانوادگی"
                                    component={this.renderTextBoxes}
                                    icon={person("text-golden w-6 h-6")}
                                />
                                <Field
                                    name="melliCode"
                                    placeholder="کد ملی"
                                    component={this.renderTextBoxes}
                                    icon={verified("text-golden w-6 h-6")}
                                />
                            </div>
                            <div className="md:w-1/2 w-full flex flex-col items-center">
                                <span className="text-2xl mt-4 mb-8">مدارک</span>
                                <Field
                                    name="shDocument"
                                    placeholder="کپی شناسنامه"
                                    component={this.renderDocumentInputs}
                                />
                                <Field
                                    name="document2"
                                    placeholder="مدرک نامشخص"
                                    component={this.renderDocumentInputs}
                                />
                            </div>
                        </div>
                        <button className="bg-golden hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-250 py-2 rounded-lg">ثبت نام</button>
                        <Link className="my-4 text-dark-blue hover:text-blueish transition duration-200" to="/">حساب دارم</Link>
                    </form>
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.firstName) errors.firstName = true;
    if (!formValues.lastName) errors.lastName = true;
    if (!formValues.melliCode) errors.melliCode = true;
    if (!formValues.shDocument) errors.shDocument = true;
    if (!formValues.document2) errors.document2 = true;

    return errors;
}

const mapStateToProps = (state) => {
    return { isThereError: state.error.isThereError, errorMessage: state.error.errorMessage }
}

const formWrapped = reduxForm({
    form: 'signupForm',
    validate
})(SignUp);

export default connect(mapStateToProps, {register, fadeError})(formWrapped);