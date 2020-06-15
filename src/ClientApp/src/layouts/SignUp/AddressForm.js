import React , { useState , useEffect }from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';

export default function AddressForm(props) {
  
  const [Info , setInfo] = useState(props.SaveData);


  const handleInput = (value , Property) =>{
    
    setInfo({...Info , [Property] : value});
    props.UpdateInfo(Property , value);
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        اطلاعات تحصیلی
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="FirstName"
            name="firstName"
            label="نام"
            fullWidth
            autoComplete="given-name"
            defaultValue={Info.FirstName}
            onChange={e => handleInput(e.target.value , e.target.id)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="LastName"
            name="lastName"
            label="نام خانوادگی"
            fullWidth
            autoComplete="family-name"
            defaultValue={Info.LastName}
            onChange={e => handleInput(e.target.value , e.target.id)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="MelliCode"
            name="address1"
            label="کد ملی"
            fullWidth
            autoComplete="shipping address-line1"
            defaultValue={Info.MelliCode}
            onChange={e => handleInput(e.target.value , e.target.id)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {props.CategoryInfo ? 
              <FormControl className="col-12">
                <InputLabel id="CategoryList">مقطع تحصیلی شما</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="Category"
                  value={Info.Category}
                  onChange={e => (handleInput(e.target.value , "Category"))}
                >
                {props.CategoryInfo.map((Cat) => {
                  return (
                  <MenuItem value={Cat.id}>{Cat.name}</MenuItem>
                  )
                })}
                </Select>
              </FormControl>
            
            :
            "درحال بارگذاری...."
            }
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="نام مدرسه"
            fullWidth
            autoComplete="shipping address-level2"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
