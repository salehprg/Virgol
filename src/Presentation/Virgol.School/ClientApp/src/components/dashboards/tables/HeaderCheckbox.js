import React from 'react';
import {chevron} from "../../../assets/icons";

class HeaderCheckbox extends React.Component {

    masterClick = () => {
        if (this.props.selected.length === 0) this.props.selectAll()
        else this.props.clear()
    }

    renderBox = () => {
        if (this.props.selected.length === 0) {
            return (
                <button onClick={this.masterClick} className="tw-w-5 tw-h-5 focus:tw-outline-none tw-rounded tw-border-2 tw-border-grayish">
                </button>
            );
        } else {
            return (
                <button onClick={this.masterClick} className="tw-w-5 tw-h-5 tw-flex tw-justify-center tw-items-center focus:tw-outline-none tw-rounded tw-bg-greenish tw-border-2 tw-border-greenish">
                    {chevron("w-2/3 tw-text-white")}
                </button>
            );
        }
    }

    render() {
        return this.renderBox()
    }

}

export default HeaderCheckbox;
