document.addEventListener('DOMContentLoaded', () => {
    const destinationNameInput = 
    document.getElementById('destination-name-input');
    const addDestinationBtn = document.getElementById('add-destination-btn');
    const baseMapImage = document.getElementById('base-map-image');
    const mapHotspotsContainer = document.getElementById('map-hotspots');
    const destinationsListEl = document.getElementById('destinations-list');
    const noDestinationsMessage = 
    document.getElementById('no-destinations-message');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');
    let destinations = [];
    let selectedDestinationId = null; // To highlight active hotspot/checklist
    /**
     * @param {string} message - The message to display.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }
    function hideMessage() {
        messageBox.style.display = 'none';
    }
    /**
     * @returns {string} A unique ID.
     */
    function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace
    (/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 
            'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    function loadDestinations() {
        const storedDestinations = 
        localStorage.getItem('travelPlannerDestinations');
        if (storedDestinations) {
            destinations = JSON.parse(storedDestinations);
        }
        renderAll(); // Render everything after loading
    }
    function saveDestinations() {
        localStorage.setItem('travelPlannerDestinations', 
            JSON.stringify(destinations));
    }
    function renderDestinations() {
        destinationsListEl.innerHTML = ''; // Clear existing list
        if (destinations.length === 0) {
            noDestinationsMessage.style.display = 'block';
        } else {
            noDestinationsMessage.style.display = 'none';
            destinations.forEach(destination => {
                const destinationCard = document.createElement('div');
                destinationCard.classList.add('destination-card');
                destinationCard.dataset.destinationId = destination.id;
                destinationCard.innerHTML = `
                    <div class="destination-header">
                        <h3>${destination.name}</h3>
     <button class="delete-destination-btn" 
     data-destination-id="${destination.id}">Excluir Destino</button>
                    </div>
                    <div class="add-checklist-item-group">
    <input type="text" class="checklist-item-input" 
    placeholder="Novo item da checklist">
    <button class="add-checklist-item-btn" 
    data-destination-id="${destination.id}">Adicionar Item</button>
                    </div>
    <ul class="checklist-items-list" id="checklist-${destination.id}">
    <!-- Checklist items will be rendered here -->
                    </ul>
                `;
                destinationsListEl.appendChild(destinationCard);
                renderChecklist(destination.id);
            });
        }
        attachDestinationEventListeners();
    }
    /**
     * @param {string} destinationId - The ID of the destination.
     */
    function renderChecklist(destinationId) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
     const checklistListEl = 
     document.getElementById(`checklist-${destinationId}`);
        if (!checklistListEl) return;
        checklistListEl.innerHTML = ''; // Clear existing items
        if (destination.checklist.length === 0) {
            const emptyItem = document.createElement('p');
            emptyItem.textContent = 'Nenhum item na checklist ainda.';
            emptyItem.classList.add('empty-message');
            checklistListEl.appendChild(emptyItem);
        } else {
            destination.checklist.forEach(item => {
                const checklistItemEl = document.createElement('li');
                checklistItemEl.classList.add('checklist-item');
                if (item.completed) {
                    checklistItemEl.classList.add('completed');
                }
                checklistItemEl.dataset.itemId = item.id;
                checklistItemEl.innerHTML = `
    <input type="checkbox" ${item.completed ? 'checked' : ''} 
    data-item-id="${item.id}" data-destination-id="${destination.id}">
    <span class="checklist-item-text">${item.text}</span>
     <button class="delete-checklist-item-btn" data-item-id="${item.id}" 
     data-destination-id="${destination.id}">X</button>
                `;
                checklistListEl.appendChild(checklistItemEl);
            });
        }
        attachChecklistEventListeners(destinationId);
    }
    function attachDestinationEventListeners() {
        document.querySelectorAll('.delete-destination-btn').forEach
        (button => {
            button.onclick = (e) => deleteDestination
            (e.target.dataset.destinationId);
        });
        document.querySelectorAll('.add-checklist-item-btn').forEach
        (button => {
            button.onclick = (e) => {
                const destinationId = e.target.dataset.destinationId;
                const inputEl = e.target.previousElementSibling; // The input field
                addChecklistItem(destinationId, inputEl.value);
                inputEl.value = ''; // Clear input
            };
        });
        document.querySelectorAll('.checklist-item-input').forEach
        (input => {
            input.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    const destinationId = 
                    e.target.nextElementSibling.dataset.destinationId; // The button
                    addChecklistItem(destinationId, e.target.value);
                    e.target.value = ''; // Clear input
                }
            };
        });
    }
    /**
     * @param {string} destinationId - The ID of the destination whose checklist items to attach listeners to.
     */
    function attachChecklistEventListeners(destinationId) {
        const checklistListEl = 
        document.getElementById(`checklist-${destinationId}`);
        if (!checklistListEl) return;
        checklistListEl.querySelectorAll
        ('input[type="checkbox"]').forEach(checkbox => {
            checkbox.onchange = (e) => toggleChecklistItem
            (e.target.dataset.destinationId, e.target.dataset.itemId);
        });
        checklistListEl.querySelectorAll
        ('.delete-checklist-item-btn').forEach(button => {
            button.onclick = (e) => 
                deleteChecklistItem(e.target.dataset.destinationId, 
                    e.target.dataset.itemId);
        });
    }
    function renderMapHotspots() {
        mapHotspotsContainer.innerHTML = ''; // Clear existing hotspots
        const mapWidth = baseMapImage.offsetWidth;
        const mapHeight = baseMapImage.offsetHeight;
        destinations.forEach((destination, index) => {
            if (destination.x === undefined || 
                destination.y === undefined) {
                destination.x = Math.random(); // 0 to 1 percentage
                destination.y = Math.random(); // 0 to 1 percentage
            }
            const hotspot = document.createElement('div');
            hotspot.classList.add('map-hotspot');
            hotspot.dataset.destinationId = destination.id;
            hotspot.style.left = `${destination.x * 100}%`;
            hotspot.style.top = `${destination.y * 100}%`;
            hotspot.textContent = index + 1; // Display a number on the hotspot
            if (selectedDestinationId === destination.id) {
                hotspot.classList.add('active');
            }
            hotspot.onclick = () => selectDestination(destination.id);
            mapHotspotsContainer.appendChild(hotspot);
        });
    }
    /**
     * @param {string} destinationId - The ID of the destination to select.
     */
    function selectDestination(destinationId) {
        selectedDestinationId = destinationId;
        renderMapHotspots(); // Re-render to update active state
        const destinationCard = document.querySelector
        (`.destination-card[data-destination-id="${destinationId}"]`);
        if (destinationCard) {
            destinationCard.scrollIntoView
            ({ behavior: 'smooth', block: 'center' });
            destinationCard.style.outline = '2px solid #007bff';
            setTimeout(() => {
                destinationCard.style.outline = 'none';
            }, 1000);
        }
    }
    function addDestination() {
        const name = destinationNameInput.value.trim();
        if (name === '') {
            showMessage('Por favor, digite um nome para o destino.');
            return;
        }
        const newDestination = {
            id: generateUUID(),
            name: name,
            checklist: []
        };
        destinations.push(newDestination);
        saveDestinations();
        renderAll();
        destinationNameInput.value = '';
        showMessage(`Destino "${name}" adicionado!`);
    }
    /**
     * Deletes a destination and its associated checklist.
     * @param {string} destinationId - The ID of the destination to delete.
     */
    function deleteDestination(destinationId) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
if (confirm(`Tem certeza que deseja excluir o destino "${destination.name}
    " e sua checklist?`)) {
            destinations = destinations.filter(d => d.id !== destinationId);
            if (selectedDestinationId === destinationId) {
                selectedDestinationId = null; // Deselect if deleted
            }
            saveDestinations();
            renderAll();
            showMessage(`Destino "${destination.name}" excluído.`);
        }
    }
    /**
     * Adds a new item to a destination's checklist.
     * @param {string} destinationId - The ID of the destination.
     * @param {string} itemText - The text for the checklist item.
     */
    function addChecklistItem(destinationId, itemText) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        const text = itemText.trim();
        if (text === '') {
            showMessage('Por favor, digite um item para a checklist.');
            return;
        }
        destination.checklist.push({
            id: generateUUID(),
            text: text,
            completed: false
        });
        saveDestinations();
        renderChecklist(destinationId);
        showMessage('Item adicionado à checklist!');
    }
    /**
     * Toggles the completion status of a checklist item.
     * @param {string} destinationId - The ID of the destination.
     * @param {string} itemId - The ID of the checklist item.
     */
    function toggleChecklistItem(destinationId, itemId) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        const item = destination.checklist.find(i => i.id === itemId);
        if (item) {
            item.completed = !item.completed;
            saveDestinations();
            renderChecklist(destinationId); // Re-render to update visual state
        }
    }
    /**
     * Deletes a checklist item.
     * @param {string} destinationId - The ID of the destination.
     * @param {string} itemId - The ID of the checklist item.
     */
    function deleteChecklistItem(destinationId, itemId) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        destination.checklist = destination.checklist.filter
        (item => item.id !== itemId);
        saveDestinations();
        renderChecklist(destinationId);
        showMessage('Item da checklist excluído.');
    }
    function renderAll() {
        renderDestinations();
        renderMapHotspots();
    }
    addDestinationBtn.addEventListener('click', addDestination);
    destinationNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addDestinationBtn.click();
        } 
    });
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });
    baseMapImage.onload = loadDestinations;
    if (baseMapImage.complete) { // If image is already cached
        loadDestinations();
    }
});
