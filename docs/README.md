# lgarcia2/personal-website

This is a static site created from a generator named [Jekyll](https://jekyllrb.com/docs/home/)

The template used here adapted from a template named [Decent](https://github.com/serenader2014/decent). 

To run or test the site, use the following command to build and deploy to localhost:4000/ as changes are made, they should appear automatically.
    > bundle exec jekyll serve

To build/deploy this site, see the following instructions
    1. Clone this repository
    2. Make changes
    3. Build the new static site with the command 'bundle exec jekyll build'
    3. Push changes to master
    4. check luisgarcia.me

Common Issues:
    1.  ISSUE: When building or running the site, an error with a similar message occurrs:
        _Could not find nokogiri-x.xx.x-x64-mingw32 in any of the sources (Bundler::GemNotFound)_
        RESOLUTION: Update bundler
        _bundle update --bundler_