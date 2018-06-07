<h1 align="center">AniTorrent</h1>

<p align="center">Automatically downloads the latest episode of your favorite anime from HorribleSubs.</p>

<img src="https://i.imgur.com/LxpLI6A.jpg" alt="image">

## Prerequisites

* Must have NodeJS installed. Installers can be found [here](https://nodejs.org/en/download/).

## Instructions

* Clone Repository.
* Use the command line to cd into the repository and run ```npm install```
* Go to [HorribleSubs](horriblesubs.info), and find the anime you want to set automatic downloads for.
* Copy the text that comes after "http://horriblesubs.info/shows/".
* Go to the cloned repository and create a JSON object inside the array in the format:
  ```
  {
    "name":"Paste The Copied Text In Step 2 Here",
    "day":"Paste The Day It Releases Every Week i.e. Saturday",
    "latestEpisode":"Paste Latest Episode Here"
  }  
  ```
* For additional anime, create another object in the array.
* Use the command line to cd into the repository and run ```node index.js```.

## Libraries
* [NodeJS](https://nodejs.org), [jQuery](https://jquery.com/), [WebTorrent](https://github.com/webtorrent/webtorrent), [Puppeteer](https://github.com/GoogleChrome/puppeteer)
