import React from 'react';
import protectedManager from '../protectedRoutes/protectedManager';
import {GetServices , CalculateAmount , MakePay} from '../../_actions/paymensActions'
import {getNewUsers} from '../../_actions/managerActions'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { arrow_left } from '../../assets/icons';
import history from '../../history';

class Plans extends React.Component {
    
    state = {selectedPlan : null , userCount : 0 , amount : 0}

    componentDidMount = async () =>
    {
        await this.props.GetServices(this.props.user.token)
        await this.props.getNewUsers(this.props.user.token)
        
        if(this.props.services)
            this.setState({selectedPlan : this.props.services[0]})
        
        if(this.props.newUsers)
            this.onChangeUserCount(this.props.newUsers.length)
    }

    OnPayment = async () => {
        await this.props.MakePay(this.props.user.token , this.state.selectedPlan.id , this.state.userCount)
    }

    onChangeUserCount = async (userCount) => {
        await this.props.CalculateAmount(this.props.user.token , this.state.selectedPlan.id , userCount)

        if(this.props.amount)
            this.setState({userCount : userCount , amount : this.props.amount})
    }

    render() {
        return (
            <div className="tw-w-screen tw-min-h-screen tw-bg-dark-blue">
                <button onClick={() => history.goBack()} className=" tw-border-2 tw-border-light-blue tw-rounded tw-p-2 tw-mx-2 tw-my-2">{arrow_left('tw-centerize tw-text-purplish tw-w-6 tw-cursor-pointer')}</button>
                <div className="tw-w-11/12 tw-max-w-500 tw-px-2 tw-py-12 centerize tw-bg-purplish  tw-border-2 tw-border-greenish tw-rounded-xl tw-text-center">
                    {this.state.selectedPlan ? 
                    <>
                        <p className="tw-text-black-blue tw-text-xl">پرداخت آسان و مطمئن با <span className="tw-text-sky-blue">پی پینگ</span></p>
                        <div className="tw-w-full tw-my-6 tw-flex md:tw-flex-row tw-flex-col tw-justify-evenly tw-items-center">
                            <div className="tw-flex tw-flex-col tw-items-center md:tw-mb-0 tw-mb-6">
                                <span className="tw-my-1">هزینه هر دانش آموز </span>
                                <span dir="rtl" className="tw-font-vb">{this.state.selectedPlan.pricePerUser.toLocaleString()} تومان</span>
                            </div>
                            <div className="tw-flex tw-flex-col tw-items-center">
                                <span className="tw-my-1">مدت قرارداد (روز)</span>
                                <span className="tw-font-vb">{parseInt(this.state.selectedPlan.option) * 30}</span>
                            </div>
                            <div className="tw-flex tw-flex-col tw-items-center">
                                <span className="tw-my-1">تعداد دانش آموزان</span>
                                <span className="tw-font-vb">{this.state.userCount}</span>
                            </div>
                        </div>
                        <div className="tw-flex tw-flex-col tw-justify-right tw-pb-2">
                            <p className="tw-text-lg tw-font-vb tw-mb-2">مبلغ کل</p>
                            <p>{(+this.props.newUsers.length * +this.state.selectedPlan.pricePerUser).toLocaleString()}</p>
                        </div>
                        <div className="tw-flex tw-flex-col tw-justify-right tw-pb-2">
                            <p className="tw-text-lg tw-font-vb tw-mb-2">کسر از قرارداد فعلی</p>
                            <p>{(+this.props.newUsers.length * +this.state.selectedPlan.pricePerUser - +this.state.amount).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="tw-text-xl tw-font-vb tw-mb-2">( تومان ) هزینه نهایی</p>
                            <p className="tw-text-xl">{this.state.amount.toLocaleString()}</p>
                        </div>
                        <button className="tw-py-2 w-2/3 tw-mt-6 tw-px-4 tw-rounded-lg tw-mx-auto tw-bg-greenish tw-text-white" onClick={(e) => this.OnPayment()}>پرداخت</button>
                    </>
                    : null}
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , services : state.paymentsData.services 
                                        , newUsers : state.managerData.newUsers
                                        , amount : state.paymentsData.amount}
}

const cwrapped = connect(mapStateToProps , {GetServices,getNewUsers,CalculateAmount,MakePay})(protectedManager(Plans))

export default withTranslation()(cwrapped);