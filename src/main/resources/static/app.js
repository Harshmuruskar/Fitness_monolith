// API Base URL
const API_BASE_URL = 'http://localhost:8080/api/activities';

// DOM Elements
const activityForm = document.getElementById('activityForm');
const editForm = document.getElementById('editForm');
const activitiesContainer = document.getElementById('activitiesContainer');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const editModal = document.getElementById('editModal');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');

let currentEditId = null;
let allActivities = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    activityForm.addEventListener('submit', handleAddActivity);
    editForm.addEventListener('submit', handleEditActivity);
    refreshBtn.addEventListener('click', loadActivities);
    searchInput.addEventListener('input', handleSearch);
    closeBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
});

// Load all activities
async function loadActivities() {
    try {
        activitiesContainer.innerHTML = '<p class="loading">Loading activities...</p>';
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }

        allActivities = await response.json();
        displayActivities(allActivities);
    } catch (error) {
        console.error('Error loading activities:', error);
        activitiesContainer.innerHTML = '<p class="error">Error loading activities. Please try again.</p>';
    }
}

// Display activities
function displayActivities(activities) {
    if (activities.length === 0) {
        activitiesContainer.innerHTML = '<p class="empty-message">No activities found. Add one to get started!</p>';
        return;
    }

    activitiesContainer.innerHTML = activities.map(activity => createActivityCard(activity)).join('');
}

// Create activity card HTML
function createActivityCard(activity) {
    const startTime = new Date(activity.startTime).toLocaleString();
    const createdAt = new Date(activity.createdAt).toLocaleString();

    return `
        <div class="activity-card">
            <span class="activity-type">${activity.type}</span>

            <div class="activity-detail">
                <span class="activity-label">Duration:</span>
                <span class="activity-value">${activity.duration} minutes</span>
            </div>

            <div class="activity-detail">
                <span class="activity-label">Calories Burned:</span>
                <span class="activity-value">${activity.caloriesBurned}</span>
            </div>

            <div class="activity-detail">
                <span class="activity-label">Start Time:</span>
                <span class="activity-value">${startTime}</span>
            </div>

            <div class="activity-detail">
                <span class="activity-label">Created:</span>
                <span class="activity-value">${createdAt}</span>
            </div>

            <div class="activity-actions">
                <button class="btn btn-warning" onclick="openEditModal('${activity.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteActivity('${activity.id}')">Delete</button>
            </div>
        </div>
    `;
}

// Handle add activity
async function handleAddActivity(e) {
    e.preventDefault();

    const activity = {
        type: document.getElementById('activityType').value,
        duration: parseInt(document.getElementById('duration').value),
        caloriesBurned: parseInt(document.getElementById('caloriesBurned').value),
        startTime: document.getElementById('startTime').value
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activity)
        });

        if (!response.ok) {
            throw new Error('Failed to create activity');
        }

        const createdActivity = await response.json();
        console.log('Activity created:', createdActivity);

        activityForm.reset();
        loadActivities();
        showSuccess('Activity added successfully!');
    } catch (error) {
        console.error('Error creating activity:', error);
        showError('Failed to add activity. Please try again.');
    }
}

// Open edit modal
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch activity');
        }

        const activity = await response.json();
        currentEditId = id;

        // Populate form
        document.getElementById('editActivityType').value = activity.type;
        document.getElementById('editDuration').value = activity.duration;
        document.getElementById('editCaloriesBurned').value = activity.caloriesBurned;

        // Format datetime-local
        const startDateTime = new Date(activity.startTime).toISOString().slice(0, 16);
        document.getElementById('editStartTime').value = startDateTime;

        editModal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching activity:', error);
        showError('Failed to load activity for editing.');
    }
}

// Close edit modal
function closeEditModal() {
    editModal.style.display = 'none';
    currentEditId = null;
    editForm.reset();
}

// Handle edit activity
async function handleEditActivity(e) {
    e.preventDefault();

    const activity = {
        type: document.getElementById('editActivityType').value,
        duration: parseInt(document.getElementById('editDuration').value),
        caloriesBurned: parseInt(document.getElementById('editCaloriesBurned').value),
        startTime: document.getElementById('editStartTime').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activity)
        });

        if (!response.ok) {
            throw new Error('Failed to update activity');
        }

        const updatedActivity = await response.json();
        console.log('Activity updated:', updatedActivity);

        closeEditModal();
        loadActivities();
        showSuccess('Activity updated successfully!');
    } catch (error) {
        console.error('Error updating activity:', error);
        showError('Failed to update activity. Please try again.');
    }
}

// Delete activity
async function deleteActivity(id) {
    if (!confirm('Are you sure you want to delete this activity?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete activity');
        }

        console.log('Activity deleted:', id);
        loadActivities();
        showSuccess('Activity deleted successfully!');
    } catch (error) {
        console.error('Error deleting activity:', error);
        showError('Failed to delete activity. Please try again.');
    }
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allActivities.filter(activity =>
        activity.type.toLowerCase().includes(searchTerm) ||
        activity.duration.toString().includes(searchTerm) ||
        activity.caloriesBurned.toString().includes(searchTerm)
    );
    displayActivities(filtered);
}

// Show success message
function showSuccess(message) {
    showMessage(message, 'success');
}

// Show error message
function showError(message) {
    showMessage(message, 'error');
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;

    const container = document.querySelector('.form-section');
    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

