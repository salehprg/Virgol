import React from 'react'
import { connect } from 'react-redux';
import {Link} from "react-router-dom";
import { removeStatus } from "../../_actions/authActions";

class Status extends React.Component {

    componentWillUnmount() {
        this.props.removeStatus();
    }

    render() {
        return (
            <div className="w-screen min-h-screen flex flex-col justify-center items-center">
                <div className="w-2/3 flex flex-col justify-center items-center">
                    <p className="text-center text-2xl">هنوز حسابت تایید نشده، یکم صبر داشته باش و اگه خیلی طول کشیده به مدیر مدرسه اطلاع بده</p>
                    <div className="w-full flex flex-col md:flex-row justify-evenly items-center">
                        <div className="w-32 h-32 md:my-8 my-4 flex text-center justify-center items-center rounded-full border-4 border-blueish">
                            <span className="font-vb">ثبت نام اولیه</span>
                        </div>
                        <div className="w-32 h-32 md:my-0 my-4 flex text-center justify-center items-center rounded-full border-4 border-golden">
                            <span className="font-vb">تایید حساب</span>
                        </div>
                        <div className="w-32 h-32 md:my-0 my-4 flex text-center justify-center items-center rounded-full border-4 border-blueish">
                            <span className="font-vb">استفاده از امکانات ویرگول</span>
                        </div>
                    </div>
                    <Link to="/" className="py-2 px-4 text-center bg-blueish text-white rounded-lg transition-all duration-200 hover:bg-darker-blueish">بازگشت به صفحه ورود</Link>
                </div>
            </div>
        );
    }

}

const mapStateToProp = state => {
    return { user: state.auth.status }
}

export default connect(mapStateToProp, { removeStatus })(Status);