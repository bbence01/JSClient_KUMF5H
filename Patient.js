const api_url = 'http://localhost:5000/Patient';

document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    let patientName = document.getElementById('patientName').value;
    let age = document.getElementById('age').value;

    let newPatient = {
        patientName: patientName,
        age: age
    };

    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPatient)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error creating patient');
        }
    })
    .then(data => {
        e.target.reset(); 
        fetchPatients(); 
    })
    .catch(error => console.error('Error:', error));
});

function fetchPatients() {
    fetch(api_url)
        .then(response => response.json())
        .then(data => {
            displayPatients(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayPatients(data) {
    const patientList = document.getElementById('patient-list'); 
    patientList.innerHTML = '';

    data.forEach(patient => {
        const patientItem = document.createElement('div');
        patientItem.textContent = `Id: ${patient.id}, Name: ${patient.patientName}, Age: ${patient.age}`;
        patientList.appendChild(patientItem);
    });
}

fetchPatients();
