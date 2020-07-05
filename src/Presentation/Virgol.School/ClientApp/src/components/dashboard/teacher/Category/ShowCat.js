import React from 'react';
import { Fields, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import {edit, loading, remove} from "../../../../assets/icons";
import {Field} from "redux-form";
import {getCatCourses, addNewCourse, deleteCatCourse} from "../../../../actions";
import Modal from "../../../Modal";

class ShowCat extends React.Component {

    state = {
        renderModal: false,
        deleteHolderId: null
    }

    componentDidMount() {
        this.props.getCatCourses(this.props.token, this.props.cat.id);
    }

    showModal = (id) => {
        this.setState({ renderModal: true, deleteHolderId: id })
    }

    onAcceptDelete = () => {
        this.props.deleteCatCourse(this.props.token, this.state.deleteHolderId, this.props.cat.id);
        this.setState({ renderModal: false, deleteHolderId: null })
    }

    onCancelDelete = () => {
        this.setState({ renderModal: false, deleteHolderId: null })
    }

    catCourses = () => {
        return this.props.courses.map(course => {
            return (
                <div className="flex flex-row-reverse items-center justify-center">
                    <span className="my-2 mx-2" key={course.id}>{course.displayname}</span>
                    <div onClick={() => this.showModal(course.id)}>
                        {this.props.isThereLoading && this.props.loadingComponent === course.id ?
                            loading("w-6 h-6 text-blueish")
                            :
                            remove("w-6 h-6 transition-all cursor-pointer duration-200 hover:text-red-500")
                        }
                    </div>
                </div>
            );
        });
    }

    renderFormInputs = ({ input, meta, placeholder }) => {
        return (
            <div className={`flex px-1 flex-row py-3 my-3 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
                <input
                    {...input}
                    dir="rtl"
                    className="w-full px-2 placeholder-grayish focus:outline-none"
                    type="text"
                    placeholder={placeholder}
                />
            </div>
        );
    }

    onAddCourse = (formValues) => {
        formValues = {...formValues, categoryId: this.props.cat.id}
        this.props.addNewCourse(this.props.token, formValues);
    }

    renderContent = () => {
        if (this.props.isThereLoading && this.props.loadingComponent === 'getCatCourse') return loading("w-10 h-10 text-blueish")
        return (
            <div className="w-full flex flex-row">
                {this.state.renderModal ? <Modal accept={this.onAcceptDelete} cancel={this.onCancelDelete} /> : null}
                <div className="w-1/3 flex flex-col items-center">
                    <span className="text-2xl text-blueish">افزودن درس</span>
                    <form className={`w-3/4 flex flex-col transition-height`} onSubmit={this.props.handleSubmit(this.onAddCourse)}>
                        <Field
                            name="shortname"
                            placeholder="نام"
                            component={this.renderFormInputs}
                        />
                        <Field
                            name="teacherName"
                            placeholder="نام معلم"
                            component={this.renderFormInputs}
                        />
                        <button className="bg-golden flex justify-center items-center my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg">
                            {this.props.isThereLoading && this.props.loadingComponent === 'addNewCourse' ? loading("w-6 h-6 text-dark-green") : 'افزودن'}
                        </button>
                    </form>
                </div>
                <div className="w-1/3 flex flex-col items-center">
                    <span className="text-2xl text-blueish mb-4">دروس</span>
                    {this.catCourses()}
                </div>
                <div className="w-1/3 flex flex-col items-center">
                    <div className="flex flex-row justify-center items-center">
                        {/*{edit("w-6 h-6 hover:text-blueish cursor-pointer")}*/}
                        <span className="text-2xl text-blueish mx-2">
                        نام مقطع
                        </span>
                    </div>
                    <span className="mb-8">{this.props.cat.name}</span>
                    <button
                        onClick={this.props.exit}
                        className="px-6 py-1 text-xl text-red-500 border-2 border-red-500 transition-all duration-200 hover:text-white hover:bg-red-500">خروج</button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="w-full flex flex-col justify-center items-center">
                {this.renderContent()}
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.shortname) errors.shortname = true;

    return errors;
}

const formWrapped = reduxForm({
    form: 'addCourseToCat',
    validate
})(ShowCat);

const mapStateToProps = (state) => {
    return {
        courses: state.adminData.catInfo,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getCatCourses, addNewCourse, deleteCatCourse })(formWrapped);