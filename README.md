<h1 align="center">:sunny: AniTorrent :sunny:</h1>

<p align="center">Automatically downloads the latest episode of your favorite anime from HorribleSubs.</p>

<p align="center">
  <img src="https://i.imgur.com/LxpLI6A.jpg" alt="image">
</p>

<h2 align="center">Features</h2>

* Will only download on the day an episode is scheduled to release.
* Downloads are in the form of peer-to-peer torrents, resulting in faster downloads (depends on anime popularity).
* If there is a delay or an absence of an episode, no episodes will be downloaded.
* Organizes downloaded episodes by folders (using anime's name), episodes themselves are named appropriately.
* Episodes are **subbed in English**...(who watches dubbed anime anyway :poop:).

<h2 align="center">Demonstration</h2>

<p align="center">
  <a href="https://www.youtube.com/watch?v=HO3uTBC0Ilo">
    <img src="https://i.imgur.com/CjAIDjN.png">
  </a>
</p>

<h2 align="center">Prerequisites</h2>

* Must have NodeJS installed. Installers can be found [here](https://nodejs.org/en/download/).

<h2 align="center">Instructions</h2>

1. Clone Repository.
2. Use the command line to cd into the repository and run ```npm install```
3. Go to [HorribleSubs](horriblesubs.info), and find the anime you want to set automatic downloads for.
4. Copy the text that comes after "http://horriblesubs.info/shows/".
5. Go to the cloned repository and create a JSON object inside the array in the format:
  ```json
  {
    "name":"Paste The Copied Text In Step 2 Here",
    "day":"Paste The Day It Releases Every Week i.e. Saturday",
    "latestEpisode":"Paste Latest Episode Here"
  }  
  ```
6. For additional anime, create another object in the array.
7. Use the command line to cd into the repository and run ```node index.js```.
8. All anime will be downloaded in ```anime/<anime name>/```.

<h2 align="center">Libraries</h2>

* [NodeJS](https://nodejs.org)
* [jQuery](https://jquery.com/)
* [WebTorrent](https://github.com/webtorrent/webtorrent)
* [Puppeteer](https://github.com/GoogleChrome/puppeteer)
* [Chalk](https://github.com/chalk/chalk)
* [CLI-Progress](https://github.com/AndiDittrich/Node.CLI-Progress)
