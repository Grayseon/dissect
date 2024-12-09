import * as cheerio from "cheerio"

function html(html){
  return cheerio.load(html)
}

export default html