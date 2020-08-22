import React from 'react';
import DatePicker from 'react-datepicker2';
import history from '../../../history'
import Add from '../../field/Add';
import Fieldish from '../../field/Fieldish';
import { reduxForm, Field, formValues } from 'redux-form'
import { connect } from 'react-redux';
import { CompleteStudentProfile , SendVerifyPhoneNumber , CheckVerifyPhoneNumber , UploadDocuments} from "../../../_actions/authActions"
import moment from 'moment-jalaali'
import {validator} from '../../../assets/validator'
import protectedStudent from "../../protectedRoutes/protectedStudent";

class CompleteProfile extends React.Component {

    state = {birthDate : moment() , 
        // shDocUploaded : 0, //0 = notSelected , 1 = Uploading , 2 = Uploaded
        // axDocUploaded : 0, //0 = notSelected , 1 = Uploading , 2 = Uploaded
        verifyPhone : false , 
        verifiedPhone : false , 
        phoneNumber : "" , 
        verifyCodePhoneNumber : "" , 
        verifyFatherPhone : false ,  
        verifiedFatherPhone : false , 
        fatherPhoneNumber : "" ,
        verifyCodeFatherPhoneNumber : "" }

    renderInputs = ({ input, meta, type, placeholder,extra }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra={`${extra}`}
            />
        );
    }

    onSendPhoneVerify () {
        this.setState({verifyPhone : true});
        this.sendVerifyPhone();
    }
    sendVerifyPhone = async () => {
        const result = await this.props.SendVerifyPhoneNumber(this.state.phoneNumber , this.props.user.token , 0);
        
        if(!result)
        {
            this.setState({verifyPhone : false});
        }
    }
    onCheckVerifyPhone = async () => {
        const result = await this.props.CheckVerifyPhoneNumber(this.state.phoneNumber , this.state.verifyCodePhoneNumber , this.props.user.token , 0);
        if(result)
        {
            this.setState({verifiedPhone : true})
        }
        else
        {
            this.setState({verifiedPhone : false , verifyPhone : false})
        }
        
    }



    onSendFatherPhoneVerify () {
        this.setState({verifyFatherPhone : true});
        this.sendVerifyFatherPhone();
    }
    sendVerifyFatherPhone = async () => {
        const result = await this.props.SendVerifyPhoneNumber(this.state.fatherPhoneNumber , this.props.user.token , 1);
        if(!result)
        {
            this.setState({verifyFatherPhone : false});
        }
    }
    onCheckVerifyFatherPhone = async () => {
        const result = await this.props.CheckVerifyPhoneNumber(this.state.fatherPhoneNumber , this.state.verifyCodeFatherPhoneNumber , this.props.user.token , 1);
        if(result)
        {
            this.setState({verifiedFatherPhone : true})
        }
        else
        {
            this.setState({verifiedFatherPhone : false ,verifyFatherPhone : false})
        }
    }

    handleUploadSH = async shDoc => {

        //this.setState({shDocUploaded : 1});

        const result = await this.props.UploadDocuments(this.props.user.token , shDoc , 0)
        // if(result)
        // {
        //     this.setState({shDocUploaded : 2});
        // }
        // else
        // {
        //     this.setState({shDocUploaded : 0});
        // }
    }

    handleUploadAX = async axDoc => {

        //this.setState({axDocUploaded : 1});

        const result = await this.props.UploadDocuments(this.props.user.token , axDoc , 1)
        // if(result)
        // {
        //     this.setState({axDocUploaded : 2});
        // }
        // else
        // {
        //     this.setState({axDocUploaded : 0});
        // }
    }


    onSubmit = async (formValues) => {
        
        let data = formValues;

        data.studentDetail = {
            fatherPhoneNumber : formValues.fatherPhoneNumber,
            birthDate : (this.state.birthDate ? this.state.birthDate._d : null),
            cityBirth: formValues.cityBirth
        }

        console.log(data)
        
        await this.props.CompleteStudentProfile(this.props.user.token , data)
    }

    render() {
        return (
            <div>
                <Add
                    onCancel={() => history.push('/')}
                    title={"لطفا اطلاعات پروفایل خودرا تکمیل نمایید"}
                >
                    <form className="w-full text-right " style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <p className="text-right text-white mb-6 text-xl">{this.props.user.userInformation.firstName} {this.props.user.userInformation.lastName}</p>
                        <Field
                            name="latinFirstname"
                            type="text"
                            placeholder="نام لاتین"
                            component={this.renderInputs}
                            extra={"w-40 my-4 mx-2"}
                        />
                        <Field
                            name="latinLastname"
                            type="text"
                            placeholder="نام خانوادگی لاتین"
                            component={this.renderInputs}
                            extra={"w-40 my-4"}
                        />
                        {(this.state.verifiedPhone ? <p className="text-right text-white mb-6 text-xl"> شماره تلفن : {this.state.phoneNumber} </p> :
                            (!this.state.verifyPhone ? 
                            <>
                            <Field
                                name="phoneNumber"
                                type="text"
                                onChange={(e) => this.setState({phoneNumber : e.target.value})}
                                placeholder="شماره همراه"
                                component={this.renderInputs}
                                extra={"w-3/4 my-4"}
                            />
                            <button type="button" onClick={() => this.onSendPhoneVerify()} className="w-1/4 py-2 mt-4 text-white bg-purplish rounded-lg">ارسال کد</button>
                            </>
                            :
                            <>
                                <Field
                                name="verifyCodePhone"
                                type="text"
                                onChange={(e) => this.setState({verifyCodePhoneNumber : e.target.value})}
                                placeholder="کد ارسال شده را وارد نمایید"
                                component={this.renderInputs}
                                extra={"w-3/4 my-4"}
                                />
                                <button type="button" onClick={() => this.onCheckVerifyPhone()} className="w-1/4 py-2 mt-4 text-white bg-purplish rounded-lg">ثبت</button>
                            </>
                            )
                        )}

                        {(this.state.verifiedFatherPhone ? <p className="text-right text-white mb-6 text-xl">  شماره تلفن ولی : {this.state.fatherPhoneNumber} </p> :
                            (!this.state.verifyFatherPhone ? 
                                <>
                                <Field
                                    name="fatherPhoneNumber"
                                    type="text"
                                    onChange={(e) => this.setState({fatherPhoneNumber : e.target.value})}
                                    placeholder="شماره همراه ولی"
                                    component={this.renderInputs}
                                    extra={"w-3/4 my-4"}
                                />
                                <button type="button" onClick={() => this.onSendFatherPhoneVerify()} className="w-1/4 py-2 mt-4 text-white bg-purplish rounded-lg">ارسال کد</button>
                                </>
                                :
                                <>
                                    <Field
                                    name="verifyCodeFatherPhoneNumber"
                                    type="text"
                                    onChange={(e) => this.setState({verifyCodeFatherPhoneNumber : e.target.value})}
                                    placeholder="کد ارسال شده را وارد نمایید"
                                    component={this.renderInputs}
                                    extra={"w-3/4 my-4"}
                                    />
                                    <button type="button" onClick={() => this.onCheckVerifyFatherPhone()} className="w-1/4 py-2 mt-4 text-white bg-purplish rounded-lg">ثبت</button>
                                </>
                            )
                        )}
                        <Field
                            name="cityBirth"
                            type="text"
                            placeholder="شهر محل تولد"
                            component={this.renderInputs}
                            extra={"w-full my-4 mx-2"}
                        />
                        {/* <p className="text-right text-white mb-4 text-xl">تاریخ تولد : </p>
                        <DatePicker
                            timePicker={false}
                            isGregorian={false}
                            value={this.state.birthDate}
                            onChange={value => this.setState({ birthDate : value })}
                        ></DatePicker> */
                        }

                        {/* <p className="text-right text-white mb-4 text-xl">شناسنامه</p>
                        <input
                            onChange={(e) => this.handleUploadSH(e.target.files[0])}
                            type="file"
                            id="excel"
                            accept="image/*"
                        />

                        <p className="text-right text-white mb-4 text-xl">عکس</p>
                        <input
                            onChange={(e) => this.handleUploadAX(e.target.files[0])}
                            type="file"
                            id="excel"
                            accept="image/*"
                        /> */}

                        <button type="submit" className="w-full py-2 mt-4 text-white bg-purplish rounded-lg">ذخیره</button>
                    </form>

                </Add>
            </div>
        );
    }

}

const validate = formValues => {
    const errors = {}

    if (!formValues.latinFirstname) errors.latinFirstname = true
    if (!formValues.latinLastname) errors.latinLastname = true
    if (!formValues.phoneNumber) errors.phoneNumber = true
    if (!formValues.fatherPhoneNumber) errors.fatherPhoneNumber = true
    if (!formValues.cityBirth) errors.cityBirth = true

    return errors;
}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo ,
        initialValues: {
            firstName: state.auth.userInfo.userInformation ? state.auth.userInfo.userInformation.firstName : null,
            lastName: state.auth.userInfo.userInformation ? state.auth.userInfo.userInformation.lastName : null
        }
    }
}

const formWrapped = reduxForm({
    form: 'teacherProfile',
    enableReinitialize : true,
    validate
})(CompleteProfile)

const authWrapped = protectedStudent(formWrapped)

export default connect(mapStateToProps , {CompleteStudentProfile , SendVerifyPhoneNumber , 
                                            CheckVerifyPhoneNumber , UploadDocuments})(authWrapped);