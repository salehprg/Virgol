import React from 'react';
import { connect } from 'react-redux';
import { confirmUser, getAllCategory } from "../../../../actions";
import {check, loading} from "../../../../assets/icons";
import AuthCard from "./AuthCard";
import history from "../../../../history";
import Modal from "../../../Modal";
import Loading from "../../../Loading";

class Confirm extends React.Component {

    state = { loading: false, confirmLoading: false, confirmModal: false, cat: null }

    async componentDidMount() {
        this.setState({loading: true})
        await this.props.getAllCategory(this.props.token);
        this.setState({ cat: this.props.categories.find(el => el.id === this.props.user.userDetail.baseId), loading: false });
    }

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
        if (this.state.loading) return <Loading />
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
                             <AuthCard title="نام" value={this.props.user.firstName} />
                             <AuthCard title="نام خانوادگی" value={this.props.user.lastName} />
                             <AuthCard title="کد ملی" value={this.props.user.melliCode} />
                             <AuthCard title="نام پدر" value={this.props.user.userDetail.fatherName} />
                             <AuthCard title="کد ملی پدر" value={this.props.user.userDetail.fatherMelliCode} />
                             <AuthCard title="نام مادر" value={this.props.user.userDetail.motherName} />
                             <AuthCard title="کد ملی مادر" value={this.props.user.userDetail.motherMelliCode} />
                             <AuthCard title="شماره همراه" value={this.props.user.phoneNumber} />
                             <AuthCard title="شماره همراه پدر" value={this.props.user.userDetail.fatherPhoneNumber} />
                        </div>
                    </div>
                    <div className="w-11/12 flex flex-col">
                        <span className="w-full text-right border-b-2 text-grayish">اطلاعات تحصیلی</span>
                        <div className="w-full flex flex-row-reverse flex-wrap justify-start">
                             <div className="flex my-2 w-1/3 flex-col items-center">
                                 <span className="text-2xl font-vb text-blueish">مقطع</span>
                                 <span>{this.state.cat ? this.state.cat.name : ''}</span>
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

const mapStateToProps = (state, ownProps) => {
    const user = state.adminData.newUsers.find(el => el.id === parseInt(ownProps.match.params.id))
    return { token: state.auth.userInfo.token, user, categories: state.adminData.categories}
}

export default connect(mapStateToProps, { confirmUser, getAllCategory })(Confirm);