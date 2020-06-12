import React from 'react';
import ReactDOM from 'react';
import logo from './logo.svg';
import './App.css';

import {
  Button, Intent, ButtonGroup, AnchorButton, Navbar,
  Alignment, Card, Elevation, Position, Tooltip
} from "@blueprintjs/core"

class NoteChar extends React.Component{
  constructor(props){
    super(props);    
    this.noteUpdate = this.noteUpdate.bind(this);
    this.clickToChar = this.clickToChar.bind(this);
    this.state = {
      cNote: props.note
    }
  }
  clickToChar(lY,mY){
    return (lY[0] <= mY && lY[1] >= mY);
  }
  noteUpdate(evt){  
    let clickY = evt.clientY - this.props.cy;
    let safeChars = "[ё\\/".split("");
    let noteHights = [
      [40,34,"й"],
      [35,29,"ц"],
      [30,24,"у"],
      [25,19,"к"],
      [20,14,"е"],
      [15,9,"н"],
      [10,4,"г"],
      [5,1,"ш"],
      [0,-4,"щ"],
      [-5,-9,"з"],
      [-10,-14,"х"],
      [-15,-20,"ъ"],
    ]
    this.setState(function(state){
      if( safeChars.indexOf(this.state.cNote) === -1){        
        let nCh = noteHights.find(element => {
            if (clickY < element[0] && clickY > element[1]){
                return true;
            }
        });
        console.log(nCh);
        if(nCh===undefined){
          return {cNote: "="}
        } else {
          return {cNote: nCh[2]}
        }
      }
    })
    console.log(" cY:"+this.props.cy +  " eCy:" + evt.clientY + " rY:"+clickY);
  }
  render(){
    return(
      <span onClick={this.noteUpdate}>
      {this.state.cNote}
      </span>
    );
  }
}

class NoteLine extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      cx: 0,
      cy: 0
    }
  }
  componentDidMount(){
        this.setState({
          cy: this.containerLine.offsetTop
        });        
  }
  render(){
    let myLine = "ё=======================================================\\/";
    let resLine = myLine.split("").map((char, key) => 
      <NoteChar note={char} key={key} cx={this.state.cx} cy={this.state.cy} />      
    );
    return(
      <div className="noteline" ref={el => this.containerLine = el}>
           {resLine}
      </div>
    );
  }
}

class NoteBtn extends React.Component {
  constructor(props) {
    super(props);
    this.switchState = this.switchState.bind(this)
    this.state = {
      btnState: Intent.NONE
    }
  }

  switchState() {
    this.setState(function (state, props) {
      if (this.state.btnState === Intent.PRIMARY) {
        return {
          btnState: Intent.NONE
        }
      } else {
        return {
          btnState: Intent.PRIMARY
        }
      }
    });
  }

  render() {
    return (
      <Button className="note_btn"
        onClick={this.switchState} intent={this.state.btnState}>
        <span style={{ top: this.props.pos, position: "relative" }}>
          {this.props.symb}
        </span>
      </Button>
    );
  }
}

class NoteBar extends React.Component {

  render() {
    const symbols = this.props.symbols;
    const noteBarRes = symbols.map((symbol, key) =>
      <Tooltip position={Position.LEFT} content={symbol[1]} key={key}>
        <NoteBtn pos={symbol[2]} symb={symbol[0]} />
      </Tooltip>
    );

    return (
      <ButtonGroup vertical={true}>
        {noteBarRes}
      </ButtonGroup>
    );
  }

}


function App() {

  function printCall() {
    window.print();
  }

  const notes = [
    ["Αα", "восьмая (1/8)", -13],
    ["Ββ", "четверть (1/4)", -13],
    ["Γγ", "половинка (2/4)", -7],
    ["Δ", "целая (4/4)", -7],
    ["Εε", "двойная (8/4)", -7],
    ["Ι", "речитатив (RC)", -7]
  ];

  const marks = [
    ["Θ", "Точка", -7],
    ["δ", "Бемоль", -7]
  ]

  return (
    <div className="App">
      <Navbar className="bp3-dark" >
        <Navbar.Group align={Alignment.LEFT} >
          <img src={logo} className="App-axe" alt="logo" />
          <Navbar.Heading style={{ fontWeight: "bold" }}>
            простоТопорики
           </Navbar.Heading>
          <Navbar.Divider />
          <AnchorButton className="bp3-minimal" icon="folder-open" text="Открыть" />
          <Button className="bp3-minimal" icon="floppy-disk" text="Сохранить" />
          <Button className="bp3-minimal" icon="print" text="Печать" onClick={printCall} />
        </Navbar.Group>
      </Navbar>
      <header className="App-header">
        <Card elevation={Elevation.TWO} className="printCard" >
          <h3>Composition 1</h3>
          <NoteLine />
          <p> Line 1 </p>
          <NoteLine />
          <p> Line 2 </p>
          <NoteLine />
          <p> Line 3 </p>
          <NoteLine />
          <p> Line 4 </p>
          <NoteLine />
          <p> Line 5 </p>
        </Card>
        <ButtonGroup vertical={true} large={true} style={{ padding: 15 }}>
          <NoteBar symbols={notes} />
          <div style={{ height: 5 }} />
          <NoteBar symbols={marks} />
        </ButtonGroup>
      </header>
    </div>
  );
}

export default App;
