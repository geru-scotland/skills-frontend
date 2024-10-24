const Scrapper = require('./Scraper');

class SkillScraper extends Scrapper {
    constructor(url){
        super(url);
        this.skills = [];
    }

    parseSkills() {
        if (!this.$) {
            return 'No data loaded yet';
        }

        const svgWrappers = this.$('.svg-container').find('.svg-wrapper');
        svgWrappers.each((index, skill) => {
            const skillId = this.$(skill).attr('data-id');

            const skillText = this.$(skill).find('text').find('tspan').map((index, element) => {
                return this.$(element).text().trim();
            }).get().join(' /');

            // Accedo al atributo href del elemento image, hago split por / y obtengo el último elemento
            // que es el nombre del archivo del icono
            const skillIcon = this.$(skill).find('image').attr('href').split('/').pop();

            this.skills.push({
                id: skillId,
                text: skillText,
                icon: skillIcon
            });
        });
        return this.skills;
    }
}

// TODO: Remove this, is for testing purposes only
(async () => {
    const scraper = new SkillScraper('https://tinkererway.dev/web_skill_trees/electronics_skill_tree');
    await scraper.fetchData();
    const skills = scraper.parseSkills()
    console.log(skills);
})()

module.exports = SkillScraper;