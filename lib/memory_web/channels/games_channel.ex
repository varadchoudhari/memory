defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)},socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("logTileData", payload, socket) do
    #assign global game state to game
    game = socket.assigns[:game]

    #perform operations
    withNewValue = Game.setTileValue(payload["tileClicked"], game)
    withNewColor = Game.setTileColor(payload["tileClicked"], withNewValue)
    withDisabledButtons = Game.setDisable(payload["tileClicked"], withNewColor)
    withNewScore = Game.setScore(withDisabledButtons)
    withNewClickCount = Game.setClickCount(withNewScore)
    withPreviousClick = Game.setPreviousClick(payload["tileClicked"], withNewClickCount)
    withPreviousId = Game.setPreviousId(payload["tileClicked"], withPreviousClick)

    #assign global game state with local modified state
    socket = assign(socket, :game, withPreviousId)

    #reply back to the client
    {:reply, {:logTileDataDone, %{"game" => Game.client_view(socket.assigns[:game])}}, socket}
  end

  def handle_in("applyLogic", payload, socket) do
    #assign global game state to game0
    game0 = socket.assigns[:game]

    #perform operations
    game1 = Game.applyLogic(game0, socket)

    #assign global game state with local modfified state
    socket = assign(socket, :game, game1)

    #reply back to the client
    if game1.click_count == 1 do
    {:reply, {:applyLogicDone, %{"game" => Game.client_view(socket.assigns[:game]), "count" => 1}}, socket}
    else
    {:reply, {:applyLogicDone, %{"game" => Game.client_view(socket.assigns[:game]), "count" => 2}}, socket}
    end
  end

  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("reset", payload, socket) do
    #assign global game state to game0
    game0 = socket.assigns[:game]

    #perform operations
    game1 = Game.reset()

    #assign global game state with local modfified state
    socket = assign(socket, :game, game1)

    #reply back to the client
    {:reply, {:resetDone, %{"game" => Game.client_view(socket.assigns[:game])}}, socket}
  end

  def sendSomething(topic, msg, socket) do
    push socket, topic, msg
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
