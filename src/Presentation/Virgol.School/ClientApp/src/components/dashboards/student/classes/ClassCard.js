import React, {createRef} from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import getColor from "../../../../assets/colors";
import history from "../../../../history";
import { withTranslation } from 'react-i18next';

class ClassCard extends React.Component {

    formRef = createRef();

    ssoLogin() {
        history.push("/SSO")
    }

    render() {
        const { lessonId , scheduleId, title, school, nameOfClass } = this.props;
        return (
            <div className={`tw-py-6 tw-relative tw-mx-2 tw-my-4 tw-rounded-lg tw-bg-${getColor(lessonId)}`}>
                <p onClick={() => this.ssoLogin()} className="tw-text-center tw-cursor-pointer tw-text-white tw-text-2xl tw-font-vb">{title}</p>
                <p className="tw-text-white tw-text-center">{school + " - " + nameOfClass}</p>
                <div onClick={(e) => e.stopPropagation()} className="tw-flex tw-flex-row tw-justify-evenly tw-mt-6">
                <Link className="tw-link tw-w-5/12 tw-py-1 tw-text-center tw-text-white" to={`/sessionsList/${scheduleId}`}>{this.props.t('sessionList')}</Link>
                <Link className="tw-link tw-w-5/12 tw-py-1 tw-text-center tw-text-white" to={`/SSO/${scheduleId}`} rel="noopener noreferrer">{this.props.t('activities')}</Link>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo}
}
const cwrapped = connect(mapStateToProps)(ClassCard);

export default withTranslation()(cwrapped);