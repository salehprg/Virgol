import React from "react";
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


class NewsInfo extends React.Component {

    state = { showManagerInfo: true , tags : []}

    options = [
        { value: 4, label: 'مدیران مدارس' },
        { value: 3, label: 'دانش آموزان' },
        { value: 2, label: 'معلمان' }
    ];

    componentDidMount = async() => {
        
        const newsDetail = this.props.myNews.filter(x => x.id == parseInt(this.props.match.params.id))[0];
        await this.props.GetNewsDetail(newsDetail)

        let accesRole = parseInt(newsDetail.accessRoleId.split(",")[0])

        const Receivers = this.options.find(x => x.value == accesRole);
        console.log(newsDetail)
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
                newsClassName={"w-2/4"}
                onCancel={() => history.push('/a/news')}
                title="ویرایش خبر"
            >
            <form className="w-full " style={{direction : "rtl"}} onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Field
                    name="message"
                    type="text"
                    placeholder="متن خبر"
                    extra={"w-full my-4 mx-2 h-40"}
                    component={this.renderTextArea}
                />
                <Field
                    name="tags"
                    type="text"
                    onChange={(e) => this.setState({tags : e.target.value.split(",")})}
                    placeholder="تگ هارا با , از هم جدا کنید"
                    extra={"w-2/4 my-4 mx-2"}
                    component={this.renderInputs}
                />
                <Select
                    className="w-1/4 inline-grid my-4 rounded-lg"
                    value={this.state.Receivers}
                    onChange={this.handleChangeDay}
                    options={this.options}
                    placeholder="گیرنده"
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

                <button type="submit" className="w-1/4 py-2 mt-4 text-white bg-purplish rounded-lg">ثبت تغییرات</button>
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

export default connect(mapStateToProps,{EditNews , GetNewsDetail})(formWrapped);