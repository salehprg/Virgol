import React from 'react';
import Modal from "../../../modal/Modal";
import {excel, person} from "../../../../assets/icons";
import history from "../../../../history";

class AddTeacherModal extends React.Component {

    render() {
        return (
            <Modal cancel={this.props.onAddCancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-600 bg-white px-8 py-16 flex md:flex-row flex-col justify-evenly items-center">
                    <div onClick={() => history.push('/addTeacherByExcel')} className="md:w-1/3 w-5/6 cursor-pointer transform duration-200 hover:scale-110 p-4 border-2 border-dashed border-green flex flex-col items-center">
                        {excel("w-24 text-green")}
                        <span className="text-green">افزودن با فایل اکسل</span>
                    </div>
                    <div onClick={() => history.push('/addTeacher')} className="md:w-1/3 w-5/6 cursor-pointer transform duration-200 hover:scale-110 p-4 border-2 border-dashed border-green flex flex-col items-center">
                        {person("w-24 text-green")}
                        <span className="text-green">افزودن دستی</span>
                    </div>
                </div>
            </Modal>
        );
    }

}

export default AddTeacherModal;