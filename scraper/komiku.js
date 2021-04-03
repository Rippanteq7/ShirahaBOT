const cheerio = require("cheerio");
const baseUrl = 'https://komiku.id/'
const replaceMangaPage = "https://komiku.id/manga/";
const request = require('request')


//mangalist
const page = async (pagenumber) => new Promise(async(resolve, reject) => {
  let url = pagenumber === undefined ? 'https://data1.komiku.id/pustaka' : pagenumber === '1' ? 'https://data1.komiku.id/pustaka/'
  : `https://data1.komiku.id/pustaka/page/${pagenumber}/` 
   try {
    const response = await HttpPage(url)
    console.log(url);
      const $ = cheerio.load(response);
      const element = $(".perapih");
      let manga_list = [];
      let title, type, updated_on, endpoint, thumb, chapter;
    
      element.find(".daftar > .bge").each((idx, el) => {
        title = $(el).find(".kan > a").find("h3").text().trim();
        endpoint = $(el).find("a").attr("href").replace(replaceMangaPage, "");
        type = $(el).find(".bgei > a").find(".tpe1_inf > b").text();
        updated_on = $(el).find(".kan > span").text().split("• ")[1].trim();
        thumb = $(el).find(".bgei > a").find("img").attr("data-src");
        chapter = $(el).find("div.kan > div:nth-child(5) > a > span:nth-child(2)").text();
        manga_list.push({
          title,
          thumb,
          type,
          updated_on,
          endpoint,
          chapter,
        })
      })
      return resolve(parseObj({manga_list}))
   }catch(err) {
        console.log(err)
        reject(err);
   }
})

// detail manga  ---- Done -----
const detailManga = async(slug) => new Promise(async(resolve, reject) => {
  try {
  const response = await HttpPage(`${baseUrl}manga/${slug}`);
  const $ = cheerio.load(response);
  const element = $(".perapih");
  let genre_list = [];
  let chapter = [];
  const obj = {};

  /* Get Title, Type, Author, Status */
  const getMeta = element.find(".inftable > tbody").first();
  obj.title = $(getMeta)
    .children()
    .eq(0)
    .find("td:nth-child(2)")
    .text()
    .replace("Komik", "")
    .trim();
  obj.type = $('tr:nth-child(2) > td:nth-child(2)').find('b').text();
  obj.author = $('#Informasi > table > tbody > tr:nth-child(4) > td:nth-child(2)').text().trim();
  obj.status = $(getMeta).children().eq(4).find("td:nth-child(2)").text();

  /* Set Manga Endpoint */
  obj.manga_endpoint = slug;

  /* Get Manga Thumbnail */
  obj.thumb = element.find(".ims > img").attr("src");

  element.find(".genre > li").each((idx, el) => {
    let genre_name = $(el).find("a").text();
    genre_list.push({
      genre_name,
    });
    obj.genre_list = genre_list;
  });

  /* Get Synopsis */
  const getSinopsis = element.find("#Sinopsis").first();
  obj.synopsis = $(getSinopsis).find("p").text().trim();

  /* Get Chapter List */
  $('#Daftar_Chapter > tbody')
    .find("tr")
    .each((index, el) => {
      let chapter_title = $(el)
        .find("a")
        .attr("title")
      let chapter_endpoint = $(el).find("a").attr("href")
      console.log(chapter_endpoint);
      if(chapter_endpoint !== undefined){
        const rep = chapter_endpoint.replace('/ch/','')
        chapter.push({
          chapter_title,
          chapter_endpoint:rep,
        }); 
      }
      obj.chapter = chapter;
    });

  resolve(parseObj(obj))
  } catch (error) {
    reject(error)
  }
});

//search manga 
const search = async(query) => new Promise(async(resolve, reject) => {
  const url = `https://data1.komiku.id/cari/?post_type=manga&s=${query}`;

  try {
    const response = await HttpPage(url);
    const $ = cheerio.load(response);
    const element = $(".daftar");
    let manga_list = [];
    let title, thumb, type, endpoint, updated_on;
    element.find(".bge").each((idx, el) => {
      endpoint = $(el).find("a").attr("href").replace(replaceMangaPage, "").replace('/manga/','');
      thumb = $(el).find("div.bgei > a > img").attr("data-src");
      type = $(el).find("div.bgei > a > div.tpe1_inf > b").text();
      title = $(el).find(".kan").find("h3").text().trim();
      updated_on = $(el).find("div.kan > p").text().split('.')[0].trim();
      manga_list.push({
        title,
        thumb,
        type,
        endpoint,
        updated_on,
      });
    });
    resolve(parseObj({manga_list}));
  } catch (error) {
    reject(error)
  }
});

//genreList 
const genreList = async() => new Promise(async(resolve, reject) => {
  try {
    const response = await HttpPage();

    const $ = cheerio.load(response);
    let list_genre = [];
    let obj = {};
    $('#Filter > form > select:nth-child(2)').find('option').each((idx,el)=>{
      if($(el).text() !== 'Genre 1'){
        list_genre.push({
          genre_name:$(el).text()
        })
      }
    })
    obj.list_genre = list_genre
    resolve(parseObj(obj))
  } catch (error) {
    reject(error)
  }
});

//genreDetail 
 const genreDetail = async(slug, pagenumber) => new Promise(async(resolve, reject) => {
  const url = pagenumber === '1' ?`https://data1.komiku.id/pustaka/?orderby=modified&genre=${slug}&genre2=&status=&category_name=` : `https://data1.komiku.id/pustaka/page/${pagenumber}/?orderby=modified&genre=${slug}&genre2&status&category_name`;
  try {
    const response = await HttpPage(url);
    const $ = cheerio.load(response);
    const element = $(".daftar");
    var thumb, title, endpoint, type;
    var manga_list = [];
    element.find(".bge").each((idx, el) => {
      title = $(el).find(".kan").find("h3").text().trim();
      endpoint = $(el).find("a").attr("href").replace(replaceMangaPage, "");
      type = $(el).find("div.bgei > a > div").find("b").text();
      thumb = $(el).find("div.bgei > a > img").attr("data-src");
      manga_list.push({
        title,
        type,
        thumb,
        endpoint,
      });
    });
    resolve(parseObj({manga_list}));
  } catch (error) {
    reject(error)
  }
});

//manga rekomendasi
const recommended = async(pagenumber) => new Promise(async(resolve, reject ) => {
  const url = pagenumber === undefined ? `https://data1.komiku.id/other/rekomendasi/` : pagenumber === '1' ? `https//data1.komiku.id/other/rekomendasi/` : `https//data1.komiku.id/other/rekomendasi/page/${pagenumber}`;
  try {
    const response = await HttpPage(url);
    const $ = cheerio.load(response);
    const element = $(".daftar");
    let thumb, title, endpoint, type, upload_on;
    let manga_list = [];
    element.find(".bge").each((idx, el) => {
      title = $(el).find(".kan").find("h3").text().trim();
      endpoint = $(el).find("a").attr("href").replace(replaceMangaPage, "").replace('/manga/','');
      type = $(el).find("div.bgei > a > div.tpe1_inf > b").text();
      thumb = $(el).find("div.bgei > a > img").attr("data-src");
      upload_on = $(el).find("div.kan > p").text().split('.')[0].trim();
      manga_list.push({
        title,
        type,
        thumb,
        endpoint,
        upload_on,
      });
    });
    resolve(parseObj({manga_list}));
  } catch (error) {
    reject(error)
  }
});

//recommended ---done---
const mangaPopuler = () => new Promise(async( resolve, reject) => {
  try {
    const response = await HttpPage('https//data1.komiku.id/other/hot/');

    const $ = cheerio.load(response);
    const element = $("div.daftar > .bge");
    let manga_list = [];
    let type, title, chapter, update, endpoint, thumb;
    element.each((idx, el) => {
      title = $(el).find("div.kan > a > h3").text().trim();
      thumb = $(el).find("div.bgei > a > img").attr("data-src");
      endpoint = $(el).find("div.kan > a").attr('href')
        .replace('/manga/', "").replace(replaceMangaPage,'');
      manga_list.push({
        title,
        chapter,
        type,
        thumb,
        endpoint,
        update,
      });
    });
    resolve(parseObj({manga_list}))
  } catch (error) {
    reject(error)
  }
});

//manhua  
const getManhuaManhwa = async (pagenumber, type) => {
  let url = pagenumber === '1' ?`https://data1.komiku.id/pustaka/?orderby=&category_name=${type}&genre=&genre2=&status=`
  :`https://data1.komiku.id/pustaka/page/${pagenumber}/?orderby&category_name=${type}&genre&genre2&status`;

  try {
    console.log(url);
    const response = await HttpPage(url);
    const $ = cheerio.load(response);
    const element = $(".perapih");
    var manga_list = [];
    var title, type, updated_on, endpoint, thumb, chapter;

    element.find(".daftar > .bge").each((idx, el) => {
      title = $(el).find(".kan > a").find("h3").text().trim();
      endpoint = $(el).find("a").attr("href").replace(replaceMangaPage, "");
      type = $(el).find(".bgei > a").find(".tpe1_inf > b").text().trim();
      updated_on = $(el).find(".kan > span").text().split("• ")[1].trim();
      thumb = $(el).find(".bgei > a").find("img").attr("data-src");
      chapter = $(el).find("div.kan > div:nth-child(5) > a > span:nth-child(2)").text();
      manga_list.push({
        title,
        thumb,
        type,
        updated_on,
        endpoint,
        chapter,
      });
    });

    return parseObj({manga_list})
  } catch (error) {
    console.log(error);
    throw error
  }
};


function parseObj(obj) {
    if (obj) return JSON.parse(JSON.stringify(obj))
    else return {}
}

const HttpPage = async(url) => {
    return new Promise((resolve, reject) => {
	request({
		headers: { "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"},
		url: `${url}`,
	},(err,resp,html) => {
		if(!err && resp.statusCode == 200){
			resolve(html);
		} else {
			reject(err);
		}
	});
  })
}





module.exports = {
    page,
    detailManga,
    genreDetail,
    genreList,
    getManhuaManhwa,
    recommended,
    mangaPopuler,
    search,
}
