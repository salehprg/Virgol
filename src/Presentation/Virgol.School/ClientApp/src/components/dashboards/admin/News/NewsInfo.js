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
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import {styles} from '../../../../selectStyle'


class NewsInfo extends React.Component {

    state = { showManagerInfo: true , tags : []}

    options = [
        { value: 4, label: this.props.t('schoolManagers') },
        { value: 3, label: this.props.t('students') },
        { value: 2, label: this.props.t('teachers') }
    ];

    componentDidMount = async() => {
        
        const newsDetail = this.props.myNews.filter(x => x.id == parseInt(this.props.match.params.id))[0];
        await this.props.GetNewsDetail(newsDetail)

        let accesRole = parseInt(newsDetail.accessRoleId.split(",")[0])

        const Receivers = this.options.find(x => x.value == accesRole);
        this.setState({ Receivers , tags : newsDetail.tagsStr});
    }

    componentWillReceiveProps() {
        this.render();
    }

    renderInputs = ({ input, meta, type, placeholder , extra }) => {
        return (
            <Fieldish
                input={input}
                redCondition={meta.touched && meta.error}
                type={type}
                dir="rtl"
                placeholder={placeholder}
                extra={extra + " tw-my-4"}
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
                extra={extra + " tw-my-4"}
            />
        );
    }

    handleChangeDay = Receivers => {
        this.setState({ Receivers });
    };

    onSubmit = async (formValues) => {
        formValues.AccessRoleIdList = [this.state.Receivers.value]
        formValues.id = parseInt(this.props.match.params.id)

        const result = await this.props.EditNews(this.props.user.token , formValues)
        if(result)
        {
            history.push('/a/news')
        }
        this.setState({showManagerInfo : false})
    }

    render() {
        return (
            <Add 
                isNews={true}
                newsClassName={"tw-w-2/4"}
                onCancel={() => history.push('/a/news')}
                title={this.props.t('editNews')}
            >
            <form className="tw-w-full " style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Field
                    name="message"
                    type="text"
                    placeholder={this.props.t('newsText')}
                    extra={"tw-w-full tw-my-4 tw-mx-2 tw-h-40"}
                    component={this.renderTextArea}
                />
                <Field
                    name="tags"
                    type="text"
                    onChange={(e) => this.setState({tags : e.target.value.split(",")})}
                    placeholder={this.props.t('tagsInfo')}
                    extra={"w-2/4 tw-my-4 tw-mx-2"}
                    component={this.renderInputs}
                />
                <Select
                    styles={styles}
                    className="tw-w-1/4 tw-inline-grid tw-my-4 tw-rounded-lg"
                    value={this.state.Receivers}
                    onChange={this.handleChangeDay}
                    options={this.options}
                    placeholder={this.props.t('reciever')}
                />
                <div className="tw-w-3/4 tw-flex tw-flex-wrap tw-justify-start tw-items-center">
                    {(this.state.tags.length > 0
                    ? 
                    this.state.tags.map((tag, i) => {
                        if(tag.trim() != "")
                        {
                            return (
                                <div className={`tw-px-6 tw-py-1 tw-ml-2 tw-mb-2 tw-rounded-full tw-text-white tw-bg-${getColor(i)}`}>
                                    {tag}
                                </div>
                            );
                        }
                    })
                    : 
                    null)}
                </div>

                <button type="submit" className="tw-w-1/4 tw-py-2 tw-mt-4 tw-text-white tw-bg-purplish tw-rounded-lg"> {this.props.t('saveChanges')} </button>
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

const authWrapped = protectedAdmin(formWrapped)
const cwrapped = connect(mapStateToProps,{EditNews , GetNewsDetail})(authWrapped);

export default withTranslation()(cwrapped);