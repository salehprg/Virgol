import React from "react";
import { getAllStudents } from "../../../actions";
import {book, edit, errorOutline, loading, remove} from "../../../assets/icons";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";

class Students extends React.Component {

    state = {
        selectedCourses: null,
        showTeacherCourses: false,
        dragging: false,
        excel: null
    }
    dropRef = React.createRef();

    componentDidMount() {
        this.props.getAllStudents(this.props.auth.token);

        this.dragCounter = 0
        let div = this.dropRef.current;
        div.addEventListener('dragenter', this.handleDragEnter)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }

    componentWillUnmount() {
        let div = this.dropRef.current;
        div.removeEventListener('dragenter', this.handleDragEnter)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    renderStudents = () => {
        const { students } = this.props;

        if (students !== null) {
            if (students.length === 0) {
                return (
                    <div className="w-full flex-grow flex flex-col justify-center items-center">
                        {errorOutline("w-24 h-24 text-blueish")}
                        <span className="text-xl mt-4 text-dark-blue">هیچ دانش آموزی وجود ندارد</span>
                    </div>
                );
            } else {
                const studentCards = students.map((student) => {
                    return (
                        <tr key={student.id}>
                            <td className="py-2">{student.firstName}</td>
                            <td className="py-2">{student.lastName}</td>
                            <td className="py-2">{student.melliCode}</td>
                        </tr>
                    );
                })

                return (
                    <table dir="rtl" className="table-auto w-5/6 text-center">
                        <thead>
                        <tr className="border-b-2 border-blueish">
                            <th className="px-8 py-2">نام</th>
                            <th className="px-8 py-2">نام خانوادگی</th>
                            <th className="px-8">کد ملی</th>
                        </tr>
                        </thead>
                        <tbody>
                        {studentCards}
                        </tbody>
                    </table>
                );
            }
        }

        return loading("w-16 h-16 text-blueish")
    }

    handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({dragging: true})
        }
    }

    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--;
        if (this.dragCounter > 0) return
        this.setState({dragging: false})
    }

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({dragging: false})
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.setState({ excel: e.dataTransfer.files })
            console.log(this.state.excel)
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }

    onAddBase = () => {

    }

    render() {
        return (
            <div className="w-full h-full pt-12 flex md:flex-row flex-col md:items-start items-center justify-evenly">
                <div className="md:w-1/4 w-5/6 md:order-1 order-2 flex flex-col items-end">
                    <input
                        className="md:w-1/3 w-1/2 invisible mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div ref={this.dropRef} className={`${this.state.dragging ? 'bg-green-200' : 'bg-white'} w-full flex flex-col py-2 justify-start items-center overflow-auto`}>
                        <span className="font-vb text-blueish text-2xl mb-8">افزودن دانش آموز</span>
                        <form className="w-3/4 flex flex-col text-center" onSubmit={this.onAddBase}>
                            <div className="w-full h-64 flex flex-col justify-center">
                                <span className="text-2xl text-green-900">{this.state.excel === null ? 'فایل اکسل را رها کنید' : this.state.excel[0].name}</span>
                            </div>
                            <button className={`bg-golden my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg ${this.state.excel === null ? 'hidden' : 'block'}`}>افزودن</button>
                        </form>
                    </div>
                </div>
                <div className="md:w-1/2 w-5/6 max-h-screen mb-12 md:order-12 order-1 flex flex-col items-end">
                    <input
                        className="md:w-1/3 w-1/2 mb-2 px-4 py-1 rounded-lg text-right text-grayish focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="جست و جو"
                    />
                    <div className="bg-white w-full min-h-75 flex flex-col py-2 justify-start items-center overflow-auto">
                        <span className="font-vb text-blueish text-2xl mb-8">دانش آموزان</span>
                        {this.renderStudents()}
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        auth: state.auth.userInfo,
        students: state.adminData.students,
    }
}

export default connect(mapStateToProps, { getAllStudents })(Students);