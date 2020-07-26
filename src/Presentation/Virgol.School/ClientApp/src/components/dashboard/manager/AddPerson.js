import React from "react";

class AddPerson extends React.Component {

    state = {
        dragging: false,
        file: null
    }
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
            this.props.handleFile(e.dataTransfer.files[0])
            this.setState({ file: e.dataTransfer.files[0] })
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }

    handleFileChange = (e) => {
        this.setState({ file: e.target.files[0] });
        this.props.handleFile(e.target.files[0]);
    }

    render() {
        return (
            <div ref={this.dropRef} className={`${this.state.dragging ? 'bg-green-200' : 'bg-white'} w-full mt-4 mx-4 flex flex-col items-center justify-center`}>
                <form className="w-3/4 flex flex-col items-center pt-4 pb-8" onSubmit={(e) => this.props.onSubmit(e)}>
                    <input
                        onChange={(e) => this.handleFileChange(e)}
                        className="hidden"
                        type="file"
                        id="excel"
                    />
                    <label htmlFor="excel" className="w-2/3 text-center cursor-pointer text-white bg-dark-green px-4 py-2 rounded-lg">آپلود فایل اکسل</label>
                    <span className="my-5">{this.state.file === null ? 'فایل اکسل را رها کنید' : this.state.file.name}</span>
                    <button className={`bg-golden my-6 hover:bg-darker-golden transition-all duration-200 font-vb text-xl text-dark-green w-full py-2 rounded-lg ${this.state.file === null ? 'hidden' : 'block'}`}>افزودن</button>
                </form>
            </div>
        );
    }

}

export default AddPerson;