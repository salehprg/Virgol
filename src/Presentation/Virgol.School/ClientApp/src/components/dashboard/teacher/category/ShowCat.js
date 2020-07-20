import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { getCatCourses, editCategory, addCoursesToCat, wipeCatInfo, deleteCategory, getAllCourses, editCourse, deleteCourseFromCat } from "../../../../actions";
import {add, loading, person} from "../../../../assets/icons";
import history from "../../../../history";
import Modal from "../../../Modal";

class ShowCat extends React.Component {

    state = {
        name: '',
        renderDeleteModal: false,
        renderAddCourseModal: false,
        renderDeleteCourseModal: false,
        deleteCourseIdHolder: null,
        selectedCourses: null,
        delCatLoading: false,
        addCourseLoading: false,
        delCourseLoading: false
    }

    componentDidMount() {
        this.props.wipeCatInfo()
        this.props.getAllCourses(this.props.auth.token);
        this.props.getCatCourses(this.props.auth.token, this.props.match.params.id);
        this.setState({ name: this.props.category.name })
    }

    componentWillUnmount() {
        this.props.wipeCatInfo()
    }

    handleChange = (name) => {
        this.setState({ name: name })
    }

    showConfirm = (id) => {
        this.setState({ renderDeleteCourseModal: true, deleteCourseIdHolder: id })
    }

    renderCards = () => {
        return this.props.courses.map(course => {
            return (
                <div key={course.id} className="w-5/6 max-w-300 sm:ml-12 ml-0 mb-12 py-4 bg-white flex flex-col items-center">
                    <span className="text-xl text-blueish font-vb">{course.shortname}</span>
                    <div className="w-full my-4 flex flex-row justify-center items-center">
                        <span>{course.teacherName}</span>
                        {person("w-8 h-8")}
                    </div>
                    <button onClick={() => this.showConfirm(course.id)} className="px-4 py-1 text-red-600 rounded-lg font-vb border-2 border-red-600">حذف</button>
                </div>
            );
        })
    }

    deleteCat = async () => {
        this.setState({delCatLoading: true})
        const values = {id: parseInt(this.props.match.params.id)}
        await this.props.deleteCategory(this.props.auth.token, values);
        this.setState({ delCatLoading: false, renderDeleteModal: false })
    }

    deleteCourse = async () => {
        this.setState({ delCourseLoading: true })
        await this.props.deleteCourseFromCat(this.props.auth.token, this.state.deleteCourseIdHolder, parseInt(this.props.match.params.id));
        this.setState({renderDeleteCourseModal: false, deleteCourseIdHolder: null, delCourseLoading: false})
    }

    onCancelDelete = () => {
        this.setState({ renderDeleteModal: false })
    }

    onCancelAddCourse = () => {
        this.setState({ renderAddCourseModal: false })
    }

    addCourse = () => {
        this.setState({ renderAddCourseModal: true })
    }

    renderSelectableCourses = () => {
        let options = []

        this.props.allCourses.map(course => {
            if (!this.props.courses.some(e => e.id === course.id)) {
                options.push({
                    value: course.id,
                    label: course.shortname
                });
            }
        })

        return options;
    }

    handleSelectCourses = selectedCourses => {
        this.setState({ selectedCourses });
    };

    addSelectedCourses = async () => {

        const adds = []
        this.state.selectedCourses.map(course => {
            adds.push(course.value)
        })

        this.setState({ addCourseLoading: true })
        await this.props.addCoursesToCat(this.props.auth.token, adds, this.props.match.params.id);
        this.setState({renderAddCourseModal: false, addCourseLoading: false, selectedCourses: null})
    }

    save = async () => {
        const values = {id: parseInt(this.props.match.params.id), name: this.state.name}
        this.props.editCategory(this.props.auth.token, values);
    }

    cancel = () => {
        this.props.wipeCatInfo();
        history.push("/a/dashboard");
    }

    onCancelDeleteCourse = () => {
        this.setState({ renderDeleteCourseModal: false, deleteCourseIdHolder: null })
    }

    render() {
        if (!this.props.courses || !this.props.allCourses) {
            return (
                <div className="w-screen h-screen flex justify-center items-center">
                    {loading("w-24 h-24 text-blueish")}
                </div>
            );
        }

        return (
            <div className="w-screen min-h-screen bg-light-white flex flex-col justify-center items-center">
                {this.state.renderDeleteModal ?
                    <Modal cancel={this.onCancelDelete}>
                        <div onClick={(e) => e.stopPropagation()} className="md:w-1/3 w-5/6 p-8 flex flex-col items-center bg-white font-vb">
                            <span className="py-2 text-center">آیا از حذف کامل این مقطع مطمئن هستید؟</span>
                            <div className="flex md:flex-row flex-col">
                                <button
                                    onClick={this.onCancelDelete}
                                    className="px-8 py-2 mx-2 my-2 text-red-600 border-2 border-red-600 rounded-lg focus:outline-none"
                                >خیر</button>
                                <button
                                    onClick={() => this.deleteCat()}
                                    className="px-8 py-2 mx-2 my-2 text-white bg-red-600 rounded-lg focus:outline-none"
                                >بله</button>
                            </div>
                        </div>
                    </Modal>
                    : null}
                {this.state.renderDeleteCourseModal ?
                    <Modal cancel={this.onCancelDeleteCourse}>
                        <div onClick={(e) => e.stopPropagation()} className="md:w-1/3 w-5/6 p-8 flex flex-col items-center bg-white font-vb">
                            <span className="py-2 text-center">آیا از حذف این درس از این مقطع مطمئن هستید؟</span>
                            <div className="flex md:flex-row flex-col">
                                <button
                                    onClick={this.onCancelDeleteCourse}
                                    className="px-8 py-2 mx-2 my-2 text-red-600 border-2 border-red-600 rounded-lg focus:outline-none"
                                >خیر</button>
                                <button
                                    onClick={() => this.deleteCourse()}
                                    className="px-8 py-2 mx-2 my-2 text-white bg-red-600 rounded-lg focus:outline-none"
                                >
                                    {this.state.delCourseLoading ? loading("w-5 text-white") : 'بله'}
                                </button>
                            </div>
                        </div>
                    </Modal>
                    : null}
                {this.state.renderAddCourseModal ?
                    <Modal cancel={this.onCancelAddCourse}>
                        <div onClick={(e) => e.stopPropagation()} className="addCourse bg-center md:w-2/3 w-5/6 px-8 py-24 flex flex-col items-end font-vb">
                            <span className="text-xl text-center my-4 text-dark-green">دروس مورد نظر خود را از لیست زیر انتخاب نمایید</span>
                            <div className="md:w-2/3 w-full flex md:flex-row-reverse flex-col md:items-start items-center">
                                <Select
                                    className="w-5/6 mx-3"
                                    value={this.state.selectedCourses}
                                    onChange={this.handleSelectCourses}
                                    options={this.renderSelectableCourses()}
                                    isMulti
                                    isSearchable
                                    placeholder="دروس"
                                />
                                <button onClick={this.addSelectedCourses} className="px-8 py-2 md:my-0 my-4 bg-blueish text-white">
                                    {this.state.addCourseLoading ? loading('w-6 text-white') : 'ذخیره'}
                                </button>
                            </div>
                        </div>
                    </Modal>
                    : null}
                <span className="text-4xl font-vb text-dark-green my-8">اطلاعات مقطع</span>
                <div className="md:w-2/3 w-11/12 flex md:flex-row flex-col-reverse justify-around">
                    <div className="flex flex-row justify-center items-center">
                        {this.state.delCatLoading ?
                            loading("w-12 text-red-600")
                            :
                            <button
                                onClick={() => this.setState({ renderDeleteModal: true })}
                                className="px-6 py-2 border-2 font-vb mx-4 border-red-600 text-red-600"
                            >
                                حذف مقطع
                            </button>}
                        <button
                            onClick={this.addCourse}
                            className="px-6 py-2 border-2 font-vb mx-4 border-green-600 text-green-600"
                        >
                            افزودن درس
                        </button>
                    </div>
                    <div className="md:my-0 my-4 flex flex-row-reverse items-center">
                        <span className="mx-4 text-2xl text-dark-green">نام مقطع</span>
                        <input
                            className="my-2 px-2 py-1 text-xl focus:outline-none focus:shadow-outline"
                            dir="rtl"
                            value={this.state.name}
                            onChange={(e => this.handleChange(e.target.value))}
                        />
                    </div>
                </div>
                <div className="w-5/6 flex mt-8 flex-row-reverse flex-wrap justify-center">
                    {this.renderCards()}
                </div>
                <div className="flex flex-row w-full justify-center items-center">
                    <button onClick={this.save} className="px-12 py-2 mx-1 rounded-lg bg-blueish text-xl font-vb text-white focus:outline-none focus:shadow-outline">
                        {this.props.isThereLoading && this.props.loadingComponent === 'editCat' ?
                            loading("w-6 h-6 text-white")
                            :
                            "ذخیره"
                        }
                    </button>
                    <button
                        onClick={this.cancel}
                        className="px-12 py-2 mx-2 rounded-lg border-2 border-blueish text-xl font-vb text-blueish focus:outline-none focus:shadow-outline">لغو</button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state, myProps) => {
    return {
        auth: state.auth.userInfo,
        category: state.adminData.categories.find(el => el.id === parseInt(myProps.match.params.id)),
        courses: state.adminData.catInfo,
        allCourses: state.adminData.courses,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { getCatCourses, editCategory, addCoursesToCat,wipeCatInfo, deleteCategory, getAllCourses, editCourse, deleteCourseFromCat })(ShowCat);