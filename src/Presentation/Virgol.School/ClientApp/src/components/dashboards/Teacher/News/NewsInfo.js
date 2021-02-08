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
import {EditNews , GetNewsDetail} from "../../../../_actions/newsActions";
import getColor from "../../../../assets/colors";
import protectedTeacher from "../../../protectedRoutes/protectedTeacher";
import {styles} from '../../../../selectStyle'


class NewsInfo extends React.Component {

    state = { showManagerInfo: true , tags : []}

    options = [
        { value: 3, label: this.props.t('students') }
    ];

    componentDidMount = async() => {
        
        const newsDetail = this.props.myNews.filter(x => x.id == parseInt(this.props.match.params.id));
        await this.props.GetNewsDetail(newsDetail[0])

        let accesRole = parseInt(newsDetail[0].accessRoleId.split(",")[0])

        const Receivers = this.options.find(x => x.value == accesRole);
        this.setState({ Receivers });
    }


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
        formValues.AccessRoleIdList = [this.state.Receivers.value];
        formValues.id = parseInt(this.props.match.params.id);

        const result = await this.props.EditNews(this.props.user.token , formValues)
        if(result)
        {
            history.push('/t/myNews')
        }
        this.setState({showManagerInfo : false})
    }

    render() {
        return (
            <Add 
                isNews={true}
                newsClassName={"w-2/4"}
                onCancel={() => history.push('/t/myNews')}
                title={this.props.t('editNews')}
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

                <button type="submit" className="w-1/4 py-2 mt-4 text-white bg-purplish rounded-lg">{this.props.t('saveChanges')}</button>
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
    return {
        user: state.auth.userInfo,
        myNews : state.newsData.myNews,
        newsDetail : state.newsData.newsDetail,
        initialValues: {
            message: state.newsData.newsDetail ? state.newsData.newsDetail.message : null,
            tags: state.newsData.newsDetail ? state.newsData.newsDetail.tags : null
        }
    }
}

const formWrapped = reduxForm({
    form: 'news',
    enableReinitialize : true,
    validate
})(NewsInfo)

const authWrapped = protectedTeacher(formWrapped)
const cwrapped = connect(mapStateToProps,{EditNews , GetNewsDetail})(authWrapped);

export default withTranslation()(cwrapped);