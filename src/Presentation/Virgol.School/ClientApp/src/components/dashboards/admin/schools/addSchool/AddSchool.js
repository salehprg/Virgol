import React from "react";
import Add from "../../../../field/Add";
import history from "../../../../../history";
import BaseInfo from "./BaseInfo";

class AddSchool extends React.Component {

    state = {
        page: 1
    }

    nextPage = () => {
        this.setState({ page: this.state.page + 1 })
    }

    previousPage = () => {
        this.setState({ page: this.state.page - 1 })
    }

    onSubmit = (formValues) => {

    }

    renderPanel = () => {
        if (this.state.page === 1) {
            return (
                <BaseInfo
                    onCancel={() => history.push('/a/schools')}
                    onSubmit={this.nextPage}
                />
            );
        } else if (this.state.page === 2) {
            return (
                <Add
                    onCancel={this.previousPage}
                    onSubmit={this.nextPage}
                >

                </Add>
            );
        } else {
            return (
                <Add
                    onCancel={this.previousPage}
                    onSubmit={this.onSubmit}
                >

                </Add>
            );
        }
    }

    render() {
        return (
            <>
                {this.renderPanel()}
            </>
        );
    }

}

export default AddSchool;