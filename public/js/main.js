// TODO: Preparar bien rutas, quitar esta chapuza que me está dando urticaria de verlo.
// Quizá alias con node etc, config en package + @root o similar. Echar un ojillo.
// NO utilizar nada de TS, va más allá del contexto dl proyecto.


import skillsData from '../data/skills.js';

document.addEventListener("DOMContentLoaded", () => {
    buildSkills(skillsData);
});

function buildSkills(skillsData) {
    const svgContainer = document.querySelector('.svg-container');
    svgContainer.innerHTML = skillsData.map(skill => createSkillSVG(skill)).join('');
}

function createSkillSVG(skill) {
    return `
        <div class="svg-wrapper" data-id="${skill.id}" data-custom="false">
            <svg width="100" height="100" viewBox="0 0 100 100">
                <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" class="hexagon"></polygon>
                <text x="50%" y="20%" text-anchor="middle" fill="black" font-size="10">
                    ${skill.text.split(' /').map(line => `<tspan x="50%" dy="1.2em" font-weight="bold">${line}</tspan>`).join('')}
                </text>
                <image x="35%" y="60%" width="30" height="30" href="electronics/icons/${skill.icon}" />
            </svg>
        </div>
    `;
}
