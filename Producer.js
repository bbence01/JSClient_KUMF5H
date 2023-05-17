// Change this URL to match your API
const api_url = 'http://localhost:5000/Producer';


function displayProducers(data) {
    const producerList = document.getElementById('producer-list'); // Assuming you have a div with id 'producer-list' in your HTML.

    // Clear the list first.
    producerList.innerHTML = '';

    // Append each producer to the list.
    data.forEach(producer => {
        const producerItem = document.createElement('div');
        producerItem.textContent = `Id: ${producer.id}, Name: ${producer.producerName}, Location: ${producer.location}`;
        producerList.appendChild(producerItem);
    });
}


// Fetch data from the API
fetchProducers();

// Function to Fetch Producers from the API
function fetchProducers() {
    fetch(api_url)
        .then(response => response.json())
        .then(data => {
            displayProducers(data);
            attachButtonListeners();  // Attach event listeners after displaying producers.
        })
        .catch(error => console.error('Error:', error));
}

function attachButtonListeners() {
    // Attach event listener to edit buttons.
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            editProducer(id);
        });
    });

    // Attach event listener to delete buttons.
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            deleteProducer(id);
        });
    });
}


// Function to display Producer details
function displayProducers(data) {
    const producerList = document.getElementById('producer-list'); 

    producerList.innerHTML = '';

    data.forEach(producer => {
        const producerItem = document.createElement('div');
        producerItem.innerHTML = `
            Id: ${producer.id}, 
            Name: ${producer.producerName}, 
            Location: ${producer.location} 
            <button class="edit-button" data-id="${producer.id}">Edit</button>
            <button class="delete-button" data-id="${producer.id}">Delete</button>
        `;

        producerList.appendChild(producerItem);
    });
}


// Function to create a new producer
document.getElementById('producerForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    let producerName = document.getElementById('producerName').value;
    let location = document.getElementById('location').value;

    let newProducer = {
        ProducerName: producerName,
        Location: location
    };

    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProducer)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error creating producer');
        }
    })
    .then(data => {
        e.target.reset(); // clear the form
        fetchProducers(); // refresh the producers list AFTER the new producer has been saved
    })
    .catch(error => console.error('Error:', error));
    location.reload(); 

});




// Function to delete a producer
function deleteProducer(id) {
    fetch(`${api_url}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('Producer deleted successfully!');
            fetchProducers();  // Fetch producers again to update the list.
        } else {
            alert('Error: Could not delete producer.');
        }
    })
    .catch(error => console.error('Error:', error));

   

}


 // Function to edit a producer
 function editProducer(id) {
    // Fetch the current data of the producer.
    fetch(`${api_url}/${id}`)
    .then(response => response.json())
    .then(data => {
        // Get the first element of the data array
        let producer = data[0];

        // Now you can access producerName and location
        producerForm.innerHTML = `
            <input type="text" id="producer-name" value="${producer.producerName}">
            <input type="text" id="producer-location" value="${producer.location}">
            <button type="submit" id="submit-btn">Submit</button>
            <button type="button" id="cancel-btn">Cancel</button>

        `;
        document.getElementById('submit-btn').addEventListener('click', function() {
            location.reload();
        });
        document.getElementById('cancel-btn').addEventListener('click', function() {
            location.reload();
        });

            // Attach an event listener to the form.
            producerForm.addEventListener('submit', (event) => {
                event.preventDefault();  // Prevent the form from being submitted normally.

                // Create a producer object with the updated data.
                const updatedProducer = {
                    id: id,
                    producerName: document.getElementById('producer-name').value,
                    location: document.getElementById('producer-location').value
                };

                // Send a PUT request with the updated data.
                fetch(`${api_url}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProducer),
                })
                .then(response => {
                    if (response.ok) {
                        alert('Producer updated successfully!');
                        fetchProducers();  // Fetch producers again to update the list.
                    } else {
                        alert('Error: Could not update producer.');
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}

