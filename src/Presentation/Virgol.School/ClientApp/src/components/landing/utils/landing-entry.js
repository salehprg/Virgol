import React from 'react';
import {MyViolet} from '../../../assets/colors'

const LandingEntry = () => {
    return(
        <div className="text-right">
            <div style={{fontWeight : 'bold' , fontSize : '30px'}}>
                سامانه آموزش از راه دور ویرگول
            </div>
            <br/>
            <div>
                آلودگی هوا، شیوع بیماری‌هایی نظیر آنفولانزا و کرونا، سرما و یخبندان همه و همه از جمله دلایل تعطیلی مدارس و مراکز آموزشی است. این تعطیلی‌ها باعث عقب افتادن دانش آموزان و دانشجویان از فعالیت‌های کلاسی آن‌ها می‌شود.
                سامانه آموزش مجازی ویرگول با تمامی عناصر لازم برای برگزاری کلاس‌ها و جلسات آنلاین این نگرانی را رفع کرده. شما در هر جا که باشید می‌توانید از خدمات آموزشی بهره مند شوید و در جلسات و سمینارها شرکت کنید. ویرگول تمام نیازهای آموزشی را پشتیبانی می‌کند.

            </div>
            <br/>
            <button className="btn" style={{backgroundColor : `${MyViolet}` ,color : 'white' ,borderRadius:20}}>تماس با ما</button>
        </div>
    )
}

export default LandingEntry;