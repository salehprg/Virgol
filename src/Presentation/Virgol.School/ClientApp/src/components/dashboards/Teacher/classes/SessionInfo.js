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
            <div className="w-screen min-h-screen py-4 bg-black-blue">
                <div className="lg:w-11/12 w-full lg:px-8 px-4 py-16 relative min-h-90 mx-auto lg:border-2 border-0 rounded-lg border-dark-blue">
                    <div onClick={() => history.push(this.redirectUrl())} className="w-10 h-10 cursor-pointer absolute top-0 left-0 mt-4 ml-8 rounded-lg border-2 border-purplish">
                        {arrow_left('w-6 centerize text-purplish')}
                    </div>
                    <p className="text-right text-xl text-white">{this.props.lessonDetail ? `${this.props.lessonDetail.orgLessonName} - ${this.props.t('school')} ${this.props.lessonDetail.schoolName} - ${this.props.t('class')} ${this.props.lessonDetail.className}` : null}</p>
                    {(this.props.classBookData ?
                    <div className="mx-auto rounded-lg bg-dark-blue mt-4 py-4 px-8">
                        <Tablish
                            headers={[this.props.t('name'), this.props.t('nationCode'), this.props.t('email'), this.props.t('absents'), this.props.t('point')]}
                            body={() => {
                                return (
                                    this.props.classBookData.map(x =>
                                        <tr>
                                            <td className="py-4">{x.firstName} {x.lastName}</td>
                                            <td>{x.melliCode}</td>
                                            <td>{x.email ? x.email : this.props.t('notAvailable')}</td>
                                            <td>{x.absentCount}</td>
                                            <td>{x.score}</td>
                                        </tr>
                                    )
                                );
                            }}
                        />
                    </div>
                    : <p className="text-right text-white">{this.props.t('loading')}</p> )}
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