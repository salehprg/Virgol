import React from 'react';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import history from '../../../../history'
import Add from '../../../field/Add';
import { connect } from "react-redux";
import {getAllClass , GetClassesCommonLessons} from "../../../../_actions/schoolActions"
import {getAllStudents , AssignUserToLesson} from "../../../../_actions/managerActions"
import Fieldish from '../../../field/Fieldish';
import {styles} from '../../../../selectStyle'
import { loading } from '../../../../assets/icons';

class AddExtraLesson extends React.Component {

    state = { 
        loading : false ,
        classes: [],
        lessons: [],
        students: [],

        selectedClass: null,
        selectedLesson: null,
        selectedStudent: null
    }

    componentDidMount = async () => {

        var students = [];
        await this.props.getAllStudents(this.props.user.token);
        this.props.students.map(x => students.push({value : x.id , label : x.firstName + " " + x.lastName}));
        this.setState({students : students});


        var classes = [];
        await this.props.getAllClass(this.props.user.token);
        this.props.allClass.map(x => classes.push({value : x.id , label : x.className}));
        this.setState({classes : classes});

    }

    handleChangeClass = async (selectedClass) => {

        var classId = [selectedClass.value]

        await this.props.GetClassesCommonLessons(this.props.user.token , classId);
        this.setState({ selectedClass });

        var commLessons = [];
        this.props.commonLessons.map(x => commLessons.push({value : x.id , label : x.lessonName}));

        this.setState({lessons : commLessons});
    };

    handleChangeLesson = selectedLesson => {
        this.setState({ selectedLesson });
    };

    handleChangeStudent = selectedStudent => {
        this.setState({ selectedStudent });
    };

    onSubmit = async (formValues) => {
        if (this.state.selectedLesson && this.state.selectedStudent && this.state.selectedClass) 
        {
            const data = {
                    classId : this.state.selectedClass.value,
                    lessonId : this.state.selectedLesson.value,
            }

            this.setState({loading : true})
            await this.props.AssignUserToLesson(this.props.user.token , data ,  this.state.selectedStudent.value);
            this.setState({loading : false})
        }
    }

    render() {
        return (
            <Add
                onCancel={() => history.push('/m/extraLesson')}
                title={this.props.t('addExtraLesson')}
            >
                <div className="tw-w-full" style={{direction : "rtl"}} >
                    <Select
                        styles={styles}
                        className="tw-w-full tw-mx-auto tw-my-4"
                        value={this.state.selectedClass}
                        onChange={this.handleChangeClass}
                        options={this.state.classes}
                        placeholder={this.props.t('className')}
                    />
                    <Select
                        styles={styles}
                        className="tw-w-full tw-mx-auto tw-my-4"
                        value={this.state.selectedLesson}
                        onChange={this.handleChangeLesson}
                        options={this.state.lessons}
                        placeholder={this.props.t('lesson')}
                    />
                    <Select
                        styles={styles}
                        className="tw-w-full tw-mx-auto tw-my-4"
                        value={this.state.selectedStudent}
                        onChange={this.handleChangeStudent}
                        options={this.state.students}
                        placeholder={this.props.t('student')}
                    />
                    
                    <button onClick={() => this.onSubmit()} className="tw-w-full tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg"> {this.state.loading ? loading('tw-w-6 tw-text-white tw-mx-auto') : this.props.t('save')} </button>
                </div>
            </Add>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , 
            mixedSchedules : state.schedules.mixedClassSchedules,
            allClass : state.schoolData.allClass,
            commonLessons : state.schoolData.commonLessons,
            students : state.managerData.students}
}

const cwrapped = connect (mapStateToProps, { getAllClass , GetClassesCommonLessons , getAllStudents , AssignUserToLesson})(AddExtraLesson);

export default withTranslation()(cwrapped);