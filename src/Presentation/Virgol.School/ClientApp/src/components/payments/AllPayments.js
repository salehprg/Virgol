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
            <div className="w-full mt-10">
                <div className="w-full relative rounded-xl bg-dark-blue px-6 py-2 min-h-70">
                    <p className="text-right text-white mt-2 mb-6">{this.props.t('payments')}</p>
                    <Tablish
                        headers={[this.props.t('serviceName') , this.props.t('paymentCost'), this.props.t('paymentDate'), this.props.t('userCount') , this.props.t('paymentStatus'), this.props.t('paymentMsg'), this.props.t('paymentReqId')]}
                        body={() => {
                            return (
                                (this.props.payments ? 
                                this.props.payments.map(x => {
                                    return(
                                        <tr key={x.id} className="p-2">
                                            <td className="text-right">{x.serviceName}</td>
                                            <td className="text-right">{x.amount.toLocaleString()}</td>
                                            <td className="text-right">{new Date(x.payTime).toLocaleDateString('fa-IR')}</td>
                                            <td className="text-right">{x.userCount}</td>
                                            <td className="text-right">{(x.status == "pending" ? "در جریان" : (x.status == "success" ? "موفقیت آمیز" :"خطا"))}</td>
                                            <td className="text-right">{x.statusMessage}</td>
                                            <td className="text-right">{(x.status == "success" ? x.reqId : x.refId)}</td>
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