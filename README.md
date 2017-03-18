# Wddit v2 Visualizer

For our final one week project I built a simple data dashboard for my [Wdditv2](http://wdditv2.herokuapp.com/) project. After re-structuring the platform and rigging Wdditv2 with the necessary cookies, the visualizer polls real-time data from the live site.

I learnt how to use D3.JS, a powerful JavaScript library to create graphs dynamically. The project also gave me an overview and insights of how web dev, data management, data analytics and data visualization worked together.

## How to use this

Head over to [Wdditv2](http://wdditv2.herokuapp.com/) and start the user journey as a guest. Best results in your browser's private browsing/incognito mode.

Load [Wddit Visualizer]() on a separate tab, preferably lined next to your Wdditv2 window so that you can observe the real-time changes.  

1) Search for a post using unique keywords... you should see your query reflected on the Visualizer's Guest & Conversions tab.
2) Register as a user... this will update the conversion pie chart in Guest & Conversions tab.
3) As a user, post new articles and comment on other's post. You will see your user activity reflected on User Activity tab.

## Links

[Live Site]()
[GitHub](https://github.com/olico852/project4-visualizer)

## Dependencies

"dependencies": {
  "dotenv": "^4.0.0",
  "ejs": "^2.3.1",
  "express": "^4.12.3",
  "mongodb": "^2.2.24",
  "morgan": "^1.5.2",
  "requestify": "^0.2.5",
  "socket.io": "^1.7.3"
}

## Additional

-jQuery
-D3.JS v3
-Bootstrap v4

## Acknowledgements

Many thanks to GA SG WDI 7 instructor Jeremiah and TA Nick for encouraging me to attempt a project that married both of my skill sets. It's a mammoth of a project for a one week sprint but the gains were worth it!
