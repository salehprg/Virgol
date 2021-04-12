import React from 'react';
import { withTranslation } from 'react-i18next';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {EditCoManager , FindCoManager} from "../../../../_actions/coManagerActions"
import { validator } from '../../../../assets/validator';
import protectedManager from "../../../protectedRoutes/protectedManager";


class CoManagerInfo extends React.Component {

    state = {selectedOption : ""}

    componentDidMount = async () => {
        this.props.FindCoManager(parseInt(this.props.match.params.id))
    }

    emptyData = async () =>{
        this.props.FindCoManager(-1)
        history.push('/m/coManagers')
    }

    renderInputs = ({ input, meta, type, placeholder , extra }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra={extra}
            />
        );
    }

    handleRadioBtnChng = (gender) =>{
        this.setState({selectedOption : gender});
    }

    onSubmit = async (formValues) => {
        
        formValues.id = parseInt(this.props.match.params.id);
        
        await this.props.EditCoManager(this.props.user.token , formValues)
    }

    render() {
        return (
            <div>
                <Add 
                    onCancel={() => this.emptyData()}
                    title={"اطلاعات معاون"}
                >
                    <form className="tw-w-full" style={{direction : "rtl"}}  onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                            <Field
                                name="firstName"
                                type="text"
                                placeholder={this.props.t('firstName')}
                                component={this.renderInputs}
                                extra={"tw-w-1/2 tw-ml-1 tw-my-4"}
                            />
                            <Field
                                name="lastName"
                                type="text"
                                placeholder={this.props.t('lastName')}
                                component={this.renderInputs}
                                extra={"tw-w-1/2 tw-mr-1 tw-my-4"}
                            />
                        </div>
                        <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                            <Field
                                name="latinFirstname"
                                type="text"
                                placeholder={this.props.t('latinFirstName')}
                                component={this.renderInputs}
                                extra={"tw-w-1/2 tw-ml-1 tw-my-4"}
                            />
                            <Field
                                name="latinLastname"
                                type="text"
                                placeholder={this.props.t('latinLastName')}
                                component={this.renderInputs}
                                extra={"tw-w-1/2 tw-mr-1 tw-my-4"}
                            />
                        </div>
                        <Field
                            name="phoneNumber"
                            type="text"
                            placeholder={this.props.t('phoneNumber')}
                            component={this.renderInputs}
                            extra={"tw-w-full tw-my-4"}
                        />
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder={this.props.t('nationCode')}
                            component={this.renderInputs}
                            extra={"tw-w-full tw-my-4"}
                        />
                        <button type="submit" className="tw-w-full tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg">{this.props.t('save')}</button>
                    </form>
                </Add>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo , 
        coManagers : state.coManagersData.coManagers,
        selectedCoManager : state.coManagersData.selectedCManager,
        initialValues: {
            firstName: state.coManagersData.selectedCManager ? state.coManagersData.selectedCManager.firstName : null,
            lastName: state.coManagersData.selectedCManager ? state.coManagersData.selectedCManager.lastName : null,
            melliCode: state.coManagersData.selectedCManager ? state.coManagersData.selectedCManager.melliCode : null,
            phoneNumber: state.coManagersData.selectedCManager ? state.coManagersData.selectedCManager.phoneNumber : null,
            latinFirstname: state.coManagersData.selectedCManager ? state.coManagersData.selectedCManager.latinFirstname : null,
            latinLastname: state.coManagersData.selectedCManager ? state.coManagersData.selectedCManager.latinLastname : null
            
        }
    }
}

const validate = formValues => {
    const errors = {}
    const { firstName, lastName, melliCode, phoneNumber } = formValues

    if (!firstName) errors.firstName = true
    if (!lastName) errors.lastName = true
    //if (!validator.checkMelliCode(melliCode)) errors.melliCode = true
    if (!phoneNumber) errors.phoneNumber = true
    
    return errors
}

const formWrapped = reduxForm({
    form: 'editCpManager',
    validate,
    enableReinitialize : true
})(CoManagerInfo)

const authWrapped = protectedManager(formWrapped)
const cwarpped = connect(mapStateToProps , {EditCoManager , FindCoManager})(authWrapped);

export default withTranslation()(cwarpped);