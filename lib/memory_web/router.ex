defmodule MemoryWeb.Router do
  use MemoryWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", MemoryWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/game/:game", PageController, :game
    post "/game", PageController, :join
  end

  # Other scopes may use custom stacks.
  # scope "/api", MemoryWeb do
  #   pipe_through :api
  # end
end
