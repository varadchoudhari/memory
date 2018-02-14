import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_game(root, channel) {
  ReactDOM.render(<Board channel={channel}/>, root);
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    //Initializing channel
    this.channel = props.channel;
    this.channel.join()
    .receive("ok", this.gotView.bind(this))
    .receive("error", resp => { console.log("Unable to join", resp); });

    //Bind the helper functions that I am using cross components
    this.reset = this.reset.bind(this);
    this.onClick = this.onClick.bind(this);

    //Initialize state here
    this.state = {
      clicks: [],
      matched: [],
      disabled_buttons: [],
      bgColor: [],
      click_count: 0,
      score: 0,
      previous_click: [],
      previous_id: [],
    };
  }

  // Get view map from the server and assign it to the state
  gotView(view) {
    this.setState(view.game)
  }

  onClick(id) {
    this.logTileData(id);

  }

  componentDidMount() {
    this.channel.on("DISABLE_EVERYTHING", payload => {
      this.setState({disabled_buttons: payload.data})
    });
    this.channel.on("DISABLE_EVERYTHING1", payload => {
      this.setState({disabled_buttons: payload.data})
    });
  }

  logTileData(id) {
    this.channel.push("logTileData", {tileClicked: id}).receive("logTileDataDone", msg => {
      this.setState(msg.game)
      this.applyLogic(id)
    });
  }

  applyLogic(id) {
    this.channel.push("applyLogic", {tileClicked: id}).receive("applyLogicDone", msg => {
      if (msg.count == 1) {
        this.setState(msg.game)
      }
      else {
        setTimeout(() => {
          this.setState(msg.game)
        }, 1000);
      }
    });
  }

  reset() {
    this.channel.push("reset").receive("resetDone", msg => {
      this.setState(msg.game)
    });
  }

  renderTile(id) {
    return <Square id={id} current_value={this.state.clicks[id]} disabled_buttons={this.state.disabled_buttons} bgColor={this.state.bgColor} onClick={this.onClick}/>
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

function Square(params) {
  let id = params.id
  let disabled_buttons = params.disabled_buttons
  let bgColor = params.bgColor

  return (<button className="tile" disabled={disabled_buttons[id]} style={{backgroundColor:bgColor[id]}} onClick={() => {
    let onClick = params.onClick;
    onClick(id);
  }}>
  {params.current_value}
</button>);
}
