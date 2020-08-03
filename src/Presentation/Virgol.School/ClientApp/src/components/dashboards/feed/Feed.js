import React from "react";
import News from "./News";

class Feed extends React.Component {

    render() {
        const { title, pos } = this.props
        return (
            <div className={`${pos} w-full h-full px-6 py-4 text-right bg-dark-blue rounded-xl`}>
                <p className="text-white">{title}</p>
                <News
                    text="پایان راه اندازی سامانه آموزش مجازی ویرگول"
                    tags={['آموزشی']}
                    time="1399/5/1 10:00"
                />
                <News
                    text="اطلاعیه ثبت کدملی دانش آموزان در شونصدمین سامانه آموزش و
پرورش توسط مدیران مدارس                         "
                    tags={['اطلاعیه مهم']}
                    time="1399/5/1 10:00"
                />
            </div>
        );
    }

}

export default Feed;