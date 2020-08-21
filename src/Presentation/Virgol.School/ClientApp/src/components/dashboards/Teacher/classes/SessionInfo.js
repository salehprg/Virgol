import React from "react";
import Tablish from "../../tables/Tablish";
import {arrow_left, check_circle, edit, trash} from "../../../../assets/icons";
import history from "../../../../history";

class SessionInfo extends React.Component {

    render() {
        return (
            <div className="w-screen min-h-screen py-4 bg-black-blue">
                <div className="lg:w-11/12 w-full lg:px-8 px-4 py-16 relative min-h-90 mx-auto lg:border-2 border-0 rounded-lg border-dark-blue">
                    <div onClick={() => history.push('/t/classes')} className="w-10 h-10 cursor-pointer absolute top-0 left-0 mt-4 ml-8 rounded-lg border-2 border-purplish">
                        {arrow_left('w-6 centerize text-purplish')}
                    </div>
                    <p className="text-right text-xl text-white">حسابان - مدرسه فرزانگان - کلاس 101</p>
                    <div className="mx-auto rounded-lg bg-dark-blue mt-4 py-4 px-8">
                        <Tablish
                            headers={['نام', 'کد ملی', 'ایمیل', 'تعداد غیبت', 'نمره']}
                            body={() => {
                                return (
                                    <React.Fragment>
                                        <tr>
                                            <td className="py-4">صالح ابراهیمیان</td>
                                            <td>10536984568</td>
                                            <td>Saleh.Ebrahimian.05@legace.ir</td>
                                            <td>5</td>
                                            <td>20</td>
                                        </tr>
                                    </React.Fragment>
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

}

export default SessionInfo