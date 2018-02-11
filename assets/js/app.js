// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket";

import run_game from "./memory2";

function init() {
  let root = document.getElementById('game');
  if (root) {
    let channel = socket.channel("games:"+window.gameName, {});
    run_game(root, channel);
  }
  if (document.getElementById('index-page')) {
    form_init();
  }

}

// Use jQuery to delay until page loaded.
$(init);
