import React from 'react';

const Sponsers = () => {
    return(
        <div className="tw-mt-8">
            <div className="text-center tw-my-8" style={{fontWeight:'bold' , fontSize:'30px'}}>کارفرمایان سامانه</div>
            <div className="row justify-content-around">
                <img src="./pic/سمپاد.png" width="50%" height="50%" className="align-self-center col-lg-2 col-sm-12 col-md-12 text-center tw-py-20 hover:tw-shadow-lg "/>
                <img src="./pic/آموزش از راه دور.jpeg" width="50%" height="50%" className="col-lg-2 col-sm-12 col-md-12 text-center tw-py-2 hover:tw-shadow-lg"/>
                <img src="./pic/آموزش پرورش.jpg" width="50%" height="50%" className="align-self-center col-lg-2 col-sm-12 col-md-12 text-center tw-py-16 hover:tw-shadow-lg"/>
            </div>
        </div>
    )
}

export default Sponsers;