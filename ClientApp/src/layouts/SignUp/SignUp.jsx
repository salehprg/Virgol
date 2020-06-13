import React , { useState, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';
import './SignupStyle.css'
import { authenticationService } from '../../_Services/AuthenticationService';
import { Spinner, Alert } from 'react-bootstrap';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const steps = ['اطلاعات شخصی', 'ارسال مدارک'];

export default class SignUp extends Component{

  constructor (props){
    super(props);
    this.state = {Succes : 0 , Loading : false , activeStep : 0 , UserInfo : {Username : "" , Passsword : "" , FirstName : "" , LastName : ""
                                                , MelliCode : "" , Category : "" , Shfile : null , Doc2 : null}
                  , Categories : []};

  }

  async componentDidMount(){
    const CatInfo = await authenticationService.GetAllCategory();
    if(CatInfo != false)
    {
      this.setState({Categories : CatInfo})
      console.log(CatInfo);
    }
  }

  UpdateUserInfo = (Property , Value) =>{
    this.setState(prevState => ({
        UserInfo : { 
          ...prevState.UserInfo , [Property] : Value
        }
      }))
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm CategoryInfo={this.state.Categories} UpdateInfo={this.UpdateUserInfo} SaveData={this.state.UserInfo} />;
      case 1:
        return <PaymentForm UpdateInfo={this.UpdateUserInfo} SaveData={this.state.UserInfo} />;
      default:
        throw new Error('Unknown step');
    }
  }

  handleNext = () => {
    this.setState({activeStep : this.state.activeStep + 1});
  };

  handleBack = () => {
    this.setState({activeStep : this.state.activeStep - 1});
  };
  
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
          this.setState({Succes : 2});
        }
        else
        {
          this.setState({Succes : 1});
        }
      }
    }

    this.setState({Loading : false});
  }

  render ()
  {
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="absolute" color="default" className="appBar">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              <Link href="/Login">
                سیستم یکپارچه آموزش مجازی
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <main className="col-xl-6 col-lg-6 col-md-10 col-10 mr-auto ml-auto layout">
          <Paper className="p-4 m-2 mt-2">
            <Typography component="h1" variant="h4" align="center">
              ثبت نام اولیه
            </Typography>
            <Stepper activeStep={this.state.activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {this.state.activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subtitle1">
                    Your order number is #2001539. We have emailed your order confirmation, and will
                    send you an update when your order has shipped.
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {this.getStepContent(this.state.activeStep)}
                  <div className="buttons mt-2">
                    {this.state.activeStep !== 0 && (
                      <Button onClick={this.handleBack}>
                        بازگشت
                      </Button>
                    )}
                    {(this.state.activeStep !== steps.length - 1 ?
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                      >
                        بعدی
                      </Button>
                      :
                      (this.state.Loading ? <Spinner animation="border" variant="primary" /> : 
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.RegisterUser}
                        >
                          ثبت
                        </Button>
                      ))}
                  </div>
                </React.Fragment>
              )}
              {this.state.Succes == 2
              &&  
                <Alert variant="primary" className="mt-3" style={{color : "black"}}>
                  ثبت نام با موفقیت انجام شد
                </Alert>
              }
              {this.state.Succes == 1 &&
                <Alert variant="danger" className="mt-3">
                 در فرایند ثبت نام مشکلی پیش آمد
                </Alert>
              }
            </React.Fragment>
          </Paper>
          <Copyright />
        </main>
      </React.Fragment>
    );
  }
}
