import React from 'react';
import FeedCard from "./FeedCard";

class Feed extends React.Component {

    render() {
        return (
            <div className="w-full h-full rounded-lg text-center py-4 px-4">
                <h1 className="font-vb text-blueish text-2xl">اخبار و اطلاعیه ها</h1>
                <FeedCard
                    message="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ"
                    author="مدیر مدرسه"
                    time="10:00"
                    date="1399/5/1"
                    tags={[{ text: 'آموزشی', color: 'bg-blue-500' }]}
                />
                <FeedCard
                    message="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد"
                    author="حسام صباحی"
                    time="09:40"
                    date="1399/4/30"
                    tags={[{ text: 'ریاضی', color: 'bg-red-500' }, { text: 'اطلاعیه نمرات', color: 'bg-orange-500' }]}
                />
            </div>
        );
    }

}

export default Feed;