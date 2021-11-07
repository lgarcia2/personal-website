source 'http://rubygems.org'

gem "jekyll"
gem 'wdm', '~> 0.1.1', :install_if => Gem.win_platform?
gem "webrick" # issue loading webrick for jekyll. See https://stackoverflow.com/questions/65989040/bundle-exec-jekyll-serve-cannot-load-such-file

group :jekyll_plugins do
    gem 'jekyll-mentions'
    gem 'jekyll-feed'
    gem 'jekyll-sitemap'
    gem 'jekyll-redirect-from'
    #gem 'hawkins'    # jekyll liveserve
end
