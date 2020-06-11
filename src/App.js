import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  Button, Intent, ButtonGroup, AnchorButton, Navbar,
  Alignment, Card, Elevation, Position, Tooltip
} from "@blueprintjs/core"

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
      <Tooltip position={Position.LEFT} content={symbol[1]}>
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
          <h5>Composition 1</h5>
          <div className="noteline">
            [`=======йц==у=к===енг===шщ==з(Ъ)хъ========================\/
          </div>
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
