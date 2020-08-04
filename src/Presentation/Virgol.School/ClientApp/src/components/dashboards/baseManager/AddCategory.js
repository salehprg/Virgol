import React from "react";
import Modal from "../../Modal";
import Searchish from "../../field/Searchish";

class AddCategory extends React.Component {

    state = {
        cats: [{id: 1, name: 'دبستان'}, {id: 2, name: 'متوسطه اول'}, {id: 3, name: 'متوسطه دوم'}],
        selectedCats: []
    }

    setCat = (id) => {
        if (!this.state.selectedCats.some(el => el === id)) {
            this.setState({ selectedCats: [...this.state.selectedCats, id] })
        } else {
            this.setState({ selectedCats: this.state.selectedCats.filter(el => el !== id)})
        }
    }

    render() {
        return (
            <Modal cancel={this.props.cancel}>
                <div onClick={e => e.stopPropagation()} className="w-5/6 max-w-800 bg-bold-blue px-4 py-16 flex flex-col items-center">
                    <Searchish
                        className="mx-auto max-w-350"
                    />
                    <div className="w-11/12 mt-4 flex flex-row-reverse justify-center flex-wrap">
                        {this.state.cats.map(cat => {
                            return (
                                <span onClick={() => this.setCat(cat.id)}
                                      className={`px-6 py-1 mx-2 my-2 border cursor-pointer ${this.state.selectedCats.some(el => el === cat.id) ? 'border-sky-blue text-sky-blue' : 'border-purplish text-purplish'}`}
                                >
                                    {cat.name}
                                </span>
                            );
                        })}
                    </div>
                    <div className="flex mt-8 flex-row items-center">
                        <button className="px-6 py-1 mx-1 border-2 border-transparent rounded-lg bg-greenish text-white">
                            ذخیره
                        </button>
                        <button onClick={this.props.cancel} className="px-6 mx-1 py-1 rounded-lg border-2 border-grayish text-grayish">
                            لغو
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

}

export default AddCategory;