import React from 'react';

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

  export default NoteLine;