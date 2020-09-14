import React, {createRef} from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import getColor from "../../../../assets/colors";
import history from "../../../../history";

class ClassCard extends React.Component {

    formRef = createRef();

    ssoLogin() {
        history.push("/SSO")
    }

    render() {
        const { lessonId , scheduleId, title, school, nameOfClass } = this.props;
        return (
            <div className={`py-6 relative mx-2 my-4 rounded-lg bg-${getColor(lessonId)}`}>
                <p onClick={() => this.ssoLogin()} className="text-center cursor-pointer text-white text-2xl font-vb">{title}</p>
                <p className="text-white text-center">{school + " - " + nameOfClass}</p>
                <div onClick={(e) => e.stopPropagation()} className="flex flex-row justify-evenly mt-6">
                    <Link className="w-5/12 py-1 text-center text-white" to={`/session/${scheduleId}`}>دفتر نمره</Link>
                    <Link className="w-5/12 py-1 text-center text-white" to={`/recordedSessions/${scheduleId}`}>لیست جلسات</Link>
                </div>
                {/* <form ref={this.formRef} className="text-center" action="http://vs.legace.ir/login/index.php" method="POST"  >
                    <input
                        hidden="true"
                        name="username"
                        type="text"
                        placeholder="نام کاربری"
                        value={this.props.user.userInformation.userName}
                    />
                    <input
                        hidden="true"
                        name="password"
                        type="text"
                        placeholder="رمز عبور"
                        value={localStorage.getItem('userPassword')}
                    />
                </form> */}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user : state.auth.userInfo}
}

export default connect(mapStateToProps)(ClassCard);