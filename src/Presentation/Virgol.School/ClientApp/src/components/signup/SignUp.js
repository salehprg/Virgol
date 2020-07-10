import React from "react";
import {connect} from "react-redux";
import {fadeError, register} from "../../actions";
import { circle, upload, uploadDone } from "../../assets/icons";
import PersonalForm from "./PersonalForm";
import EducationalForm from "./EducationalForm";
import AccountalForm from "./AccountalForm";
import {Link} from "react-router-dom";

class SignUp extends React.Component {

    state = {
        page: 1,
        selectedCategory: null
    }

    nextPage = () => {
        this.setState({ page: this.state.page + 1 })
    }

    previousPage = () => {
        this.setState({ page: this.state.page - 1 })
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
        formValues.categoryId = this.state.selectedCategory.value;
        console.log(formValues)
        // this.props.register(formValues);
    }

    handleSelectedCategory = selectedCategory => {
        this.setState({ selectedCategory });
    };

    renderInfoPanel = () => {
        if (this.state.page === 1) {
            return (
                <PersonalForm
                    onSubmit={this.nextPage}
                />
            );
        } else if (this.state.page === 2) {
            return (
                <EducationalForm
                    select={this.handleSelectedCategory}
                    previousPage={this.previousPage}
                    onSubmit = {this.nextPage}
                />
            );
        } else {
            return (
                <AccountalForm
                    previousPage={this.previousPage}
                    onSubmit={this.onSubmit}
                />
            );
        }
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
                <div className="md:w-650 w-screen md:h-800 md:min-h-0 min-h-screen bg-white md:rounded-lg rounded-none flex flex-col justify-start">
                   <div className="w-full py-4 flex flex-row-reverse justify-evenly">
                        <div className="flex md:flex-row-reverse flex-col justify-center items-center">
                            {circle(`w-6 h-6 ${this.state.page === 1 ? 'text-blueish' : 'text-grayish'}`)}
                            <span className={`font-vb mx-2 ${this.state.page === 1 ? 'text-blueish' : 'text-grayish'}`}>اطلاعات فردی</span>
                        </div>
                       <div className="flex md:flex-row-reverse flex-col justify-center items-center">
                           {circle(`w-6 h-6 ${this.state.page === 2 ? 'text-blueish' : 'text-grayish'}`)}
                           <span className={`font-vb mx-2 ${this.state.page === 2 ? 'text-blueish' : 'text-grayish'}`}>اطلاعات تحصیلی</span>
                       </div>
                       <div className="flex md:flex-row-reverse flex-col justify-center items-center">
                           {circle(`w-6 h-6 ${this.state.page === 3 ? 'text-blueish' : 'text-grayish'}`)}
                           <span className={`font-vb mx-2 ${this.state.page === 3 ? 'text-blueish' : 'text-grayish'}`}>اطلاعات کاربری</span>
                       </div>
                   </div>
                    {this.renderInfoPanel()}
                </div>
                <Link className="my-4 py-1 px-4 border-2 border-white text-white" to="/">من حساب کاربری دارم</Link>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return { isThereError: state.error.isThereError, errorMessage: state.error.errorMessage }
}

export default connect(mapStateToProps, {register, fadeError})(SignUp);