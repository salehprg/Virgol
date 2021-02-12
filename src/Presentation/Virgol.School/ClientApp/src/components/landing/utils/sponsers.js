import React from 'react';

const Sponsers = () => {
    return(
        <div>
            <div className="text-center my-8" style={{fontWeight:'bold' , fontSize:'30px'}}>کارفرمایان سامانه</div>
            <div className="row justify-content-around">
                <img src="./pic/سمپاد.png" width="50%" height="50%" className="align-self-center col-lg-2 col-sm-12 col-md-12 text-center"/>
                <img src="./pic/آموزش از راه دور.jpeg" width="50%" height="50%" className="col-lg-2 col-sm-12 col-md-12 text-center"/>
                <img src="./pic/آموزش پرورش.jpg" width="50%" height="50%" className="align-self-center col-lg-2 col-sm-12 col-md-12 text-center"/>
            </div>
        </div>
    )
}

export default Sponsers;