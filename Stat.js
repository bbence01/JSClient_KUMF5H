const api_url = 'http://localhost:5000/Stat'; // Base API URL

document.getElementById('averagePrice').addEventListener('click', () => fetchData('AveragePrice'));
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
    statDetails.innerHTML = JSON.stringify(data, null, 2); // Display data in JSON format with indentation
}
