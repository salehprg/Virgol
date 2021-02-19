import React from 'react';
import Fade from 'react-reveal/Fade'

const OnlineSessions = () => {

    return(
        <div className="row tw-py-5" style={{backgroundColor : '#e5daff'}}>
            <Fade right>
                <div className="col-lg-6 col-md-12 col-sm-12 text-center tw-my-5">
                    <img src="./pic/onlineSessions.png" width="90%" alt="جلسات مجازی"/>
                </div>
            </Fade>
            
            <Fade left>
                <div className="col-lg-6 col-md-12 col-sm-12">
                    <h3 className="text-right tw-my-4" style={{fontWeight : 'bold' , fontSize : '25px'}}>سامانه جلسات مجازی</h3>
                    <div className="text-right tw-my-4">
                        با این سامانه شما می‌توانید در تمامی ساعات شبانه روز
                        کلاس‌ها و جلسات خود را تشکیل دهید و از راه دور و به صورت آنلاین آن‌ها را برگزار نمایید.
                        می‌توانید تجربه بالاترین کیفیت و سرعت را در جلسات خود داشته باشید. 
                        تمامی عناصر مورد نیاز برای برگزاری وبینار، کلاس‌های آموزشی آنلاین و جلسات در اختیار شماست.
                    </div>
                </div>
            </Fade>
            
        </div>
    )
}

export default OnlineSessions;