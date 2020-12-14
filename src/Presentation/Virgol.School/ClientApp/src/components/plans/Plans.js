import React from 'react';
import protectedManager from '../protectedRoutes/protectedManager';

class Plans extends React.Component {

    render() {
        return (
            <div className="w-screen min-h-screen bg-dark-blue">
                <div className="w-11/12 max-w-500 px-2 py-12 centerize bg-white rounded-xl text-center">
                    <p className="text-black-blue text-xl">پرداخت آسان و مطمئن با <span className="text-sky-blue">پی پینگ</span></p>
                    <div className="w-full my-6 flex md:flex-row flex-col justify-evenly items-center">
                        <div className="flex flex-col items-center md:mb-0 mb-6">
                            <span className="my-1">هزینه هر دانش آموز به صورت ماهیانه</span>
                            <span dir="rtl" className="font-vb">6900 تومان</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="my-1">تعداد ماه ها</span>
                            <span className="font-vb">3</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-vb mb-2">( تومان ) هزینه نهایی</p>
                        <p className="text-xl">500 X 6900 = 3,450,000</p>
                    </div>
                    <button className="py-2 w-2/3 mt-6 rounded-lg mx-auto bg-greenish text-white">پرداخت</button>
                </div>
            </div>
        );
    }

}

export default protectedManager(Plans);