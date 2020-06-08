import React, { Component } from 'react';
import {Avatar , Button , CssBaseline , TextField ,
       FormControlLabel , Checkbox , Link , Grid , 
       Box , Typography , Container} from '@material-ui/core';
       
// import LockOutlinedIcon from '@material-ui/icons/Lo';
import { makeStyles } from '@material-ui/core/styles';
import { authenticationService } from '../../_Services';

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

export default class SignIn extends Component {

  constructor (props)
  {
    super(props);
    this.state ={Username : "" , Password : ""};
    
  }

  classes = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  Login = async (event) =>{
    event.preventDefault();
    let result = await authenticationService.login(this.state.Username , this.state.Password);
    console.log(result);
  }
  

  render()
  {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={this.classes.paper}>
          <Avatar className={this.classes.avatar}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            ورود
          </Typography>
          <form className={this.classes.form} noValidate onSubmit={this.Login}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="نام کاربری"
              name="Username"
              autoComplete="username"
              autoFocus
              onChange = { e => this.setState({ Username : e.target.value }) }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="پسورد"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange = { e => this.setState({ Password : e.target.value }) }
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}
            >
              ورود
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  };
}
