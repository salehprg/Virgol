import React from 'react';
import { connect } from 'react-redux';
import { addCoursesToCat } from "../../../../_actions/managerActions";
import Modal from "../../../modal/Modal";
import {add} from "../../../../assets/icons";
import Select from "react-select";

class AddCourseModal extends React.Component {

    state = { selected: null }

    renderSelectableCourses = () => {
        let options = []

        this.props.courses.map(course => {
            if (!this.props.ownCourses.some(el => el.id === course.id)) {
                options.push({
                    value: course.id,
                    label: course.shortname
                });
            }
        })

        return options;
    }

    handleSelect = selected => {
        this.setState({ selected });
    };

    onSubmit = () => {
        if (this.state.selected) {
            const courses = []
            this.state.selected.map(course => {
                courses.push(course.value)
            })
            this.props.addCoursesToCat(this.props.token, courses, this.props.catId);
            this.props.onAddCancel()
        }
    }

    render() {
       return (
            <Modal cancel={this.props.onAddCancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-500 px-4 py-16 flex flex-col justify-center items-end addCourseToCat">
                    <div className="w-full flex flex-row-reverse justify-start">
                        <Select
                            className="w-2/3"
                            onChange={this.handleSelect}
                            options={this.renderSelectableCourses()}
                            isMulti={true}
                            isSearchable={true}
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
    return { token: state.auth.userInfo.token, courses: state.managerData.courses }
}

export default connect(mapStateToProps, { addCoursesToCat })(AddCourseModal);