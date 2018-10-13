const puppeteer = require('puppeteer');
const fs = require('fs');
const WebTorrent = require('webtorrent');
const _cliProgress = require('cli-progress');
const chalk = require('chalk');
const prompts = require('prompts');
const notifier = require('node-notifier');
const path = require('path');
const rpcClient = require('discord-rich-presence')('498583892366852106');
const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const now = new Date();
const today = now.getDay();
let resolution;
let animeData;

console.log(chalk.red.bold('Starting AniTorrent'));

notifier.notify({
    title: 'AniTorrent',
    message: 'Starting',
    icon: path.join(__dirname, 'assets/notificationIcon.png'), // Absolute path (doesn't work on balloons)
    sound: false, // Only Notification Center or Windows Toasters
    wait: true // Wait with callback, until user action is taken against notification
  },
  function(err, response) {
    if (err) {
      //console.log(chalk.yellow.bold('Error in Sending Notification', err));
    }
  }
);

async function checkAnimeDataExists() {
  try {
    animeData = JSON.parse(fs.readFileSync('animeData.json'));
    resolution = animeData.resolution;
  } catch(err) {
    let response = await prompts({
      type: 'number',
      name: 'resolution',
      message: 'What resolution do you want to download videos in? (Type 480, 720, or 1080)'
    });
  
    while (!([480, 720, 1080].includes(response.resolution))) {
      response = await prompts({
        type: 'number',
        name: 'resolution',
        message: 'What resolution do you want to download videos in? (Type 480, 720, or 1080)'
      });
    }  
  
    let defaultAnimeData = {"resolution": response.resolution, "anime":[]}
  
    console.log(chalk.green.bold('Creating animeData.json'));
    fs.writeFileSync("animeData.json", JSON.stringify(defaultAnimeData));
    animeData = JSON.parse(fs.readFileSync('animeData.json'));
    resolution = animeData.resolution;
  }
}

async function init() {

  await checkAnimeDataExists();

  if (!fs.existsSync('anime')) {
    console.log(chalk.green.bold('Creating anime folder'));
    fs.mkdirSync('anime');
  }

  if (animeData.anime.length > 0) {
    for (i = 0; i < animeData.anime.length; i++) {
      if (!fs.existsSync('anime/' + animeData.anime[i].name)) {
        console.log(chalk.green.bold('Creating a folder for', animeData.anime[i].name));
        fs.mkdirSync('anime/' + animeData.anime[i].name);
      }

      if (animeData.anime[i].day == daysOfTheWeek[today]) {
        console.log(chalk.green.bold(animeData.anime[i].name + ' should have a new episode today'));
        await initBrowser(animeData.anime[i].name, i, animeData.anime[i].latestEpisode);
      } else {
        console.log(chalk.yellow.bold(animeData.anime[i].name + ' does not have a new episode today'));
      }
    }
  } else {
    console.log(chalk.yellow.bold('No anime specified in animeData.json'));
  }

  console.log(chalk.red.bold('Closing AniTorrent'));
  notifier.notify({
      title: 'AniTorrent',
      message: 'Closing',
      icon: path.join(__dirname, 'assets/notificationIcon.png'), // Absolute path (doesn't work on balloons)
      sound: false, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification
    },
    function(err, response) {
      if (err) {
        //console.log(chalk.yellow.bold('Error in Sending Notification', err));
      }
    }
  );

  process.exit();
}

async function initBrowser(animeName, index, latestEpisode) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://horriblesubs.info/shows/' + animeName);
  await page.addScriptTag({
    url: 'https://code.jquery.com/jquery-3.2.1.min.js'
  });

  let magnetLink = await page.evaluate((resolution) => {
    return $(".rls-info-container:eq(1) .rls-links-container .link-" + resolution + "p .hs-magnet-link a").attr('href')
  }, resolution);

  let onlineEpisode = await page.evaluate(() => {
    return $('.rls-info-container').eq(1).attr('id')
  });

  await page.close();
  await browser.close();

  if (magnetLink && onlineEpisode) {
    if (onlineEpisode > latestEpisode) {
      animeData.anime[i].latestEpisode = parseInt(onlineEpisode);
      fs.writeFileSync('animeData.json', JSON.stringify(animeData));
      await torrent(animeName, onlineEpisode, magnetLink);
    } else {
      console.log(`
< No new episode has been released for ` + animeName + `...RIP >
  \\   ^__^
   \\  (oo)\\_______
      (__)\\       )\\/\\
          ||----w |
          ||     ||`);
      notifier.notify({
          title: 'AniTorrent',
          message: 'No new episode has been released for' + animeName,
          icon: path.join(__dirname, 'assets/notificationIcon.png'), // Absolute path (doesn't work on balloons)
          sound: false, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification
        },
        function(err, response) {
          if (err) {
            //console.log(chalk.yellow.bold('Error in Sending Notification', err));
          }
        }
      );
    }
  } else {
    console.log(chalk.yellow.bold('Could not retrieve magnet link or online episode, please check the name of ' + animeName));
  }

}

function torrent(animeName, onlineEpisode, magnetLink) {
  let promise = new Promise(function(resolve, reject) {
    const client = new WebTorrent();
    client.add(magnetLink, {
      path: 'anime/' + animeName
    }, function(torrent) {
      console.log(chalk.blue.bold('Started downloading episode ' + onlineEpisode + ' of ' + animeName));
      const animeProgress = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
      const time = Date.now();
      rpcClient.updatePresence({
        state: 'Episode ' + onlineEpisode,
        startTimestamp: time,
        details: 'Downloading ' + animeName,
        largeImageKey: 'downloadlarge',
        largeImageText: 'Anitorrent',
        smallImageKey: 'statusgrey',
        smallImageText: '0%',
        instance: true
      });
      animeProgress.start(100, 0);
      var interval = setInterval(function() {
        const progress = (torrent.progress * 100).toFixed(1);
        animeProgress.update(progress);
        if (progress <= 20) {
          rpcClient.updatePresence({
            state: 'Episode ' + onlineEpisode,
            startTimestamp: time,
            details: 'Downloading ' + animeName,
            largeImageKey: 'downloadlarge',
            largeImageText: 'Anitorrent',
            smallImageKey: 'statusred',
            smallImageText: progress + '%',
            instance: true
          });
        } else if (progress > 20 && progress <= 50) {
          rpcClient.updatePresence({
            state: 'Episode ' + onlineEpisode,
            startTimestamp: time,
            details: 'Downloading ' + animeName,
            largeImageKey: 'downloadlarge',
            largeImageText: 'Anitorrent',
            smallImageKey: 'statusyellow',
            smallImageText: progress + '%',
            instance: true
          });
        } else {
          rpcClient.updatePresence({
            state: 'Episode ' + onlineEpisode,
            startTimestamp: time,
            details: 'Downloading ' + animeName,
            largeImageKey: 'downloadlarge',
            largeImageText: 'Anitorrent',
            smallImageKey: 'statusgreen',
            smallImageText: progress + '%',
            instance: true
          });
        }
      }, 2000);
      notifier.notify({
          title: 'AniTorrent',
          message: 'Started downloading episode ' + onlineEpisode + ' of ' + animeName,
          icon: path.join(__dirname, 'assets/notificationIcon.png'), // Absolute path (doesn't work on balloons)
          sound: false, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification
        },
        function(err, response) {
          if (err) {
            //console.log(chalk.yellow.bold('Error in Sending Notification', err));
          }
        }
      );
      torrent.on('done', function() {
        rpcClient.updatePresence({
          instance: false
        });
        clearInterval(interval);
        animeProgress.update(100);
        animeProgress.stop();
        client.destroy(function() {
          console.log(chalk.blue.bold('Finished downloading episode ' + onlineEpisode + ' of ' + animeName));
          notifier.notify({
              title: 'AniTorrent',
              message: 'Finished downloading episode ' + onlineEpisode + ' of ' + animeName,
              icon: path.join(__dirname, 'assets/notificationIcon.png'), // Absolute path (doesn't work on balloons)
              sound: false, // Only Notification Center or Windows Toasters
              wait: true // Wait with callback, until user action is taken against notification
            },
            function(err, response) {
              if (err) {
                //console.log(chalk.yellow.bold('Error in Sending Notification', err));
              }
            }
          );
          resolve();
        });
      });
    });
  });
  return promise;
}

init();
