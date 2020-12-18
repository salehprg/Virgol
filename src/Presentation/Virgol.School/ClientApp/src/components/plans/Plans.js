import React from 'react';
import protectedManager from '../protectedRoutes/protectedManager';
import {GetServices , CalculateAmount , MakePay} from '../../_actions/paymensActions'
import {getNewUsers} from '../../_actions/managerActions'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

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
            <div className="w-screen min-h-screen bg-dark-blue">
                <div className="w-11/12 max-w-500 px-2 py-12 centerize bg-white rounded-xl text-center">
                    {this.state.selectedPlan ? 
                    <>
                        <p className="text-black-blue text-xl">پرداخت آسان و مطمئن با <span className="text-sky-blue">پی پینگ</span></p>
                        <div className="w-full my-6 flex md:flex-row flex-col justify-evenly items-center">
                            <div className="flex flex-col items-center md:mb-0 mb-6">
                                <span className="my-1">هزینه هر دانش آموز </span>
                                <span dir="rtl" className="font-vb">{this.state.selectedPlan.pricePerUser.toLocaleString()} تومان</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="my-1">مدت قرارداد</span>
                                <span className="font-vb">{this.state.selectedPlan.option}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="my-1">تعداد دانش آموزان</span>
                                <span className="font-vb">{this.state.userCount}</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-right pb-2">
                            <p className="text-lg font-vb mb-2">مبلغ کل</p>
                            <p>{(+this.props.newUsers.length * +this.state.selectedPlan.pricePerUser).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col justify-right pb-2">
                            <p className="text-lg font-vb mb-2">کسر از قرارداد فعلی</p>
                            <p>{(+this.props.newUsers.length * +this.state.selectedPlan.pricePerUser - +this.state.amount).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xl font-vb mb-2">( تومان ) هزینه نهایی</p>
                            <p className="text-xl">{this.state.amount.toLocaleString()}</p>
                        </div>
                        <button className="py-2 w-2/3 mt-6 rounded-lg mx-auto bg-greenish text-white" onClick={(e) => this.OnPayment()}>پرداخت</button>
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