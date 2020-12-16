import React from 'react';
import protectedManager from '../protectedRoutes/protectedManager';
import {GetPaymentDetail} from '../../_actions/paymensActions'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

class PaymentDetail extends React.Component {

    state = {paymentStatus : ''}

    componentDidMount = async () =>
    {
        await this.props.GetPaymentDetail(this.props.user.token , this.props.match.params.paymentId)
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-dark-blue">
                <div className="w-11/12 max-w-500 px-2 py-12 centerize bg-white rounded-xl text-center">
                    <p className="text-black-blue text-xl">پرداخت آسان و مطمئن با <span className="text-sky-blue">پی پینگ</span></p>
                    <div className="w-full my-6 flex md:flex-row flex-col justify-evenly items-center">
                        <p className="text-xl font-vb mb-2">وضعیت پرداخت</p>
                    </div>
                    <p className="text-xl font-vb mb-2">{this.props.match.params.statusmsg}</p>
                    <div>
                        <p className="text-lg">مبلغ کل</p>
                    </div>
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