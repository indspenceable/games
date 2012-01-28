require 'rubygems'
require 'sinatra'

get '/' do
  File.read 'public/asteroids.html'
end

get '/m' do
  File.read 'public/metroidvania.html'
end