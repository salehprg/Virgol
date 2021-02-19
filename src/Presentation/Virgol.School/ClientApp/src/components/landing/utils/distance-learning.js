import React from 'react';
import Advantage from './advantage';
import Zoom from 'react-reveal/Zoom'

const DistanceLearning = () => {
    const advantages = [
        {
            key : 0 ,
            title : "کاهش هزینه های دانش آموزان و مدارس" ,
            icon : 'fas fa-money-bill-wave'
        } , 
        {
            key : 1 ,
            title : "پوشش آموزشی تعداد زیادی از دانش آموزان" ,
            icon : 'fas fa-users'
        } , 
        {
            key : 2 ,
            title : "حذف محدودیت های جغرافیایی" ,
            icon : 'fas fa-map-marked-alt'
        } ,
        {
            key : 3 ,
            title : "در دسترس بودن همیشگی محتوای آموزشی" ,
            icon : 'fas fa-universal-access'
        } ,
        {
            key : 4 ,
            title : "تحقق عدالت آموزشی" ,
            icon : 'fas fa-balance-scale'
        }
    ]

    return(
        <Zoom top cascade>

            <div className="distance-learning">
                <div className="row tw-my-5">

                    <div className="col-lg-6 col-sm-12 col-md-12 tw-my-6 tw-px-5" style={{borderLeft : '1px solid black'}}>
                        <div className="text-right" style={{fontWeight:'bold' , fontSize:'25px'}}>مزایای آموزش از راه دور مجازی چیست؟</div>
                    </div>

                    <div className="col-lg-6 col-sm-12 col-md-12 tw-my-6">
                        <div className="text-right tw-px-5">
                        آموزش از راه دور با حذف محدودیت‌های جغرافیایی و همچنین کاهش هزینه‌ها عدالت در آموزش را محقق کرده است .
                        </div>
                    </div>

                </div>

                    <div className="row tw-my-5 justify-content-center">
                            {
                                advantages.map(advantage => 
                                        <Advantage
                                        className="col-lg-6 col-sm-12 col-md-12" 
                                        icon={advantage.icon} 
                                        title={advantage.title}
                                        color={advantage.key}
                                        key={advantage.key}/>
                                    

                                )
                            }
                    </div>
            </div>
        </Zoom>
    )
}

export default DistanceLearning;