import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_game(root) {
  ReactDOM.render(<Board />, root);
}

class Square extends React.Component {

  render() {
    let id = this.props.id;
    let value = this.props.value;
    let disabled_buttons = this.props.disabled_buttons;
    let bgColor = this.props.bgColor;
    return (<button className="tile" disabled={disabled_buttons[id]} style={{backgroundColor:bgColor[id]}} onClick={() => {
      let onClick = this.props.onClick;
      onClick(id, value);
    }}>
    {this.props.current_value}
  </button>);
}
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      tile_values: [],
      clicks: new Array(16).fill(null),
      matched: [],
      disabled_buttons: new Array(16).fill(false),
      bgColor: new Array(16).fill("#026DAE"),
      click_count: 0,
      score: 0,
      previous_click: [],
      previous_id: [],
    };
  }

  onClick(id, value) {
    this.setTileValue(id);
    this.setCount(id, value);
    this.setPreviousClick(id, value);

  }

  setTileValue(id) {
    let local_clicks = this.state.clicks.slice();
    local_clicks[id] = this.state.tile_values[id];
    this.setState({clicks: local_clicks});

    let local_bgColor = this.state.bgColor.slice();
    local_bgColor[id] = "#DCDCDC";
    this.setState({bgColor: local_bgColor});
  }

  setCount(id, value) {
    let local_click_count = this.state.click_count;
    local_click_count = local_click_count + 1;
    this.setState({click_count: local_click_count},() => {
      this.getCount(id, value);
    });
    let local_score = this.state.score;
    local_score = local_score + 1;
    this.setState({score: local_score})
  }

  getCount(id, value) {
    let local_click_count = this.state.click_count;
    if(local_click_count == 2) {
      if(this.state.previous_click[0] == this.state.previous_click[1]) {

        let local_bgColor = this.state.bgColor.slice();
        local_bgColor[this.state.previous_id[0]] = "#2b921b";
        local_bgColor[this.state.previous_id[1]] = "#2b921b";

        let local_clicks = this.state.clicks.slice();
        local_clicks[this.state.previous_id[0]] = "";
        local_clicks[this.state.previous_id[1]] = "";

        let local_matched = this.state.matched.slice();
        local_matched.push(this.state.previous_id[0]);
        local_matched.push(this.state.previous_id[1]);

        let disable_everything = new Array(16).fill(true);
        this.setState({disabled_buttons: disable_everything});
        let enable_everything = new Array(16).fill(false);
        for(let i = 0; i < local_matched.length; i++) {
          enable_everything[local_matched[i]] = true;
        }

        setTimeout(() => {
          this.setState({disabled_buttons: enable_everything});
          this.setState({clicks: local_clicks});
          this.setState({bgColor: local_bgColor});
          this.setState({matched: local_matched});
          this.setState({click_count:0});
          this.setState({previous_click: []});
          this.setState({previous_id: []});
        },1000);

      }
      else {
      this.setState({click_count:0});
      let disable_everything = new Array(16).fill(true);

      this.setState({disabled_buttons: disable_everything});

      let enable_everything = new Array(16).fill(false);
      let local_matched = this.state.matched.slice();
      let local_bgColor = new Array(16).fill("#026DAE");
      for(let i = 0; i < local_matched.length; i++) {
        enable_everything[local_matched[i]] = true;
        local_bgColor[local_matched[i]] = "#2b921b";
      }

      setTimeout(() => {
        this.setState({disabled_buttons: enable_everything});
        this.setState({bgColor: local_bgColor});
        let local_clicks = this.state.clicks.slice();
        let previous_value_one = this.state.previous_click[0];
        let previous_value_two = this.state.previous_click[1];
        local_clicks[local_clicks.indexOf(previous_value_one)] = "";
        local_clicks[local_clicks.indexOf(previous_value_two)] = "";

        local_bgColor[this.state.previous_id[0]] = "#026DAE";
        local_bgColor[this.state.previous_id[1]] = "#026DAE";


        this.setState({bgColor: local_bgColor});
        this.setState({clicks: local_clicks});
        this.setState({previous_click: []});
        this.setState({previous_id: []});

      },1000);
    }
    }
    else {
      let local_previous_id = this.state.previous_id[0];
      let local_disabled_buttons = this.state.disabled_buttons.slice();
      local_disabled_buttons[local_previous_id] = true;
      this.setState({disabled_buttons: local_disabled_buttons});
    }
  }

  reset() {
    this.shuffleAndSet();
    let local_clicks = new Array(16).fill(null);
    this.setState({clicks: local_clicks});
    this.setState({matched: []});
    this.setState({disabled_buttons: new Array(16).fill(false)});
    this.setState({bgColor: ["#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE","#026DAE"]});
    this.setState({click_count: 0});
    this.setState({score: 0});
    this.setState({previous_click: []});
    this.setState({previous_id: []});

  }


  setPreviousClick(id, value) {
    let local_previous_click = this.state.previous_click.slice();
    local_previous_click.push(value);
    this.setState({previous_click: local_previous_click});

    let local_previous_id = this.state.previous_id.slice();
    local_previous_id.push(id);
    this.setState({previous_id: local_previous_id});
  }

  renderTile(id) {
    return <Square id={id} value={this.state.tile_values[id]} current_value={this.state.clicks[id]} disabled_buttons={this.state.disabled_buttons} bgColor={this.state.bgColor} onClick={this.onClick}/>
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
        <div>
          <button onClick={this.reset}>Restart</button>
        </div>
      </div>
    );
  }
}
