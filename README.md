<h1 align="center">AniTorrent</h1>

<p align="center">Automatically downloads the latest episodes of your favorite anime from HorribleSubs!</p>

<p align="center">
  <img src="https://i.imgur.com/LxpLI6A.jpg" alt="image">
</p>

<h2 align="center">Features</h2>

* Will only download on the day an episode is scheduled to release.
* Downloads are in the form of peer-to-peer torrents, resulting in faster downloads (speed depends on anime popularity).
* Can be used with Windows Scheduler or Windows Startup Processes using the ```anitorrent.bat``` file.
* If there is a delay or an absence of an episode, no episodes will be downloaded.
* Organizes downloaded episodes by folders (using anime's name), episodes themselves are named appropriately.
* Episodes are **subbed in English**...(who watches dubbed anime anyway).

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
5. Go to the cloned repository, open ```animeData.json``` and create a JSON object inside the array in the format:
  ```javascript
  {
    "name":"Paste The Copied Text In Step 2 Here",
    "day":"Paste The Day It Releases Every Week i.e. Saturday",
    "latestEpisode":"Paste Latest Episode Here"
  }  
  ```
6. For additional anime, create another object in the array.
7. Use the command line to cd into the repository and run ```node index.js```.
8. All anime will be downloaded in ```anime/<anime name>/```.
9. **Optional**: If you want to automatically start downloads on certain days, open Task Scheduler, Create Basic Task, Trigger Weekly, and Supply the Path to the ```anitorrent.bat``` file. Note that before doing this, you must set the path to the directory of the repository in the cd command of the bat file.

<h2 align="center">
  <img width="200px" align="middle" src="https://i.imgur.com/7cKyn4V.png"/>
</h2>

<p align="center">
  You can read how this project was created <a href="">here</a>.
</p>

<h2 align="center">Libraries</h2>

<p align="center">
  <a href="https://nodejs.org">NodeJS</a>
</p>
<p align="center">
  <a href="https://github.com/GoogleChrome/puppeteer">Puppeteer</a>
</p>
<p align="center">
  <a href="https://github.com/webtorrent/webtorrent">WebTorrent</a>
</p>
<p align="center">
  <a href="https://jquery.com/">jQuery</a>
</p>
<p align="center">
  <a href="https://github.com/mikaelbr/node-notifier">Notifier</a>
</p>
<p align="center">
  <a href="https://github.com/AndiDittrich/Node.CLI-Progress">CLI-Progress</a>
</p>
<p align="center">
  <a href="https://github.com/chalk/chalk">Chalk</a>
</p>
