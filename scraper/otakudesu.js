const cheerio = require("cheerio");
const url = require("./helpers/base-url");
const { default: Axios } = require("axios");
const baseUrl = url.baseUrl;
const completeAnime = url.completeAnime;
const onGoingAnime = url.onGoingAnime;
const ImageList = require("./helpers/image_genre").ImageList;
const episodeHelper = require("./helpers/episodeHelper");



const home = () => {
    return new Promise(async(resolve, reject) => {
  let home = {};
  let on_going = [];
  let complete = [];
  Axios.get(baseUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".venz");
      let episode, uploaded_on, day_updated, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          day_updated = $(this).find(".epztipe").text().replace(" ", "");
          on_going.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            day_updated,
            link,
          });
        });
      home.on_going = on_going;
      return response;
    })
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".venz");
      let episode, uploaded_on, score, thumb, title, link, id;
      element
        .children()
        .eq(1)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));
          complete.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            score,
            link,
          });
        });
      home.complete = complete;
      resolve(parseObj({
        status: "success",
        baseUrl: baseUrl,
        home,
      }));
    })
    .catch((e) => {
      reject(e)
      console.log(e.message)
    });
  })
};
const completeAnimeList = (params = 1) => {
    return new Promise(async(resolve, reject) => {
  const page = !params ? '' : params == 1 ? '' : `page/${params}`;
  const fullUrl = `${baseUrl}${completeAnime}${page}`;
  console.log(fullUrl);
  Axios.get(fullUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".venz");
      let animeList = [];
      let episode, uploaded_on, score, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));
          animeList.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            score,
            link,
          });
        });
      resolve(parseObj({
        status: "success",
        baseUrl: fullUrl,
        animeList,
      }));
    })
    .catch((err) => {
      reject(err.message);
    });
  });
};



const onGoingAnimeList = () => {
    return new Promise(async(resolve, reject) => {
  const url = `${baseUrl}${onGoingAnime}`;
  console.log(url);
  Axios.get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".venz");
      let animeList = [];
      let episode, uploaded_on, day_updated, thumb, title, link, id;
      element
        .children()
        .eq(0)
        .find("ul > li")
        .each(function () {
          $(this)
            .find(".thumb > a")
            .filter(function () {
              title = $(this).find(".thumbz > h2").text();
              thumb = $(this).find(".thumbz > img").attr("src");
              link = $(this).attr("href");
              id = link.replace(`${baseUrl}anime/`, "");
            });
          uploaded_on = $(this).find(".newnime").text();
          episode = $(this).find(".epz").text().replace(" ", "");
          day_updated = $(this).find(".epztipe").text().replace(" ", "");
          animeList.push({
            title,
            id,
            thumb,
            episode,
            uploaded_on,
            day_updated,
            link,
          });
        });
      resolve(parseObj({
        status: "success",
        baseUrl: url,
        animeList,
      }));
    })
    .catch((err) => {
      reject(err.message);
    });
  });
};




const schedule = () => {
    return new Promise(async(resolve, reject) => {
  Axios.get(baseUrl + url.schedule)
  .then((response) => {
    const $ = cheerio.load(response.data);
    const element = $(".kgjdwl321");
    let animeList = [];
    let scheduleList = [];
    let day;
    let anime_name, link, id;
    element.find(".kglist321").each(function () {
      day = $(this).find("h2").text();
      animeList = [];
      $(this)
        .find("ul > li")
        .each(function () {
          anime_name = $(this).find("a").text();
          link = $(this).find("a").attr("href");
          id = link.replace(baseUrl + "anime/", "");
          animeList.push({ anime_name, id, link });
        });
      scheduleList.push({ day, animeList });
    });
    resolve(parseObj({ scheduleList }));
    }).catch((err) => reject(err));
 });
};

   /*@return genre list*/
const genre = () => {
    return new Promise(async(resolve, reject) => {
  const fullUrl = baseUrl + url.genreList;
  Axios.get(fullUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".genres");
      let genreList = [];
      element.find("li > a").each(function (i, el) {
        let object = {};
        object.genre_name = $(el).text();
        object.id = $(el).attr("href").replace("/genres/", "");
        object.link = baseUrl + $(el).attr("href");
        object.image_link = ImageList[i];
        genreList.push(object);
      });
      resolve(parseObj({ genreList }));
    })
    .catch((err) => {
        reject(err)
    });
  });
};

/**
 *query anime by genre
 *@param {string} id of genre
 *@paean {number} page
 */
const animeByGenre = async(id, pageNumber = 1) => new Promise(async(resolve, reject) => {
  const fullUrl = baseUrl + `genres/${id}/page/${pageNumber}`;
  console.log(fullUrl);
  Axios.get(fullUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const element = $(".page");
      let animeList = [];
      let genreList = [];
      let object = {};
      let genre_name, genre_link, genre_id;
      element.find(".col-md-4").each(function () {
        object = {};
        object.anime_name = $(this).find(".col-anime-title").text();
        object.link = $(this).find(".col-anime-title > a").attr("href");
        object.id = $(this)
          .find(".col-anime-title > a")
          .attr("href")
          .replace("https://otakudesu.tv/anime/", "");
        object.studio = $(this).find(".col-anime-studio").text();
        object.episode = $(this).find(".col-anime-eps").text();
        object.score = parseFloat($(this).find(".col-anime-rating").text());
        object.release_date = $(this).find(".col-anime-date").text();
        genreList = [];
        $(this)
          .find(".col-anime-genre > a")
          .each(function () {
            genre_name = $(this).text();
            genre_link = $(this).attr("href");
            genre_id = genre_link.replace("https://otakudesu.tv/genres/", "");
            genreList.push({ genre_name, genre_link, genre_id });
            object.genre_list = genreList;
          });
        animeList.push(object);
      });
      resolve(parseObj({
        status: "success",
        baseUrl: fullUrl,
        animeList,
      }));
    })
    .catch((err) => {
      reject(pageNumber, id, err);
    });
});


/**Search anime by query
 *Param {string} query
 *@return all search anime
 */
const search = async(query) => new Promise(async(resolve, reject) =>{
  const fullUrl = `${baseUrl}?s=${query}&post_type=anime`;
  Axios.get(fullUrl).then((response) => {
    const $ = cheerio.load(response.data);
    const element = $(".page");
    let obj = {};
    let anime_list = [];
    (obj.status = "success"), (obj.baseUrl = fullUrl);
    element.find("ul > li").each(function () {
      const genre_list = [];
      $(this)
        .find(".set")
        .find("a")
        .each(function () {
          const genre_result = {
            genre_title: $(this).text(),
            genre_link: $(this).attr("href"),
            genre_id: $(this).attr("href").replace(`${baseUrl}genres/`, ""),
          };
          genre_list.push(genre_result);
        });
      const results = {
        thumb: $(this).find("img").attr("src"),
        title: $(this).find("h2").text(),
        link: $(this).find("h2 > a").attr("href"),
        id: $(this).find("h2 > a").attr("href").replace(`${baseUrl}anime/`, ""),
        status: $(this).find(".set").eq(1).text().replace("Status : ", ""),
        score: parseFloat(
          $(this).find(".set").eq(2).text().replace("Rating : ", "")
        ),
        genre_list,
      };
      anime_list.push(results);
      obj.search_results = anime_list;
    });
    return resolve(parseObj(obj));
  }).catch(err => reject(err));
});

const detailAnime = async (id) => new Promise(async(resolve, reject) => {
  const fullUrl = url.baseUrl + `anime/${id}`;
  // console.log(fullUrl);
  try {
    const response = await Axios.get(fullUrl);

    const $ = cheerio.load(response.data);
    const detailElement = $(".venser").find(".fotoanime");
    const epsElement = $("#_epslist").html();
    let object = {};
    let episode_list = [];
    object.thumb = detailElement.find("img").attr("src");
    object.anime_id = id;
    let genre_name, genre_id, genre_link;
    let genreList = [];

    object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
      .find("p")
      .text();

    detailElement.find(".infozin").filter(function () {
      object.title = $(this)
        .find("p")
        .children()
        .eq(0)
        .text()
        .replace("Judul: ", "");
      object.japanese = $(this)
        .find("p")
        .children()
        .eq(1)
        .text()
        .replace("Japanese: ", "");
      object.score = parseFloat(
        $(this).find("p").children().eq(2).text().replace("Skor: ", "")
      );
      object.producer = $(this)
        .find("p")
        .children()
        .eq(3)
        .text()
        .replace("Produser: ", "");
      object.type = $(this)
        .find("p")
        .children()
        .eq(4)
        .text()
        .replace("Tipe: ", "");
      object.status = $(this)
        .find("p")
        .children()
        .eq(5)
        .text()
        .replace("Status: ", "");
      object.total_episode = parseInt(
        $(this).find("p").children().eq(6).text().replace("Total Episode: ", "")
      );
      object.duration = $(this)
        .find("p")
        .children()
        .eq(7)
        .text()
        .replace("Durasi: ", "");
      object.release_date = $(this)
        .find("p")
        .children()
        .eq(8)
        .text()
        .replace("Tanggal Rilis: ", "");
      object.studio = $(this)
        .find("p")
        .children()
        .eq(9)
        .text()
        .replace("Studio: ", "");
      $(this)
        .find("p")
        .children()
        .eq(10)
        .find("span > a")
        .each(function () {
          genre_name = $(this).text();
          genre_id = $(this)
            .attr("href")
            .replace("https://otakudesu.tv/genres/", "");
          genre_link = $(this).attr("href");
          genreList.push({ genre_name, genre_id, genre_link });
          object.genre_list = genreList;
        });
    });

    $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
      (i, element) => {
        const dataList = {
          title: $(element).find("span > a").text(),
          id: $(element)
            .find("span > a")
            .attr("href")
            .replace("https://otakudesu.tv/", ""),
          link: $(element).find("span > a").attr("href"),
          uploaded_on: $(element).find(".zeebr").text(),
        };
        episode_list.push(dataList);
      }
    );
    object.episode_list =
      episode_list.length === 0
        ? [
            {
              title: "Masih kosong gan",
              id: "Masih kosong gan",
              link: "Masih kosong gan",
              uploaded_on: "Masih kosong gan",
            },
          ]
        : episode_list;
    const batch_link = {
      id:
        $("div.venser > div:nth-child(6) > ul").text().length !== 0
          ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
              .attr("href")
              .replace("https://otakudesu.tv/batch/", "")
          : null,
      link:
        $("div.venser > div:nth-child(6) > ul").text().length !== 0
          ? $(
              "div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a"
            ).attr("href")
          : null,
    };
    const empty_link = {
      id: "Masih kosong gan",
      link: "Masih kosong gan",
    };
    object.batch_link = batch_link;
    resolve(parseObj(object));
  } catch (err) {
    console.log(err);
    reject(id, err);
  }
});


const batchAnime = async (id) => new Promise(async(resolve, reject) =>{
  const fullUrl = `https://otakudesu.tv/batch/${id}`;
  Axios.get(fullUrl)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const obj = {};
      obj.title = $(".batchlink > h4").text();
      obj.status = "success";
      obj.baseUrl = fullUrl;
      let low_quality = _batchQualityFunction(0, response.data);
      let medium_quality = _batchQualityFunction(1, response.data);
      let high_quality = _batchQualityFunction(2, response.data);
      obj.download_list = { low_quality, medium_quality, high_quality };
      resolve(parseObj(obj));
    })
    .catch((err) => {
        console.log(err)
        reject(err)
    });
});
const epsAnime = async (id) => new Promise(async(resolve, reject) => {
  const fullUrl = `https://otakudesu.tv/${id}`
  try {
    const response = await Axios.get(fullUrl);
    const $ = cheerio.load(response.data);
    const streamElement = $("#lightsVideo").find("#embed_holder");
    const obj = {};
    obj.title = $(".venutama > h1").text();
    obj.baseUrl = fullUrl;
    obj.id = fullUrl.replace(url.baseUrl, "");
    const streamLink = streamElement.find("iframe").attr("src");
    // const streamLinkResponse = await Axios.get(streamLink)
    // const stream$ = cheerio.load(streamLinkResponse.data)
    // const sl = stream$('body').find('script').html().search('sources')
    // const endIndex = stream$('body').find('script').eq(0).html().indexOf('}]',sl)
    // const val = stream$('body').find('script').eq(0).html().substr(sl,endIndex - sl+1).replace(`sources: [{'file':'`,'')
    // console.log(val);
    // console.log(val.replace(`','type':'video/mp4'}`,''));
    obj.link_stream = await episodeHelper.get(streamLink);
    let low_quality = _epsQualityFunction(0, response.data);
    let medium_quality = _epsQualityFunction(1, response.data);
    let high_quality = _epsQualityFunction(2, response.data);
    obj.quality = { low_quality, medium_quality, high_quality };
    resolve(parseObj(obj));
  } catch (err) {
      console.log(err)
    reject(err);
  }
});

function _batchQualityFunction(num, res) {
  const $ = cheerio.load(res);
  const element = $(".download").find(".batchlink");
  const download_links = [];
  let response;
  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        const _list = {
          host: $(this).text(),
          link: $(this).attr("href"),
        };
        download_links.push(_list);
        response = { quality, size, download_links };
      });
  });
  return response;
}
function _epsQualityFunction(num, res) {
  const $ = cheerio.load(res);
  const element = $(".download");
  const download_links = [];
  let response;
  element.find("ul").filter(function () {
    const quality = $(this).find("li").eq(num).find("strong").text();
    const size = $(this).find("li").eq(num).find("i").text();
    $(this)
      .find("li")
      .eq(num)
      .find("a")
      .each(function () {
        const _list = {
          host: $(this).text(),
          link: $(this).attr("href"),
        };
        download_links.push(_list);
        response = { quality, size, download_links };
      });
  });
  return response;
}



function parseObj(obj) {
    if (obj) return JSON.parse(JSON.stringify(obj))
    else return {}
}

module.exports = {
    home,
    genre,
    schedule,
    search,
    epsAnime,
    batchAnime,
    detailAnime,
    animeByGenre,
    onGoingAnimeList,
    completeAnimeList,
    
    
}