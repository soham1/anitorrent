const puppeteer = require('puppeteer');
const fs = require('fs');
const WebTorrent = require('webtorrent');
const _cliProgress = require('cli-progress');
const chalk = require('chalk');
const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const now = new Date();
const today = now.getDay();

console.log(chalk.red.bold('Starting AniTorrent'));

let animeData = JSON.parse(fs.readFileSync('animeData.json'));

async function init() {
  
  if (!fs.existsSync('anime')){
    console.log(chalk.green.bold('Creating anime folder'));
    fs.mkdirSync('anime');
  }

  for (i=0; i < animeData.length; i++) {
    if (!fs.existsSync('anime/' + animeData[i].name)){
      console.log(chalk.green.bold('Creating a folder for', animeData[i].name));
      fs.mkdirSync('anime/' + animeData[i].name);
    }

    if (animeData[i].day == daysOfTheWeek[today]) {
      console.log(chalk.green.bold(animeData[i].name + ' should have a new episode today'));
      await initBrowser(animeData[i].name, i, animeData[i].latestEpisode);
    } else {
      console.log(chalk.yellow.bold(animeData[i].name + ' does not have a new episode today'));
    }
  }

  console.log(chalk.red.bold('Closing Anitorrent'));
  process.exit();
}

async function initBrowser(animeName, index, latestEpisode) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://horriblesubs.info/shows/' + animeName);
  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

  let magnetLink = await page.evaluate( () => {
    return $("div[class$='480p']:eq(1)").find('.dl-link:first a').attr('href'); // You can change 1080 to 480 or 720.
  });

  let onlineEpisode = await page.evaluate( () => {
    let classArray = $("div[class$='480p']:eq(1)").find('.dl-link:first a').prevObject[0].className.split(" ")[1].split("-"); // You can change 1080 to 480 or 720.
    return classArray[classArray.length - 2];
  });

  await page.close();
  await browser.close();

  if (magnetLink && onlineEpisode) {
    if (onlineEpisode > latestEpisode) {
      animeData[i].latestEpisode = parseInt(onlineEpisode);
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
    }
  } else {
    console.log(chalk.yellow.bold('Could not retrieve magnet link or online episode, please check the name of ' + animeName));
  }

}

function torrent(animeName, onlineEpisode, magnetLink) {
  let promise = new Promise(function(resolve, reject) {
    const client = new WebTorrent();
    client.add(magnetLink, { path: 'anime/' + animeName }, function (torrent) {
      console.log(chalk.blue.bold('Started downloading episode ' + onlineEpisode + ' of ' + animeName));
      const animeProgress = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
      animeProgress.start(100, 0);
      var interval = setInterval(function () {
           animeProgress.update((torrent.progress * 100).toFixed(1));
      }, 2000);
      torrent.on('done', function () {
        clearInterval(interval);
        animeProgress.update(100);
        animeProgress.stop();
        client.destroy(function() {
          console.log(chalk.blue.bold('Finished downloading episode ' + onlineEpisode + ' of ' + animeName));
          resolve();
        });
      });
    });
  });
  return promise;
}

init();
