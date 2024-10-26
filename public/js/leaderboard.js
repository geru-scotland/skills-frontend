import badgesData from '../data/badges.js';

function loadBadgeTable() {
    const tableBody = document.getElementById('badgeTableBody');

    badgesData.forEach(badge => {
        const row = document.createElement('tr');

        const rangeCell = document.createElement('td');
        rangeCell.textContent = badge.rango;
        row.appendChild(rangeCell);

        const badgeCell = document.createElement('td');
        const badgeImg = document.createElement('img');
        badgeImg.src = `badges/${badge.png.replace('.png', '-min.png')}`;
        badgeImg.alt = badge.rango;
        badgeCell.appendChild(badgeImg);
        row.appendChild(badgeCell);

        const bitpointsCell = document.createElement('td');
        bitpointsCell.textContent = `${badge.bitpoints_min} - ${badge.bitpoints_max}`;
        row.appendChild(bitpointsCell);

        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', loadBadgeTable);
