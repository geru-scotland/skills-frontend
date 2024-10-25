const SkillScraper = require("./SkillScraper")
const configMap = require('../config/config')

class ImageHarvester {

    constructor(endpoint) {
        this.endpoint = endpoint;
        this.scraperClass = null;
        this.scraper = null;
        this.harvestedData = null;
    }

    setupScraper(scraper, harvestMethod, endpoint) {
        this.scraperEndpoint = endpoint;
        this.scraperClass = scraper;
        this.harvestData = harvestMethod;
    }

    async init() {
        this.scraper = new this.scraperClass(this.scraperEndpoint);
        await this.scraper.init();
        this.scraper[this.harvestData]()
    }

    harvestImages(getData) {
        const data = this.scraper[getData]();
        data.forEach( (iconName) => {
            try {
                const url = `${this.endpoint}/${iconName}`;
                console.log(`Downloading ${url}`)
            } catch (error) {
                console.log("There was an error downloading " + iconName + ": " + error.error);
            }
        })
    }
}

const imageHarvester = new ImageHarvester(configMap.icon_endpoint)
imageHarvester.setupScraper(SkillScraper, "harvestSkills", configMap.skill_endpoint);

(async () => {
    await imageHarvester.init();
    imageHarvester.harvestImages("getIconsFromSkills");
})();