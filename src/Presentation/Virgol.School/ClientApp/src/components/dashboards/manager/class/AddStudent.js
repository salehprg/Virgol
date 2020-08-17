import React from "react";
import Modal from "../../../modals/Modal";
import Searchish from "../../../field/Searchish";
import {getAllStudents } from "../../../../_actions/managerActions"
import { connect } from "react-redux";
import { loading } from "../../../../assets/icons";

class AddStudent extends React.Component {

    state = {
        cats: [{id: 1, name: 'دبستان'}, {id: 2, name: 'متوسطه اول'}, {id: 3, name: 'متوسطه دوم'}],
        selectedStudents: [],
        query: '',
        loading: false
    }



    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getAllStudents(this.props.user.token , 'true')
        this.setState({ loading: false })
    }

    addStudentToSchool = async () => {
        this.props.onAddStudent(this.state.selectedStudents)
    }

    setStudent = (id) => {
        if (!this.state.selectedStudents.some(el => el === id)) {
            this.setState({ selectedStudents: [...this.state.selectedStudents, id] })
        } else {
            this.setState({ selectedStudents: this.state.selectedStudents.filter(el => el !== id)})
        }
    }

    render() {
        if (this.state.loading) return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-800 bg-bold-blue px-4 py-16 flex flex-col items-center">
                    {loading('w-8 text-white centerize')}
                </div>
            </Modal>
        );
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-800 bg-bold-blue px-4 py-16 flex flex-col items-center">
                    <span className={`px-6 py-1 mx-2 my-2 text-white`}>
                        لیست دانش آموزان بدون کلاس
                    </span>
                    <Searchish
                        className="mx-auto max-w-350"
                        query={this.state.query}
                        changeQuery={(query) => this.setState({ query })}
                    />
                    <div className="w-11/12 mt-4 flex flex-row-reverse justify-center flex-wrap">
                        {this.state.query.trim().length == 0 && this.props.students.length > 10 ? 
                            this.props.students.slice(0, 10).map(x => {
                                return (
                                    <span onClick={() => this.setStudent(parseInt(x.id))}
                                            className={`px-6 py-1 mx-2 my-2 border cursor-pointer ${this.state.selectedStudents.some(el => el === x.id) ? 'border-sky-blue text-sky-blue' : 'border-white text-white'}`}
                                    >
                                        {x.firstName} {x.lastName}
                                    </span>
                                );
                            })
                        :
                        this.props.students.map(x => {
                            if (x.firstName.includes(this.state.query) || x.lastName.includes(this.state.query) || (x.firstName + " " + x.lastName).includes(this.state.query)) {
                                return (
                                    <span onClick={() => this.setStudent(parseInt(x.id))}
                                            className={`px-6 py-1 mx-2 my-2 border cursor-pointer ${this.state.selectedStudents.some(el => el === x.id) ? 'border-sky-blue text-sky-blue' : 'border-white text-white'}`}
                                    >
                                    {x.firstName} {x.lastName}
                                </span>
                                );
                            }
                        })}
                    </div>
                    <div className="flex mt-8 flex-row items-center">
                        <button onClick={this.addStudentToSchool} className="px-6 py-1 mx-1 border-2 border-transparent rounded-lg bg-greenish text-white">
                            ذخیره
                        </button>
                        <button onClick={this.props.cancel} className="px-6 mx-1 py-1 rounded-lg border-2 border-grayish text-grayish">
                            لغو
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , students: state.managerData.students }
}

export default connect(mapStateToProps, { getAllStudents  })(AddStudent);