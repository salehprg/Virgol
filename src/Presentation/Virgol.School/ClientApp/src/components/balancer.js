import React, { Component } from "react";
import equal from "fast-deep-equal";

const propsWithoutLocation = props => {
    const { location, ...rest } = props;
    return rest;
};

export default WrappedComponent => {
    class HOC extends Component {
        shouldComponentUpdate(nextProps) {
            return !equal(propsWithoutLocation(nextProps), propsWithoutLocation(this.props));
        }
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
    return HOC;
};