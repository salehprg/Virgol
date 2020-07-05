import React from 'react';
import {loading} from "../assets/icons";
import { connect } from 'react-redux';
import { forgotPassword } from "../actions";

class ForgotPassCode extends React.Component {

    state = { code1: "", code2: "", code3: "", code4: "", code5: "", code6: "", }
    curr1 = React.createRef();
    curr2 = React.createRef();
    curr3 = React.createRef();
    curr4 = React.createRef();
    curr5 = React.createRef();
    curr6 = React.createRef();

    CODE_LENGTH = new Array(6).fill(0);

    componentDidMount() {
        this.curr1.current.focus();
    }

    write = (e, index) => {
        const code = e.target.value;
        switch (index) {
            case 0: {
                this.setState({ code1: code });
                this.curr2.current.focus();
                break;
            }
            case 1: {
                this.setState({code2: code});
                this.curr3.current.focus();
                break;
            }
            case 2: {
                this.setState({code3: code});
                this.curr4.current.focus();
                break;
            }
            case 3: {
                this.setState({code4: code});
                this.curr5.current.focus();
                break;
            }
            case 4: {
                this.setState({code5: code});
                this.curr6.current.focus();
                break;
            }
            case 5: {
                this.setState({code6: code});
                this.curr6.current.blur();
                break;
            }
        }
    }

    printValue = (index) => {
        switch (index) {
            case 0: return this.state.code1;
            case 1: return this.state.code2;
            case 2: return this.state.code3;
            case 3: return this.state.code4;
            case 4: return this.state.code5;
            case 5: return this.state.code6;
        }
    }

    getRef = (index) => {
        switch (index) {
            case 0: return this.curr1;
            case 1: return this.curr2;
            case 2: return this.curr3;
            case 3: return this.curr4;
            case 4: return this.curr5;
            case 5: return this.curr6;
        }
    }

    back = (e, index) => {
        if (e.keyCode === 8) {
            switch (index) {
                case 1:
                    if (this.state.code2 === "") {
                        this.setState({ code1: "" })
                        this.curr1.current.focus();
                    } else {
                        this.setState({ code2: "" })
                    }
                    break;

                case 2:
                    if (this.state.code3 === "") {
                        this.setState({ code2: "" })
                        this.curr2.current.focus();
                    } else {
                        this.setState({ code3: "" })
                    }
                    break;

                case 3:
                    if (this.state.code4 === "") {
                        this.setState({ code3: "" })
                        this.curr3.current.focus();
                    } else {
                        this.setState({ code4: "" })
                    }
                    break;

                case 4:
                    if (this.state.code5 === "") {
                        this.setState({ code4: "" })
                        this.curr4.current.focus();
                    } else {
                        this.setState({ code5: "" })
                    }
                    break;

                case 5:
                    if (this.state.code6 === "") {
                        this.setState({ code5: "" })
                        this.curr5.current.focus();
                    } else {
                        this.setState({ code6: "" })
                    }
                    break;
            }
        }
    }

    getCode = () => {
        let code = ""
        code = code + this.state.code1
        code = code + this.state.code2
        code = code + this.state.code3
        code = code + this.state.code4
        code = code + this.state.code5
        code = code + this.state.code6
        return code;
    }

    submitCode = () => {
        if (this.getCode().length === 6) {
            this.props.forgotPassword(this.props.melliCode, this.getCode());
        }
    }

    render() {
        return(
            <div className="flex flex-col items-center">
                <p>کد شش رقمی ارسال شده را وارد کنید</p>
                <div className="flex flex-row my-8">
                    {this.CODE_LENGTH.map((v, index) => {
                        return (
                            <div className="w-10 h-10 mx-1 border-b-2 border-dark-blue">
                                <input
                                    ref={this.getRef(index)}
                                    value={this.printValue(index)}
                                    onChange={(e) => this.write(e, index)}
                                    onKeyDown={(e) => this.back(e, index)}
                                    className="w-full bg-transparent border-none text-center focus:outline-none"
                                    type="text"
                                    maxLength="1"
                                />
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={this.submitCode}
                    className="bg-golden hover:bg-darker-golden transition-all duration-200 flex justify-center font-vb text-xl text-dark-green w-full py-2 rounded-lg">
                    {this.props.isThereLoading && this.props.loadingComponent === 'forgotPass' ? loading("w-8 h-8 text-dark-green") : 'تایید'}
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        melliCode: state.auth.sendCode.melliCode,
        isThereLoading: state.loading.isThereLoading,
        loadingComponent: state.loading.loadingComponent
    }
}

export default connect(mapStateToProps, { forgotPassword })(ForgotPassCode);