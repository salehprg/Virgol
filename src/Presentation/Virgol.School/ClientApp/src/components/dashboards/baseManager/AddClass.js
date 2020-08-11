import React from "react";
import Modal from "../../modals/Modal";
import Searchish from "../../field/Searchish";
import {getStudyfields } from "../../../_actions/schoolActions"
import { connect } from "react-redux";
import { Field } from "redux-form";

class AddClass extends React.Component {

    state = {
        className : ""
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

    render() {
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-500 bg-bold-blue px-4 py-16 flex flex-col items-center">
                    <div className="w-11/12 mt-4 flex flex-row-reverse justify-center flex-wrap">
                        <input dir="rtl" placeholder="نام کلاس" className="px-4 py-2 text-white bg-transparent focus:outline-none focus:shadow-outline border-2 border-dark-blue rounded-lg" onChange={this.handleChange} value={this.state.className} />
                    </div>
                    <div className="flex mt-8 flex-row items-center">
                        <button onClick={this.addClass} className="px-6 py-1 mx-1 border-2 border-transparent rounded-lg bg-greenish text-white">
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

export default connect(mapStateToProps, { getStudyfields  })(AddClass);