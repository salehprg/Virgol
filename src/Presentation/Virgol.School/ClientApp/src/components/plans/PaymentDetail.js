import React from 'react';
import protectedManager from '../protectedRoutes/protectedManager';
import {GetPaymentDetail} from '../../_actions/paymensActions'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

class PaymentDetail extends React.Component {

    state = {paymentStatus : ''}

    componentDidMount = async () =>
    {
        console.log("w");
        await this.props.GetPaymentDetail(this.props.user.token , this.props.match.params.paymentId)
    }

    componentDidUpdate() {
        console.log(this.props.paymentDetail);
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-dark-blue">
                <div className="w-11/12 max-w-500 px-2 py-12 centerize bg-white rounded-xl text-center">
                    <p className={`text-2xl font-vb ${this.props.paymentDetail.status === 'success' ? 'text-greenish' : 'text-redish'}`}>{this.props.paymentDetail.status === 'success' ? 'پرداخت موفق' : 'پرداخت ناموفق'}</p>
                    {this.props.paymentDetail.status === 'success' ? 
                    <>
                        <p className="text-lg my-4">مبلغ: {this.props.paymentDetail.amount} تومان</p>
                        <p className="text-lg my-4">کد رهگیری: {this.props.paymentDetail.reqId}</p>
                        <p className="text-lg mt-4 mb-8">تعداد دانش آموزان پرداختی: {this.props.paymentDetail.userCount}</p>
                    </>
                    : 
                    <>
                        <p className="my-8 text-xl">{this.props.paymentDetail.statusMessage}</p>
                    </>
                    }
                    <Link className="px-6 rounded-lg py-2 text-white bg-purplish" to="/m/dashboard">بازگشت</Link>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , paymentDetail : state.paymentsData.paymentDetail}
}

const cwrapped = connect(mapStateToProps, {GetPaymentDetail})(protectedManager(PaymentDetail))

export default withTranslation()(cwrapped);