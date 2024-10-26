const BadgeScrapper = require("./scrapers/BadgesScrapper")
const ImageHarvester = require("./harvesters/ImageHarvester")
const configMap = require('../config/config')

const imageHarvester = new ImageHarvester(configMap.badge_endpoint);
imageHarvester.setupScraper(BadgeScrapper, "harvestBadges", configMap.obijuan_endpoint);

(async () => {
    await imageHarvester.init();
    await imageHarvester.harvestImages("getIconsFromBadges", configMap.badges_path);
})();