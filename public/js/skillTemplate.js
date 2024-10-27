import skillsData from '../data/skills.js';

const unverifiedEvidences = [];

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
        <h2>Unverified Evidence Submissions</h2>
        <table id="evidenceTable" class="evidence-table">
            <tr>
                <th>User</th>
                <th>Evidence</th>
                <th>Actions</th>
            </tr>
        </table>
    `;
    document.getElementById('evidenceForm').addEventListener('submit', handleEvidenceSubmit);
}

function handleEvidenceSubmit(event) {
    // para que no se muera :( 
    event.preventDefault();
    
    const evidenceInput = event.target.elements.evidence.value;

    const newEvidence = { user: "Admin", evidence: evidenceInput };
    unverifiedEvidences.push(newEvidence);

    renderEvidenceTable();

    event.target.reset();
}

function renderEvidenceTable() {
    const evidenceTable = document.getElementById('evidenceTable');

    evidenceTable.innerHTML = `
        <tr>
            <th>User</th>
            <th>Evidence</th>
            <th>Actions</th>
        </tr>
    `;

    unverifiedEvidences.forEach((evidence, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evidence.user}</td>
            <td><a href="${evidence.evidence}" target="_blank">${evidence.evidence}</a></td>
            <td>
                <button onclick="approveEvidence(${index})" class="approve-btn">Approve</button>
                <button onclick="rejectEvidence(${index})" class="reject-btn">Reject</button>
            </td>
        `;
        evidenceTable.appendChild(row);
    });
}

function approveEvidence(index) {
    unverifiedEvidences.splice(index, 1);
    renderEvidenceTable();
    alert('Evidence approved!');
}

function rejectEvidence(index) {
    unverifiedEvidences.splice(index, 1);
    renderEvidenceTable();
    alert('Evidence rejected!');
}

document.addEventListener("DOMContentLoaded", renderSkillTemplate);
