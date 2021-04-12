import React from 'react';
import { withTranslation } from 'react-i18next';
import history from '../../../../history'
import Add from '../../../field/Add';
import Fieldish from '../../../field/Fieldish';
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux';
import {AddNewCoManager } from "../../../../_actions/coManagerActions"
import { validator } from '../../../../assets/validator'
import protectedManager from "../../../protectedRoutes/protectedManager";

class AddCoManager extends React.Component {

    state = {selectedOption : "CoManager"}

    renderInputs = ({ input, meta, type, placeholder }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra="tw-w-full tw-my-4"
            />
        );
    }

    onSubmit = async (formValues) => {
        
        let data = formValues;
        
        await this.props.AddNewCoManager(this.props.user.token , data)
    }

    render() {
        return (
                <Add
                    onCancel={() => history.push('/m/coManagers')}
                    title={"افزودن معاون جديد"}
                >
                    <form className="tw-w-full" style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        <Field
                            name="firstName"
                            type="text"
                            placeholder={this.props.t('firstName')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="lastName"
                            type="text"
                            placeholder={this.props.t('lastName')}
                            component={this.renderInputs}
                        />
                        <div className="tw-w-full tw-flex tw-flex-row tw-justify-between tw-items-center">
                            <Field
                                name="latinFirstname"
                                type="text"
                                placeholder={this.props.t('latinFirstName')}
                                extra={"tw-w-1/2 tw-my-4 tw-mx-2"}
                                component={this.renderInputs}
                            />
                            <Field
                                name="latinLastname"
                                type="text"
                                extra={"tw-w-1/2 tw-my-4"}
                                placeholder={this.props.t('latinLastName')}
                                component={this.renderInputs}
                            />
                        </div>
                        <Field
                            name="melliCode"
                            type="text"
                            placeholder={this.props.t('nationCode')}
                            component={this.renderInputs}
                        />
                        <Field
                            name="phoneNumber"
                            type="text"
                            placeholder={this.props.t('phoneNumber')}
                            component={this.renderInputs}
                        />
                        <button type="submit" className="tw-w-full tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg"> {this.props.t('save')} </button>
                    </form>
                </Add>
        );
    }

}

const validate = formValues => {
    const errors = {}
    const { firstName, latinLastname, latinFirstname, lastName, melliCode} = formValues

    if (!firstName) errors.firstName = true
    if (!latinLastname) errors.latinLastname = true
    if (!latinFirstname) errors.latinFirstname = true
    if (!lastName) errors.lastName = true
    if (!validator.checkMelliCode(melliCode)) errors.melliCode = true
    
    return errors
}

const mapStateToProps = state => {
    return {
        user: state.auth.userInfo 
    }
}

const formWrapped = reduxForm({
    form: 'addCoManager',
    validate
})(AddCoManager)

const authWrapped = protectedManager(formWrapped)
const cwrapped = connect(mapStateToProps , {AddNewCoManager })(authWrapped);

export default withTranslation()(cwrapped);