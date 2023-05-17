const api_url = 'http://localhost:5000/Stat'; // Base API URL

document.getElementById('averageByProducers').addEventListener('click', () => fetchData('AvarageByProducers'));
document.getElementById('highestMedicineByProducer').addEventListener('click', () => fetchData('HighestMedicineByProducer'));
document.getElementById('getThreatment').addEventListener('click', () => fetchData('GetThreatment'));
document.getElementById('getProducerWithSameMedicine').addEventListener('click', () => fetchData('GetProducerwithsamemedicine'));
document.getElementById('getCovidCure').addEventListener('click', () => fetchData('GetCovidcure'));
document.getElementById('getLocations').addEventListener('click', () => fetchData('GetLocations'));

function fetchData(endpoint) {
    fetch(`${api_url}/${endpoint}`)
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(error => console.error('Error:', error));
}

function displayData(data) {
    const statDetails = document.getElementById('statDetails');
    let html = '';

    if (Array.isArray(data) && data.length > 0) {
        // Create table header
        html += '<table>';
        html += '<thead><tr>';
        for (let key in data[0]) {
            html += `<th>${key}</th>`;
        }
        html += '</tr></thead>';

        // Create table body
        html += '<tbody>';
        for (let item of data) {
            html += '<tr>';
            for (let key in item) {
                html += `<td>${item[key]}</td>`;
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
    } else {
        html = 'No data to display';
    }

    statDetails.innerHTML = html;
}

