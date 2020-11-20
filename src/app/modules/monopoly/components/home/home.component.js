import React from 'react';
import "./home.component.scss";



class HomeComponent extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            playersCount: 4,
            players: [
                {
                    id: 1,
                    name: '',
                    color: 'red',
                    balance: 1500,
                    position: 0,
                    properties: [],
                    communityCards: [],
                    chanceCards: [],
                },
                {
                    id: 2,
                    name: '',
                    color: 'blue',
                    balance: 1500,
                    position: 0,
                    properties: [],
                    communityCards: [],
                    chanceCards: [],
                },
    
                {
                    id: 3,
                    name: '',
                    color: 'purple',
                    balance: 1500,
                    position: 0,
                    properties: [],
                    communityCards: [],
                    chanceCards: [],
                },
                {
                    id: 4,
                    name: '',
                    color: 'green',
                    balance: 1500,
                    position: 0,
                    properties: [],
                    communityCards: [],
                    chanceCards: [],
                },
            ],
        };
    }

    handleChange = (event) => {
        event.preventDefault();
        
        const { name, value } = event.target;
        const { players } = this.state;
        switch (name) {
          case 'playersCount': 
            this.setState({playersCount: parseInt(value)});
            break;
          case 'player_1': 
            players[0].name = value;
            break;
          case 'player_2':
            players[1].name = value;
            break;
          case 'player_3':
            players[2].name = value;
            break;
          case 'player_4':
            players[3].name = value;
            break;
          default:
            break;
        }
    
        this.setState({players});
    }


    handleSubmit = (event) => {

        event.preventDefault();

        // if (!this.state.name || !this.state.level) {
        //     const e1 = this.state.name ? "" : "Name is mandatory!";
        //     const e2 = this.state.level ? "" : "Level is mandatory!";

        //     this.setState({errors: { name: e1, level: e2 }});
        //     return;
        // }

        localStorage.setItem("playersCount", this.state.playersCount);
        localStorage.setItem("players", JSON.stringify(this.state.players));

        this.props.history.push(`/gameplay`);
      
    }

 

    render() {
        return (
          <>
            <div className="container home-container">
                <div className="row">
                    <div className="col-sm-12 intro-header">
                        <h3>Monopoly - The game</h3>
                    </div>
                </div>
                <br></br>
                <form onSubmit={this.handleSubmit} noValidate className="user-details-form" >
                    
                    <div className="row">
                        <div className="col-sm-4 offset-sm-4 form-group">
                            <label>Number of players</label>
                            <select defaultValue={this.state.playersCount} className="select-difficulty" onChange={this.handleChange} noValidate name="playersCount" id="cars">
                                <option value="" disabled>Number of players</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>     
                        </div>
                    </div>
                    
                    <div className="row">
                        {
                            this.state.players.filter(p => p.id <= this.state.playersCount).map(player => {
                                return (
                                    <div className="col-sm-4 offset-sm-4">
                                        <p>{player.id}. <input className="" onChange={this.handleChange} noValidate type="text" name={`player_${player.id}`} placeholder="Enter name"/> </p>
                                    </div>
                                )
                            })
                        }
                        
                    </div>

                 

                    <div className="row text-center">
                        <button className="start-game-btn submit"> START GAME</button>
                    </div>

                </form>
            </div>
          </>
        );
    }
}

export default HomeComponent;