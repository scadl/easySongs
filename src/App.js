import React from 'react';
import ReactToPrint from "react-to-print";
import './App.css';
import {
  Button, ButtonGroup, Navbar,
  Card, Elevation, Alert, Intent,
  Tooltip, InputGroup, NumericInput
} from "@blueprintjs/core";
import { v4 as uuidv4 } from 'uuid';

import NoteLine from "./Music";
import NoteBar from "./Toolbar";
import NoteText from "./Text";
import { TEXT_LARGE } from '@blueprintjs/core/lib/esm/common/classes';


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
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.saveAsk = this.saveAsk.bind(this);
    this.loadAsk = this.loadAsk.bind(this);
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
      isAskPrsisOpen : false,
      isAskSaveOpen: false,
      isAskLoadOpen: false,
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
      let alState = false;
      let mS = this.state.mySong;
      if (mS[id] === undefined) {
        mS[id] = Object.assign({}, this.emptyLine)
      }
      if (subIndex !== -1) {
        let insText = text
        if(typeof(text)=="object"){
          insText = '[-';
          alState = true;
        }
        let nS = mS[id].notes;
        mS[id].notes = nS.substr(0, subIndex) + insText + nS.substr(subIndex + 1);
      } else {
        // if subIndex = -1, it's a text
        mS[id].texts = text;
      }
      //console.log(mS);
      this.setState((state) => ({
        mySong: mS,
        isAskPrsisOpen: alState
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

  toggleOverlay(){
    this.setState({
      isAskPrsisOpen:false
    })
  }

  saveAsk(confirm){
    if(confirm){
      this.saveDoc();
    }
    this.setState({
      isAskSaveOpen:false
    })
  }

  loadAsk(confirm){
    if(confirm){
      this.loadDoc();
    }
    this.setState({
      isAskLoadOpen:false
    })
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
            <ButtonGroup>
            <Tooltip content={"Загрузить преидущую сессию"}>
              <Button minimal={false} icon="unarchive" text="Загрузить" 
              onClick={()=>{this.setState({isAskLoadOpen:true})}} />
            </Tooltip>
            <Tooltip content={"Записать текущий документ"}>
              <Button minimal={false} icon="archive" text="Сохранить" 
              onClick={()=>{this.setState({isAskSaveOpen:true})}} />
            </Tooltip>
              <Tooltip content={"Печать всех страниц"}>
                <ReactToPrint
                  trigger={() => <Button icon="print" text="Печать" />}
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

        <Alert isOpen={this.state.isAskPrsisOpen} onClose={this.toggleOverlay} className={TEXT_LARGE}
        icon="info-sign" intent={Intent.PRIMARY} canEscapeKeyCancel={true}>
          <strong>Обратите Внимание!</strong><hr/>
          Сохранение "приставок" пока не реализовано...
          Пожалуйста распечатайте документ, или замените "приставку" на любой символ.
          Если вы продолжите, ваша "приставка" будет автоматически заменена на "начало строки" при сохранении.
        </Alert>

        <Alert isOpen={this.state.isAskSaveOpen} onClose={this.saveAsk} className={TEXT_LARGE}
        icon="floppy-disk" intent={Intent.WARNING} cancelButtonText="Нет" confirmButtonText="Да">
          <strong>Перезаписать?</strong><hr/>
          В данный момент можно хранить только один файл...
          Сохранить текущий документ, удалив предыдущую запись (если есть)?
        </Alert>

        <Alert isOpen={this.state.isAskLoadOpen} onClose={this.loadAsk} className={TEXT_LARGE}
        icon="upload" intent={Intent.SUCCESS} cancelButtonText="Нет" confirmButtonText="Да">
          <strong>Загрузить?</strong><hr/>
          В данный момент можно хранить только один файл...
          Загрузить предыдущий документ заменив текущий (если есть)?
        </Alert>

      </div>
    );
  }
}

export default App;
