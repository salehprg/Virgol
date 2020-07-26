import React from 'react';
import { connect } from 'react-redux';
import { addBulkTeacher } from "../../../../_actions/managerActions";
import history from "../../../../history";
import {clear, excel} from "../../../../assets/icons";

class AddTeacherByExcel extends React.Component {

    state = { dragging : false, file: null }
    dropRef = React.createRef();

    componentDidMount() {
        this.dragCounter = 0
        let div = this.dropRef.current;
        div.addEventListener('dragenter', this.handleDragEnter)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
    }

    componentWillUnmount() {
        let div = this.dropRef.current;
        div.removeEventListener('dragenter', this.handleDragEnter)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }

    handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({dragging: true})
        }
    }

    handleDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--;
        if (this.dragCounter > 0) return
        this.setState({dragging: false})
    }

    handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({dragging: false})
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.setState({ file: e.dataTransfer.files[0] })
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }

    handleFileChange = (e) => {
        this.setState({ file: e.target.files[0] });
    }

    submit = () => {
        if (this.state.file != null) {
            this.props.addBulkTeacher(this.props.token, this.state.file);
            history.push("/m/dashboard");
        }
    }

    render() {
        return (
            <div className="w-screen min-h-screen bg-green-800 flex justify-center items-center">
                <div className="max-w-1000 py-12 relative w-5/6 bg-white flex flex-col justify-center items-center">
                    <div onClick={() => history.push("/m/dashboard")} className="absolute test">
                        {clear("w-6 h-8 text-black cursor-pointer")}
                    </div>
                    <span className="my-4 text-xl font-vb">یک فایل اکسل مطابق با نمونه زیر اپلود کنید و باقی کارها را به ما بسپارید</span>
                    <a className="my-4 text-green-600 transition-all duration-200 hover:text-green-900" href="/studentSample.xlsx" download>
                        دریافت فایل اکسل نمونه
                    </a>
                    <div ref={this.dropRef} className={`w-1/2 my-2 py-4 flex flex-col justify-center items-center border-2 border-dashed border-green-800 ${this.state.dragging ? 'bg-green-200' : 'bg-white'}`}>
                        {excel(`w-24 h-24 ${this.state.dragging || this.state.file ? 'text-green-800' : 'text-grayish'}`)}
                        <span className="my-8">فایل اکسل را رها کنید</span>
                        <input
                            onChange={(e) => this.handleFileChange(e)}
                            className="hidden"
                            type="file"
                            id="excel"
                        />
                        <label htmlFor="excel" className="w-2/3 text-center cursor-pointer text-white bg-dark-green px-4 py-2 rounded-lg">جست و جوی فایل</label>
                    </div>
                    <button onClick={this.submit} className={`mt-4 bg-golden text-dark-green transition-all duration-200 font-vb text-xl px-16 py-2 focus:outline-none focus:shadow-outline rounded-lg ${this.state.file === null ? 'invisible' : 'visible'}`}>افزودن</button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return { token: state.auth.userInfo.token }
}

export default connect(mapStateToProps, { addBulkTeacher })(AddTeacherByExcel);