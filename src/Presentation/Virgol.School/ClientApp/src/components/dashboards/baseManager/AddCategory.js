import React from "react";
import { withTranslation } from 'react-i18next';
import Modal from "../../modals/Modal";
import Searchish from "../../field/Searchish";
import {getBases } from "../../../_actions/schoolActions"
import { connect } from "react-redux";

class AddCategory extends React.Component {

    state = {
        query: '',
        cats: [{id: 1, name: 'دبستان'}, {id: 2, name: 'متوسطه اول'}, {id: 3, name: 'متوسطه دوم'}],
        selectedCats: []
    }

    componentDidMount = async () => {
        await this.props.getBases(this.props.user.token)
    }

    addBaseToSchool = async () => {
        this.props.onAddBase(this.state.selectedCats)
    }

    changeQuery = (query) => {
        this.setState({ query })
    }

    setCat = (id) => {
        if (!this.state.selectedCats.some(el => el === id)) {
            this.setState({ selectedCats: [...this.state.selectedCats, id] })
        } else {
            this.setState({ selectedCats: this.state.selectedCats.filter(el => el !== id)})
        }
    }

    render() {
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="tw-w-5/6 tw-max-w-800 tw-bg-bold-blue tw-px-4 tw-py-16 tw-flex tw-flex-col tw-items-center">
                    <Searchish
                        className="tw-mx-auto tw-max-w-350"
                        query={this.state.query}
                        changeQuery={this.changeQuery}
                    />
                    <div className="tw-w-11/12 tw-mt-4 tw-flex tw-flex-row-reverse tw-justify-center tw-flex-wrap">
                        {(this.props.newSchoolInfo.bases ? 
                            this.props.newSchoolInfo.bases.map(cat => {
                                if (cat.baseName.includes(this.state.query)) {
                                    return (
                                        <span onClick={() => this.setCat(cat.id)}
                                              className={`tw-px-6 tw-py-1 tw-mx-2 tw-my-2 tw-border tw-cursor-pointer ${this.state.selectedCats.some(el => el === cat.id) ? 'tw-border-sky-blue tw-text-sky-blue' : 'tw-border-white tw-text-white'}`}
                                        >
                                        {cat.baseName}
                                    </span>
                                    );
                                }
                            })
                           : this.props.t('loading')
                        )}
                    </div>
                    <div className="tw-flex tw-mt-8 tw-flex-row tw-items-center">
                        <button onClick={this.addBaseToSchool} className="tw-px-6 tw-py-1 tw-mx-1 tw-border-2 tw-border-transparent tw-rounded-lg tw-bg-greenish tw-text-white">
                            {this.props.t('save')}
                        </button>
                        <button onClick={this.props.cancel} className="tw-px-6 tw-mx-1 tw-py-1 tw-rounded-lg tw-border-2 tw-border-grayish tw-text-grayish">
                            {this.props.t('cancel')}
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

}

const mapStateToProps = state => {
    return {user: state.auth.userInfo , newSchoolInfo: state.schoolData.newSchoolInfo }
}

const cwrapped = connect(mapStateToProps, { getBases  })(AddCategory);

export default withTranslation()(cwrapped);