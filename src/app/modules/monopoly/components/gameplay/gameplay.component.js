import React from 'react';
import "./gameplay.component.scss";
import gameBlocks from '../../../../../data/gameBlocks.json';
import boardBackground from '../../../../../assets/game-board.jpg'
import dice1 from '../../../../../assets/Die_1.png'
import dice2 from '../../../../../assets/Die_2.png'
import dice3 from '../../../../../assets/Die_3.png'
import dice4 from '../../../../../assets/Die_4.png'
import dice5 from '../../../../../assets/Die_5.png'
import dice6 from '../../../../../assets/Die_6.png'

class GameplayComponent extends React.Component {

    constructor(props) {
        super(props);

        gameBlocks.map((g, index) => {
            g.id = index;
            g.owned_by = null;
            return g;
        });

        this.state = { 
            width: 0, 
            height: 0,
            players: [],
            bank: null,
            board: gameBlocks,
            currentPlayer: null,
            currentPlayerIndex: 0,
            dice1: 1,
            dice2: 1,
            displayBlock: null,
            
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.diceMap = { 1: dice1, 2: dice2, 3: dice3, 4: dice4, 5: dice5, 6: dice6 };
        
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        this.initPlayers();
        this.initBank();
        this.initBoard();
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    initPlayers() {
        const players = [
            {
                id: 1,
                name: 'Ashim',
                color: 'red',
                balance: 1500,
                position: 0,
                properties: [],
            },
            {
                id: 2,
                name: 'Yash',
                color: 'blue',
                balance: 1500,
                position: 0,
                properties: []
            },

            {
                id: 3,
                name: 'Kar',
                color: 'yellow',
                balance: 1500,
                position: 0,
                properties: [],
            },
            {
                id: 4,
                name: 'Bha',
                color: 'green',
                balance: 1500,
                position: 0,
                properties: [],
            },
        ];

        this.setState({players, currentPlayer: players[0], currentPlayerIndex: 0});

        this.setState({displayBlock: this.state.board[0]});

    }

    initBank() {
        this.setState({bank: {balance: 20000, houses: 20, hotels: 20}})
    }

    initBoard() {
        // this.board.map(b => b['players'] = []);
    }


    rollDice = () => {
       
        const currentPlayer = this.state.currentPlayer;
        
        const max = 6;
        const min = 1;
        const dice1 = Math.floor(Math.random() * (max - min) + min) + 1;
        const dice2 = Math.floor(Math.random() * (max - min) + min) + 1;
        
        
        const total = dice1 + dice2;
        console.log(total, dice1, dice2);
        
        let final_pos = currentPlayer.position + total;
        if (final_pos >= this.state.board.length) final_pos -= this.state.board.length;
        currentPlayer.position = final_pos;
        

        this.setState({ currentPlayer, dice1, dice2, displayBlock: this.state.board[currentPlayer.position]});

        // this.nextPlayer();

    }

    nextPlayer() {
        let newIndex = this.state.currentPlayerIndex + 1;
        if  (newIndex >= this.state.players.length) newIndex = 0;

        const currentPlayerIndex = newIndex;
        const currentPlayer = this.state.players[currentPlayerIndex];

        this.setState({currentPlayer, currentPlayerIndex})
    }

    nextAction = () => {
        this.nextPlayer();
    }

    buyProperty = () => {
        const { currentPlayer, displayBlock } = this.state;
        
        if (!displayBlock.price && typeof displayBlock.price != 'number') {
            window.alert('Cannot buy this block');
            return;
        }

        if (currentPlayer.balance >= displayBlock.price) {
            currentPlayer.balance -= displayBlock.price;
            currentPlayer.properties.push(displayBlock);
            
            displayBlock.owned_by = currentPlayer;

            this.setState({ currentPlayer, displayBlock });
            window.alert('Property bought successfully');
        }
    }

    payRent = () => {
        const { currentPlayer, displayBlock } = this.state;
        
        if (!displayBlock.rent1 && typeof displayBlock.rent1 != 'number') {
            window.alert('Cannot pay rent for this block');
            return;
        }

        if (currentPlayer.balance >= displayBlock.rent1) {
            currentPlayer.balance -= displayBlock.rent1;

            displayBlock.owned_by.balance += displayBlock.rent1;

            this.setState({ currentPlayer, displayBlock });
            window.alert('Rent paid successfully successfully');
        }


    }

    
    render() {
       
        return (
          <>
            <div className="background">
                <img className="board-image" alt="board-background" style={{ height: `${this.state.height}px`, left: `calc(50% - ${this.state.height / 2}px)` }}  src={boardBackground} />
            </div>
            
            {/* {this.board} */}

            <div style={{ height: `${this.state.height}px`, width: `${this.state.height}px`, left: `calc(50% - ${this.state.height / 2}px)` }} className="gameplay board">
                <div className="board-row board-bottom">
                    <div className="corner-block">

                    </div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="corner-block">

                    </div>
                </div>
                <div className="board-col board-left">
                <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                </div>
                <div className="board-row board-top">
                    <div className="corner-block">

                    </div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="corner-block">

                    </div>
                </div>
                <div className="board-col board-right">
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                    <div className="block"></div>
                </div>
            </div>
            

            <div className="details-panel">
                <div className="block-view">
                    <div style={{backgroundColor: this.state.displayBlock?.color}} className="head-color">
                        <h4>#{this.state.displayBlock?.id} {this.state.displayBlock?.name}</h4>
                    </div>

                    <div className="price-text">
                        {/* <h4>50</h4> */}
                        <h4>{this.state.displayBlock?.pricetext}</h4>
                    </div>
                    
                </div>

                <div className="actions">
                    {
                        this.state.displayBlock?.owned_by === null &&
                        typeof this.state.displayBlock?.price === 'number' &&
                        <button onClick={this.buyProperty} >BUY NOW</button>
                    }
                    {
                        this.state.displayBlock?.owned_by !== null &&
                        this.state.displayBlock?.owned_by.id !== this.state.currentPlayer?.id &&
                        <button onClick={this.payRent} >PAY RENT</button>
                    }
                    <button>PASS</button>
                </div>
            </div>

            <div className="action-panel">
                
                <h4>Current Player: #{this.state.currentPlayer?.id} {this.state.currentPlayer?.name} </h4>
                <div className="dice-rolls">
                    <div className="dice-roll-1">
                        <img src={this.diceMap[this.state.dice1]} alt='dice-icon 1'/>
                    </div>
                    <div className="dice-roll-2">
                        <img src={this.diceMap[this.state.dice2]} alt='dice-icon 2'/>
                    </div>
                </div>
                <button onClick={this.rollDice}>Roll Dice</button>
                <button onClick={this.nextAction}>NEXT</button>

                <hr/>
                <h4>Players</h4>
                <div className="players">
                    {
                        this.state.players.map(player => {
                            return (
                                <div className={`player-box ${this.state.currentPlayer?.id === player.id ? 'active-box': ''}`}>
                                    {player.name} <br/>
                                    {player.balance} <br/>
                                    {player.position} <br/>

                                    <hr/>
                                    Assets
                                    <ul>
                                        {
                                            player.properties.map(property => {
                                                return (
                                                    <li>#{property.id}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
          </>
        );
      }
}

export default GameplayComponent;