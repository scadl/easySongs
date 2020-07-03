import React from 'react';
import ReactToPrint from "react-to-print";
import './App.css';
import {
  Button, ButtonGroup, Navbar,
  Card, Elevation,
  Tooltip, InputGroup, NumericInput
} from "@blueprintjs/core";
import { v4 as uuidv4 } from 'uuid';

import NoteLine from "./Music";
import NoteBar from "./Toolbar";
import NoteText from "./Text";


class App extends React.Component {

  constructor(props) {
    super(props);
    this.onActiveNote = this.onActiveNote.bind(this);
    this.onLineAdd = this.onLineAdd.bind(this);
    this.onGlasChange = this.onGlasChange.bind(this);
    this.onPristChange = this.onPristChange.bind(this);
    this.saveDoc = this.saveDoc.bind(this);
    this.loadDoc = this.loadDoc.bind(this);
    this.onDataGot = this.onDataGot.bind(this);
    this.docData = [];
    this.emptyLine = {
      'notes': '=`===============================================================',
      'texts': 'Текст песнопения'
    }    
    this.state = {
      noteID: -1,
      noteLines: 0,
      glasNm: 1,
      pagesNm: 1,
      prist: "Пёснь",
      docHeader: 'Заголовок документа',
      mySong: [Object.assign({}, this.emptyLine)],
    }
    // Object.assign(target, ...sources) - Copy object with props
  }

  onActiveNote(nID) {
    this.setState({
      noteID: nID
    })
  }

  componentDidMount() {
  }

  onLineAdd(val) {
    this.setState({
      noteLines: val
    })
  }

  onGlasChange(val) {
    this.setState({
      glasNm: val
    })
  }

  onPristChange(evt) {
    let itxt = evt.target.value;
    this.setState({
      prist: itxt
    })
  }

  onDataGot(id, text, subIndex = -1) {    
    if (id === 'H') {
      // This is a header
      this.setState((state) => ({
        docHeader: text
      }));
    } else {
      let mS = this.state.mySong;
      if (mS[id] === undefined) {
        mS[id] = Object.assign({}, this.emptyLine)
      }
      if (subIndex !== -1) {
        let nS = mS[id].notes;
        mS[id].notes = nS.substr(0, subIndex) + text + nS.substr(subIndex + 1);
      } else {
        // if subIndex = -1, it's a text
        mS[id].texts = text;
      }
      //console.log(mS);
      this.setState((state) => ({
        mySong: mS
      }));
    }
    
  }

  saveDoc() {

    console.log(uuidv4());

    let saveStruct = {
      'header':this.state.docHeader, 
      'data': this.state.mySong
    }
    localStorage.setItem(
      'file_1',
      JSON.stringify(saveStruct)
    );

    console.group("Saving Process");
    console.warn("Data to be saved");
    console.log(this.state.mySong);
    //console.log(this.docData.length);
    //console.log(this.docData);
    console.groupEnd("Saving Process");
  }

  loadDoc() {
    let fileData = JSON.parse(localStorage.getItem('file_1'));
    let lines = fileData.data.length;
    this.setState((state)=>({
      noteLines: lines,
      docHeader: fileData.header,
      mySong: fileData.data,      
    }));

    console.group("Loading Process");
    console.warn("Document loaded "+lines+"l :")
    console.log(fileData);
    console.groupEnd("Loading Process");
  }

  render() {

    const notes = [
      ["Α", "восьмая (1/8)", -13],
      ["Β", "четверть (1/4)", -13],
      ["Γ", "половинка (2/4)", -7],
      ["Δ", "целая (4/4)", -7],
      ["Ε", "двойная (8/4)", -7],
      ["Ζ", "Переход Вверх (ST+)", -13],
      ["Η", "Перход Вниз (ST-)", -13],
      ["Ι", "речитатив (RC)", -7],
      ["Θ", "Точка", -7],
      ["δ", "Бемоль", -7],
      ["=", "Пустой стан", -5],
      ["[", "Начало строки", -5],
      ["\\", "Конец строки", -5],
      ["/", "Конец песнопения", -5],
      ["Σ", "Удалить символ", -13],
      ["Τ", "Вставить приставку", -13],
    ];

    let lines = [];
    lines.push([]);
    let pages = [
      <Card elevation={Elevation.TWO} className="printCard" id="myPage" key={"c0"}>
        <h3>
          <NoteText key={"tH"} txtID={"H"}
            onTxtData={this.onDataGot}
            textLine={this.state.docHeader} />
        </h3>
        {lines[0]}
      </Card>
    ];

    let ind = 0;
    for (let i = 0; i < this.state.noteLines; i++) {

      if (i % 9 === 0 && i > 7) {
        ind++;
        lines.push([]);
        pages.push(
          <Card elevation={Elevation.TWO}
            className="printCard" id="myPage" key={"c" + i}>
            {lines[ind]}
          </Card>
        )
      }

      if (this.state.mySong[i] === undefined) {
        let oS = this.state.mySong;
        oS[i] = Object.assign({}, this.emptyLine);
        this.setState((state) => ({
          mySong: oS
        }));
      }
      lines[ind].push(
        <NoteLine key={"l" + i} SnID={this.state.noteID}
          glas={this.state.glasNm} prist={this.state.prist} nID={i}
          noteLine={this.state.mySong[i].notes} onNoteData={this.onDataGot} />,
        <NoteText key={"t" + i} txtID={i} onTxtData={this.onDataGot}
          textLine={this.state.mySong[i].texts} />
      )

    }
    this.docData = lines;

    return (
      <div className="App">
        <Navbar className="bp3-dark" style={{ position: "fixed" }}>
          <Navbar.Group >
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
                style={{ fill: "#bfccd6", fillOpacity: 0.1, stroke: "#bfccd6", strokeOpacity: 0.5, strokeWidth: 50, }}
                ry="200" />
            </svg>
            <Navbar.Heading style={{ fontWeight: "bold" }} className="">
              простоТопорики
           </Navbar.Heading>
            <Navbar.Divider />
            <ButtonGroup>
              <Button minimal={false} icon="folder-open" text="Открыть" onClick={this.loadDoc} />
              <Button minimal={false} icon="floppy-disk" text="Сохранить" onClick={this.saveDoc} />
              <Tooltip content={"Печать"}>
                <ReactToPrint
                  trigger={() => <Button icon="print" />}
                  content={() => this.componentRef}
                />
              </Tooltip>
            </ButtonGroup>
            <Navbar.Divider />
            <Tooltip content={"Станов в документе"}>
              <NumericInput leftIcon="sort" min={0} max={100} value={this.state.noteLines}
                style={{ width: 70 }} onValueChange={this.onLineAdd} />
            </Tooltip>
            <Tooltip content={"Приставка"}>
              <InputGroup leftIcon="sort-alphabetical" value={this.state.prist}
                style={{ width: 100 }} onChange={this.onPristChange} />
            </Tooltip>
            <Tooltip content={"Номер"}>
              <NumericInput leftIcon="changes" min={1} max={8} value={1}
                style={{ width: 70 }} onValueChange={this.onGlasChange} />
            </Tooltip>
          </Navbar.Group>
        </Navbar>
        <Navbar className="bp3-dark" style={{ paddingLeft: 1, top: 45, position: "fixed" }}>
          <Navbar.Group >
            <NoteBar symbols={notes} onActiveN={this.onActiveNote} />
          </Navbar.Group>
        </Navbar>
        <header className="App-header" >
          <div style={{ height: 100, display: "inline-block" }}></div>
          <span ref={el => (this.componentRef = el)}>
            {pages}
          </span>
        </header>
      </div>
    );
  }
}

export default App;
