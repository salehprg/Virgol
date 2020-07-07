import React from "react";
import ReactTooltip from "react-tooltip";
import { getAllCategory, addNewCategory, deleteCategory, fadeError, wipeCatInfo } from "../../../../actions";
import {book, edit, remove, loading, errorOutline, add, clear} from "../../../../assets/icons";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import lms from "../../../../apis/lms";
import Modal from "../../../Modal";
import ShowCat from "./ShowCat";
import {Link} from "react-router-dom";

class Base extends React.Component {

    state = {
        query: '',
        renderModal: false,
    }

    componentDidMount() {
        this.props.getAllCategory(this.props.auth.token);
    }

    renderCards = () => {

        const { categories } = this.props;

        if (categories !== null) {

            const cards = categories.map((category) => {
                if (category.name.includes(this.state.query)) {
                    return (
                        <div key={category.id} className="w-5/6 max-w-300 sm:ml-12 ml-0 mb-12 py-4 bg-white flex flex-col items-center">
                            <span className="text-xl text-blueish font-vb">{category.name}</span>
                            <span className="my-4" dir="rtl">تعداد دروس: {category.courseCount}</span>
                            <Link className="w-5/6 py-2 bg-dark-blue text-center text-white rounded-full" to={`/cat/${category.id}`}>ویرایش</Link>
                        </div>
                    );
                }
            })

            return cards;

        } else {
            return loading("w-16 h-16 text-blueish")
        }

    }

    renderAddCatFormFields = ({ input, meta, placeholder }) => {
        return (
            <input
                {...input}
                dir="rtl"
                className={`w-1/2 px-2 py-2  placeholder-grayish focus:outline-none focus:shadow-outline border-2  ${meta.error && meta.touched ? 'border-red-600' : 'border-white'}`}
                type="text"
                placeholder={placeholder}
            />
        );
    }

    renderAddCatModal = (id) => {
        this.setState({ renderModal: true })
    }

    onAddCategory = (formValues) => {
        this.props.addNewCategory(this.props.auth.token, formValues);
        this.setState({ renderModal: false })
    }

    onCancelDelete = () => {
        this.setState({ renderModal: false, deleteHolderId: null })
    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center md:justify-end">
                <ReactTooltip />
                {this.state.renderModal ?
                    <Modal cancel={this.onCancelDelete}>
                        <div onClick={(e) => e.stopPropagation()} className="md:w-1/3 w-5/6 py-16 px-4 relative flex flex-col items-end addCat bg-cover font-vb">
                            <div onClick={this.onCancelDelete} className="absolute top-0">
                                {clear("w-6 h-8 text-white cursor-pointer")}
                            </div>
                            <span className="text-dark-green my-4 text-2xl">اضافه کردن مقطع</span>
                            <form onSubmit={this.props.handleSubmit(this.onAddCategory)} className="w-full flex flex-row-reverse justify-start items-center" >
                                <Field
                                    name="name"
                                    placeholder="نام مقطع"
                                    component={this.renderAddCatFormFields}
                                />
                                <button type="submit" className="focus:outline-none">
                                    {add("w-8 h-8 mx-2 text-dark-green")}
                                </button>
                            </form>
                        </div>
                    </Modal>
                : null}
                <div className="w-full min-h-screen md:mb-12 mb-0 md:order-12 order-1 flex flex-col items-end">
                    <div className="w-full flex flex-row-reverse justify-start items-center">
                        <input
                            value={this.state.query}
                            onChange={(e) => this.setState({ query: e.target.value })}
                            className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="جست و جو"
                        />
                        <button
                            onClick={this.renderAddCatModal}
                            className="mx-8 px-8 py-2 rounded-lg border-2 border-blueish font-vb text-blueish focus:outline-none focus:shadow-outline hover:bg-blueish hover:text-white">
                            افزودن مقطع
                        </button>
                    </div>
                    <div className="w-full mt-8 flex flex-row-reverse flex-wrap justify-center">
                        {this.renderCards()}
                    </div>
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.name) errors.name = true;

    return errors;
}

const formWrapped = reduxForm({
    form: 'addBase',
    validate
})(Base);

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        categories: state.adminData.categories,
        categoryCourses: state.adminData.categoryCourses,
        isThereError: state.error.isThereError,
        errorMessage: state.error.errorMessage,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getAllCategory, addNewCategory, deleteCategory, fadeError, wipeCatInfo })(formWrapped);