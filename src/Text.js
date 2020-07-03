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
        theVal: ''
      }
    }

    componentDidMount(){
      this.setState((state)=>({
        theVal: this.props.textValue
      }));
      this.props.onDataStor(this.props.textValue);
    }

    writeData(event){
      let myTExt = event.target.value;
      this.setState((state)=>({
        theVal: myTExt===""?"§":myTExt
      }));
      this.props.onDataStor(myTExt);
    }

    sentData(){        
      this.props.onSwithEditor()
    }

    render(){      

      // Ensures to update nonDynamic labels, like docHeader
      let textData = this.state.theVal;
      if(textData !== this.props.textValue){
        textData = this.props.textValue;
      }

      let elem = null;

      if(this.props.editMode){

        elem = <InputGroup type="text" large={true} 
        value={textData} onChange={this.writeData}
        rightElement={
          <Button icon={"tick"} minimal={true} onClick={this.sentData}/>
        } />;

      } else {

        elem = <Label onClick={this.sentData} style={{cursor:"text"}} 
        className="note_txt"> 
        {textData} 
        </Label>

      }

      return(<span>{elem}</span>);
    }
  }
  
  class NoteText extends React.Component{
    constructor(props){
      super(props)
      this.switchEditor = this.switchEditor.bind(this);
      this.dataStor = this.dataStor.bind(this);
      this.state = {
        editMode: false,        
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

    dataStor(text) {
      this.props.onTxtData(this.props.txtID, text);
    }
  
    render(){      
      return(
        <div >
          <TextElement 
          editMode={this.state.editMode} 
          onSwithEditor={this.switchEditor}
          textValue={this.props.textLine}
          onDataStor={this.dataStor}
           />
        </div>
      )
    }
  }

  export default NoteText;