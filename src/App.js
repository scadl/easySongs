import React from 'react';
//import ReactDOM from 'react';
import './App.css';

import {
  Button, Intent, ButtonGroup, Navbar,
  Alignment, Card, Elevation, Position, Tooltip, InputGroup, Label, NumericInput
} from "@blueprintjs/core"


class NoteChar extends React.Component{
  constructor(props){
    super(props);    
    this.noteUpdate = this.noteUpdate.bind(this);
    this.state = {
      cNote: props.note
    }
  }
  noteUpdate(e){  

    document.getSelection().removeAllRanges();

    let target = e.target || e.srcElement,
    rect = target.getBoundingClientRect(),
    clickY = Math.round(e.clientY - rect.top);

    let safeChars = "ё`".split("");
    let noteSources = [
      ["=","ф","й","1","!","Й","Ф","=","Z","=","=","[","\\","/"],
      ["я","ы","ц","2","\"","Ц","ы","q","X","=","=","[","\\","/"],
      ["ч","в","у","3","№","У","В","w","C","D","=","[","\\","/"],
      ["с","а","к","4",";","К","А","e","Я","=","=","[","\\","/"],
      ["м","п","е","5","%","Е","П","r","Ч","=","=","[","\\","/"],
      ["и","р","н","6",":","Н","Р","t","С","=","=","[","\\","/"],
      ["т","о","г","7","?","Г","О","y","М","=","=","[","\\","/"],
      ["ь","л","ш","8","*","Ш","Л","u","И","=","=","[","\\","/"],
      ["б","д","щ","9",")","Щ","Д","i","Т","b","=","[","\\","/"],
      ["ю","ж","з","0","(","З","Ж","o","V","=","=","[","\\","/"],
      [".","э","х","-","=","Х","Э","p","B","=","=","[","\\","/"],
      ["Ю",",","ъ","+","=","=","=","=","N","=","=","[","\\","/"],
    ];
    let slavToArab = [
      "а7","в7","г7","д7","є7","ѕ7","з7","и7"
    ]
    let noteSourcesUniversal = [
      "=","[","\\","/"," ",      
      <span>
      <span className="glas_nm">{this.props.pristN} {slavToArab[this.props.glasN-1]} </span>
      [-</span>
    ];
    let stepInc = 4;
    let stepPos = 60;
    let noteHights = [];
    noteSources.forEach((note)=>{      
      noteHights.push([ stepPos, stepPos-stepInc, note ]);
      stepPos -= (stepInc+1);
    });
    //console.log(noteHights)
    this.setState(function(state){
      if( safeChars.indexOf(this.state.cNote) === -1){        
        let nCh = noteHights.find(function(element) {
            if (clickY <= element[0] && clickY >= element[1]){
                return true;
            } else {
              return false;
            }
        });
        //console.log(nCh);
        if(nCh===undefined || this.props.CnID === -1){      
          return {cNote: "="};          
        } else {
          if(this.props.CnID > 9){
            return {cNote: noteSourcesUniversal[this.props.CnID-10]}
          } else {
            return {cNote: nCh[2][this.props.CnID]}
          }
        }
      }
    });
    this.props.onNoteUpdate();
    console.log("NoteLinY:"+this.props.cy +  " DiferenceY:"+clickY);
  }
  render(){    
    return(
      <div onClick={this.noteUpdate} style={{display:"inline"}}>
      {this.state.cNote}
      </div>
    );
  }
}

class NoteLine extends React.Component{
  constructor(props){
    super(props);
    this.updateCoord = this.updateCoord.bind(this);
    this.state = {
      cx: 0,
      cy: 0,
      cL: null
    }
  }
  componentDidMount(){
    this.setState({
      cL: this.containerLine
    });  
    this.updateCoord();
    window.addEventListener('scroll', this.updateCoord, true);
  }
  updateCoord(){
    if (this.state.cL!==null) {
      this.setState((state) => ({
        cx: state.cL.offsetLeft,
        cy: state.cL.offsetTop
      }));
    }
  }
  render(){
    let myLine = "=`===============================================================";
    let resLine = myLine.split("").map((char, key) => 
      <NoteChar note={char} key={key} onNoteUpdate={this.updateCoord}
      cx={this.state.cx} cy={this.state.cy} CnID={this.props.SnID} 
      glasN={this.props.glas} pristN={this.props.prist} />      
    );

    
    //console.log(this.props)
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
  }

  switchState() {
   this.props.onBtnSel(this.props.btnID);
  }

  render() {
    return (
      <Button className="note_btn"
        onClick={this.switchState} intent={this.props.curInt}>
        <span style={{ top: this.props.pos, position: "relative" }}>
          {this.props.symb}
        </span>
      </Button>
    );
  }
}

class NoteBar extends React.Component {
  constructor(props){
    super(props);
    this.btnSel = this.btnSel.bind(this)
    this.state={
      cItnt: -1
    }
  }

  btnSel(btnKey){    
    this.setState(function(state){
      if(btnKey === this.state.cItnt){
        this.props.onActiveN(-1);
        return{ cItnt: -1}
      } else {
        this.props.onActiveN(btnKey);
        return {cItnt: btnKey}
      }
    })
  }


  render() {
    const symbols = this.props.symbols;
    const noteBarRes = symbols.map((symbol, key) =>
      <Tooltip position={Position.LEFT} content={symbol[1]} key={key}>
        <NoteBtn pos={symbol[2]} symb={symbol[0]} btnID={key} 
        onBtnSel={this.btnSel} onVisReset={this.visReset} 
        curInt={this.state.cItnt===key?Intent.PRIMARY:Intent.NONE} />
      </Tooltip>
    );

    return (
      <ButtonGroup vertical={true}>
        {noteBarRes}
      </ButtonGroup>
    );
  }

}

class TextElement extends React.Component{
  constructor(props){
    super(props)
    this.sentData = this.sentData.bind(this)
    this.writeData = this.writeData.bind(this)
    this.state = {
      theVal: this.props.textValue
    }
  }
  writeData(event){
    let myTExt = event.target.value;
    //console.log(myTExt)
    this.setState((state)=>({
      theVal: myTExt===""?"§":myTExt
    }));
  }
  sentData(){        
    this.props.onSwithEditor()
  }
  render(){
    let elem = null;
    if(this.props.editMode){
      elem = <InputGroup type="text" large={true} 
      value={this.state.theVal} onChange={this.writeData}
      rightElement={
        <Button icon={"tick"} minimal={true} onClick={this.sentData}/>
      } />;
    } else {
      elem = <Label onClick={this.sentData} style={{cursor:"text"}}> 
      {this.state.theVal} 
      </Label>
    }
    return(<span>{elem}</span>);
  }
}

class NoteText extends React.Component{
  constructor(props){
    super(props)
    this.switchEditor = this.switchEditor.bind(this);
    this.state = {
      editMode: false,
      textLine: "Линия " + (this.props.txtID + 1)
    }
  }  

  switchEditor(){
        
    this.setState(function (state) {

      if (state.editMode) {             
        return {
          editMode:false,
        }
      } else {        
        return {
          editMode: true,
        }
      }
    });  
  }


  render(){
    return(
      <div >
        <TextElement 
        editMode={this.state.editMode} 
        onSwithEditor={this.switchEditor}
        textValue={this.state.textLine}
         />
      </div>
    )
  }
}


class App extends React.Component {

  constructor(props){
    super(props);
    this.printCall = this.printCall.bind(this);
    this.onActiveNote = this.onActiveNote.bind(this);
    this.onLineAdd = this.onLineAdd.bind(this);
    this.onGlasChange = this.onGlasChange.bind(this);
    this.onPristChange = this.onPristChange.bind(this);
    this.state = {
      noteID: -1,
      noteLines: 1,
      glasNm: 1,
      prist: "Пёснь"
    }
  }
  
  printCall() {
    window.print();
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
    for(let i=0; i<this.state.noteLines; i++){
    lines.push(
      <NoteLine key={"l"+i} SnID={this.state.noteID} 
      glas={this.state.glasNm} prist={this.state.prist} />,
      <NoteText key={"t"+i} txtID={i}/>
    )
    }

    return (
      <div className="App">
        <Navbar className="bp3-dark" >
          <Navbar.Group align={Alignment.LEFT} >
            <svg viewBox="0 0 1000 1000" className="App-axe" alt="logo">
              <path d="m 398,293 q 0,-25 14,-100 9,-46 9,-69 0,-12 -2,-23 Q 385,84 312,84 268,84 230.5,90 193,96 193,101 v 121 h 121 q 42,0 45,16 -19,73 -49,212 -20,91 -20,150 0,46 14,81 2,5 5,5 10,0 40,-20 34,-34 51,-34 2,0 3,1 -5,-16 -8,-34 h 247 q -12,156 -12,236 0,87 24,87 0,2 6,2 13,0 49,-10 36,-10 36,-12 V 181 H 533 q -16,17 -19,94 0,25 -1,50 -2,49 5.51562,52.1211 7.48438,2.87891 25.4844,2.87891 19,0 60,-3.5 41,-3.5 52,-3.5 13,0 13,3 0,36 -17,102 v 0 h -266 q 6,-92 12,-185 z m 6,343 q 0,-2 -1,-3 z" />
            </svg>
            <Navbar.Heading style={{ fontWeight: "bold" }} className="">
              простоТопорики
           </Navbar.Heading>
            <Navbar.Divider />
            <Button className="bp3-minimal" icon="folder-open" text="Открыть" />
            <Button className="bp3-minimal" icon="floppy-disk" text="Сохранить" />
            <Button className="bp3-minimal" icon="print" text="Печать" onClick={this.printCall} />
            <Navbar.Divider />
            <Tooltip content={"Строк на странице"}>
            <NumericInput leftIcon="sort" min={1} max={10} value={1} 
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
        <header className="App-header">
          <Card elevation={Elevation.TWO} className="printCard" id="myPage">
            <h3><NoteText key={"tH"} txtID={"H"}/></h3>
            {lines}
          </Card>
          <ButtonGroup vertical={true} large={true} style={{ padding: 15 }}>
            <NoteBar symbols={notes} onActiveN={this.onActiveNote} />
          </ButtonGroup>
        </header>
      </div>
    );
  }
}

export default App;
