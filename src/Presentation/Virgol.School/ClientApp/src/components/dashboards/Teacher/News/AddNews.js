import React from "react";
import { withTranslation } from 'react-i18next';
import Add from "../../../field/Add";
import { Link } from 'react-router-dom'
import Select from 'react-select';
import { connect } from 'react-redux'
import {reduxForm, Field} from 'redux-form';
import history from "../../../../history";
import Fieldish from '../../../field/Fieldish';
import Textareaish from '../../../field/Textareaish';
import { check_circle } from "../../../../assets/icons";
import {CreateNews , ShowError} from "../../../../_actions/newsActions";
import {alert} from "../../../../_actions/alertActions";
import getColor from "../../../../assets/colors";
import protectedTeacher from "../../../protectedRoutes/protectedTeacher";
import {styles} from '../../../../selectStyle'


class AddNews extends React.Component {

    state = { showManagerInfo: true , tags : []}

    options = [
        { value: 6, label: this.props.t('students') }
    ];

    renderInputs = ({ input, meta, type, placeholder , extra }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra={extra + " my-4"}
            />
        );
    }

    renderTextArea = ({ input, meta, type, placeholder , extra }) => {
        return (
            <Textareaish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra={extra + " my-4"}
            />
        );
    }

    handleChangeDay = Receivers => {
        this.setState({ Receivers });
    };

    onSubmit = async (formValues) => {
        if(this.state.Receivers)
        {
            formValues.AccessRoleIdList = [this.state.Receivers.value];

            const result = await this.props.CreateNews(this.props.user.token , formValues , '/t/myNews')
            this.setState({showManagerInfo : false})
        }
        else
        {
            this.props.ShowError(this.props.t('sendNewsErrorNoReciever'))
        }
    }

    render() {
        return (
            <Add 
                isNews={true}
                newsClassName={"w-2/4"}
                onCancel={() => history.push('/t/myNews')}
                title={this.props.t('sendNews')}
            >
            <form className="w-full " style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Field
                    name="message"
                    type="text"
                    placeholder={this.props.t('newsText')}
                    extra={"w-full my-4 mx-2 h-40"}
                    component={this.renderTextArea}
                />
                <Field
                    name="tags"
                    type="text"
                    onChange={(e) => this.setState({tags : e.target.value.split(",")})}
                    placeholder={this.props.t('tagsInfo')}
                    extra={"w-2/4 my-4 mx-2"}
                    component={this.renderInputs}
                />
                <Select
                    styles={styles}
                    className="w-1/4 inline-grid my-4 rounded-lg"
                    value={this.state.Receivers}
                    onChange={this.handleChangeDay}
                    options={this.options}
                    placeholder={this.props.t('reciever')}
                />
                <div className="w-3/4 flex flex-wrap justify-start items-center">
                    {(this.state.tags.length > 0
                    ? 
                    this.state.tags.map((tag, i) => {
                        if(tag.trim() != "")
                        {
                            return (
                                <div className={`px-6 py-1 ml-2 mb-2 rounded-full text-white bg-${getColor(i)}`}>
                                    {tag}
                                </div>
                            );
                        }
                    })
                    : 
                    null)}
                </div>
                

                <button type="submit" className="w-1/4 py-2 mt-4 text-white bg-purplish rounded-lg">{this.props.t('add')}</button>
            </form> 
            </Add>
        );
    }

}

const validate = (formValues) => {

    const errors = {}

    if (!formValues.message) errors.message = true
    return errors;

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo}
}

const formWrapped = reduxForm({
    form: 'news',
    validate
}, mapStateToProps)(AddNews)

const authWrapped = protectedTeacher(formWrapped)
const cwrapped = connect(mapStateToProps,{CreateNews , ShowError})(authWrapped);

export default withTranslation()(cwrapped);