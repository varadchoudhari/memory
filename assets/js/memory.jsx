import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_game(root) {
  ReactDOM.render(<Board />, root);
}

class Square extends React.Component {
  showValue(id,value,handler, click_count) {
    var button = document.getElementById(id);
    button.style.background = "#FFF";
    button.innerHTML = value;
    if(click_count == 1) {
      handler(value, 0, id);
    }
    else {
      var new_count = click_count + 1;
      handler(value, new_count, id);
    }

  }
  hideValue(id,value,handler) {
    var button = document.getElementById(id);
    button.style.background = "#026DAE";
    button.innerHTML = "";
  }
  analyse(id, value, matchtracker, handler, previous_click, click_count, previous_id, matched_ids, updatescore, getscore) {
    var show = this.showValue(id,value,handler, click_count);

    var score = getscore + 1;
    updatescore(score);

    document.getElementById(id).disabled = true;

    if(previous_click == value) {
      var first = document.getElementById(id);
      var second = document.getElementById(previous_id);
      var newelement1 = document.createElement("div");
      var newelement2 = document.createElement("div");
      newelement1.setAttribute("id",id);
      newelement1.setAttribute("class","matchtile");
      newelement2.setAttribute("id",previous_id);
      newelement2.setAttribute("class","matchtile");
      setTimeout(() => {
        first.replaceWith(newelement1);
        second.replaceWith(newelement2);
      },500);
      // first.disabled = true;
      // var second = document.getElementById(previous_id);
      // second.disabled = true;
      matchtracker(id, previous_id);
    }
    else if(click_count == 1) {
      var buttons = Array.from(document.getElementsByTagName("button"));
      var matched = Array.from(matched_ids);
      for(var i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true;
      }
      setTimeout(() => {this.hideValue(id,value,handler);},1000);
      setTimeout(() => {this.hideValue(previous_id,value,handler);},1000);
      setTimeout(() => {
        for(var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
      },1000);
    }
  }
  render() {
    var uid = this.props.uid;
    var value = this.props.value;
    var handler = this.props.handler;
    var previous_click = this.props.previous;
    var click_count = this.props.clickcount;
    var previous_id = this.props.previousId;
    var matchtracker = this.props.matchtracker;
    var matched_ids = this.props.matched_ids;
    var updatescore = this.props.updatescore;
    var getscore = this.props.getscore;

    return (<button id={uid} className="tile" onClick={() => this.analyse(uid, value, matchtracker, handler, previous_click, click_count, previous_id, matched_ids, updatescore, getscore)}>
    </button>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.matchtracker = this.matchtracker.bind(this);
    this.updatescore = this.updatescore.bind(this);
    this.state = {
      tile_values: ["A","B","C","D","A","E","F","B","D","C","F","E","G","H","H","G"],
      previously_clicked: "",
      previously_clicked_id: "",
      click_count: 0,
      score: 0,
      matched_ids: []
    };
  }

  handler(button_value, click_count, id) {
    this.setState({previously_clicked: button_value, click_count: click_count, previously_clicked_id:id});
    console.log(this.state.matched_ids);
  }

  matchtracker(id1, id2) {
    var clone = this.state.matched_ids.slice();
    clone.push(id1);
    clone.push(id2);
    this.setState({matched_ids: clone});
  }

  updatescore(score) {
    this.setState({score: score});
  }

  renderTile(id) {
    var tile_value = this.state.tile_values[id];
    var previous_value = this.state.previously_clicked;
    var click_count = this.state.click_count;
    var previous_id = this.state.previously_clicked_id;
    var matched_ids = this.state.matched_ids;
    var getscore = this.state.score;

    return <Square uid={id} value={tile_value} matchtracker={this.matchtracker} handler = {this.handler} previous={previous_value} clickcount={click_count} previousId={previous_id} matched_ids={matched_ids} updatescore={this.updatescore} getscore={getscore}/>;
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
