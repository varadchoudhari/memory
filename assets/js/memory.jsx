import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_game(root) {
  ReactDOM.render(<Board />, root);
}

class Square extends React.Component {
  showValue(id,value,handler, click_count) {
    let button = document.getElementById(id);
    button.style.background = "#FFF";
    button.innerHTML = value;
    if(click_count == 1) {
      handler(value, 0, id);
    }
    else {
      let new_count = click_count + 1;
      handler(value, new_count, id);
    }

  }
  hideValue(id,value,handler) {
    let button = document.getElementById(id);
    button.style.background = "#026DAE";
    button.innerHTML = "";
  }
  analyse(id, value, reset_previous, handler, previous_click, click_count, previous_id, updatescore, getscore) {
    let show = this.showValue(id,value,handler, click_count);

    let score = getscore + 1;
    updatescore(score);

    document.getElementById(id).disabled = true;

    if(previous_click == value) {
      let first = document.getElementById(id);
      let second = document.getElementById(previous_id);
      let newelement1 = document.createElement("div");
      let newelement2 = document.createElement("div");
      newelement1.innerHTML = "✓";
      newelement2.innerHTML = "✓";
      newelement1.setAttribute("id",id);
      newelement1.setAttribute("class","matchtile");
      newelement2.setAttribute("id",previous_id);
      newelement2.setAttribute("class","matchtile");
      setTimeout(() => {
        first.replaceWith(newelement1);
        second.replaceWith(newelement2);
      },500);
    }
    else if(click_count == 1) {
      let buttons = Array.from(document.getElementsByTagName("button"));
      for(let i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true;
      }
      setTimeout(() => {this.hideValue(id,value,handler);},1000);
      setTimeout(() => {this.hideValue(previous_id,value,handler);},1000);
      setTimeout(() => {
        for(let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
      },1000);
      reset_previous(); //function to reset previous entries
    }
  }
  render() {
    let uid = this.props.uid;
    let value = this.props.value;
    let handler = this.props.handler;
    let previous_click = this.props.previous;
    let click_count = this.props.clickcount;
    let previous_id = this.props.previousId;
    let reset_previous = this.props.reset_previous;
    let updatescore = this.props.updatescore;
    let getscore = this.props.getscore;

    return (<button id={uid} className="tile" onClick={() => this.analyse(uid, value, reset_previous, handler, previous_click, click_count, previous_id, updatescore, getscore)}>
    </button>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.updatescore = this.updatescore.bind(this);
    this.reset_previous = this.reset_previous.bind(this);
    this.state = {
      tile_values: [],
      previously_clicked: "",
      previously_clicked_id: "",
      click_count: 0,
      score: 0,
    };
  }

  handler(button_value, click_count, id) {
    this.setState({previously_clicked: button_value, click_count: click_count, previously_clicked_id:id});
  }

  reset_previous() {
    this.setState({previously_clicked: "", previously_clicked_id: ""});
  }

  updatescore(score) {
    this.setState({score: score});
  }

  renderTile(id) {
    let tile_value = this.state.tile_values[id];
    let previous_value = this.state.previously_clicked;
    let click_count = this.state.click_count;
    let previous_id = this.state.previously_clicked_id;
    let getscore = this.state.score;
    return <Square uid={id} value={tile_value} reset_previous={this.reset_previous} handler = {this.handler} previous={previous_value} clickcount={click_count} previousId={previous_id} updatescore={this.updatescore} getscore={getscore}/>;
  }

  shuffleAndSet() {
    let alphabets = ["A","A","B","B","C","C","D","D","E","E","F","F","G","G","H","H"];
    let length = alphabets.length;
    let temp = 0;
    let index = 0;
    while(length) {
      index = Math.floor(Math.random() * length--);
      temp = alphabets[length];
      alphabets[length] = alphabets[index];
      alphabets[index] = temp;
    }
    this.setState({tile_values: alphabets})
    }
    componentWillMount() {
      this.shuffleAndSet();
    }
  render() {
    return (
      <div id="board">
        <div className="row" id="row1">
          {this.renderTile(0)}
          {this.renderTile(1)}
          {this.renderTile(2)}
          {this.renderTile(3)}
        </div>
        <div className="row" id="row2">
          {this.renderTile(4)}
          {this.renderTile(5)}
          {this.renderTile(6)}
          {this.renderTile(7)}
        </div>
        <div className="row" id="row3">
          {this.renderTile(8)}
          {this.renderTile(9)}
          {this.renderTile(10)}
          {this.renderTile(11)}
        </div>
        <div className="row" id="row4">
          {this.renderTile(12)}
          {this.renderTile(13)}
          {this.renderTile(14)}
          {this.renderTile(15)}
        </div>
        <div>
          Score: {this.state.score}
        </div>
      </div>
    );
  }
}
