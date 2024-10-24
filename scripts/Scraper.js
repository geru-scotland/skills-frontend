const cheerio = require('cheerio');

class Scraper {

    constructor(url){
        this.url = url;
        this.$ = null;
    }

    async fetchData(){
        try {
            this.$ = null;
            const response = await fetch(this.url);
            const html = await response.text();
            this.$ = cheerio.load(html);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }
}


module.exports = Scraper;