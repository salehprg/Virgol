import React from 'react';
import { withTranslation } from 'react-i18next';
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
            fatherPhoneNumber : "",
            birthDate : (this.state.birthDate ? this.state.birthDate._d : null),
            cityBirth: formValues.cityBirth
        }

        
        await this.props.CompleteStudentProfile(this.props.user.token , data)
    }

    render() {
        return (
            <div>
                <Add
                    onCancel={() => history.push('/')}
                    title={this.props.t('completeProfile')}
                >
                    <form className="tw-w-full tw-text-right " style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <p className="tw-text-right tw-text-white tw-mb-6 tw-text-xl">{this.props.user.userInformation.firstName} {this.props.user.userInformation.lastName}</p>
                        <Field
                            name="latinFirstname"
                            type="text"
                            placeholder={this.props.t('latinFirstName')}
                            component={this.renderInputs}
                            extra={"tw-w-40 tw-my-4 tw-mx-2"}
                        />
                        <Field
                            name="latinLastname"
                            type="text"
                            placeholder={this.props.t('latinLastName')}
                            component={this.renderInputs}
                            extra={"tw-w-40 tw-my-4"}
                        />
                        {(this.state.verifiedPhone ? <p className="tw-text-right tw-text-white tw-mb-6 tw-text-xl"> شماره تلفن : {this.state.phoneNumber} </p> :
                            (!this.state.verifyPhone ? 
                            <>
                            <Field
                                name="phoneNumber"
                                type="text"
                                onChange={(e) => this.setState({phoneNumber : e.target.value})}
                                placeholder={this.props.t('phoneNumber')}
                                component={this.renderInputs}
                                extra={"tw-w-3/4 tw-my-4"}
                            />
                            <button type="button" onClick={() => this.onSendPhoneVerify()} className="tw-w-1/4 tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg">{this.props.t('sendCode')}</button>
                            </>
                            :
                            <>
                                <Field
                                name="verifyCodePhone"
                                type="text"
                                onChange={(e) => this.setState({verifyCodePhoneNumber : e.target.value})}
                                placeholder={this.props.t('enterCode')}
                                component={this.renderInputs}
                                extra={"tw-w-3/4 tw-my-4"}
                                />
                                <button type="button" onClick={() => this.onCheckVerifyPhone()} className="tw-w-1/4 tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg">{this.props.t('save')}</button>
                            </>
                            )
                        )}

                        {/* {(this.state.verifiedFatherPhone ? <p className="tw-text-right tw-text-white tw-mb-6 tw-text-xl">  شماره تلفن ولی : {this.state.fatherPhoneNumber} </p> :
                            (!this.state.verifyFatherPhone ? 
                                <>
                                <Field
                                    name="fatherPhoneNumber"
                                    type="text"
                                    onChange={(e) => this.setState({fatherPhoneNumber : e.target.value})}
                                    placeholder="شماره همراه ولی"
                                    component={this.renderInputs}
                                    extra={"tw-w-3/4 tw-my-4"}
                                />
                                <button type="button" onClick={() => this.onSendFatherPhoneVerify()} className="tw-w-1/4 tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg">ارسال کد</button>
                                </>
                                :
                                <>
                                    <Field
                                    name="verifyCodeFatherPhoneNumber"
                                    type="text"
                                    onChange={(e) => this.setState({verifyCodeFatherPhoneNumber : e.target.value})}
                                    placeholder="کد ارسال شده را وارد نمایید"
                                    component={this.renderInputs}
                                    extra={"tw-w-3/4 tw-my-4"}
                                    />
                                    <button type="button" onClick={() => this.onCheckVerifyFatherPhone()} className="tw-w-1/4 tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg">ثبت</button>
                                </>
                            )
                        )} */}
                        <Field
                            name="cityBirth"
                            type="text"
                            placeholder={this.props.t('birthPlace')}
                            component={this.renderInputs}
                            extra={"tw-w-full tw-my-4 tw-mx-2"}
                        />
                        {/* <p className="tw-text-right tw-text-white tw-mb-4 tw-text-xl">تاریخ تولد : </p>
                        <DatePicker
                            timePicker={false}
                            isGregorian={false}
                            value={this.state.birthDate}
                            onChange={value => this.setState({ birthDate : value })}
                        ></DatePicker> */
                        }

                        {/* <p className="tw-text-right tw-text-white tw-mb-4 tw-text-xl">شناسنامه</p>
                        <input
                            onChange={(e) => this.handleUploadSH(e.target.files[0])}
                            type="file"
                            id="excel"
                            accept="image/*"
                        />

                        <p className="tw-text-right tw-text-white tw-mb-4 tw-text-xl">عکس</p>
                        <input
                            onChange={(e) => this.handleUploadAX(e.target.files[0])}
                            type="file"
                            id="excel"
                            accept="image/*"
                        /> */}

                    <button type="submit" className="tw-w-full tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg">{this.props.t('save')}</button>
                    </form>

                </Add>
            </div>
        );
    }

}

const validate = formValues => {
    const errors = {}

    if (!formValues.latinFirstname || !validator.checkEnglish(formValues.latinFirstname)) errors.latinFirstname = true
    if (!formValues.latinLastname || !validator.checkEnglish(formValues.latinLastname)) errors.latinLastname = true
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
const cwarpped = connect(mapStateToProps , {CompleteStudentProfile , SendVerifyPhoneNumber , 
    CheckVerifyPhoneNumber , UploadDocuments})(authWrapped);

export default withTranslation()(cwarpped);