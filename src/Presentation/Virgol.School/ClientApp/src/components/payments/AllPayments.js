import React from "react";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import {GetAllPayments} from "../../_actions/paymensActions"    

import Tablish from "../dashboards/tables/Tablish";

class AllPayments extends React.Component {

    state = {
    }

    componentDidMount = async () => {
        await this.props.GetAllPayments(this.props.user.token);
    }


    render() {
        return (
            <div className="tw-w-full tw-mt-10">
                <div className="tw-w-full tw-relative tw-rounded-xl tw-bg-dark-blue tw-px-6 tw-py-2 tw-min-h-70">
                    <p className="tw-text-right tw-text-white tw-mt-2 tw-mb-6">{this.props.t('payments')}</p>
                    <Tablish
                        headers={[this.props.t('serviceName') , this.props.t('paymentCost'), this.props.t('paymentDate'), this.props.t('userCount') , this.props.t('paymentStatus'), this.props.t('paymentMsg'), this.props.t('paymentReqId')]}
                        body={() => {
                            return (
                                (this.props.payments ? 
                                this.props.payments.map(x => {
                                    return(
                                        <tr key={x.id} className="tw-p-2">
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.serviceName}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.amount.toLocaleString()}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{new Date(x.payTime).toLocaleDateString('fa-IR')}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.userCount}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{(x.status == "pending" ? "در جریان" : (x.status == "success" ? "موفقیت آمیز" :"خطا"))}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{x.statusMessage}</td>
                                            <td className="tw-text-right tw-px-4 tw-py-4">{(x.status == "success" ? x.reqId : x.refId)}</td>
                                        </tr>
                                    )
                                })
                                : this.props.t('loading') )
                            );
                        }}
                    />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , payments: state.paymentsData.allPaymnet}
}

const cwrapped = connect(mapStateToProps, { GetAllPayments })(AllPayments);

export default withTranslation()(cwrapped);