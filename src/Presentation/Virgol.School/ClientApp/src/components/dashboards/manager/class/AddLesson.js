import React from 'react';
import Modal from '../../../modals/Modal';
import Select from 'react-select';
import TimeKeeper from 'react-timekeeper';

class AddLesson extends React.Component {

    state = { selectedCourse: null, selectedTeacher: null };

    handleChangeCourse = selectedCourse => {
        this.setState({ selectedCourse });
    };

    handleChangeTeacher = selectedTeacher => {
        this.setState({ selectedTeacher });
    };

    options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ];

    render() {
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={(e) => e.stopPropagation()} className="w-11/12 max-w-500 bg-dark-blue px-4 py-6">
                    <p className="text-center text-white my-4">قرار دادن درس در برنامه کلاسی</p>
                    <Select
                        className="w-1/2 mx-auto my-4"
                        value={this.state.selectedCourse}
                        onChange={this.handleChangeCourse}
                        options={this.options}
                        placeholder="درس"
                    />
                    <Select
                        className="w-1/2 mx-auto my-4"
                        value={this.state.selectedCourse}
                        onChange={this.handleChangeTeacher}
                        options={this.options}
                        placeholder="معلم"
                    />
                </div>
            </Modal>
        );
    }

}

export default AddLesson;