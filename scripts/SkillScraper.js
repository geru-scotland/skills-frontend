const Scrapper = require('./Scraper');
const configMap = require('../config/config')

class SkillScraper extends Scrapper {
    constructor(endpoint){
        super(endpoint);
        this.skills = [];
    }

    async init() {
        await super.fetchData()
    }

    harvestSkills() {
        if (!this.$) {
            return 'No data loaded yet';
        }

        const svgWrappers = this.$('.svg-container').find('.svg-wrapper');

        svgWrappers.each((index, skill) => {
            try{
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
            } catch (error) {
                console.log("Error when trying to harvest skills")
            }
        });
    }

    getIconsFromSkills() {
        return this.skills.reduce( (icons, skill) => {
            icons.push(skill.icon)
            return icons;
        }, [])
    }
}

// TODO: Remove this, is for testing purposes only
(async () => {
    const scraper = new SkillScraper(configMap.skill_endpoint);
    await scraper.init();
    const skills = scraper.harvestSkills()
})()

module.exports = SkillScraper;