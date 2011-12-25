require 'rubygems'
require 'sinatra'

get '/' do
  File.read 'public/games.html'
end