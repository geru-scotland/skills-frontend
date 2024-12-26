
const Skill = require('../models/Skill');
const Badge = require('../models/Badge');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

async function importData() {
    try {
        console.log("Importando base de datos inicial...");

        const skillCount = await Skill.countDocuments();
        if (skillCount > 0) {
            console.log("La colección Skills ya contiene datos. Ignorando.");
        } else {
            console.log("Importando datos a la colección Skills...");
            const skillsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/skills.json'), 'utf-8'));

            const modifiedSkills = skillsData.map(skill => ({
                ...skill,
                set: "electronics",
                description: generateDynamicDescription(skill.text),
                score: Math.floor(Math.random() * (100 - 5 + 1)) + 5,
                tasks: generateRandomTasks()
            }));

            await Skill.insertMany(modifiedSkills);
            console.log(`Importados ${modifiedSkills.length} documentos a Skills.`);
        }

        const badgeCount = await Badge.countDocuments();
        if (badgeCount > 0) {
            console.log("La colección Badges ya contiene datos. Ignorando.");
        } else {
            console.log("Importando datos a la colección Badges...");
            const badgesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/badges.json'), 'utf-8'));
            await Badge.insertMany(badgesData);
            console.log(`Importados ${badgesData.length} documentos a Badges.`);
        }

        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log("La colección Users ya contiene datos. Ignorando.");
        } else {
            console.log("Importando datos a la colección Users...");
            const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'));

            for (const userData of usersData) {
                const newUser = new User({
                    username: userData.username,
                    password: userData.password,
                    admin: userData.admin
                });
                await newUser.save();
            }

            console.log(`Importados ${usersData.length} usuarios a la colección Users.`);
        }

        console.log("Migración completada.");
    } catch (error) {
        console.error("Error durante la migración:", error);
    }
}

function generateDynamicDescription() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return `${randomQuote}`;
}

function generateRandomTasks() {
    const tasksPool = [
        "Build a lightsaber replica",
        "Assemble a Raspberry Pi",
        "Program a simple game",
        "Create a working circuit on a breadboard",
        "Decode an ancient Sith message",
        "Hack a fictional system for fun",
        "Create an Arduino project",
        "Design a spaceship model",
        "Solve a complex riddle",
        "Repair a droid"
    ];
    const taskCount = Math.floor(Math.random() * 3) + 1; // Entre 1 y 3
    return Array.from({ length: taskCount }, () => tasksPool[Math.floor(Math.random() * tasksPool.length)]);
}

const quotes = [
    "With great power comes great responsibility. - Spider-Man (2002)",
    "May the Force be with you. - Star Wars (1977)",
    "It's dangerous to go alone! Take this. - The Legend of Zelda (1986)",
    "Keep calm and carry a lightsaber. - Star Wars-inspired phrase",
    "Why so serious? - The Dark Knight (2008)",
    "You can't handle the truth! - A Few Good Men (1992)",
    "Live long and prosper. - Star Trek (1966)",
    "Do or do not. There is no try. - Star Wars: The Empire Strikes Back (1980)",
    "I am Groot. - Guardians of the Galaxy (2014)",
    "Winter is coming. - Game of Thrones (2011)",
    "One does not simply walk into Mordor. - The Lord of the Rings: The Fellowship of the Ring (2001)",
    "My precious. - The Lord of the Rings: The Two Towers (2002)",
    "You shall not pass! - The Lord of the Rings: The Fellowship of the Ring (2001)",
    "I'm Batman. - Various Batman media",
    "I find your lack of faith disturbing. - Star Wars: A New Hope (1977)",
    "The cake is a lie. - Portal (2007)",
    "I am inevitable. - Avengers: Endgame (2019)",
    "I solemnly swear that I am up to no good. - Harry Potter and the Prisoner of Azkaban (2004)",
    "Wubba Lubba Dub-Dub! - Rick and Morty (2013)",
    "In the name of the moon, I will punish you! - Sailor Moon (1992)",
    "What is better? To be born good or to overcome your evil nature through great effort? - The Elder Scrolls V: Skyrim (2011)",
    "A mind needs books as a sword needs a whetstone. - Game of Thrones (2011)",
    "Fear is the mind-killer. - Dune (1965)",
    "You are a wizard, Harry. - Harry Potter and the Philosopher's Stone (2001)",
    "The needs of the many outweigh the needs of the few. - Star Trek II: The Wrath of Khan (1982)",
    "Are you not entertained? - Gladiator (2000)",
    "This is the way. - The Mandalorian (2019)",
    "I've always depended on the kindness of strangers. - A Streetcar Named Desire (1951)",
    "The Force will be with you, always. - Star Wars: A New Hope (1977)",
    "I'm the one who knocks. - Breaking Bad (2008)",
    "I know kung fu. - The Matrix (1999)",
    "I have the high ground! - Star Wars: Revenge of the Sith (2005)",
    "Bazinga! - The Big Bang Theory (2007)",
    "Make it so. - Star Trek: The Next Generation (1987)",
    "It’s a trap! - Star Wars: Return of the Jedi (1983)",
    "There’s always a lighthouse, there’s always a man, there’s always a city. - BioShock Infinite (2013)",
    "Stay awhile and listen. - Diablo II (2000)",
    "War. War never changes. - Fallout (1997)",
    "Would you kindly? - BioShock (2007)",
    "Nothing is true; everything is permitted. - Assassin's Creed (2007)"
];


module.exports = importData;
