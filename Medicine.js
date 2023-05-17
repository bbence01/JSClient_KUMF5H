const api_url = 'http://localhost:5000/Medicine';

document.getElementById('medicineForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    let medicineName = document.getElementById('medicineName').value;
    let producerId = document.getElementById('producerId').value;

    let newMedicine = {
        medicineName: medicineName,
        producerId: producerId
    };

    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMedicine)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error creating medicine');
        }
    })
    .then(data => {
        e.target.reset(); 
        fetchMedicines(); 
    })
    .catch(error => console.error('Error:', error));
});

function fetchMedicines() {
    fetch(api_url)
        .then(response => response.json())
        .then(data => {
            displayMedicines(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayMedicines(data) {
    const medicineList = document.getElementById('medicine-list'); 
    medicineList.innerHTML = '';

    data.forEach(medicine => {
        const medicineItem = document.createElement('div');
        medicineItem.textContent = `Id: ${medicine.id}, Name: ${medicine.medicineName}, Producer ID: ${medicine.producerId}`;
        medicineList.appendChild(medicineItem);
    });
}

fetchMedicines();
