defmodule Memory.Game do

  alias MemoryWeb.GamesChannel

  def new do
    clicks = List.duplicate nil, 16
    disabled_buttons = List.duplicate false, 16
    bgColor = List.duplicate "#026DAE", 16
    %{
      tile_values: shuffleAndSet(),
      clicks: clicks,
      matched: [],
      disabled_buttons: disabled_buttons,
      bgColor: bgColor,
      click_count: 0,
      score: 0,
      previous_click: [],
      previous_id: [],
    }
  end

  def client_view(game) do
    %{
      clicks: game.clicks,
      matched: game.matched,
      disabled_buttons: game.disabled_buttons,
      bgColor: game.bgColor,
      click_count: game.click_count,
      score: game.score,
      previous_click: game.previous_click,
      previous_id: game.previous_id,
    }
  end

  def shuffleAndSet() do
    alphabets = ["A","A","B","B","C","C","D","D","E","E","F","F","G","G","H","H"]
    sendAlphabets = Enum.shuffle alphabets
    {sendAlphabets}
  end

  def setTileValue(tileClicked, game) do
    #Reading current game state
    tile_values = List.flatten(Tuple.to_list(game.tile_values))
    clicks = game.clicks
    #Modifying game state into a temporary variable
    new_clicks = List.replace_at(clicks, tileClicked, Enum.at(tile_values, tileClicked))
    #Setting it to the game var
    Map.put(game, :clicks, new_clicks)

  end

  def setTileColor(tileClicked, game) do
    #Reading current game state
    bgColor = game.bgColor
    #Modifying game state into a temporary variable
    new_bgColor = List.replace_at(bgColor, tileClicked, "#DCDCDC")
    #Setting it to the game var
    Map.put(game, :bgColor, new_bgColor)
  end

  def setDisable(tileClicked, game) do
    #Reading current game state
    disabled_buttons = game.disabled_buttons
    #Modifying game state into a temporary variable
    new_disabled_buttons = List.replace_at(disabled_buttons, tileClicked, true)
    #Setting it to the game var
    Map.put(game, :disabled_buttons, new_disabled_buttons)
  end

  def setScore(game) do
    #Reading current game state
    score = game.score
    #Modifying game state into a temporary variable
    new_score = score + 1
    #Setting it to the game var
    Map.put(game, :score, new_score)
  end

  def setClickCount(game) do
    #Reading current game state
    click_count = game.click_count
    #Modifying game state into a temporary variable
    new_click_count = click_count + 1
    #Setting it to the game var
    Map.put(game, :click_count, new_click_count)
  end

  def setPreviousClick(tileClicked, game) do
    #Reading current game state
    previous_click = game.previous_click
    tile_values = List.flatten(Tuple.to_list(game.tile_values))
    #Modifying game state into a temporary variable
    new_previous_click = [previous_click] ++ [Enum.at(tile_values, tileClicked)]
    #Setting it to the game var
    Map.put(game, :previous_click, List.flatten(new_previous_click))
  end

  def setPreviousId(tileClicked, game) do
    #Reading current game state
    previous_id = game.previous_id
    #Modifying game state into a temporary variable
    new_previous_id = [previous_id] ++ [tileClicked]
    #Setting it to the game var
    Map.put(game, :previous_id, List.flatten(new_previous_id))
  end

  def applyLogic(game, socket) do
    if game.click_count == 2 do
      val1 = Enum.at(game.previous_click,0)
      val2 = Enum.at(game.previous_click,1)
      id1 = Enum.at(game.previous_id,0)
      id2 = Enum.at(game.previous_id,1)
      if val1 == val2 do
        #First disable all the buttons
        local_disabled_buttons = List.duplicate true, 16
        GamesChannel.sendSomething("DISABLE_EVERYTHING", %{data: local_disabled_buttons}, socket)

        #Change tile color
        bgColor = game.bgColor
        bgColor1 = List.replace_at(bgColor, id1, "#2b921b")
        bgColor2 = List.replace_at(bgColor1, id2, "#2b921b")

        # #Nullify clicks
        clicks = List.duplicate nil, 16

        matched = game.matched
        matched1 = List.flatten([matched] ++ [id1])
        matched2 = List.flatten([matched1] ++ [id2])

        enable_everything = List.duplicate false, 16
        accu = iterateListAndEnable(matched2, length(matched2), enable_everything)

        state1 = Map.put(game, :bgColor, bgColor2)
        state2 = Map.put(state1, :clicks, clicks)
        state3 = Map.put(state2, :click_count, 0)
        state4 = Map.put(state3, :disabled_buttons, accu)
        state5 = Map.put(state4, :previous_click, [])
        state6 = Map.put(state5, :previous_id, [])
        Map.put(state6, :matched, matched2)
      else
        click_count = 0
        local_disabled_buttons = List.duplicate true, 16
        GamesChannel.sendSomething("DISABLE_EVERYTHING1", %{data: local_disabled_buttons}, socket)
        enable_everything = List.duplicate false, 16
        colorize_everything = List.duplicate "#026DAE", 16
        {btn,col} = iterateListEnableChangeColor(game.matched, length(game.matched), enable_everything, colorize_everything)


        clicks = game.clicks
        clicks1 = List.replace_at(clicks, Enum.at(game.previous_id,0),nil)
        clicks2 = List.replace_at(clicks1, Enum.at(game.previous_id,1),nil)

        state1 = Map.put(game, :disabled_buttons, btn)
        state2 = Map.put(state1, :bgColor, col)
        state3 = Map.put(state2, :previous_click, [])
        state4 = Map.put(state3, :previous_id, [])
        state5 = Map.put(state4, :clicks, clicks2)
        Map.put(state5, :click_count, click_count)
      end
    else
      game
    end
  end

  def iterateListAndEnable(list, length, accumulator) do
    if(length == 0) do
      accumulator
  else
    element = Enum.at(list, length(list) - length)
    accu = List.replace_at(accumulator, element, true)
    iterateListAndEnable(list, length - 1, accu)
  end
  end

  def iterateListEnableChangeColor(list, length, buttons, color) do
    if(length == 0) do
      {buttons, color}
  else
    element = Enum.at(list, length(list) - length)
    btn = List.replace_at(buttons, element, true)
    col = List.replace_at(color, element, "#2b921b")
    iterateListEnableChangeColor(list, length - 1, btn, col)
  end
  end

  def reset() do
    clicks = List.duplicate nil, 16
    disabled_buttons = List.duplicate false, 16
    bgColor = List.duplicate "#026DAE", 16
    %{
      tile_values: shuffleAndSet(),
      clicks: clicks,
      matched: [],
      disabled_buttons: disabled_buttons,
      bgColor: bgColor,
      click_count: 0,
      score: 0,
      previous_click: [],
      previous_id: [],
    }
  end



end
