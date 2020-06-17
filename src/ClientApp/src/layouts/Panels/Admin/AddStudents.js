import React from "react";
import Card from "../../../components/Card";
import {adminService} from '../../../_Services/AdminService'
import { Spinner } from "react-bootstrap";

class AddStudents extends React.Component {

    constructor(props){
        super(props);

        this.state = { Loading : false , BulkData : null};
    }

    handleInputFile = (event) => {
        event.preventDefault();
        var Bulkdata = event.target.files[0];
  
        let reader = new FileReader();
  
        reader.onloadend = () => {
          this.setState({BulkData : Bulkdata});
        }
  
        reader.readAsDataURL(Bulkdata) 
    }

    AddBulkUser = async () =>{
        this.setState({Loading : true});

        await adminService.AddBulkStudent(this.state.BulkData)
        
        this.setState({Loading : false});
    }

    render() {
        return (
            <div className="md:w-1/5 w-5/6 h-500 md:order-1 order-2 md:mt-0 mt-6">
                <Card title="افزودن دانش آموز">
                    <form noValidate className="flex flex-col h-full justify-between items-center">
                        <div className="h-full w-full flex flex-col justify-center">
                            <span className="">فایل اکسل اپلود کنید</span>
                        </div>
                        <div>
                            <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                            className="w-5/6 "
                            onChange={e => this.handleInputFile(e)}/>

                            {(!this.state.Loading ?
                            <input
                                className="bg-pri px-12 py-1 mb-6 mt-8 text-white rounded-lg focus:outline-none focus:shadow-outline"
                                type="submit"
                                onClick={this.AddBulkUser}
                                value="افزودن"
                            />
                            :
                            <Spinner animation="border" variant="primary" />
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        );
    }

}

export default AddStudents;