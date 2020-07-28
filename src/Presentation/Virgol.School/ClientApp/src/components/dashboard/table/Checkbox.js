import React from 'react';

class Checkbox extends React.Component {

    toggle = () => {
        if (!this.props.checked) this.props.check(this.props.itemId)
        else this.props.uncheck(this.props.itemId)
    }

    render() {
        return (
            <button onClick={this.toggle} className={`w-5 h-5 flex justify-center items-center focus:outline-none rounded border-2 ${this.props.checked ? 'border-green bg-green' : 'border-grayish'}`}>
            </button>
        );
    }

}

export default Checkbox;