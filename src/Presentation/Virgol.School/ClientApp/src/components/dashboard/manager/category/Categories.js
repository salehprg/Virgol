import React from 'react';
import { connect } from 'react-redux';
import { getAllCategory } from "../../../../_actions/managerActions";
import SearchBar from "../../SearchBar";
import {loading} from "../../../../assets/icons";
import CategoryCard from "./CategoryCard";
import AddCategory from "./AddCategory";
import protectedManager from "../../../protectedRoutes/protectedManager";

class Categories extends React.Component {

    state = { loading: false, showAddCategory: false, searchQuery: '' }

    async componentDidMount() {
        if (this.props.history.action === 'POP' || !this.props.categories) {
            this.setState({loading: true})
            await this.props.getAllCategory(this.props.user.token);
            this.setState({loading: false})
        }
    }

    search = (query) => {
        this.setState({ searchQuery: query })
    }

    renderCards = () => {
        if (!this.props.categories) return null;
        if (this.props.categories.length === 0) return (
            <span className="text-2xl text-grayish block text-center">هیچ مقطعی وجود ندارد</span>
        );
        return this.props.categories.map((category, index) => {
            if (category.name.includes(this.state.searchQuery)) {
                return (
                    <CategoryCard
                        key={category.id}
                        title={category.name}
                        id={category.id}
                        code={index}
                    />
                );
            }
        })
    }

    cancelAdd = () => {
        this.setState({ showAddCategory: false })
    }

    render() {
        if (this.state.loading) return <div className="flex justify-center items-center">{loading("w-16 text-grayish")}</div>
        return (
            <div className="w-full">
                {this.state.showAddCategory ? <AddCategory onAddCancel={this.cancelAdd} /> : null}
                <div className="w-full flex xl:flex-row-reverse flex-col justify-start items-center">
                    <SearchBar
                        value={this.state.searchQuery}
                        search={this.search}
                    />
                    <button onClick={() => this.setState({ showAddCategory: true })} className="py-1 px-8 xl:my-0 my-4 mx-4 bg-green rounded-full text-white focus:outline-none focus:shadow-outline">مقطع جدید</button>
                </div>

                <div className="w-full grid grid-categories mt-12">
                    {this.renderCards()}
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { user: state.auth.userInfo, categories: state.managerData.categories }
}

const authWrapped = protectedManager(Categories)
export default connect(mapStateToProps, { getAllCategory })(authWrapped);