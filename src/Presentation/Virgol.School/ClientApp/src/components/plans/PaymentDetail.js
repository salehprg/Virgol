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
        await this.props.GetPaymentDetail(this.props.user.token , this.props.match.params.paymentId)
    }

    render() {
        return (
            <div className="tw-w-screen tw-min-h-screen tw-bg-dark-blue">
                <div className="tw-w-11/12 tw-max-w-500 tw-px-2 tw-py-12 centerize tw-bg-white tw-rounded-xl tw-text-center">
                    <p className={`tw-text-2xl tw-font-vb ${this.props.paymentDetail.status === 'success' ? 'tw-text-greenish' : 'tw-text-redish'}`}>{this.props.paymentDetail.status === 'success' ? 'پرداخت موفق' : 'پرداخت ناموفق'}</p>
                    {this.props.paymentDetail.status === 'success' ? 
                    <>
                        <p className="tw-text-lg tw-my-4">مبلغ: {this.props.paymentDetail.amount} تومان</p>
                        <p className="tw-text-lg tw-my-4">کد رهگیری: {this.props.paymentDetail.reqId}</p>
                        <p className="tw-text-lg tw-mt-4 tw-mb-8">تعداد دانش آموزان پرداختی: {this.props.paymentDetail.userCount}</p>
                    </>
                    : 
                    <>
                        <p className="tw-my-8 tw-text-xl">{this.props.paymentDetail.statusMessage}</p>
                    </>
                    }
                    <Link className="tw-link tw-px-6 tw-rounded-lg tw-py-2 tw-text-white tw-bg-purplish" to="/m/dashboard">بازگشت</Link>
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