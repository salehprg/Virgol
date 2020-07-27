import React from 'react';
import {minus} from "../../../assets/icons";

class HeaderCheckbox extends React.Component {

    masterClick = () => {
        if (this.props.selected.length === 0) this.props.selectAll()
        else this.props.clear()
    }

    renderBox = () => {
        if (this.props.selected.length === 0) {
            return (
                <button onClick={this.masterClick} className="w-5 h-5 focus:outline-none rounded border-2 border-grayish">
                </button>
            );
        } else {
            return (
                <button onClick={this.masterClick} className="w-5 h-5 flex justify-center items-center focus:outline-none rounded bg-green border-2 border-green">
                    {minus("w-2/3 text-white")}
                </button>
            );
        }
    }

    render() {
        return this.renderBox()
    }

}

export default HeaderCheckbox;