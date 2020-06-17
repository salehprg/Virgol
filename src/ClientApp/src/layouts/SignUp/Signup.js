import React from "react";
import { authenticationService } from '../../_Services/AuthenticationService';
import { Spinner, Alert } from 'react-bootstrap';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';

class Signup extends React.Component {

    constructor (props){
        super(props);
        this.state = {Status : 3 , Loading : false , activeStep : 0 , UserInfo : {Username : "" , Passsword : "" , FirstName : "" , LastName : ""
                                                    , MelliCode : "" , Category : "" , Shfile : null , Doc2 : null}
                      , Categories : null};
    
      }

    handleInput = (value , Property) =>{
        this.setState(prevState => ({
            UserInfo : { 
              ...prevState.UserInfo , [Property] : value
            }
          }))
    }

    onShSelected = (event) => {
        event.preventDefault();
        var ShDoc = event.target.files[0];
        let reader = new FileReader();
  
        reader.onloadend = () => {
            this.setState(prevState => ({
                UserInfo : { 
                ...prevState.UserInfo , Shfile : ShDoc
                }
            }))
        }
  
        reader.readAsDataURL(ShDoc) 
  
    }
    onDoc2Selected = (event) => {
        event.preventDefault();
        var Doc2 = event.target.files[0];
        let reader = new FileReader();
  
        reader.onloadend = () => {
            this.setState(prevState => ({
                UserInfo : { 
                ...prevState.UserInfo , Doc2 : Doc2
                }
            }))
        }
  
        reader.readAsDataURL(Doc2) 
    }
    
    async componentDidMount(){
        const CatInfo = await authenticationService.GetAllCategory();
        if(CatInfo != false)
        {
            this.setState({Categories : CatInfo})
            console.log(CatInfo);
        }
    }

    RegisterUser = async () =>{
        this.setState({Loading : true});

        const ShFile = await authenticationService.UploadFile(this.state.UserInfo.MelliCode , this.state.UserInfo.Shfile)
        if(ShFile)
        {
            const Doc2 = await authenticationService.UploadFile(this.state.UserInfo.MelliCode + "_Doc2" , this.state.UserInfo.Doc2)
            if(Doc2)
            {
            const Result = await authenticationService.Register(this.state.UserInfo , this.state.UserInfo.MelliCode);
            if(Result == true)
            {
                this.setState({Status : 1});
            }
            else
            {
                this.setState({Status : 2});
            }
            }
        }

        this.setState({Loading : false});
    }

    render() {
        return (
            <div className="bg-mbg w-screen min-h-screen flex justify-center sm:items-center">
                <div className="h-600 min-h-screen sm:min-h-0 sm:w-2/3 md:w-3/4 w-full bg-white justify-between flex flex-col justify-center items-center">
                    <div className="mt-8">
                        <span className="text-pri text-4xl">ثبت نام</span>
                    </div>
                    <form className="h-full w-full flex flex-col items-center">
                        <div className="w-full h-full pt-12 flex flex-wrap justify-center content-start">
                            <input
                                className="md:w-1/3 w-5/6 mx-12 my-8 rtl border-b border-box my-4 py-1 focus:outline-none"
                                type="text"
                                placeholder="نام"
                                id="FirstName"
                                onChange={e => this.handleInput(e.target.value , e.target.id)}
                            />
                            <input
                                className="md:w-1/3 w-5/6 mx-12 my-8 rtl border-b border-box my-4 py-1 focus:outline-none"
                                type="text"
                                placeholder="نام خانوادگی"
                                id="LastName"
                                onChange={e => this.handleInput(e.target.value , e.target.id)}
                            />
                            <input
                                className="md:w-1/3 w-5/6 mx-12 my-8 rtl border-b border-box my-4 py-1 focus:outline-none"
                                type="number"
                                placeholder="کد ملی"
                                id="MelliCode"
                                onChange={e => this.handleInput(e.target.value , e.target.id)}
                            />
                            {this.state.Categories ? 
                                <FormControl className="col-4">
                                    <InputLabel id="CategoryList">مقطع تحصیلی شما</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="Category"
                                    value={this.state.UserInfo.Category}
                                    onChange={e => (this.handleInput(e.target.value , "Category"))}
                                    >
                                        {this.state.Categories.map((Cat) => {
                                        return (
                                            <MenuItem value={Cat.id}>{Cat.name}</MenuItem>
                                        )
                                        })}
                                    </Select>
                                </FormControl>
                                
                                :
                                "درحال بارگذاری...."
                                }

                            <input type="file" accept="image/*" className="w-5/6 "
                                onChange={e => this.onShSelected(e)}/>

                            <input type="file" accept="image/*" className="w-5/6 "
                                onChange={e => this.onDoc2Selected(e)}/>

                        </div>
                        <div className="flex flex-row justify-between mt-8">
                        {this.state.Loading ? <Spinner animation="border" variant="primary" /> :
                            (
                            this.state.Status == 1 ?  
                              <Alert variant="primary" className="mt-3" style={{color : "black"}}>
                                ثبت نام با موفقیت انجام شد
                              </Alert> :
                            
                            this.state.Status == 2 ?  
                              <Alert variant="danger" className="mt-3">
                               در فرایند ثبت نام مشکلی پیش آمد
                              </Alert> :
                            this.state.Status == 3 &&  
                              <input
                                className="bg-pri px-12 py-1 mb-10 text-white rounded-lg focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={this.RegisterUser}
                                value="ثبت نام"
                            />
                            )
                        }
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;