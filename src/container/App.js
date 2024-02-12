import React, { Component } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Navigation from '../components/Navigation/Navigation';
import Signin from '../components/Signin/Signin';
import Register from '../components/Register/Register';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';
import Modal from '../components/Modal/Modal'
import Profile from '../components/Profile/Profile'
import './App.css';

const praticlesOptions = {
  fpsLimit: 60,
  particles: {
      color: {
          value: "#ffffff",
      },
      links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
      },
      move: {
          direction: "none",
          enable: true,
          outModes: {
              default: "bounce",
          },
          random: false,
          speed: 6,
          straight: false,
      },
      number: {
          density: {
              enable: true,
              area: 300,
          },
          value: 30,
      },
      opacity: {
          value: 0.5,
      },
      shape: {
          type: "circle",
      },
      size: {
          value: { min: 1, max: 5 },
      },
  },
  detectRetina: true,
}

const initialState = { 
    input: '',
    imageURL: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    isProfileOpen: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
        pet: '',
        age: '',
        customicon: '',
        defaultIcon: ''
    }

}

class App extends Component {
    constructor(){
        super();
        this.state = initialState;
    }

    componentDidMount() {
        const token = window.sessionStorage.getItem('token');
        if (token) {
            fetch('https://facespotterai-api.onrender.com/signin', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    fetch(`https://facespotterai-api.onrender.com/profile/${data.id}`, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    })
                    .then(res => res.json())
                    .then(user => {
                        if (user && user.email) {
                            this.loadUser(user);
                            this.onRouteChange('home');
                        }
                    })
                }
            })
            .catch(console.log)
        }
    }

    async customInit(engine) {
        await loadSlim(engine);
    }

    loadUser = (data) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined,
            age: data.age,
            pet: data.pet,
            customicon: data.customicon,
            defaultIcon: 'https://cdn1.iconfinder.com/data/icons/ui-essential-17/32/UI_Essential_Outline_1_essential-app-ui-avatar-profile-user-account-256.png'
        }})
    }

    displayFaceBoxes = (boxes) => {
        if (boxes) {
            this.setState({boxes: boxes});
        }
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({imageURL: this.state.input});

        fetch('https://facespotterai-api.onrender.com/imageurl', {
            method:'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.sessionStorage.getItem('token')      
            },
            body: JSON.stringify({
                input: this.state.input
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result){
                fetch('https://facespotterai-api.onrender.com/image', {
                    method:'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': window.sessionStorage.getItem('token')                       
                    },
                    body: JSON.stringify({
                        id: this.state.user.id
                    })
                })
                    .then(response => response.json())
                    .then(count => {
                        this.setState(Object.assign(this.state.user, { entries: count }))
                    })
                    .catch(console.log)
                }
                this.displayFaceBoxes(this.calculateFacesLocation(result));
            })
            .catch(error => console.log('error', error));
}          

    onRouteChange = (route) => {
        if (route === 'signout') {
        window.sessionStorage.removeItem('token');
          return this.setState(initialState)
        } else if (route === 'home') {
          this.setState({isSignedIn: true})
        }
        this.setState({route: route});
      }

    calculateFacesLocation = data => {
        if (data && data.outputs) {
            return data.outputs[0].data.regions.map(face => {
                const clarifaiFace = face.region_info.bounding_box;
                const image = document.getElementById('inputimage');
                const width = Number(image.width);
                const height = Number(image.height);
            
                return {
                    leftCol: clarifaiFace.left_col * width,
                    topRow: clarifaiFace.top_row * height,
                    rightCol: width - (clarifaiFace.right_col * width),
                    bottomRow: height - (clarifaiFace.bottom_row * height)
                }
            })
        }
        return;
    }

    toggleModal = () => {
        this.setState(prevState => ({
            isProfileOpen: !this.state.isProfileOpen
        }))
    }

    render(){
        const { isSignedIn, imageURL, route, boxes, user, isProfileOpen } = this.state;
        return (
        <div className="App">
            
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}
                toggleModal={this.toggleModal} user={user}/>
            <Particles className='particles'
                id="tsparticles"
                init={this.customInit}
                options={praticlesOptions}
                
            />
            {isProfileOpen && 
                <Modal>
                    <Profile
                     isProfileOpen={isProfileOpen} 
                     toggleModal={this.toggleModal}
                     loadUser={this.loadUser}
                     user={user} />
                </Modal>}
            { route === 'home' 
            ?  <> 
            <Logo  />
            <Rank name={user.name} entries={user.entries}/>
            <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
            /> 
            <FaceRecognition boxes={boxes} imageURL={imageURL}/>
            </>
            :(
                route === 'signin' 
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
            
        }
        </div>
        );
    }
}

export default App;
