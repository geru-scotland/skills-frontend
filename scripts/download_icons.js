const SkillScraper = require("./scrapers/SkillScraper")
const ImageHarvester = require("./harvesters/ImageHarvester")
const configMap = require('../config/config')

const imageHarvester = new ImageHarvester(configMap.icon_endpoint);
imageHarvester.setupScraper(SkillScraper, "harvestSkills", configMap.skill_endpoint);

(async () => {
    await imageHarvester.init();
    await imageHarvester.harvestImages("getIconsFromSkills", configMap.icon_path);
})();