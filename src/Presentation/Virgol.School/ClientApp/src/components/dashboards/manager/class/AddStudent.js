import React from "react";
import { withTranslation } from 'react-i18next';
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
        loading: false,
        adding : false
    }



    componentDidMount = async () => {
        this.setState({ loading: true })
        var FreeClass = this.props.IsFreeClass;

        await this.props.getAllStudents(this.props.user.token , !FreeClass , FreeClass)
        this.setState({ loading: false })
    }

    addStudentToSchool = async () => {
        this.setState({ loading: true })
        this.props.onAddStudent(this.state.selectedStudents)
    }

    setStudent = (id) => {
        if (!this.state.selectedStudents.some(el => el === id)) {
            this.setState({ selectedStudents: [...this.state.selectedStudents, id] })
        } else {
            this.setState({ selectedStudents: this.state.selectedStudents.filter(el => el !== id)})
        }
    }

    searchStudent = (query) => {

        var list = []

        this.props.students.map(x => {
            if (x.firstName.includes(query) 
                || x.lastName.includes(query) 
                || (x.firstName + " " + x.lastName).includes(query)) 
            {
                list.push(x);
            }
        })

        return list
    }

    render() {
        if (this.state.loading) return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="tw-w-5/6 tw-max-w-800 tw-bg-bold-blue tw-px-4 tw-py-16 tw-flex tw-flex-col tw-items-center">
                    {loading('tw-w-8 tw-text-white centerize')}
                </div>
            </Modal>
        );
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="tw-w-5/6 tw-max-w-800 tw-bg-bold-blue tw-px-4 tw-py-16 tw-flex tw-flex-col tw-items-center">
                    <span className={`tw-px-6 tw-py-1 tw-mx-2 tw-my-2 tw-text-white`}>
                        {this.props.IsFreeClass ? this.props.t('userList') : this.props.t('noClassStudents')}
                    </span>
                    <Searchish
                        className="tw-mx-auto tw-max-w-350"
                        query={this.state.query}
                        changeQuery={(query) => this.setState({ query })}
                    />
                    <div className="tw-w-11/12 tw-mt-4 tw-flex tw-flex-row-reverse tw-justify-center tw-flex-wrap">
                        {this.state.query.trim().length == 0 && this.props.students.length > 10 ? 
                            this.props.students.slice(0, 20).map(x => {
                                return (
                                    <span onClick={() => this.setStudent(parseInt(x.id))}
                                            className={`tw-px-6 tw-py-1 tw-mx-2 tw-my-2 border tw-cursor-pointer ${this.state.selectedStudents.some(el => el === x.id) ? 'tw-border-sky-blue tw-text-sky-blue' : 'tw-border-white tw-text-white'}`}
                                    >
                                        {x.firstName} {x.lastName}
                                    </span>
                                );
                            })
                        :
                        this.searchStudent(this.state.query).slice(0, 20).map(x => {
                            return (
                                <span onClick={() => this.setStudent(parseInt(x.id))}
                                        className={`tw-px-6 tw-py-1 tw-mx-2 tw-my-2 border tw-cursor-pointer ${this.state.selectedStudents.some(el => el === x.id) ? 'tw-border-sky-blue tw-text-sky-blue' : 'tw-border-white tw-text-white'}`}
                                >
                                {x.firstName} {x.lastName}
                            </span>
                            );
                        })}
                    </div>
                    <div className="tw-flex tw-mt-8 tw-flex-row tw-items-center">
                        <button onClick={this.addStudentToSchool} className="tw-px-6 tw-py-1 tw-mx-1 tw-border-2 tw-border-transparent tw-rounded-lg tw-bg-greenish tw-text-white">
                            {this.props.t('save')}
                        </button>
                        <button onClick={this.props.cancel} className="tw-px-6 tw-mx-1 tw-py-1 tw-rounded-lg tw-border-2 tw-border-grayish tw-text-grayish">
                            {this.props.t('cancel')}
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

const cwrapped = connect(mapStateToProps, { getAllStudents  })(AddStudent);

export default withTranslation()(cwrapped);