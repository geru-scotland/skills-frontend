
const taskStates = JSON.parse(localStorage.getItem('taskStates')) || {};

function getSkillById(skillId) {
    return fetch(`/skills/${skillId}/get-by-id`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al obtener la skill: ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            const skill = data.skill;

            return {
                id: skill.id,
                text: skill.text,
                icon: skill.icon,
                set: skill.set,
                tasks: skill.tasks || [],
                resources: skill.resources || [],
                description: skill.description || '',
                score: skill.score || 1,
                isCompleted: data.isCompleted
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

    getSkillById(id).then(function(skill) {
        if (!skill) {
            console.error('Skill not found');
            return;
        }

        const hexagonElement = document.getElementById(`hexagon-${id}`);
        if (hexagonElement) {
            hexagonElement.style.backgroundColor = skill.isCompleted ? "green" : "white";
        }

        const tasks = skill.tasks || [];
        const resources = skill.resources || [];

        const skillTitleText = skill.text.replace(/ *\/ */g, ' ');
        const skillContainer = document.getElementById('skillContainer');

        // Renderizar el contenido principal
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
                        <input type="checkbox" class="task-checkbox" data-task-index="${index}" ${taskStates[id] && taskStates[id][index] ? 'checked' : ''}> 
                        ${task}
                    </label>
                </li>`).join('')}
        </ul>
        <h2>Provide Evidence</h2>
        ${!skill.isCompleted ? `
            <form id="evidenceForm" class="evidence-form" action="/skills/${skill.set}/${skill.id}/submit-evidence" method="POST">
                <textarea name="evidence" placeholder="Enter a URL or explanation as evidence for completing this skill" required></textarea>
                <button type="submit" class="submit-btn">Submit Evidence</button>
            </form>
        ` : `<p>This skill is already completed. No further evidence is required.</p>`}
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

        const checkboxes = document.querySelectorAll(".task-list input[type='checkbox']");

        function checkTasksCompletion() {
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            if (allChecked) {
                launchConfetti();
            }
        }

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", checkTasksCompletion);
        });

        function launchConfetti() {
            confetti({
                particleCount: 1000,
                spread: 360,
                origin: { y: 0.5 }
            });
        }

        if (!skill.isCompleted) {
            document.getElementById('evidenceForm').addEventListener('submit', function(event) {
                event.preventDefault();

                const form = event.target;
                const evidence = form.elements.evidence.value;
                const action = form.action;

                fetch(action, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ evidence })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al enviar la evidencia');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            alert('Evidencia enviada con éxito');
                            form.reset();
                            renderEvidenceTable(skill.id);
                        } else {
                            throw new Error(data.error || 'Error desconocido al enviar la evidencia');
                        }
                    })
                    .catch(error => {
                        console.error('Error al enviar la evidencia:', error);
                        alert(error.message);
                    });
            });
        }

        const taskCheckboxes = document.querySelectorAll('.task-checkbox');
        taskCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleTaskChange);
        });

        renderEvidenceTable(id);
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

function renderEvidenceTable(skillId) {
    fetch(`/skills/${skillId}/evidences`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al obtener las evidencias: ' + response.statusText);
            }
            return response.json();
        })
        .then(function(evidences) {
            const evidenceTable = document.getElementById('evidenceTable');

            evidenceTable.innerHTML = `
                <tr>
                    <th>User</th>
                    <th>Evidence</th>
                    <th>Actions</th>
                </tr>
            `;

            evidences.forEach(evidence => {
                const row = document.createElement('tr');

                const showVerifyButton = !window.isAdmin && evidence.user.username !== window.currentUsername;

                row.innerHTML = `
                    <td>${evidence.user.username || 'Unknown'}</td>
                    <td><a href="${evidence.evidence}" target="_blank">${evidence.evidence}</a></td>
                    <td>
                        ${showVerifyButton ? `
                            <button onclick="verifyEvidence('${evidence._id}')" class="verify-btn">Verify</button>
                        ` : ''}
                        ${window.isAdmin ? `
                            <button onclick="approveEvidence('${evidence._id}')" class="approve-btn">Approve</button>
                            <button onclick="rejectEvidence('${evidence._id}')" class="reject-btn">Reject</button>
                        ` : ''}
                    </td>
                `;

                evidenceTable.appendChild(row);
            });
        })
        .catch(function(error) {
            console.error('Error al renderizar la tabla de evidencias:', error);
        });
}


function verifyEvidence(evidenceId) {
    const { id: skillId } = getQueryParams();

    fetch(`/skills/evidence/${evidenceId}/verify`, { method: 'POST' })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al verificar la evidencia: ' + response.statusText);
            }
            return response.json();
        })
        .then(function(result) {
            alert(result.message || 'Evidence verified!');
            renderEvidenceTable(skillId);
        })
        .catch(function(error) {
            console.error('Error al verificar la evidencia:', error);
        });
}

function approveEvidence(evidenceId) {
    fetch(`/skills/evidence/${evidenceId}/approve`, { method: 'POST' })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al aprobar la evidencia: ' + response.statusText);
            }
            return response.json();
        })
        .then(function(result) {
            alert(result.message || 'Evidence approved!');
            renderEvidenceTable(getQueryParams().id);
        })
        .catch(function(error) {
            console.error('Error al aprobar la evidencia:', error);
        });
}

function rejectEvidence(evidenceId) {
    fetch(`/skills/evidence/${evidenceId}/reject`, { method: 'POST' })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Error al rechazar la evidencia: ' + response.statusText);
            }
            return response.json();
        })
        .then(function(result) {
            alert(result.message || 'Evidence rejected!');
            renderEvidenceTable(getQueryParams().id);
        })
        .catch(function(error) {
            console.error('Error al rechazar la evidencia:', error);
        });
}
window.verifyEvidence = verifyEvidence;
window.approveEvidence = approveEvidence;
window.rejectEvidence = rejectEvidence;

document.addEventListener("DOMContentLoaded", renderSkillTemplate);
