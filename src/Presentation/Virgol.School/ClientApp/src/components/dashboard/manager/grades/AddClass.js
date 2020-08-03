import React from 'react';
import { connect } from 'react-redux';
import { addNewClass } from "../../../../_actions/managerActions";
import Modal from "../../../modal/Modal";
import {add} from "../../../../assets/icons";

class AddClass extends React.Component {

    state = { name: '', error: false }

    change = (name) => {
        this.setState({ name })
    }

    onSubmit = () => {
        if (this.state.name === '') this.setState({ error: true })
        else {
            const formValues = { className: this.state.name , gradeId: this.props.gradeId}
            this.props.addNewClass(this.props.token, formValues);
            this.props.onAddCancel()
        }
    }

    render() {
        return (
            <Modal cancel={this.props.onAddCancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-500 px-4 py-16 flex flex-col justify-center items-end addCat">
                    <span className="text-xl font-vr text-white my-4">اضافه کردن یک مقطع جدید</span>
                    <div className="w-full flex flex-row-reverse justify-start">
                        <input
                            className={`w-2/3 px-4 py-2 font-vb focus:outline-none focus:shadow-outline rounded-xl ${this.state.error ? 'border-2 border-red-600' : 'border-2 border-transparent'}`}
                            type="text"
                            value={this.state.name}
                            onChange={e => this.change(e.target.value)}
                            placeholder="نام..."
                            dir="rtl"
                        />
                        <div onClick={this.onSubmit} className="cursor-pointer">
                            {add("w-10 text-white mx-2")}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return { token: state.auth.userInfo.token }
}

export default connect(mapStateToProps, { addNewClass })(AddClass);