

document.addEventListener("DOMContentLoaded", async () => {
    const skillTreeName = "electronics";
    const apiUrl = `http://localhost:3001/skills/${skillTreeName}/all`;

    try {
        const response = await fetch(apiUrl);
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { skills, evidencesBySkill } = await response.json();

        let { unverifiedEvidences, verifiedEvidences } = evidencesBySkill;

        window.unverifiedEvidences = unverifiedEvidences;
        window.verifiedEvidences = verifiedEvidences;

        console.log(skills)
        buildSkills(skills);
        applyHexagonColors(skills);
    } catch (error) {
        console.error("Error fetching skills with evidences:", error);
    }
});

function applyHexagonColors(skillsData) {
    skillsData.forEach(skill => {
        const hexagon = document.querySelector(`.svg-wrapper[data-id="${skill.id}"] .hexagon`);

        if (hexagon) {
            hexagon.classList.remove('white', 'green');
            if (skill.isCompleted) {
                hexagon.classList.add('green');
            } else {
                hexagon.classList.add('white');
            }
        }
    });
}

function buildSkills(skillsData) {
    const svgContainer = document.querySelector('.svg-container');
    svgContainer.innerHTML = skillsData.map(skill => createSkillSVG(skill)).join('');
}

function createSkillSVG(skill) {

    const unverifiedCount = window.unverifiedEvidences[skill.id]?.length || 0;
    const verifiedCount = skill.verificationsCount || 0;
    console.log(unverifiedCount, verifiedCount);

    return `
    <div class="svg-wrapper" data-id="${skill.id}" onmouseover="showDescription('${skill.description}')" onmouseout="hideDescription()">
        <svg width="100" height="100" viewBox="0 0 100 100">
            <polygon id="hexagon-${skill.id}" points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" class="hexagon"></polygon>
            <text x="50%" y="20%" text-anchor="middle" fill="black" font-size="10">
                ${skill.text.split(' /').map(line => `<tspan x="50%" dy="1.2em" font-weight="bold">${line}</tspan>`).join('')}
            </text>
            <image x="35%" y="60%" width="30" height="30" href="/electronics/icons/${skill.icon}" />
            ${unverifiedCount > 0 ? `
                <circle cx="10" cy="20" r="10" fill="red"></circle>
                <text x="10" y="23" text-anchor="middle" fill="white" font-size="10">${unverifiedCount}</text>
            ` : ''}
            ${verifiedCount > 0 ? `
                <circle cx="90" cy="20" r="10" fill="green"></circle>
                <text x="90" y="23" text-anchor="middle" fill="white" font-size="10">${verifiedCount}</text>
            ` : ''}            
        </svg>
        <div class="icon-overlay">
                        ${window.isAdmin ? `<a href="/skills/${skill.set}/edit/${skill.id}"><i class="fas fa-pencil-alt"></i></a>` : ''}                                                
            <a href="/skills/${skill.set}/view?id=${skill.id}">
                <i class="fas fa-book book-icon"></i>
            </a>       
        </div>
    </div>
`;
}

window.showDescription = function(description) {
    const descriptionBox = document.getElementById('descriptionBox');
    descriptionBox.textContent = description;
}

window.hideDescription = function() {
    const descriptionBox = document.getElementById('descriptionBox');
    descriptionBox.textContent = "Hover any skill to see its description";
}