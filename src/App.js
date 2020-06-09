import React from 'react';
import logo from './eta_Toporiki.svg';
import './App.css';

import { Button, Intent, ButtonGroup, AnchorButton, Navbar, 
  Alignment, Card, Elevation, Position, Tooltip } from "@blueprintjs/core"

function NoteBar(props){
  const symbols = props.symbols;
  const noteBarRes = symbols.map((symbol, key) => 
    <Tooltip position={Position.LEFT} content={symbol[1]}>
      <Button className="note_btn">
      <span style={{top:symbol[2], position:"relative"}}>
      {symbol[0]}
      </span>
      </Button>
    </Tooltip>
  );
  return( 
    <ButtonGroup vertical={true} style={{padding:5}}>
    {noteBarRes}
    </ButtonGroup>
  );

}


function App() {

  function printCall(){
    window.print();
  }

  const notes = [
    ["Αα","восьмая (1/8)",-13],
    ["Ββ","четверть (1/4)",-13],
    ["ΒΘ","3/8",-13],
    ["Γγ","половинка (2/4)",-7],
    ["ΓΘ","3/4",-7],
    ["Δ","целая (4/4)",-7],
    ["ΔΘ","6/4",-7],
    ["Εε","двойная (8/4)",-7],
    ["Ι","речитатив (RC)",-7]
  ];

  return (
    <div className="App">
      <Navbar className="bp3-dark">
    <Navbar.Group align={Alignment.LEFT} >
        <img src={logo} className="App-axe" alt="logo" />
        <Navbar.Heading style={{fontWeight:"bold"}}>          
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
          [/=======йц==у=к===енг===шщ==з(Ъ)хъ===========================\
          </div>
        </Card>
        <ButtonGroup vertical={true} large={true} style={{padding:15}}>
          <NoteBar symbols={notes} />
        </ButtonGroup>
      </header>
    </div>
  );
}

export default App;
