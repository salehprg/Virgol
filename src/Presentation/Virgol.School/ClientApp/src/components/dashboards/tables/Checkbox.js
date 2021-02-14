import React from 'react';

class Checkbox extends React.Component {

    toggle = () => {
        if (!this.props.checked) this.props.check(this.props.itemId)
        else this.props.uncheck(this.props.itemId)
    }

    render() {
        return (
            <button onClick={this.toggle} className={`tw-w-5 tw-h-5 tw-flex tw-justify-center tw-items-center focus:tw-outline-none tw-rounded tw-border-2 ${this.props.checked ? 'tw-border-greenish tw-bg-greenish' : 'tw-border-grayish'}`}>
            </button>
        );
    }

}

export default Checkbox;
