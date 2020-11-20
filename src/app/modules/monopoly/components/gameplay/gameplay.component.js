import React from 'react';
import "./gameplay.component.scss";
import gameBlocks from '../../../../../data/gameBlocks.json';
import communityCards from '../../../../../data/communityCards.json';
import chanceCards from '../../../../../data/chanceCards.json';
import boardBackground from '../../../../../assets/game-board.jpg'
import boardBackground2 from '../../../../../assets/board_2.png';
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
            g.visited_players_count = {};
            g.players_landed = [];
            return g;
        });

        const communityCardsMap = {}
        communityCards.map((c, index) => communityCardsMap[c] = index );

        const chanceCardsMap = {};
        chanceCards.map((c, index) => chanceCardsMap[c] = index);

        const players = JSON.parse(localStorage.getItem('players'));
        const playersCount = parseInt(localStorage.getItem('playersCount'));

        this.state = { 
            width: 0, 
            height: 0,
            players: players.slice(0, playersCount),
            
            bank: {
                balance: 2000
            },
            board: gameBlocks,
            chanceCards: chanceCards,
            communityCards: communityCards,
            chanceCardsMap,
            communityCardsMap,

            currentPlayer: players[0],
            currentPlayerIndex: 0,
            dice1: 1,
            dice2: 1,
            selectedBlock: null,
            
            // action buttons
            rollDiceButtonEnabled: true,
            buyPropertyButtonEnabled: false,
            passPropertyForAuction: false,
            payPropertyRentButtonEnabled: false,

            buyRoadButtonEnabled: false,
            payRoadTaxButtonEnabled: false,

            buyUtilityCompanyButtonEnabled: false,
            payUtilityBillsButtonEnabled: false,

            payTaxButtonEnabled: false,
            collectSalaryButtonEnabled: false,
            pickCommunityCardButtonEnabled: false,
            pickChanceCardButtonEnabled: false,
            continueButtonEnabled: false,
            
            wildActionsButtonEnabled: false,

            payJailChargesButtonEnabled: false,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.diceMap = { 1: dice1, 2: dice2, 3: dice3, 4: dice4, 5: dice5, 6: dice6 };
        
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        // this.initPlayers();
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
                communityCards: [],
                chanceCards: [],
            },
            {
                id: 2,
                name: 'Yash',
                color: 'blue',
                balance: 1500,
                position: 0,
                properties: [],
                communityCards: [],
                chanceCards: [],
            },

            {
                id: 3,
                name: 'Kar',
                color: 'yellow',
                balance: 1500,
                position: 0,
                properties: [],
                communityCards: [],
                chanceCards: [],
            },
            {
                id: 4,
                name: 'Bha',
                color: 'green',
                balance: 1500,
                position: 0,
                properties: [],
                communityCards: [],
                chanceCards: [],
            },
        ];

        this.setState({players, currentPlayer: players[0], currentPlayerIndex: 0});

        // this.setState({selectedBlock: this.state.board[0]});

    }

    initBank() {
        // No houses and hotels count needed fot this version
        this.setState({bank: {balance: 2000, houses: 20, hotels: 20}})
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
        // const total = 7; // COnst increment for testing
        console.log(total, dice1, dice2);
        console.log(this.state.board)
        
        let final_pos = currentPlayer.position + total;
        if (final_pos >= this.state.board.length) final_pos -= this.state.board.length;
        currentPlayer.position = final_pos;
        

        const selectedBlock = this.state.board[currentPlayer.position];
        this.setState({ currentPlayer, dice1, dice2, selectedBlock });

        // this.nextPlayer();

        this.setState({ rollDiceButtonEnabled: false });

        this.processChanceForCorrespondingBLock(selectedBlock, currentPlayer, currentPlayer.position);

    }

    nextPlayer() {
        this.resetButtonModes();

        this.setState({ selectedBlock: null, rollDiceButtonEnabled: true });

        let newIndex = this.state.currentPlayerIndex + 1;
        if  (newIndex >= this.state.players.length) newIndex = 0;

        const currentPlayerIndex = newIndex;
        const currentPlayer = this.state.players[currentPlayerIndex];

        this.setState({currentPlayer, currentPlayerIndex})

        if (currentPlayer.inJail) {
            this.setState({ payJailChargesButtonEnabled: true });
        }
    }

    nextAction = () => {
        this.nextPlayer();
    }

    buyProperty = () => {
        const { currentPlayer, selectedBlock, bank } = this.state;
        
        if (!selectedBlock.price && typeof selectedBlock.price != 'number') {
            window.alert('Cannot buy this block');
            return;
        }

        if (currentPlayer.balance >= selectedBlock.price) {
            currentPlayer.balance -= selectedBlock.price; // Deduct from user
            bank.balance += selectedBlock.price; // Add money to bank
            
            currentPlayer.properties.push(selectedBlock);
            
            selectedBlock.owned_by = currentPlayer;

            this.setState({ currentPlayer, selectedBlock, bank });
            
            window.alert('Property bought successfully');
            
            this.nextPlayer();
            
        } else {
            window.alert("You don't have sufficient balance!");

            // Pass Buying property which will lead to auction
            this.nextPlayer();
        }

        // Keepin it here for now.
        // this.resetButtonModes();
    }

    payRent = () => {
        const { currentPlayer, selectedBlock } = this.state;

        
        // if (!selectedBlock.rent1 && typeof selectedBlock.rent1 != 'number') {
        //     window.alert('Cannot pay rent for this block');
        //     return;
        // }

        let rent;
        switch (selectedBlock.visited_players_count[currentPlayer.id]) {
            case undefined:
                rent = selectedBlock.baserent;
                break;
            case 1:
                rent = selectedBlock.rent1;
                break;
            case 2:
                rent = selectedBlock.rent2;
                break;
            case 3:
                rent = selectedBlock.rent3;
                break;
            case 4:
                rent = selectedBlock.rent4;
                break;
            default:
                rent = selectedBlock.rent4;
        }
        
        selectedBlock.visited_players_count[currentPlayer.id] ? 
            selectedBlock.visited_players_count[currentPlayer.id] += 1 :
            selectedBlock.visited_players_count[currentPlayer.id] = 1;

        if (currentPlayer.balance >= rent) {
            currentPlayer.balance -= rent;

            selectedBlock.owned_by.balance += rent;

            this.setState({ currentPlayer, selectedBlock });

            window.alert('Rent paid successfully successfully');

            this.nextPlayer();
        } else {
            // Morgaze paisa from bank or
            // Sell a property
            // !!!!!!!!!!!!!!!!!!!!!!!!!!
        }


        
        // this.resetButtonModes();

    }

    resetButtonModes() {
        this.setState({
            // action buttons
            rollDiceButtonEnabled: true,
            buyPropertyButtonEnabled: false,
            passPropertyForAuction: false,
            payPropertyRentButtonEnabled: false,
            payUtilityBillsButtonEnabled: false,
            payTaxButtonEnabled: false,
            collectSalaryButtonEnabled: false,
            pickCommunityCardButtonEnabled: false,
            pickChanceCardButtonEnabled: false,
            continueButtonEnabled: false,
            
            wildActionsButtonEnabled: false,
        });
    }
    processChanceForCorrespondingBLock(selectedBlock, currentPlayer, position) {
        const group = selectedBlock.groupNumber;

        if (group === "") {
            // Wind actions
            if (position === 4 || position === 38) {
                // Govt tax
                this.setState({ payTaxButtonEnabled: true });
            } else if (position === 0) {
                this.setState({ collectSalaryButtonEnabled: true });
            } else if (position === 10 || position === 20) {
                this.setState({ continueButtonEnabled: true });
            } else if (position === 2 || position === 17 || position === 33) {
                // Community card
                this.setState({ pickCommunityCardButtonEnabled: true });
            } else if (position === 7 || position === 22 || position === 35) {
                // Chance card pick
                this.setState({ pickChanceCardButtonEnabled: true });
            } else if (position === 30) {
                // Go to Jail
                setTimeout(() => {
                    this.movePlayerToJail();
                    this.nextPlayer();
                }, 1000);
            }
        } else if (group === 1) {
            // Properties which doesn't take rent
            if (selectedBlock.owned_by != null &&
                selectedBlock.owned_by.id !== currentPlayer.id) {
                    this.setState({ continueGameplay: true });
            } else if (selectedBlock.owned_by == null &&
                typeof selectedBlock.price === 'number') {
                    this.setState({ buyRoadButtonEnabled: true, continueGameplay: true });
            }
        } else if (group === 2) {
            // UTILITIES PROVEIDRS
            // this.setState({ payUtilityBillsButtonEnabled: true });
            if (selectedBlock.owned_by != null &&
                selectedBlock.owned_by.id !== currentPlayer.id) {
                    this.setState({ continueGameplay: true });
            } else if (selectedBlock.owned_by == null &&
                typeof selectedBlock.price === 'number') {
                    this.setState({ buyUtilityCompanyButtonEnabled: true, continueGameplay: true });
            }
        } else if ([3,4,5,6,7,8,9,10].includes(group)) {
            // Poperty block
            // 1. Pay rent, 2. Buy property, 3. Pass
            if (selectedBlock.owned_by != null &&
                selectedBlock.owned_by.id !== currentPlayer.id) {
                    this.setState({ payPropertyRentButtonEnabled: true });
            } else if (selectedBlock.owned_by == null &&
                typeof selectedBlock.price === 'number') {
                    this.setState({ buyPropertyButtonEnabled: true, passPropertyForAuction: true });
            }
        }
    }

    passPropertyForAuction = () => {
        
        this.nextPlayer();
        // this.resetButtonModes();
    }

    payUtilityBill = () => {
        const { currentPlayer, selectedBlock, bank } = this.state;

        if (currentPlayer.balance >= selectedBlock.price) {
            currentPlayer.balance -= selectedBlock.price; // Deduct from user
            bank.balance += selectedBlock.price; // Add money to bank

            this.setState({ currentPlayer, selectedBlock, bank });
            
            window.alert('Bill paid successfully');
            
            this.nextPlayer();
            
        } else {
            window.alert("You don't have sufficient balance! Mortgage something or sell a property!");

            // Pass Buying property which will lead to auction
            this.nextPlayer();
        }

        // Keepin it here for now.
        // this.resetButtonModes();
    }

    payGovtTax = () => {
        const { currentPlayer, selectedBlock, bank } = this.state;

        const pricetext = selectedBlock.pricetext;
        const tax = parseInt(pricetext.replace('Pay $', ''));
        if (currentPlayer.balance >= tax) {
            currentPlayer.balance -= tax; // Deduct from user
            bank.balance += tax; // Add money to bank

            this.setState({ currentPlayer, bank });
            
            window.alert('Tax paid successfully');
            
            this.nextPlayer();
            
        } else {
            window.alert("You don't have sufficient balance! Mortgage something or sell a property!");

            // Pass Buying property which will lead to auction
            this.nextPlayer();
        }
    }

    collectSalary = () => {
        const { currentPlayer, bank } = this.state;

        currentPlayer.balance += 200; // Deduct from user
        bank.balance -= 200; // Add money to bank

        this.setState({ currentPlayer, bank });
        
        window.alert('Salary of $200 colected successfully!');
        
        this.nextPlayer();
            
    }
    
    continueGameplay = () => {
        this.nextPlayer();
    }

    pickCommunityCard = () => {
        
        const { communityCards, currentPlayer } = this.state;
        const randomIndex = Math.floor(Math.random() * communityCards.length);
        const randomCard = communityCards.splice(randomIndex, 1);

        currentPlayer.communityCards.push(randomCard);
        
        this.setState({ communityCards, currentPlayer })
        
        window.alert(randomCard);

        this.nextPlayer();

    }

    pickChanceCard = () => {
        const { chanceCards, currentPlayer } = this.state;
        const randomIndex = Math.floor(Math.random() * chanceCards.length);
        // const randomIndex = 2;

        // const randomCard = chanceCards.splice(randomIndex, 1);
        const randomCard = chanceCards[randomIndex];

        // currentPlayer.chanceCards.push(randomCard);
        
        window.alert(randomCard);

        this.tryWildCard(randomCard, randomIndex, 'chance');

        this.setState({ chanceCards, currentPlayer });

        this.nextPlayer();
    }

    tryWildCard(card, cardIndex, cardType) {

        console.log(card,cardIndex,cardType)
        // Execute the picked wild card
        const { chanceCards, communityCards, chanceCardsMap, communityCardsMap, currentPlayer, players } = this.state;
        console.log(chanceCardsMap[card])
        if (cardType === 'chance') {
            switch (chanceCardsMap[card]) {
                case 0:
                    chanceCards.splice(cardIndex, 1);
                    currentPlayer.chanceCards.push(card);
                    // DO nothing for this
                    break;
                case 1:
                    //  "Make General Repairs on All Your Property. For each house pay $25. For each hotel $100.",
                    break;
                case 2:
                    // "Speeding fine $15."
                    console.log('in here')
                    this.payMoneyToBank(currentPlayer, 15);
                    break;
                case 3:
                    //"You have been elected chairman of the board. Pay each player $50."
                    players.filter(p => p.id !== currentPlayer.id).map(targetPlayer => {
                        this.sendMoneyFromAtoB(currentPlayer, targetPlayer, 50);
                    });
                    break;
                case 4:
                    // "Go back three spaces.",
                    this.jumpPlayerBySteps(currentPlayer, -3);
                    break;
                case 5:
                    // "ADVANCE TO THE NEAREST UTILITY. IF UNOWNED, you may buy it from the Bank. IF OWNED, throw dice and pay owner a total ten times the amount thrown.",
                    // TO do
                    break;
                case 6:
                    // "Bank pays you dividend of $50."
                    this.getMoneyFromBank(currentPlayer, 50);
                    break;
                case 7:
                    //   "ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.",
                    break;
                case 8:
                    // "Pay poor tax of $15.",
                    this.payMoneyToBank(currentPlayer, 15);
                    break;
                case 9:
                    //   "Take a trip to Reading Rail Road. If you pass 'GO' collect $200.",
                    // To do
                    break;
                case 10:
                    //   "ADVANCE to Boardwalk.",
                    break;
                case 11:
                    //   "ADVANCE to Illinois Avenue. If you pass 'GO' collect $200.",
                    break;
                case 12:
                    // "Your building loan matures. Collect $150.",
                    this.getMoneyFromBank(currentPlayer, 150);
                    break;
                case 13:
                    // "ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.":
                    break;
                case 14:
                    // "ADVANCE to St. Charles Place. If you pass 'GO' collect $200.",
                    break;
                case 15:
                    // "Go to Jail. Go Directly to Jail. Do not pass 'GO'. Do not collect $200."
                    this.movePlayerToJail();
                    break;
                default:
                    break;
            }

        } else if (cardType === 'community') {
            switch (communityCardsMap[card]) {
                case 0:
                    // "Get out of Jail, Free. This card may be kept until needed or sold.",
                    chanceCards.splice(cardIndex, 1);
                    currentPlayer.chanceCards.push(card);
                    // No nothing more as card is pushed
                    break;
                case 1:
                    // "You have won second prize in a beauty contest. Collect $10.",
                    this.getMoneyFromBank(currentPlayer, 10);
                    break;
                case 2:
                    // "From sale of stock, you get $50.",
                    this.getMoneyFromBank(currentPlayer, 50);
                    break;
                case 3:
                    // "Life insurance matures. Collect $100.",
                    this.getMoneyFromBank(currentPlayer, 100);
                    break;
                case 4:
                    // "Income tax refund. Collect $20.",
                    this.getMoneyFromBank(currentPlayer, 20);
                    break;
                case 5:
                    // "Holiday fund matures. Receive $100.",
                    this.getMoneyFromBank(currentPlayer, 100);
                    break;
                case 6:
                    // "You inherit $100."
                    this.getMoneyFromBank(currentPlayer, 100);
                    break;
                case 7:
                    // "Receive $25 consultancy fee.",
                    this.getMoneyFromBank(currentPlayer, 25);
                    break;
                case 8:
                    // "Pay hospital fees of $100."
                    this.payMoneyToBank(currentPlayer, 100);
                    break;
                case 9:
                    // "Bank error in your favor. Collect $200."
                    this.getMoneyFromBank(currentPlayer, 200);
                    break;
                case 10:
                    //"Pay school fees of $50.",
                    this.payMoneyToBank(currentPlayer, 50);
                    break;
                case 11:
                    // "Doctor's fee. Pay $50.",
                    this.payMoneyToBank(currentPlayer, 50);
                    break;
                case 12:
                    // "It is your birthday. Collect $10 from every player.",
                    // todo
                    break;
                case 13:
                    // "Advance to 'GO' (Collect $200)",
                    // TO do
                    break;
                case 14:
                    // "You are assessed for street repairs. $40 per house. $115 per hotel.",
                    // To do
                    break;
                case 15:
                    // "Go to Jail. Go directly to Jail. Do not pass 'GO'. Do not collect $200."
                    // TO do
                    break;
                default:
                    break;
            }
        }

        this.setState({ currentPlayer });

        
    }

    payMoneyToBank(player, amount) {
        const { currentPlayer, bank } = this.state;

        if (currentPlayer.balance >= amount) {
            currentPlayer.balance -= amount; // Deduct from user
            bank.balance += amount; // Add money to bank

            this.setState({ bank });
            
            // window.alert('Tax paid successfully');
            
            // this.nextPlayer();
            
        } else {
            window.alert("You don't have sufficient balance! Mortgage something or sell a property!");

            // Pass Buying property which will lead to auction
            // this.nextPlayer();
        }
    }

    getMoneyFromBank(player, amount) {

    }

    sendMoneyFromAtoB(personA, personB, amount) {

    }

    jumpPlayerToPosition(player, position) {

    }

    jumpPlayerBySteps(player, steps) {

    }

    movePlayerToJail() {
        window.alert('Sending you to Jail!');
        const {currentPlayer} = this.state;
        currentPlayer.position = 10;
        currentPlayer.inJail = true;

        this.setState({currentPlayer});

    }

    payJailCharges = () => {
        const { currentPlayer, bank } = this.state;

        const tax = 50;
        if (currentPlayer.balance >= tax) {
            currentPlayer.balance -= tax; // Deduct from user
            bank.balance += tax; // Add money to bank

            
            window.alert('Charges paid successfully!');
            
            currentPlayer.inJail = false;
            this.setState({ currentPlayer, bank });
            // this.nextPlayer();
            
        } else {
            window.alert("You don't have sufficient balance! Mortgage something or sell a property!");

            // Pass Buying property which will lead to auction
            // this.nextPlayer();
        }
    }
    
    
    render() {

        const { board, players } = this.state;
        const bottomBoard = board.slice(1, 10).reverse();
        const leftBoard = board.slice(11, 20).reverse();
        const topBoard = board.slice(21, 30);
        const rightBoard = board.slice(31, 40);
        
        console.log(bottomBoard, players)
       
        return (
          <>
            <div className="background">
                {/* <img className="board-image" alt="board-background" style={{ height: `${this.state.height}px`, left: `calc(50% - ${this.state.height / 2}px)` }}  src={boardBackground} /> */}
                <img className="board-image" alt="board-background" style={{ height: `${this.state.height}px`, left: `calc(50% - ${this.state.height / 2}px)` }}  src={boardBackground2} />
            </div>
            
            {/* {this.board} */}

            <div style={{ height: `${this.state.height}px`, width: `${this.state.height}px`, left: `calc(50% - ${this.state.height / 2}px)` }} className="gameplay board">
                <div className="board-row board-bottom">
                    <div className="corner-block">
                            
                        <div className="chance-users-collection">
                            {
                                players.filter(p => p.position === board[10].id).map(player => {
                                    return (
                                        <div style={{backgroundColor: player.color}} className="chance-users"></div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {
                        bottomBoard.map(board => {
                            return (
                                <div className="block">
                                    {
                                        board.owned_by != null &&
                                        <div style={{backgroundColor: board.owned_by.color}} className="owned-by-block">{board.owned_by.id}</div>
                                    }
                                    <div className="chance-users-collection">
                                        {
                                            players.filter(p => p.position === board.id).map(player => {
                                                return (
                                                    <div style={{backgroundColor: player.color}} className="chance-users"></div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                    <div className="corner-block">
                        <div className="chance-users-collection">
                            {
                                players.filter(p => p.position === board[0].id).map(player => {
                                    return (
                                        <div style={{backgroundColor: player.color}} className="chance-users"></div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="board-col board-left">
                    {
                        leftBoard.map(board => {
                            return (
                                <div className="block">
                                    {
                                        board.owned_by != null &&
                                        <div style={{backgroundColor: board.owned_by.color}} className="owned-by-block">{board.owned_by.id}</div>
                                    }
                                    <div className="chance-users-collection">
                                        {
                                            players.filter(p => p.position === board.id).map(player => {
                                                return (
                                                    <div style={{backgroundColor: player.color}} className="chance-users"></div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                </div>
                <div className="board-row board-top">
                    <div className="corner-block">
                        <div className="chance-users-collection">
                            {
                                players.filter(p => p.position === board[20].id).map(player => {
                                    return (
                                        <div style={{backgroundColor: player.color}} className="chance-users"></div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    
                    {
                        topBoard.map(board => {
                            return (
                                <div className="block">
                                    {
                                        board.owned_by != null &&
                                        <div style={{backgroundColor: board.owned_by.color}} className="owned-by-block">{board.owned_by.id}</div>
                                    }
                                    <div className="chance-users-collection">
                                        {
                                            players.filter(p => p.position === board.id).map(player => {
                                                return (
                                                    <div style={{backgroundColor: player.color}} className="chance-users"></div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className="corner-block">
                        <div className="chance-users-collection">
                            {
                                players.filter(p => p.position === board[30].id).map(player => {
                                    return (
                                        <div style={{backgroundColor: player.color}} className="chance-users"></div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="board-col board-right">
                    {
                        rightBoard.map(board => {
                            return (
                                <div className="block">
                                    {
                                        board.owned_by != null &&
                                        <div style={{backgroundColor: board.owned_by.color}} className="owned-by-block">{board.owned_by.id}</div>
                                    }
                                    <div className="chance-users-collection">
                                        {
                                            players.filter(p => p.position === board.id).map(player => {
                                                return (
                                                    <div style={{backgroundColor: player.color}} className="chance-users"></div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            

            <div className="bank-details">
                <h4>
                    Bank: ${ this.state.bank.balance }
                </h4>
            </div>

            <div className="details-panel">
                <div className="block-view">
                    <div style={{backgroundColor: this.state.selectedBlock?.color}} className="head-color">
                        <h4>#{this.state.selectedBlock?.id} {this.state.selectedBlock?.name}</h4>
                    </div>

                    {   this.state.selectedBlock != null &&
                        <div className="price-text">
                            <h4>{this.state.selectedBlock.pricetext}</h4>
                            
                            {   
                                typeof this.state.selectedBlock?.baserent === 'number' &&
                                <h5>Rents: {this.state.selectedBlock.baserent}, {this.state.selectedBlock.rent1}, {this.state.selectedBlock.rent2}, {this.state.selectedBlock.rent3}, {this.state.selectedBlock.rent4}, {this.state.selectedBlock.rent5}</h5>
                            }
                            {
                                this.state.payPropertyRentButtonEnabled &&
                                <p>Visit: {this.state.selectedBlock.visited_players_count[this.state.currentPlayer.id] ? this.state.selectedBlock.visited_players_count[this.state.currentPlayer.id] : 1}</p>
                            }
                        </div>
                    }

                    {
                        this.state.selectedBlock == null &&
                        this.state.currentPlayer.inJail !== true &&
                        <div className="roll-details-text">
                            <h4>Roll your dice Mr. {this.state.currentPlayer?.name}</h4>
                        </div>
                    }

                    {
                        this.state.selectedBlock == null &&
                        this.state.currentPlayer.inJail === true &&
                        <div className="roll-details-text">
                            <h4>Pay Bail fees Mr. {this.state.currentPlayer?.name} to continue</h4>
                        </div>

                    }
                    
                    
                </div>

                <div className="actions">
                    {
                        this.state.buyPropertyButtonEnabled &&
                        <button onClick={this.buyProperty} >BUY NOW</button>
                    }
                    {
                        this.state.payPropertyRentButtonEnabled &&
                        <button onClick={this.payRent} >PAY RENT</button>
                    }

                    {
                        this.state.passPropertyForAuction &&
                        <button onClick={this.passPropertyForAuction} >PASS</button>
                    }


                    {
                        this.state.buyRoadButtonEnabled &&
                        <button onClick={this.buyProperty} >BUY SERVICE COMPANY</button>
                    }

                    {
                        this.state.payRoadTaxButtonEnabled &&
                        <button onClick={this.payRoadTax} >PAY ROAD TAX</button>
                    }

                    {
                        this.state.buyUtilityCompanyButtonEnabled &&
                        <button onClick={this.buyProperty} >BUY UTILITY COMPANY</button>
                    }

                    {
                        this.state.payUtilityBillsButtonEnabled &&
                        <button onClick={this.payUtilityBill} >PAY UTILITY BILL</button>
                    }



                    {
                        this.state.payTaxButtonEnabled &&
                        <button onClick={this.payGovtTax} >PAY TAX</button>
                    }

                    {
                        this.state.collectSalaryButtonEnabled &&
                        <button onClick={this.collectSalary}>COLLECT SALARY</button>
                    }

                    {
                        this.state.pickCommunityCardButtonEnabled &&
                        <button onClick={this.pickCommunityCard}>PICK COMMUNITY CARD</button>
                    }

                    {
                        this.state.pickChanceCardButtonEnabled &&
                        <button onClick={this.pickChanceCard}>PICK CHANCE CARD</button>
                    }

                    {
                        this.state.payJailChargesButtonEnabled &&
                        <button onClick={this.payJailCharges}>PAY JAIL CHARGES</button>
                    }

                    {
                        this.state.continueButtonEnabled &&
                        <button onClick={this.continueGameplay}>CONTINUE</button>
                    }
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
                <button onClick={this.rollDice} disabled={!this.state.rollDiceButtonEnabled || this.state.currentPlayer.inJail === true}>Roll Dice</button>
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