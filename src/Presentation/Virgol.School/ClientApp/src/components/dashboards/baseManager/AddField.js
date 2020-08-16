import React from "react";
import Modal from "../../modals/Modal";
import Searchish from "../../field/Searchish";
import {getStudyfields } from "../../../_actions/schoolActions"
import { connect } from "react-redux";
import { loading } from "../../../assets/icons";

class AddField extends React.Component {

    state = {
        cats: [{id: 1, name: 'دبستان'}, {id: 2, name: 'متوسطه اول'}, {id: 3, name: 'متوسطه دوم'}],
        selectedFields: [],
        query: '',
        loading: false
    }



    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.getStudyfields(this.props.user.token , this.props.selectedBaseId)
        this.setState({ loading: false })
    }

    addFieldToSchool = async () => {
        this.props.onAddField(this.state.selectedFields)
    }

    setCat = (id) => {
        if (!this.state.selectedFields.some(el => el === id)) {
            this.setState({ selectedFields: [...this.state.selectedFields, id] })
        } else {
            this.setState({ selectedFields: this.state.selectedFields.filter(el => el !== id)})
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
                    <Searchish
                        className="mx-auto max-w-350"
                        query={this.state.query}
                        changeQuery={(query) => this.setState({ query })}
                    />
                    <div className="w-11/12 mt-4 flex flex-row-reverse justify-center flex-wrap">
                        {this.state.query.trim().length == 0 && this.props.newSchoolInfo.studyFields.length > 10 
                            ? 
                            this.props.newSchoolInfo.studyFields.slice(0 , 10).map(study => {
                                return (
                                    <span onClick={() => this.setCat(study.id)}
                                            className={`px-6 py-1 mx-2 my-2 border cursor-pointer ${this.state.selectedFields.some(el => el === study.id) ? 'border-sky-blue text-sky-blue' : 'border-white text-white'}`}
                                    >
                                    {study.studyFieldName}
                                </span>
                                );
                            })
                            :
                            this.props.newSchoolInfo.studyFields.filter(x => x.studyFieldName.includes(this.state.query)).slice(0 , 10).map(study => {
                                // if (this.props.newSchoolInfo.studyFields.length < 10 || study.studyFieldName.includes(this.state.query)) {
                                    return (
                                        <span onClick={() => this.setCat(study.id)}
                                              className={`px-6 py-1 mx-2 my-2 border cursor-pointer ${this.state.selectedFields.some(el => el === study.id) ? 'border-sky-blue text-sky-blue' : 'border-white text-white'}`}
                                        >
                                        {study.studyFieldName}
                                    </span>
                                    );
                                // }
                        })}
                    </div>
                    <div className="flex mt-8 flex-row items-center">
                        <button onClick={this.addFieldToSchool} className="px-6 py-1 mx-1 border-2 border-transparent rounded-lg bg-greenish text-white">
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
    return {user: state.auth.userInfo , newSchoolInfo: state.schoolData.newSchoolInfo }
}

export default connect(mapStateToProps, { getStudyfields  })(AddField);