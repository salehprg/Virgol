import React from "react";
import { withTranslation } from 'react-i18next';
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
                <div onClick={e => e.stopPropagation()} className="tw-w-5/6 tw-max-w-800 tw-bg-bold-blue tw-px-4 tw-py-16 tw-flex tw-flex-col tw-items-center">
                    {loading('tw-w-8 tw-text-white centerize')}
                </div>
            </Modal>
        );
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="tw-w-5/6 tw-max-w-800 tw-bg-bold-blue tw-px-4 tw-py-16 tw-flex tw-flex-col tw-items-center">
                    <Searchish
                        className="tw-mx-auto tw-max-w-350"
                        query={this.state.query}
                        changeQuery={(query) => this.setState({ query })}
                    />
                    <div className="tw-w-11/12 tw-mt-4 tw-flex tw-flex-row-reverse tw-justify-center tw-flex-wrap">
                        {this.state.query.trim().length == 0 && this.props.newSchoolInfo.studyFields.length > 10 
                            ? 
                            this.props.newSchoolInfo.studyFields.slice(0 , 10).map(study => {
                                return (
                                    <span onClick={() => this.setCat(study.id)}
                                            className={`tw-px-6 tw-py-1 tw-mx-2 tw-my-2 tw-border tw-cursor-pointer ${this.state.selectedFields.some(el => el === study.id) ? 'tw-border-sky-blue tw-text-sky-blue' : 'tw-border-white tw-text-white'}`}
                                    >
                                    {study.studyFieldName} ({study.codeStudyField})
                                </span>
                                );
                            })
                            :
                            this.props.newSchoolInfo.studyFields.filter(x => x.studyFieldName.includes(this.state.query) || x.codeStudyField.toString().includes(this.state.query)).slice(0 , 10).map(study => {
                                // if (this.props.newSchoolInfo.studyFields.length < 10 || study.studyFieldName.includes(this.state.query)) {
                                    return (
                                        <span onClick={() => this.setCat(study.id)}
                                              className={`tw-px-6 tw-py-1 tw-mx-2 tw-my-2 tw-border tw-cursor-pointer ${this.state.selectedFields.some(el => el === study.id) ? 'tw-border-sky-blue tw-text-sky-blue' : 'tw-border-white tw-text-white'}`}
                                        >
                                        {study.studyFieldName} ({study.codeStudyField})
                                    </span>
                                    );
                                // }
                        })}
                    </div>
                    <div className="tw-flex tw-mt-8 tw-flex-row tw-items-center">
                        <button onClick={this.addFieldToSchool} className="tw-px-6 tw-py-1 tw-mx-1 tw-border-2 tw-border-transparent tw-rounded-lg tw-bg-greenish tw-text-white">
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
    return {user: state.auth.userInfo , newSchoolInfo: state.schoolData.newSchoolInfo }
}

const cwrapped = connect(mapStateToProps, { getStudyfields  })(AddField);

export default withTranslation()(cwrapped);