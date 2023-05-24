const api_url = 'http://localhost:5000/Medicine';


const  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/hub") // replace with your SignalR Hub URL
    .build();

    connection.start()
    .then(() => console.log("Connected!"))
    .catch(err => console.log(err));

function displayMedicines(data) {
    const medicineList = document.getElementById('medicine-list');
    medicineList.innerHTML = '';

    data.forEach(medicine => {
        const medicineItem = document.createElement('div');
        medicineItem.innerHTML = `
            Id: ${medicine.id}, 
            Medicine Name: ${medicine.medicineName}, 
            Base Price: ${medicine.basePrice}, 
            Producer: ${medicine.producerID}, 
            Heals: ${medicine.heals} 
            <button class="edit-button" data-id="${medicine.id}">Edit</button>
            <button class="delete-button" data-id="${medicine.id}">Delete</button>
        `;

        medicineList.appendChild(medicineItem);
    });
}


connection.on("MedicineCreated", (medicine) => {
    fetchMedicines(); // Refetch producers after a new one is created
});
connection.on("MedicineUpdated", (medicine) => {
    fetchMedicines(); // Refetch producers after a new one is created
});
connection.on("MedicineDeleted", (medicine) => {
    fetchMedicines(); // Refetch producers after a new one is created
});

function fetchMedicines() {
    fetch(api_url)
        .then(response => response.json())
        .then(data => {
            displayMedicines(data);
            attachButtonListeners();
        })
        .catch(error => console.error('Error:', error));
}

function attachButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            editMedicine(id);
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            deleteMedicine(id);
        });
    });
}

document.getElementById('medicineForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    let medicineName = document.getElementById('medicineName').value;
    let basePrice = document.getElementById('basePrice').value;
    let producerID = document.getElementById('producerID').value;
    let heals = document.getElementById('heals').value;

    let newMedicine = {
        MedicineName: medicineName,
        BasePrice: basePrice,
        ProducerID: producerID,
        Heals: heals
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
    .then(() => location.reload()) // move location.reload() here
    .catch(error => console.error('Error:', error));
});

function deleteMedicine(id) {
    fetch(`${api_url}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('Medicine deleted successfully!');
            fetchMedicines();
        } else {
            alert('Error: Could not delete medicine.');
        }
    })
    .catch(error => console.error('Error:', error));
}

function editMedicine(id) {
    fetch(`${api_url}/${id}`)
        .then(response => response.json())
        .then(data => {
            let medicine = data[0];

            let medicineForm = document.getElementById('medicineForm');
            medicineForm.innerHTML = `
                <input type="text" id="medicineName" value="${medicine.medicineName}">
                <input type="number" id="basePrice" value="${medicine.basePrice}">
                <input type="number" id="producerID" value="${medicine.producerID}">
                <input type="text" id="heals" value="${medicine.heals}">
                <button type="submit" id="update-btn">Update</button>
                <button type="button" id="cancel-btn">Cancel</button>
            `;

            document.getElementById('update-btn').addEventListener('click', function(event) {
                event.preventDefault();

                const updatedMedicine = {
                    id: id,
                    medicineName: document.getElementById('medicineName').value,
                    basePrice: document.getElementById('basePrice').value,
                    producerID: document.getElementById('producerID').value,
                    heals: document.getElementById('heals').value
                };

                fetch(`${api_url}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedMedicine),
                })
                .then(response => {
                    if (response.ok) {
                        alert('Medicine updated successfully!');
                    } else {
                        alert('Error: Could not update medicine.');
                    }
                })
                .then(() => location.reload()) // move location.reload() here
                .catch(error => console.error('Error:', error));
            });

            document.getElementById('cancel-btn').addEventListener('click', function() {
                location.reload();
            });
        })
        .catch(error => console.error('Error:', error));
}


fetchMedicines();
