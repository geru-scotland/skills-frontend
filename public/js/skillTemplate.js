
const unverifiedEvidences = JSON.parse(localStorage.getItem('unverifiedEvidences')) || {};
const taskStates = JSON.parse(localStorage.getItem('taskStates')) || {};

function getSkillById(skillId) {
    return fetch(`/skills/${skillId}/get-by-id`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al obtener la skill: ' + response.statusText);
            }
            return response.json();
        })
        .then(function(skill) {
            return {
                id: skill.id,
                text: skill.text,
                icon: skill.icon,
                set: skill.set,
                tasks: skill.tasks || [],
                resources: skill.resources || [],
                description: skill.description || '',
                score: skill.score || 1
            };
        })
        .catch(function(error) {
            console.error('Error al obtener la información de la skill:', error);
            return null;
        });
}


function getQueryParams() {
    const queryParams = new URLSearchParams(window.location.search);
    return {
        id: queryParams.get('id')
    };
}

function renderSkillTemplate() {
    const { id } = getQueryParams();
    console.log(id);
    let skill;

    getSkillById(id).then(function(result) {
        skill = result;
        console.log('Skill obtenida:', skill);
        if (!skill) {
            console.error('Skill not found');
            return;
        }

        const tasks = skill.tasks || [];
        const resources = skill.resources || [];

        const skillTitleText = skill.text.replace(/ *\/ */g, ' ');
        const skillContainer = document.getElementById('skillContainer');

        skillContainer.innerHTML = `
        <h1 class="skill-title">Skill: ${skillTitleText}</h1>
        <div class="skill-icon">
            <img src="/electronics/icons/${skill.icon}" alt="Skill Icon" width="100">
        </div>
        <p class="skill-description">${skill.description}</p>
        <h2>Tasks to Complete</h2>
        <ul class="task-list">
            ${tasks.map((task, index) => `
                <li>
                    <label>
                        <input type="checkbox" class="task-checkbox" data-task-index="${index}" ${taskStates[id] && taskStates[id][index] ? 'checked' : ''}>                         ${task}
                    </label>
                </li>`).join('')}
        </ul>
        <h2>Provide Evidence</h2>
        <form id="evidenceForm" class="evidence-form">
            <textarea name="evidence" placeholder="Enter a URL or explanation as evidence for completing this skill" required></textarea>
            <button type="submit" class="submit-btn">Submit Evidence</button>
        </form>
        <h2>Resources</h2>
        <ul class="resources-list">
            ${resources.map(resource => `<li><a href="${resource.url}" target="_blank">${resource.name}</a></li>`).join('')}
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

        const taskCheckboxes = document.querySelectorAll('.task-checkbox');
        taskCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleTaskChange);
        });

        document.getElementById('evidenceForm').addEventListener('submit', handleEvidenceSubmit);

        renderEvidenceTable(id);
        updateHexagonColor(id);
    });
}


function handleTaskChange(event) {
    const { id } = getQueryParams();
    const taskIndex = event.target.getAttribute('data-task-index');

    if (!taskStates[id]) {
        taskStates[id] = [];
    }

    taskStates[id][taskIndex] = event.target.checked;

    localStorage.setItem('taskStates', JSON.stringify(taskStates));
    
    updateHexagonColor(id);
}

function updateHexagonColor(skillId) {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    const approvedEvidences = JSON.parse(localStorage.getItem('approvedEvidences')) || {};
    const hasApprovedEvidence = approvedEvidences[skillId] && approvedEvidences[skillId].length > 0;

    if (allChecked && hasApprovedEvidence) {
        localStorage.setItem(`hexagonColor-${skillId}`, "green");
    } else {
        localStorage.setItem(`hexagonColor-${skillId}`, "white");
    }
}


function handleEvidenceSubmit(event) {
    event.preventDefault();

    const { id } = getQueryParams();
    const evidenceInput = event.target.elements.evidence.value;
    const newEvidence = { user: "Admin", evidence: evidenceInput };

    if (!unverifiedEvidences[id]) {
        unverifiedEvidences[id] = [];
    }
    unverifiedEvidences[id].push(newEvidence);

    localStorage.setItem('unverifiedEvidences', JSON.stringify(unverifiedEvidences));

    renderEvidenceTable(id);

    event.target.reset();
}

function renderEvidenceTable(skillId) {
    const evidenceTable = document.getElementById('evidenceTable');

    evidenceTable.innerHTML = `
        <tr>
            <th>User</th>
            <th>Evidence</th>
            <th>Actions</th>
        </tr>
    `;

    (unverifiedEvidences[skillId] || []).forEach((evidence, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evidence.user}</td>
            <td><a href="${evidence.evidence}" target="_blank">${evidence.evidence}</a></td>
            <td>
                <button onclick="approveEvidence(${skillId}, ${index})" class="approve-btn">Approve</button>
                <button onclick="rejectEvidence(${skillId}, ${index})" class="reject-btn">Reject</button>
            </td>
        `;
        evidenceTable.appendChild(row);
    });
}


window.approveEvidence = function(skillId, index) {
    const approvedEvidences = JSON.parse(localStorage.getItem('approvedEvidences')) || {};

    if (!approvedEvidences[skillId]) {
        approvedEvidences[skillId] = [];
    }

    approvedEvidences[skillId].push(unverifiedEvidences[skillId][index]);
    
    unverifiedEvidences[skillId].splice(index, 1);
    localStorage.setItem('unverifiedEvidences', JSON.stringify(unverifiedEvidences));
    localStorage.setItem('approvedEvidences', JSON.stringify(approvedEvidences));

    renderEvidenceTable(skillId);
    updateHexagonColor(skillId);
    alert('Evidence approved!');
}

window.rejectEvidence = function(skillId, index) {
    unverifiedEvidences[skillId].splice(index, 1);
    localStorage.setItem('unverifiedEvidences', JSON.stringify(unverifiedEvidences));
    renderEvidenceTable(skillId);
    alert('Evidence rejected!');
}

document.addEventListener("DOMContentLoaded", renderSkillTemplate);
