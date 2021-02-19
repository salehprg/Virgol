import React from "react";
import { withTranslation } from 'react-i18next';
import Modal from "../../modals/Modal";
import Searchish from "../../field/Searchish";
import {getStudyfields } from "../../../_actions/schoolActions"
import { connect } from "react-redux";
import { Field } from "redux-form";

class AddClass extends React.Component {

    state = {
        className : "",
        title : ""
    }

    // componentDidMount = async () => {
    //     await this.props.getStudyfields(this.props.user.token , this.props.selectedBaseId)
    // }

    handleChange = (event) => {
        this.setState({className: event.target.value});  
    }

    addClass = async () => {
        this.props.onAddClass(this.state.className)
    }

    componentDidMount(){
        this.setState({title : this.props.title})

    }

    render() {
        const title = this.state.title
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="tw-w-5/6 tw-max-w-500 tw-bg-bold-blue tw-px-4 tw-py-16 tw-flex tw-flex-col tw-items-center">
                    <div className="tw-w-11/12 tw-mt-4 tw-flex tw-flex-row-reverse tw-justify-center tw-flex-wrap">
                        <input dir="rtl" placeholder={title} className="tw-px-4 tw-py-2 tw-text-white tw-bg-transparent focus:tw-outline-none focus:tw-shadow-outline tw-border-2 tw-border-dark-blue tw-rounded-lg" onChange={this.handleChange} value={this.state.className} />
                    </div>
                    <div className="tw-flex tw-mt-8 tw-flex-row tw-items-center">
                        <button onClick={this.addClass} className="tw-px-6 tw-py-1 tw-mx-1 tw-border-2 tw-border-transparent tw-rounded-lg tw-bg-greenish tw-text-white">
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

const cwrapped = connect(mapStateToProps, { getStudyfields  })(AddClass);

export default withTranslation()(cwrapped);