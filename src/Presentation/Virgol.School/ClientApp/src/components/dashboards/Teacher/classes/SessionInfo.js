import React from "react";
import { withTranslation } from 'react-i18next';
import Tablish from "../../tables/Tablish";
import {arrow_left, check_circle, edit, trash} from "../../../../assets/icons";
import {GetClassBook}  from "../../../../_actions/teacherActions"
import history from "../../../../history";
import { connect } from "react-redux";

class SessionInfo extends React.Component {

    state = {loading : false}
    componentDidMount = async () => {
        this.setState({loading : true})
        await this.props.GetClassBook(this.props.user.token , parseInt(this.props.match.params.id))
        this.setState({loading : false})
    }

    redirectUrl = () =>{
        if(this.props.user.userType == 3)
        {
            return '/t/classes'
        }
        else if(this.props.user.userType == 2)
        {
            return '/m/bases'
        }
    }

    render() {
        return (
            <div className="tw-w-screen tw-min-h-screen tw-py-4 tw-bg-black-blue">
                <div className="lg:tw-w-11/12 tw-w-full lg:tw-px-8 tw-px-4 tw-py-16 tw-relative tw-min-h-90 tw-mx-auto lg:tw-border-2 tw-border-0 tw-rounded-lg tw-border-dark-blue">
                    <div onClick={() => this.props.history.goBack()} className="tw-w-10 tw-h-10 tw-cursor-pointer tw-absolute tw-top-0 tw-left-0 tw-mt-4 tw-ml-8 tw-rounded-lg tw-border-2 tw-border-purplish">
                        {arrow_left('tw-w-6 centerize tw-text-purplish')}
                    </div>
                    <p className="tw-text-right tw-text-xl tw-text-white">{this.props.lessonDetail ? `${this.props.lessonDetail.orgLessonName} - ${this.props.t('school')} ${this.props.lessonDetail.schoolName} - ${this.props.t('class')} ${this.props.lessonDetail.className}` : null}</p>
                    {(this.props.classBookData ?
                    <div className="tw-mx-auto tw-rounded-lg tw-bg-dark-blue tw-mt-4 tw-py-4 tw-px-8">
                        <Tablish
                            headers={[this.props.t('name'), this.props.t('nationCode'), this.props.t('email'), this.props.t('absents'), this.props.t('point')]}
                            body={() => {
                                return (
                                    this.props.classBookData.map(x =>
                                        <tr>
                                            <td className="tw-py-4 tw-text-right tw-px-4">{x.firstName} {x.lastName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.melliCode}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.email ? x.email : this.props.t('notAvailable')}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.absentCount}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.score}</td>
                                        </tr>
                                    )
                                );
                            }}
                        />
                    </div>
                    : <p className="tw-text-right tw-text-white">{this.props.t('loading')}</p> )}
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo  , 
        classBookData : state.teacherData.classBook ? state.teacherData.classBook.classBooks : null,
        lessonDetail : state.teacherData.classBook ? state.teacherData.classBook.lessonDetail : null,
    }
}
const cwrapped = connect(mapStateToProps , {GetClassBook})(SessionInfo)

export default withTranslation()(cwrapped);