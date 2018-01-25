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
  analyse(id, value, handler, previous_click, click_count, previous_id) {
    var show = this.showValue(id,value,handler, click_count);
    if(previous_click == value) {
      var first = document.getElementById(id);
      first.disabled = true;
      var second = document.getElementById(previous_id);
      second.disabled = true;
    }
    else if(click_count == 1) {
      var buttons = document.getElementsByTagName("button");
      for(var i = 0; i < buttons.length; i++) {
          buttons[i].disabled = true;
      }
      setTimeout(() => {this.hideValue(id,value,handler);},1000);
      setTimeout(() => {this.hideValue(previous_id,value,handler);},1000);
      setTimeout(() => {
        var buttons = document.getElementsByTagName("button");
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
    return (<button id={uid} className="tile" onClick={() => this.analyse(uid, value, handler, previous_click, click_count, previous_id)}>
    </button>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
    this.state = {
      tile_values: ["A","B","C","D","A","E","F","B","D","C","F","E","G","H","H","G"],
      previously_clicked: "",
      previously_clicked_id: "",
      click_count: 0,
    };
  }

  handler(button_value, click_count, id) {
    this.setState({previously_clicked: button_value, click_count: click_count, previously_clicked_id:id});
  }

  renderTile(id) {
    var tile_value = this.state.tile_values[id];
    var previous_value = this.state.previously_clicked;
    var click_count = this.state.click_count;
    var previous_id = this.state.previously_clicked_id;

    return <Square uid={id} value={tile_value} handler = {this.handler} previous={previous_value} clickcount={click_count} previousId={previous_id}/>;
  }
  render() {
    return (
      <div id="board">
        <div className="row">
          {this.renderTile(0)}
          {this.renderTile(1)}
          {this.renderTile(2)}
          {this.renderTile(3)}
        </div>
        <div className="row">
          {this.renderTile(4)}
          {this.renderTile(5)}
          {this.renderTile(6)}
          {this.renderTile(7)}
        </div>
        <div className="row">
          {this.renderTile(8)}
          {this.renderTile(9)}
          {this.renderTile(10)}
          {this.renderTile(11)}
        </div>
        <div className="row">
          {this.renderTile(12)}
          {this.renderTile(13)}
          {this.renderTile(14)}
          {this.renderTile(15)}
        </div>
      </div>
    );
  }
}
