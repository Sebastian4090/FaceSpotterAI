import React from 'react';

class Rank extends React.Component {
    constructor() {
        super();
        this.state = {
            level: ''
        }
    }

    componentDidMount() {
        this.generateLevel(this.props.entries)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.entries === this.props.entries && prevProps.name === this.props.name) {
            return null
        }
        this.generateLevel(this.props.entries);
    }

    generateLevel = (entries) => {
        fetch(`https://901c7fp657.execute-api.eu-north-1.amazonaws.com/prod/handler?rank=${entries}`)
        .then(response => response.json())
        .then(data => this.setState({ level: data.input }))
        .catch(console.log)
    }

    render() {
        return (
            <div>
                <div className='white f3'>
                    {`${this.props.name}, your entry count is...`}
                </div>
                <div className='white f1'>
                    {`#${this.props.entries}`}
                </div>
                <div className='white f2'>
                    {`Rank : ${this.state.level}`}
                </div>
            </div>
        )
    }

}

export default Rank;