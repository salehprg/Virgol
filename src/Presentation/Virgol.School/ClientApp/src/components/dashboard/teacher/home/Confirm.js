import React from 'react';
import { connect } from 'react-redux';
import { confirmUser } from "../../../../actions";
import {check, loading} from "../../../../assets/icons";
import AuthCard from "./AuthCard";
import history from "../../../../history";
import Modal from "../../../Modal";

class Confirm extends React.Component {

    state = { confirmLoading: false, confirmModal: false }

    showConfirmModal = () => {
        if (!this.state.confirmLoading) this.setState({ confirmModal: true })
    }

    onConfirmCancel = () => {
        this.setState({ confirmModal: false })
    }

    confirm = async () => {
        this.setState({ confirmModal: false, confirmLoading: true })
        await this.props.confirmUser(this.props.token, this.props.match.params.id)
        this.setState({ confirmLoading: false })
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-light-white flex flex-row justify-center items-center">
                {this.state.confirmModal ?
                    <Modal cancel={this.onConfirmCancel}>
                        <div onClick={(e) => e.stopPropagation()} className="md:w-1/3 w-5/6 p-8 flex flex-col items-center bg-white font-vb">
                            <span className="py-2 text-center">آیا از تایید این دانش اموز مطمئن هستید؟</span>
                            <div className="flex md:flex-row flex-col">
                                <button
                                    onClick={this.onConfirmCancel}
                                    className="px-8 py-2 mx-2 my-2 text-green-600 border-2 border-green-600 rounded-lg focus:outline-none"
                                >خیر</button>
                                <button
                                    onClick={() => this.confirm()}
                                    className="px-8 py-2 mx-2 my-2 text-white bg-green-600 rounded-lg focus:outline-none"
                                >بله</button>
                            </div>
                        </div>
                    </Modal>
                    : null}
                <div className="w-5/6 max-w-1000 py-4 bg-white flex flex-col items-center">
                    {check("w-24 text-blueish")}
                    <div className="w-11/12 flex flex-col">
                        <span className="w-full text-right border-b-2 text-grayish">اطلاعات فردی</span>
                        <div className="w-full flex flex-row-reverse flex-wrap justify-start">
                             <AuthCard title="نام" value="محمد" />
                             <AuthCard title="نام خانوادگی" value="موسوی" />
                             <AuthCard title="کد ملی" value="0926578254" />
                             <AuthCard title="نام پدر" value="حسن" />
                             <AuthCard title="کد ملی پدر" value="030345789" />
                             <AuthCard title="نام مادر" value="فاطمه" />
                             <AuthCard title="کد ملی مادر" value="0567845896" />
                             <AuthCard title="شماره همراه" value="09354567858" />
                             <AuthCard title="شماره همراه پدر" value="09154568525" />
                        </div>
                    </div>
                    <div className="w-11/12 flex flex-col">
                        <span className="w-full text-right border-b-2 text-grayish">اطلاعات تحصیلی</span>
                        <div className="w-full flex flex-row-reverse flex-wrap justify-start">
                             <div className="flex my-2 w-1/3 flex-col items-center">
                                 <span className="text-2xl font-vb text-blueish">مقطع</span>
                                 <span>دهم</span>
                             </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-row justify-center flex-wrap">
                        <button onClick={() => this.showConfirmModal()} className="mx-2 px-4 py-1 text-xl rounded-lg text-white font-vb bg-green-500">
                            {this.state.confirmLoading ? loading("w-6 text-white") : 'تایید'}
                        </button>
                        {/*<button className="mx-2 px-4 py-1 text-xl rounded-lg text-white font-vb bg-red-500">عدم تایید</button>*/}
                        <button onClick={() => history.push("/a/dashboard")} className="mx-2 px-4 py-1 text-xl rounded-lg text-red-500 font-vb border-2 border-red-500">لغو</button>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { token: state.auth.userInfo.token }
}

export default connect(mapStateToProps, { confirmUser })(Confirm);