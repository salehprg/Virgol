import React from "react";
import ReactTooltip from "react-tooltip";
import { getAllCategory, addNewCategory, deleteCategory, fadeError, wipeCatInfo } from "../../../../actions";
import {book, edit, remove, loading, errorOutline} from "../../../../assets/icons";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import lms from "../../../../apis/lms";
import Modal from "../../../Modal";
import ShowCat from "./ShowCat";

class Base extends React.Component {

    state = {
        renderState: 'allBases',
        shownCatId: null,
        courses: [],
        loading: null,
        query: '',
        renderModal: false,
        deleteHolderId: null
    }

    componentDidMount() {
        this.props.getAllCategory(this.props.auth.token);
    }

    getCourses = async (id) => {

        if (this.state.shownCatId !== id) {
            try {
                this.setState({ loading: id })
                const response = await lms.get(`/api/Admin/GetAllCourseInCat?CategoryId=${id}`, {
                    headers: {
                        authorization: `Bearer ${this.props.auth.token}`
                    }
                });

                this.setState({ loading: null, shownCatId: id, courses: response.data })
            } catch (e) {

            }
        } else {
            this.setState({ shownCatId: null, courses: [] })
        }

    }

    catCourses = () => {

        if (this.state.shownCatId !== null) {
            return this.state.courses.map(course => {
                return (
                    <span key={course.id}>{course.displayname}</span>
                );
            });
        }
    }

    renderBases = () => {

        const { categories } = this.props;

        if (categories !== null) {
            const bases = categories.map((category) => {
                if (category.name.includes(this.state.query)) {
                    return (
                        <tr key={category.id}>
                            <td className="py-2">{category.name}</td>
                            <td className="flex flex-col items-center py-2">
                                <div className="flex flex-row justify-center">
                                    <div onClick={() => this.showModal(category.id)} data-tip="حذف">
                                        {this.props.loadingComponent !== category.id ?
                                            remove("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")
                                            :
                                            loading("w-8 h-8 text-blueish")
                                        }
                                    </div>
                                    <div onClick={() => this.renderCatInfo(category)} data-tip="ویرایش">
                                        {edit("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")}
                                    </div>
                                    {/*<div onClick={() => this.getCourses(category.id)} data-tip="نمایش دروس">*/}
                                    {/*    {this.state.loading !== category.id ?*/}
                                    {/*        book("w-8 h-8 mx-2 cursor-pointer transition-all duration-200 hover:text-blueish")*/}
                                    {/*        :*/}
                                    {/*        loading("w-8 h-8 text-blueish")*/}
                                    {/*    }*/}
                                    {/*</div>*/}
                                </div>
                                <div className={`w-full flex flex-col ${this.state.shownCatId === category.id ? 'block' : 'hidden'}`}>
                                    {this.catCourses()}
                                </div>
                            </td>
                        </tr>
                    );
                }
            })

            if (!bases[0]) {
                return (
                    <div className="w-full flex-grow flex flex-col justify-center items-center">
                        {errorOutline("w-24 h-24 text-blueish")}
                        <span className="text-xl mt-4 text-dark-blue">هیچ مقطعی وجود ندارد</span>
                    </div>
                );
            } else {
                return (
                    <table dir="rtl" className="table-auto w-5/6 text-center">
                        <thead>
                        <tr className="border-b-2 border-blueish">
                            <th className="px-8 py-2">نام مقطع</th>
                            <th className="px-8"> </th>
                        </tr>
                        </thead>
                        <tbody>
                            {bases}
                        </tbody>
                    </table>
                );
            }
        }

        return loading("w-16 h-16 text-blueish")

    }

    renderCatInfo = (cat) => {
        ReactTooltip.hide();
        this.setState({ renderState: cat })
    }

    renderFormInputs = ({ input, meta, placeholder }) => {
        return (
            <div className={`flex px-1 flex-row py-3 my-6 items-center border ${meta.error && meta.touched ? 'border-red-600' : 'border-golden'}`}>
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

    renderAddButton = () => {
        if (this.props.isThereLoading && this.props.loadingComponent === 'addNewCategory') {
            return (
                <button className="bg-golden flex flex-col items-center my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg focus:outline-none">
                    {loading("w-8 h-8 text-dark-green")}
                </button>
            );
        }

        if (this.props.isThereError && this.props.errorMessage === 'add new category error') {
            setTimeout(() => {
                this.props.fadeError();
            }, 1000);
            return (
                <button className="bg-red-500 my-6 transition-all duration-200 font-vb text-xl text-white w-full py-2 rounded-lg focus:outline-none">
                    خطا
                </button>
            );
        }

        return (
            <button className="bg-golden my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg focus:outline-none">
                افزودن
            </button>
        );
    }

    onAddBase = (formValues) => {
        this.props.addNewCategory(this.props.auth.token, { name: formValues.baseName });
    }

    showModal = (id) => {
        this.setState({ renderModal: true, deleteHolderId: id })
    }

    onAcceptDelete = () => {
        this.props.deleteCategory(this.props.auth.token, this.state.deleteHolderId);
        this.setState({ renderModal: false, deleteHolderId: null })
    }

    onCancelDelete = () => {
        this.setState({ renderModal: false, deleteHolderId: null })
    }

    renderContent = () => {
        if (this.state.renderState === 'allBases') {
            return this.renderBases();
        } else {
            return (
                <ShowCat
                    cat={this.state.renderState}
                    token={this.props.auth.token}
                    exit={this.exitCat}
                />
            );
        }
    }

    exitCat = () => {
        this.setState({ renderState: 'allBases' })
    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center md:justify-end">
                <ReactTooltip />
                {this.state.renderModal ? <Modal accept={this.onAcceptDelete} cancel={this.onCancelDelete} /> : null}
                <div className="md:w-1/4 w-5/6 md:order-1 order-2 flex flex-col items-end">
                    <input
                        type="text"
                        className="md:w-1/3 w-1/2 invisible mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full flex flex-col py-2 md:mx-4 mx-0 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">افزودن مقطع</span>
                        <form className="w-3/4 flex flex-col text-center" onSubmit={this.props.handleSubmit(this.onAddBase)}>
                            <Field
                                name="baseName"
                                placeholder="نام مقطع"
                                component={this.renderFormInputs}
                            />
                            {this.renderAddButton()}
                        </form>
                    </div>
                </div>
                <div className="md:w-2/3 w-5/6 max-h-screen md:mb-12 mb-0 md:order-12 order-1 flex flex-col items-end">
                    <input
                        value={this.state.query}
                        onChange={(e) => this.setState({ query: e.target.value })}
                        className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full min-h-75 flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">{this.state.renderState === 'allBases' ? 'مقاطع تحصیلی' : 'اطلاعات مقطع'}</span>
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }

}

const validate = (formValues) => {
    const errors = {}

    if (!formValues.baseName) errors.baseName = true;

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