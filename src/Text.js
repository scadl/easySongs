import React from 'react';
import {
    Button, InputGroup, Label,
  } from "@blueprintjs/core";

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
        elem = <Label onClick={this.sentData} style={{cursor:"text"}} className="note_txt"> 
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

  export default NoteText;