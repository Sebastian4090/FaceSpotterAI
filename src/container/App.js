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
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }

}

class App extends Component {
    constructor(){
        super();
        this.state = initialState;
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
            joined: data.joined
        }})
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({imageURL: this.state.input});

        fetch('http://localhost:3000/imageurl', {
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result){
                fetch('http://localhost:3000/image', {
                    method:'put',
                    headers: {'Content-Type': 'application/json'},
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
                this.displayFaceBox(this.calculateFaceLocation(result));
            })
            .catch(error => console.log('error', error));
}          

    onRouteChange = (route) => {
        if (route === 'signout') {
          this.setState(initialState)
        } else if (route === 'home') {
          this.setState({isSignedIn: true})
        }
        this.setState({route: route});
      }

    calculateFaceLocation = data => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    render(){
        const { isSignedIn, imageURL, route, box, user } = this.state;
        return (
        <div className="App">
            
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
            <Particles className='particles'
                id="tsparticles"
                init={this.customInit}
                options={praticlesOptions}
            />
            { route === 'home' 
            ?  <> 
            <Logo  />
            <Rank name={user.name} entries={user.entries}/>
            <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
            /> 
            <FaceRecognition box={box} imageURL={imageURL}/>
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
