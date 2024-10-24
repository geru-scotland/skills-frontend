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

    retrieveSkills() {
        if (!this.$) {
            return 'No data loaded yet';
        }
        const skills = [];
        const svgWrappers = this.$('.svg-container').find('.svg-wrapper');
        svgWrappers.each((index, skill) => {
            const skillId = this.$(skill).attr('data-id');

            const skillText = this.$(skill).find('text').find('tspan').map((index, element) => {
                return this.$(element).text().trim();
            }).get().join(' /');

            // Accedo al atributo href del elemento image, hago split por / y obtengo el último elemento
            // que es el nombre del archivo del icono
            const skillIcon = this.$(skill).find('image').attr('href').split('/').pop();

            skills.push({
                id: skillId,
                text: skillText,
                icon: skillIcon
            });
        });

        return skills
    }
}

// TODO: Remove this, is for testing purposes only
(async () => {
    const scraper = new Scraper('https://tinkererway.dev/web_skill_trees/electronics_skill_tree');
    await scraper.fetchData();
    const skills = scraper.retrieveSkills()
    console.log(skills);
})()

module.exports = Scraper;