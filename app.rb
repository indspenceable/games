require 'rubygems'
require 'sinatra'

get '/' do
  File.read 'public/asteroids.html'
end
