import skillsData from '../data/skills.js';

function getSkillById(skillId) {
    return skillsData.find(skill => skill.id === skillId);
}

function getQueryParams() {
    const queryParams = new URLSearchParams(window.location.search);
    return {
        id: queryParams.get('id')
    };
}

function renderSkillTemplate() {
    const { id } = getQueryParams();
    const skill = getSkillById(id);

    if (!skill) {
        console.error('Skill not found');
        return;
    }

    // Hardcodeo esto hasta que tengamos datos
    const tasks = [
        "Task 1",
        "Task 2",
        "Task 3"
    ];

    // Y esto también
    const resources = [
        { url: "URL1", name: "Resource 1" },
        { url: "URL2", name: "Resource 2" },
        { url: "URL3", name: "Resource 3" }
    ];

    const skillTitleText = skill.text.replace(/ *\/ */g, ' ');
    const skillContainer = document.getElementById('skillContainer');

    skillContainer.innerHTML = `
        <h1 class="skill-title">Skill: ${skillTitleText}</h1>
        <div class="skill-icon">
            <img src="electronics/icons/${skill.icon}" alt="Skill Icon" width="100">
        </div>
        <p class="skill-description">${skill.description}</p>
        <h2>Tasks to Complete</h2>
        <ul class="task-list">
            ${tasks.map(task => `<li><label><input type="checkbox"> ${task}</label></li>`).join('')}
        </ul>
        <h2>Provide Evidence</h2>
        <form id="evidenceForm" class="evidence-form">
            <textarea name="evidence" placeholder="Enter a URL or explanation as evidence for completing this skill" required></textarea>
            <button type="submit" class="submit-btn">Submit Evidence</button>
        </form>
        <h2>Resources</h2>
        <ul class="resources-list">
            ${resources.map(resource => `<li><a href="${resource.url}">${resource.name}</a></li>`).join('')}
        </ul>
    `;
}

document.addEventListener("DOMContentLoaded", renderSkillTemplate);
