import React from 'react';
import VAdvantage from './virgool-advantage';

const VirgoolAdvantages = () => {
    const advantages = [
        {
            id : 0 ,
            title : "پنل پیامکی برای اطلاعیه ها" ,
            icon : "fas fa-sms"
        } , 
        {
            id : 1 ,
            title : "امکان تشکیل جلسات در هر ساعت از شبانه روز" ,
            icon : "fas fa-clock"
        } , 
        {
            id : 2 ,
            title : "ورود افراد تنها با اطلاعات ثبت نام شده توسط مدیر" ,
            icon : "fas fa-user-shield"
        } , 
        {
            id : 3 ,
            title : "امکان فعال سازی سامانه تحت دامنه اختصاصی" ,
            icon : "fas fa-house-user"
        } , 
        {
            id : 4 ,
            title : "امکان برگزاری جلسات اولیا مربیان برای مدارس" ,
            icon : "fas fa-user-friends"
        } , 
        {
            id : 5 ,
            title : "امکان ایجاد کلاس‌های خصوصی توسط معلمان" ,
            icon : "fas fa-user-graduate"
        } , 
        {
            id : 6 ,
            title : "مقرون به صرفه بودن و کاهش هزینه ها" ,
            icon : "fas fa-coins"
        } , 
        {
            id : 7 ,
            title : "ارائه پشتیبانی ۲۴ ساعته" ,
            icon : "fas fa-headset"
        } , 
        {
            id : 8 ,
            title : "راحتی کار با سامانه" ,
            icon : "fas fa-user-check"
        }
    ]

    return(
        <div className="virgool tw-py-6 tw-px-6 tw-my-6" style={{backgroundColor : '#f0f0f0'}}>
            <div className="text-center font-weight-bold " style={{ fontSize:'30px'}}>مزایای ویرگول</div>
            <div className="row tw-my-5 justify-content-center">
            {
                advantages.map((advantage) => (
                    <VAdvantage 
                    className="col-lg-4 col-sm-12 col-md-12"
                    key={advantage.id}
                    icon={advantage.icon}
                    title={advantage.title}
                    color={advantage.id}/>
                ))
            }
            </div>

        </div>
    )
}

export default VirgoolAdvantages;