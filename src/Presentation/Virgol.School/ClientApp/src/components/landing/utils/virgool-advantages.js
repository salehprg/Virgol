import React from 'react';
import VAdvantage from './virgool-advantage';

const VirgoolAdvantages = () => {
    const advantages = [
        {
            id : 0 ,
            title : "پنل پیامکی برای اطلاعیه ها" ,
            icon : ""
        } , 
        {
            id : 1 ,
            title : "امکان تشکیل جلسات در هر ساعت از شبانه روز" ,
            icon : ""
        } , 
        {
            id : 2 ,
            title : "ورود افراد تنها با اطلاعات ثبت نام شده توسط مدیر" ,
            icon : ""
        } , 
        {
            id : 3 ,
            title : "امکان فعال سازی سامانه تحت دامنه اختصاصی" ,
            icon : ""
        } , 
        {
            id : 4 ,
            title : "امکان برگزاری جلسات اولیا مربیان برای مدارس" ,
            icon : ""
        } , 
        {
            id : 5 ,
            title : "امکان ایجاد کلاس‌های خصوصی توسط معلمان" ,
            icon : ""
        } , 
        {
            id : 6 ,
            title : "مقرون به صرفه بودن و کاهش هزینه ها" ,
            icon : ""
        } , 
        {
            id : 7 ,
            title : "ارائه پشتیبانی ۲۴ ساعته" ,
            icon : ""
        } , 
        {
            id : 8 ,
            title : "راحتی کار با سامانه" ,
            icon : ""
        }
    ]

    return(
        <div className="virgool py-6 my-6" style={{backgroundColor : '#f0f0f0'}}>
            <h4 className="text-center" style={{fontWeight:'bold' , fontSize:'30px'}}>مزایای ویرگول</h4>
            <div className="row my-5">
            {
                advantages.map((advantage) => (
                    <VAdvantage 
                    className="col-lg-4 col-sm-12 col-md-12"
                    key={advantage.id}
                    icon={advantage.icon}
                    title={advantage.title}/>
                ))
            }
            </div>

        </div>
    )
}

export default VirgoolAdvantages;