import React from 'react';
import './Profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            age: this.props.user.age,
            pet: this.props.user.pet,
            customicon: this.props.user.customicon
        }
    }


    onFormChange = (event) => {
        switch(event.target.name) {
            case 'user-name':
                this.setState({name: event.target.value})
                break;
            case 'user-age':
                this.setState({age: event.target.value})
                break;
            case 'user-pet':
                this.setState({pet: event.target.value})
                break;
            case 'user-customicon':
                this.setState({customicon: event.target.value})
                break;
            default:
                return;
        }
    }

    onProfileUpdate = (data) => {
        console.log(this.state.name, this.state.age, this.state.pet, this.state.customicon)
        fetch(`https://facespotterai-api.onrender.com/profile/${this.props.user.id}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')   
            },
            body: JSON.stringify({ formInput: data })
        }).then(res => {
            if (res.status === 200 || res.status === 304) {
                this.props.toggleModal();
                this.props.loadUser({ ...this.props.user, ...data});
            }
        }).catch(console.log)
    }
    render(){
        const { user } = this.props;
        const { name, age, pet, customicon } = this.state;
        return (
            <div className="profile-modal">
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
            <main className="pa4 black-80 w-80">
            <img
            src={customicon ? customicon : user.defaultIcon}
            className="h3 w3 dib" alt="avatar" />
            <h1>{this.state.name}</h1>
            <h4>{`Images Submitted: ${user.entries}`}</h4>
            <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
            <hr />
                <label className="mt2 fw6" htmlFor="user-name">Name:</label>
                <input 
                onChange={this.onFormChange}
                className="pa2 ba w-100" 
                placeholder={user.name}
                type="text" 
                name="user-name"  
                id="name"/>
                <label className="mt fw6" htmlFor="user-age">Age:</label>
                <input
                onChange={this.onFormChange} 
                className="pa2 ba w-100" 
                placeholder={user.age}
                type="text" 
                name="user-age"  
                id="age"/>
                <label className="mt fw6" htmlFor="user-pet">Pet:</label>
                <input
                onChange={this.onFormChange}
                className="pa2 ba w-100" 
                placeholder={user.pet}
                type="text" 
                name="user-pet"  
                id="pet"/>
                <label className="mt fw6" htmlFor="user-customicon">Link to custom icon:</label>
                <input
                onChange={this.onFormChange}
                className="pa2 ba w-100" 
                placeholder={user.customicon}
                type="text" 
                name="user-customicon"  
                id="customicon"/>
            <div className="mt4" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                <button
                onClick={() => this.onProfileUpdate({ name, age, pet, customicon })} 
                className='b pa2 grow pointer hover-white w-40 bg-light-purple b--black-20'>
                    Save
                </button>
                <button className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20'
                        onClick={this.props.toggleModal}>
                    Cancel
                </button>
            </div>
          </main>
          <div className='modal-close' onClick={this.props.toggleModal}>&times;</div>
          </article>
            </div>
        )
    }
}

export default Profile;