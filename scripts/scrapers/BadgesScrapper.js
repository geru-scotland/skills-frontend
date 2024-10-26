const fs = require('fs');
const Scraper = require('./Scraper');
const configMap = require('../../config/config');

class BadgeScraper extends Scraper {
    constructor(endpoint) {
        super(endpoint);
        this.badges = [];
    }

    async init() {
        await super.fetchData();
    }

    harvestBadges() {
        if (!this.$) {
            return 'No data loaded yet';
        }

        const listSection = this.$('h2:contains("Listado de Rangos")').parent();
        let currentElement = listSection.next();

        while (currentElement.length) {
            if (currentElement.is('h2') || currentElement.is('h1')) {
                break;
            }

            if (currentElement.is('table')) {
                currentElement.find('tbody tr').each((i, elem) => {
                    try {
                        const cols = this.$(elem).find('td');
                        const imgSrc = this.$(cols[1]).find('img').attr('src');
                        const rango = this.$(cols[2]).text().trim();
                        const bitpoints = parseInt(this.$(cols[3]).text().trim());
                        const descripcion = this.$(cols[4]).text().trim();
                        const png = imgSrc ? imgSrc.split('/').pop() : '';

                        this.badges.push({
                            rango: rango,
                            bitpoints_min: bitpoints,
                            bitpoints_max: bitpoints + 9,
                            png: png,
                            descripcion: descripcion
                        });
                    } catch (error) {
                        console.log("Error when trying to harvest badges_bk:", error);
                    }
                });
            }

            currentElement = currentElement.next();
        }
    }

    exportBadgesToJSON() {
        const filePath = "../" + configMap.badges_json_path;
        fs.writeFile(filePath, JSON.stringify(this.badges, null, 2), 'utf8', (err) => {
            if (err) {
                console.log("Error writing badges_bk to JSON file:", err);
            } else {
                console.log("Badges successfully exported to JSON file at:", filePath);
            }
        });
    }

    getIconsFromBadges() {
        return this.badges.map(badge => {
            const parts = badge.png.split(".");
            return parts[0] + "-min." + parts[1];
        });
    }
}

module.exports = BadgeScraper;
