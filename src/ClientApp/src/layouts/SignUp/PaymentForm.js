import React , {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Form } from 'react-bootstrap';

export default function PaymentForm(props) {
  const [Info , setInfo] = useState(props.SaveData);

  const onShSelected = (event) => {
      event.preventDefault();
      var ShDoc = event.target.files[0];

      let reader = new FileReader();

      reader.onloadend = () => {
        props.UpdateInfo("Shfile" , ShDoc);
      }

      reader.readAsDataURL(ShDoc) 

  }

  const onDoc2Selected = (event) => {
    event.preventDefault();
    var Doc2 = event.target.files[0];

    let reader = new FileReader();

    reader.onloadend = () => {
      props.UpdateInfo("Doc2" , Doc2);
    }

    reader.readAsDataURL(Doc2) 
}


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        مدارک هویتی
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Form style={{textAlign : "left"}}>
            <Form.File 
              id="Sh"
              label="شناسنامه"
              data-browse="Browse"
              custom
              onChange={e => onShSelected(e)}
            />
            <Form.File 
              id="Doc2"
              label="مدرک هویتی دوم"
              data-browse="Browse"
              custom
              onChange={e => onDoc2Selected(e)}
            />
          </Form>
        </Grid>
        
      </Grid>
    </React.Fragment>
  );
}
