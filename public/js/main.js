import skillsData from '../data/skills.js';

document.addEventListener("DOMContentLoaded", () => {
    buildSkills(skillsData);
});

function buildSkills(skillsData) {
    const svgContainer = document.querySelector('.svg-container');
    svgContainer.innerHTML = skillsData.map(skill => createSkillSVG(skill)).join('');

}

function createSkillSVG(skill) {

    const unverifiedCount = localStorage.getItem('unverifiedEvidenceCount') || 0;

    // Hago un "React-like", jaja
    // Devuelvo el svg a modo de "componente" (más o menos...)
    return `
        <div class="svg-wrapper" data-id="${skill.id}" onmouseover="showDescription('${skill.description}')" onmouseout="hideDescription()">
            <svg width="100" height="100" viewBox="0 0 100 100">
                <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" class="hexagon"></polygon>
                <text x="50%" y="20%" text-anchor="middle" fill="black" font-size="10">
                    ${skill.text.split(' /').map(line => `<tspan x="50%" dy="1.2em" font-weight="bold">${line}</tspan>`).join('')}
                </text>
                <image x="35%" y="60%" width="30" height="30" href="electronics/icons/${skill.icon}" />
                ${skill.unverifiedCount > 0 ? `
                    <circle cx="10" cy="10" r="10" fill="red"></circle>
                    <text x="10" y="15" text-anchor="middle" fill="white" font-size="10">${skill.unverifiedCount}</text>
                ` : ''}
            </svg>
            <div class="icon-overlay">
            <!-- Iconos de lapiz y cuaderno, unitilizo font awesome simplemente, con js -->
                <i class="fas fa-pencil-alt"></i>
                <a href="skill-template.html?id=${skill.id}">
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