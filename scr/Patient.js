// Change this URL to match your API
const api_url = 'http://localhost:5000/Patient';


const  connection2 = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/hub") // replace with your SignalR Hub URL
    .build();




    connection2.start()
    .then(() => console.log("Connected!"))
    .catch(err => console.log(err));


function displayPatients(data) {
    const patientList = document.getElementById('patient-list');

    patientList.innerHTML = '';

    data.forEach(patient => {
        const patientItem = document.createElement('div');
        patientItem.innerHTML = `
            Id: ${patient.id}, 
            Name: ${patient.patientName}, 
            illness: ${patient.illness} ,
            MedicineID: ${patient.medicineID} 
            <button class="edit-button" data-id="${patient.id}">Edit</button>
            <button class="delete-button" data-id="${patient.id}">Delete</button>
        `;

        patientList.appendChild(patientItem);
    });
}

fetchPatients();


connection2.on("PatientCreated", (patient) => {
    fetchPatients(); // Refetch producers after a new one is created
});
connection2.on("PatientUpdated", (patient) => {
    fetchPatients(); // Refetch producers after a new one is created
});
connection2.on("PatientDeleted", (patient) => {
    fetchPatients(); // Refetch producers after a new one is created
});

function fetchPatients() {
    fetch(api_url)
        .then(response => response.json())
        .then(data => {
            displayPatients(data);
            attachButtonListeners();
        })
        .catch(error => console.error('Error:', error));
}

function attachButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            editPatient(id);
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            deletePatient(id);
        });
    });
}

document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    let patientName = document.getElementById('patientName').value;
    let illness = document.getElementById('illness').value;

    let newPatient = {
        PatientName: patientName,
        Illness: illness
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
    location.reload();
});

function deletePatient(id) {
    fetch(`${api_url}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('Patient deleted successfully!');
            fetchPatients();
        } else {
            alert('Error: Could not delete patient.');
        }
    })
    .catch(error => console.error('Error:', error));
}

function editPatient(id) {
    fetch(`${api_url}/${id}`)
    .then(response => response.json())
    .then(data => {
        let patient = data[0];

        let patientForm = document.getElementById('patientForm');
        patientForm.innerHTML = `
            <label for="patientName">Patient Name:</label>
            <input type="text" id="patientName" value="${patient.patientName}" required>
            <label for="illness">illness:</label>
            <input type="text" id="illness" value="${patient.illness}" required>
            <label for="medicineID">medicineID:</label>
            <input type="text" id="medicineID" value="${patient.medicineID}" required>
           
            <button type="submit" id="update-btn">Update</button>
            <button type="button" id="cancel-btn">Cancel</button>
        `;

        document.getElementById('update-btn').addEventListener('click', function(event) {
            event.preventDefault();

            const updatedPatient = {
                id: id,
                patientName: document.getElementById('patientName').value,
                illness: document.getElementById('illness').value
            };

            fetch(`${api_url}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPatient),
            })
            .then(response => {
                if (response.ok) {
                    alert('Patient updated successfully!');
                    location.reload();
                } else {
                    alert('Error: Could not update patient.');
                }
            })
            .catch(error => console.error('Error:', error));
        });

        document.getElementById('cancel-btn').addEventListener('click', function() {
            location.reload();
        });
    })
    .catch(error => console.error('Error:', error));
}
