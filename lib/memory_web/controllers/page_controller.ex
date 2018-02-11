defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params) do
    render conn, "game.html", game: params["game"]
  end

  def join(conn, %{"param" => param}) do
    conn
    |> redirect(to: "/game/" <> param["game"])
  end
end
