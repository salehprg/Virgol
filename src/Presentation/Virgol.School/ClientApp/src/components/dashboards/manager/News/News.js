import React from "react";
import { withTranslation } from 'react-i18next';
import PlusTable from "../../tables/PlusTable";
import {edit, external_link, loading, trash} from "../../../../assets/icons";
import history from "../../../../history";
import {GetMyNews , CreateNews , EditNews , RemoveNews} from "../../../../_actions/newsActions"
import {RedirectAdmin } from "../../../../_actions/adminActions"
import protectedAdmin from "../../../protectedRoutes/protectedAdmin";
import { connect } from "react-redux";
import DeleteConfirm from "../../../modals/DeleteConfirm";
import moment from 'moment-jalaali'

class News extends React.Component {

    state = { loading: false, query: '' , showDeleteModal : false}

    componentDidMount = async () => {
        this.setState({ loading: true })
        await this.props.GetMyNews(this.props.user.token);
        this.setState({ loading: false })
    }

    showDelete = (id) => {
        this.setState({showDeleteModal : true , newsId : id})
    }

    delteNews = async () => {
        await this.props.RemoveNews(this.props.user.token , this.state.newsId)
        this.setState({showDeleteModal : false , newsId : 0})
    }

    changeQuery = query => {
        this.setState({ query })
    }

    render() {
        if(this.state.loading) return loading('tw-w-10 tw-text-grayish centerize')
        return (
            <div className="tw-w-full tw-mt-10">
                {this.state.showDeleteModal ? 
                <DeleteConfirm
                    title={this.props.t('deleteConfirm')}
                    confirm={this.delteNews}
                    cancel={() => this.setState({ showDeleteModal: false, deleteFieldId: null, deleteCatId: null })}
                /> 
                : 
                null
                }
                <PlusTable
                    title={this.props.t('adminNewsList')}
                    isLoading={this.state.loading}
                    query={this.state.query}
                    changeQuery={this.changeQuery}
                    button={() => {
                        return (
                            <button onClick={() => history.push('/addNewsManager')} className="tw-px-6 tw-py-1 tw-border-2 tw-border-sky-blue tw-text-sky-blue tw-rounded-lg"> {this.props.t('addNews')} </button>
                        );
                    }}
                    headers={[this.props.t('newsText'), this.props.t('tags'), this.props.t('newsDate')]}
                    body={() => {
                        return (
                            <React.Fragment>
                                {
                                    this.props.myNews.map(x => {
                                        if(x.message.includes(this.state.query))
                                        {
                                            return(
                                            <tr key={x.id}>
                                                <td className="tw-py-4 tw-text-right tw-px-4">{x.message.split(" ").slice(0,3).map(x => x + " ")} ...</td>
                                                <td className="tw-text-right tw-px-4 tw-py-4">{x.tags ?
                                                        x.tags.split(",").slice(0,5).map((tag,i) => {
                                                        return (
                                                        (i + 1 != x.tags.split(",").slice(0,5).length ? tag + " , " : tag)
                                                    )})
                                                : null}
                                                </td>
                                                <td className="tw-text-right tw-px-4 tw-py-4">{new Date(x.createTime).toLocaleDateString('fa-IR')}</td>
                                                <td className="tw-cursor-pointer tw-text-right tw-px-4 tw-py-4" onClick={() => history.push(`/managerNews/${x.id}`)}>
                                                    {edit('tw-w-6 tw-text-white')}
                                                </td>
                                                <td className="tw-text-right tw-px-4 tw-py-4" onClick={() => this.showDelete(x.id)} className="tw-cursor-pointer">
                                                    {trash('tw-w-6 tw-text-white ')}
                                                </td>
                                            </tr>
                                            )
                                        }
                                    })
                                    
                                }
                            </React.Fragment>
                        );
                    }}
                />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , myNews : state.newsData.myNews}
}

const cwrapped = connect(mapStateToProps, { GetMyNews, CreateNews , EditNews , RemoveNews })(News);

export default withTranslation()(cwrapped);