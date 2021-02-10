import React from 'react';

const Useful = () => {
    const usefulOrgans = [
        "آموزشگاه ها، دانشگاه ها، مدارس، مراکز علمی و تحقیقاتی" ,
        "مدرسان خصوصی و نیمه خصوصی" ,
        "برگزارکنندگان وبینارهای آموزشی" ,
        "مدیران و پرسنل سازمان‌ها" ,
        "برگزارکنندگان دوره آموزشی برای کاراموزان و توسعه منابع انسانی"
    ]
    return(
        <div className="row">
            <div className="col-lg-5 col-md-12 col-sm-12" style={{borderLeft:"1px solid grey"}}>
                <div className="text-right" style={{fontWeight:'bold' , fontSize:'25px'}}>سامانه ویرگول برای چه کسانی مناسب است؟</div>
            </div>
            
            <div className="col-lg-7 col-md-12 col-sm-12">
                {
                    usefulOrgans.map(x => (
                        <div className="text-right">{x}</div>
                    ))
                }
            </div>

            
        </div>
    )
}

export default Useful;