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

            const skillIcon = this.$(skill).find('image').attr('href');
            skills.push({
                id: skillId,
                text: skillText,
                icon: skillIcon
            });
        });

        return skills
    }
}

(async () => {
    const scraper = new Scraper('https://tinkererway.dev/web_skill_trees/electronics_skill_tree');
    await scraper.fetchData();
    const skills = scraper.retrieveSkills()
    console.log(skills);
})()
module.exports = Scraper;