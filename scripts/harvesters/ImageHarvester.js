const fs = require('fs');
const path = require('path');

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

    // Secuencial por ahora
    async downloadImage(url, filename) {
        const fetch = await import('node-fetch');
        await fetch.default(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                }
                const fileStream = fs.createWriteStream(filename);
                response.body.pipe(fileStream);
                response.body.on("error", (error) => {
                    throw new Error(error)
                });
            })
            .catch(error => {
                throw new Error(error)
            });
    }

    // TODO: Hacer debidamente el tema de rutas, esto es una chapuza.
    // Considerar si node path o similar, pero con vanila js no hay mucho
    // quizá module alias de node.
    async harvestImages(getData, storePath) {
        this.harvestData = this.scraper[getData]();
        const downloadDir = path.join(__dirname, "../../"+storePath);
        let downloadedImages = 0;

        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        for (const imageName of this.harvestData) {
            try {
                const url = `${this.endpoint}/${imageName}`;
                const filePath = path.join(downloadDir, imageName);
                console.log(`Downloading ${url}`);
                await this.downloadImage(url, filePath);
                console.log("Success!")
                downloadedImages++;
            } catch (error) {
                console.log("There was an error downloading " + imageName + ": " + error.error);
            }
        }

        if(downloadedImages === this.harvestData.length)
            console.log("Every image has been downloaded.")
        else
            console.log(`Images downloaded: ${downloadedImages}/${this.harvestData.length}`)
    }
}

module.exports = ImageHarvester;