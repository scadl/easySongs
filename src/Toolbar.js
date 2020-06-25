import React from 'react';
import {
    Button, Intent, ButtonGroup, Position, Tooltip, 
  } from "@blueprintjs/core";

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
        <Button className="note_btn" large={true}
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
        <Tooltip position={Position.BOTTOM} content={symbol[1]} key={key}>
          <NoteBtn pos={symbol[2]} symb={symbol[0]} btnID={key} 
          onBtnSel={this.btnSel} onVisReset={this.visReset} 
          curInt={this.state.cItnt===key?Intent.PRIMARY:Intent.NONE} />
        </Tooltip>
      );
  
      return (
        <ButtonGroup>
          {noteBarRes}
        </ButtonGroup>
      );
    }
  
  }

  export default NoteBar;