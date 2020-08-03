import React from "react";
import Hero from "./Hero";
import CounterCard from "./CounterCard";
import {home, key, user, users} from "../../../../assets/icons";
import Feed from "../../feed/Feed";

class Home extends React.Component {

    render() {
        return (
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 py-6">
                <Hero />
                <CounterCard
                    title="مدارس"
                    icon={home}
                    number="36"
                    border="border-sky-blue"
                />

                <CounterCard
                    title="معلمان"
                    icon={user}
                    number="650"
                    border="border-purplish"
                />

                <CounterCard
                    title="کلید"
                    icon={key}
                    number="4"
                    border="border-greenish"
                    pos="row-start-3"
                />

                <CounterCard
                    title="دانش آموزان"
                    icon={users}
                    number="7542"
                    border="border-redish"
                    pos="row-start-3"
                />

                <Feed
                    title="آخرین خبرهای منتشر شده از سمت شما"
                    pos="row-start-4 sm:row-start-auto col-span-2 row-span-2"
                />
            </div>
        );
    }

}

export default Home;