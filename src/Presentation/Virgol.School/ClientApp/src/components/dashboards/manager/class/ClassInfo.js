import React from 'react'
import { Link } from 'react-router-dom'
import Schedule from './Schedule'

class ClassInfo extends React.Component {

    render() {
        return (
            <div className="w-screen min-h-screen p-10 relative bg-bold-blue grid lg:grid-cols-4 grid-cols-1 lg:col-gap-4 xl:col-gap-10 col-gap-10 row-gap-10">
                <div className="w-full relative rounded-lg lg:min-h-90 text-center min-h-0 py-6 px-4 col-span-1 border-2 border-dark-blue">
                     <p className="text-xl text-white mb-8">لیست دانش آموزان</p>
                     <div className="flex flex-row-reverse justify-between items-center">
                        <p className="text-right text-white">صالح ابراهیمینا</p>
                        <p className="text-right text-white">1059645869</p>
                     </div>
                     <div className="flex flex-row-reverse justify-between items-center">
                        <p className="text-right text-white">صالح ابراهیمینا</p>
                        <p className="text-right text-white">1059645869</p>
                     </div>
                </div>

                <div className="w-full rounded-lg min-h-90 p-4 lg:col-span-3 col-span-1 border-2 border-dark-blue">
                    <div className="flex flex-row-reverse justify-between">
                        <div>
                            <p className="text-right text-white text-2xl">101</p>
                            <p className="text-right text-white">دهم ریاضی</p>
                        </div>
                        <div>
                            <Link className="px-6 py-1 rounded-lg border-2 border-grayish text-grayish" to="/a/bases">بازگشت</Link>
                        </div>
                    </div>
                    <div className="mb-8 relative overflow-auto">
                        <Schedule 
                            editable={true}
                        />
                    </div>
                </div>
            </div>
        );
    }

}

export default ClassInfo;