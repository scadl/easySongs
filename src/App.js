import React from 'react';
import ReactToPrint from "react-to-print";
import './App.css';
import {
  Button, ButtonGroup, Navbar,
  Alignment, Card, Elevation, 
  Tooltip, InputGroup, NumericInput
} from "@blueprintjs/core";

import NoteLine from "./Music";
import NoteBar from "./Toolbar";
import NoteText from "./Text";


class App extends React.Component {

  constructor(props){
    super(props);
    this.onActiveNote = this.onActiveNote.bind(this);
    this.onLineAdd = this.onLineAdd.bind(this);
    this.onGlasChange = this.onGlasChange.bind(this);
    this.onPristChange = this.onPristChange.bind(this);
    this.state = {
      noteID: -1,
      noteLines: 1,
      glasNm: 1,
      pagesNm: 1,
      prist: "Пёснь",      
    }
  }
  
  onActiveNote(nID){
    this.setState({
      noteID: nID
    })
  }

  componentDidMount(){
  }

  onLineAdd(val){
    //console.log(valueAsNumber+" "+this.state.noteLines.length/2);
    this.setState({
      noteLines:val
    })
  }

  onGlasChange(val){
    this.setState({
      glasNm:val
    })
  }

  onPristChange(evt){
    let itxt = evt.target.value; 
    this.setState((state)=>({
      prist: itxt
    }))
  }

  render() {

    const notes = [
      ["Αα", "восьмая (1/8)", -13],
      ["Ββ", "четверть (1/4)", -13],
      ["Γγ", "половинка (2/4)", -7],
      ["Δ", "целая (4/4)", -7],
      ["Εε", "двойная (8/4)", -7],
      ["Ζ", "Переход Вверх (ST+)", -13],
      ["Η", "Перход Вниз (ST-)", -13],
      ["Ι", "речитатив (RC)", -7],
      ["Θ", "Точка", -7],
      ["δ", "Бемоль", -7],
      ["=", "Пустой стан", -5],
      ["[", "Начало строки", -5],
      ["\\", "Конец строки", -5],
      ["/", "Конец песнопения", -5],
      ["Σ", "Удалить символ",  -13],
      ["Τ", "Вставить приставку",  -13], 
    ];


    let lines = [];
    lines.push([]);
    let pages = [ 
      <Card elevation={Elevation.TWO} className="printCard" id="myPage" key={"c0"}>
        <h3><NoteText key={"tH"} txtID={"Заголовок "}/></h3>
        {lines[0]}
      </Card>
    ];

    let ind = 0;    
    for (let i = 0; i < this.state.noteLines; i++) {    

      if( i % 9 === 0 && i>7){
        ind++;
        lines.push([]);
        pages.push(
          <Card elevation={Elevation.TWO}
          className="printCard" id="myPage" key={"c"+i}>
            {lines[ind]}
          </Card>
        )
      }

      lines[ind].push(
        <NoteLine key={"l" + i} SnID={this.state.noteID}
          glas={this.state.glasNm} prist={this.state.prist} />,
        <NoteText key={"t" + i} txtID={i} />
      )
      
    }
    console.log(lines)

    return (
      <div className="App">
        <Navbar className="bp3-dark" style={{position:"fixed"}}>
          <Navbar.Group align={Alignment.LEFT} >
            <svg viewBox="0 0 1000 1000" className="App-axe" alt="logo">
              <path d="m 398,293 q 0,-25 14,-100 9,-46 9,-69 0,-12 -2,-23 Q 385,84 312,84 268,84 230.5,90 193,96 193,101 v 121 h 121 q 42,0 45,
              16 -19,73 -49,212 -20,91 -20,150 0,46 14,81 2,5 5,5 10,0 40,-20 34,-34 51,-34 2,0 3,1 -5,-16 -8,-34 h 247 q -12,156 -12,236 0,87 24,
              87 0,2 6,2 13,0 49,-10 36,-10 36,-12 V 181 H 533 q -16,17 -19,94 0,25 -1,50 -2,49 5.51562,52.1211 7.48438,2.87891 25.4844,2.87891 19,0 60,
              -3.5 41,-3.5 52,-3.5 13,0 13,3 0,36 -17,102 v 0 h -266 q 6,-92 12,-185 z m 6,343 q 0,-2 -1,-3 z" />
              <rect
                id="rect3710"
                width="970"
                height="970"
                x="10"
                y="10"
                style={{ fill: "#bfccd6", fillOpacity: 0.1, stroke: "#bfccd6", strokeOpacity: 0.5, strokeWidth: 50,  }}
                ry="200" />
            </svg>
            <Navbar.Heading style={{ fontWeight: "bold" }} className="">
              простоТопорики
           </Navbar.Heading>
            <Navbar.Divider />
            <ButtonGroup>
            <Button minimal={false} icon="folder-open" text="Открыть" />
            <Button minimal={false} icon="floppy-disk" text="Сохранить" />
            <Tooltip content={"Печать"}>
              <ReactToPrint
              trigger={()=><Button icon="print" />}
              content={()=>this.componentRef}
              />
            </Tooltip>
            </ButtonGroup>
            <Navbar.Divider />
            <Tooltip content={"Станов в документе"}>
            <NumericInput leftIcon="sort" min={1} max={100} value={1} 
            style={{width:70}} onValueChange={this.onLineAdd} />
            </Tooltip>
            <Tooltip content={"Приставка"}>
            <InputGroup leftIcon="sort-alphabetical" value={this.state.prist} 
            style={{width:100}} onChange={this.onPristChange} />
            </Tooltip>
            <Tooltip content={"Номер"}>
            <NumericInput leftIcon="changes" min={1} max={8} value={1} 
            style={{width:70}} onValueChange={this.onGlasChange} />
            </Tooltip>
          </Navbar.Group>
        </Navbar>
        <Navbar className="bp3-dark" style={{paddingLeft: 1, top:45, position:"fixed"}}>
          <Navbar.Group align={Alignment.CENTER} >
            <NoteBar symbols={notes} onActiveN={this.onActiveNote} />
          </Navbar.Group>
        </Navbar>
        <header className="App-header" >
          <div style={{height:100, display:"inline-block"}}></div>
          <span ref={el=>(this.componentRef=el)}>
          {pages}          
          </span>
        </header>
      </div>
    );
  }
}

export default App;
