const cheerio = require('cheerio');

class Scraper {

    constructor(endpoint){
        this.endpoint = endpoint;
        this.$ = null;
    }

    async fetchData(){
        try {
            this.$ = null;
            const response = await fetch(this.endpoint);
            const html = await response.text();
            this.$ = cheerio.load(html);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }
}

module.exports = Scraper;