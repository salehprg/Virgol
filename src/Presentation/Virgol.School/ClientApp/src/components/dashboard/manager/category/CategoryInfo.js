import React from 'react';
import { connect } from 'react-redux';
import { getCatCourses, getAllCourses, deleteCourseFromCat, editCategory, deleteCategory } from "../../../../_actions/managerActions";
import Loading from "../../../Loading";
import CourseCard from "./CourseCard";
import {chart, edit, plus} from "../../../../assets/icons";
import AddCourseModal from "./AddCourseModal";
import history from "../../../../history";
import Upload from "../../upload/Upload";
import protectedManager from "../../../protectedRoutes/protectedManager";
import ConfirmDelete from "../../../modal/ConfirmDelete";

class CategoryInfo extends React.Component {

    state = { loading: false, confirm: null, showAddCourseModal: false, newName: '', changeName: false, showDeleteCat: false }

    async componentDidMount() {
            // this.setState({loading: true})
            // await this.props.getCatCourses(this.props.token, parseInt(this.props.match.params.id));
            // await this.props.getAllCourses(this.props.token);
            // this.setState({loading: false})
    }


    renderCourses = () => {
        return this.props.courses.map((course, i) => {
            return (
                <CourseCard
                    key={course.id}
                    course={course}
                    showConfirm={(id) => this.setState({ confirm: id })}
                    confirm={this.state.confirm}
                    delete={this.deleteCourse}
                    code={i}
                />
            );
        })
    }

    deleteCatModal = () => {
        this.setState({ showDeleteCat: true })
    }

    onCancelDeleteCat = () => {
        this.setState({ showDeleteCat: false })
    }

    deleteCourse = (id) => {
        this.setState({ confirm: null })
        this.props.deleteCourseFromCat(this.props.token, id)
    }

    deleteCat = () => {
        history.push('/m/categories')
        this.props.deleteCategory(this.props.token, parseInt(this.props.match.params.id))
    }

    changeName = (name) => {
        this.setState({ newName: name })
    }

    saveName = () => {
        if (this.state.newName !== '') {
            this.setState({ changeName: false })
            this.props.editCategory(this.props.token, { id: parseInt(this.props.match.params.id), name: this.state.newName})
        }
    }

    render() {
        if (this.state.loading) return <Loading />
        if (!this.props.courses) return null;

        return (
            <div onClick={() => this.setState({ confirm: null, changeName: false })} className="w-screen min-h-screen md:pt-0 pt-8 bg-light-white flex md:flex-row flex-col-reverse md:justify-evenly items-center">
                {this.state.showAddCourseModal ?
                    <AddCourseModal
                        onAddCancel={() => this.setState({ showAddCourseModal: false })}
                        ownCourses={this.props.courses}
                        catId={parseInt(this.props.match.params.id)}
                    />
                    :
                    null
                }
                {this.state.showDeleteCat ?
                    <ConfirmDelete
                        onCancel={this.onCancelDeleteCat}
                        onConfirm={this.deleteCat}
                        text="آیا از حذف کامل این مقطع اطمینان دارید؟"
                    />
                    :
                    null
                }
                <div className="md:w-3/12 w-11/12 relative bg-white flex flex-col items-center rounded-xl h-90">
                    {this.renderCourses()}
                    <div onClick={() => this.setState({ showAddCourseModal: true })} className="absolute cursor-pointer bottom-0 right-0 mr-6 mb-6 w-12 h-12 flex justify-center items-center rounded-full bg-blueish">
                        {plus("w-10 text-white")}
                    </div>
                </div>
                <div className="md:w-8/12 md:mb-0 mb-8 w-11/12 min-h-90h flex flex-col justify-between">
                    <div className="w-full flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center">
                            <button onClick={() => history.push('/m/categories')} className="py-1 rounded-xl px-8 bg-purple text-white">بازگشت</button>
                            <button onClick={() => this.setState({ showDeleteCat: true })} className="py-1 mx-2 rounded-xl px-8 bg-red-600 text-white">حذف مقطع</button>
                        </div>
                        <div className="flex flex-row-reverse items-center justify-center">
                            <span className="text-dark-blue text-2xl">{this.props.cat.name}</span>
                            <div onClick={e => e.stopPropagation()} className="relative cursor-pointer">
                                <div onClick={() => this.setState({ changeName: true })}>
                                    {edit("w-8 text-dark-blue")}
                                </div>
                                <div className={`${this.state.changeName ? 'block' : 'hidden'} absolute rounded-xl right-0 w-64 py-6 px-2 bg-white flex flex-col justify-center items-center`}>
                                    <input
                                        className="w-5/6 mb-4 mx-auto focus:outline-none focus:shadow-outline px-2 py-1 border border-grayish rounded-xl"
                                        type="text"
                                        value={this.state.newName}
                                        onChange={(e) => this.changeName(e.target.value)}
                                        placeholder="نام جدید..."
                                        dir="rtl"
                                    />
                                    <button onClick={this.saveName} className="w-4/5 focus:outline-none px-2 py-1 rounded-xl text-center text-white bg-green">ذخیره</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:my-0 my-8 rounded-xl bg-white py-16 flex flex-col justify-center items-center">
                        {chart("w-32 text-grayish")}
                        <span className="text-xl text-grayish mt-8">هنوز اطلاعاتی در دسترس نیست</span>
                    </div>

                    <div className="w-full rounded-xl bg-green-light py-12 flex md:flex-row-reverse flex-col justify-evenly items-center">
                        <div className="md:w-1/3 w-11/12 flex flex-col items-end">
                            <span className="text-3xl my-2 text-white font-vb">اپلود فایل اکسل</span>
                            <span className="text-lg my-2 text-right text-green">دانش آموزانی که اینجا بفرستید مستقیم به این مقطع افزوده خواهند شد</span>
                        </div>
                        <div className="md:w-1/3 w-11/12 rounded-xl py-4 bg-white">
                            <Upload />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state, ownProps) => {
    const cat = state.managerData.categories.find(el => el.id === parseInt(ownProps.match.params.id))
    return { token: state.auth.userInfo.token, cat, courses: state.managerData.catInfo }
}

const authWrapped = protectedManager(CategoryInfo)
export default connect(mapStateToProps, { getCatCourses, getAllCourses, deleteCourseFromCat, editCategory, deleteCategory })(authWrapped);