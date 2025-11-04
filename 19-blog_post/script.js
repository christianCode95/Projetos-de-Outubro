document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const postTitleInput = document.getElementById('post-title');
    const postContentTextarea = document.getElementById('post-content');
    const postCategorySelect = document.getElementById('post-category');
    const publishPostBtn = document.getElementById('publish-post-btn');

    const newCategoryNameInput = document.getElementById('new-category-name');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const categoriesListUl = document.getElementById('categories-list');

    const filterCategorySelect = document.getElementById('filter-category');
    const postsListDiv = document.getElementById('posts-list');

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // --- Data Structures ---
    // Stores categories as strings
    let categories = [];
    // Stores posts as objects: { id: string, title: string, content: string, category: string, date: string }
    let posts = [];

    // --- Helper Functions ---

    /**
     * Generates a unique ID for a post.
     * @returns {string} A unique post ID.
     */
    function generatePostId() {
        return `post-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    /**
     * Generates a unique ID for a category.
     * @returns {string} A unique category ID.
     */
    function generateCategoryId() {
        return `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    /**
     * Displays a message box with a given message.
     * @param {string} message - The message to display.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    /**
     * Hides the message box.
     */
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    /**
     * Renders the list of categories in the UI and updates select options.
     */
    function renderCategories() {
        categoriesListUl.innerHTML = ''; // Clear existing list
        postCategorySelect.innerHTML = '<option value="">Selecione uma categoria</option>'; // Clear post category select
        filterCategorySelect.innerHTML = '<option value="all">Todas as Categorias</option>'; // Clear filter category select

        if (categories.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('empty-message');
            emptyMessage.textContent = 'Nenhuma categoria adicionada.';
            categoriesListUl.appendChild(emptyMessage);
        } else {
            categories.forEach(category => {
                // Render in categories list
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="category-name">${category.name}</span>
                    <button class="delete-category-btn" data-category-id="${category.id}">Remover</button>
                `;
                categoriesListUl.appendChild(li);

                // Add to post category select
                const optionPost = document.createElement('option');
                optionPost.value = category.id;
                optionPost.textContent = category.name;
                postCategorySelect.appendChild(optionPost);

                // Add to filter category select
                const optionFilter = document.createElement('option');
                optionFilter.value = category.id;
                optionFilter.textContent = category.name;
                filterCategorySelect.appendChild(optionFilter);
            });
        }
    }

    /**
     * Renders the list of posts based on the current filter.
     */
    function renderPosts() {
        postsListDiv.innerHTML = ''; // Clear existing posts
        const selectedCategoryId = filterCategorySelect.value;

        const filteredPosts = selectedCategoryId === 'all'
            ? posts
            : posts.filter(post => post.category === selectedCategoryId);

        if (filteredPosts.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.classList.add('empty-message');
            emptyMessage.textContent = 'Nenhuma publicação encontrada para esta categoria.';
            postsListDiv.appendChild(emptyMessage);
            return;
        }

        filteredPosts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.dataset.postId = post.id;

            const categoryName = categories.find(cat => cat.id === post.category)?.name || 'Sem Categoria';
            const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p class="post-meta">Categoria: ${categoryName} | Publicado em: ${formattedDate}</p>
                <p class="post-content-preview">${post.content}</p>
                <div class="post-actions">
                    <button class="action-button edit-post-btn" data-post-id="${post.id}">Editar</button>
                    <button class="action-button delete-post-btn" data-post-id="${post.id}">Excluir</button>
                </div>
            `;
            postsListDiv.appendChild(postCard);
        });
    }

    /**
     * Saves categories and posts to localStorage.
     */
    function saveData() {
        localStorage.setItem('miniCmsCategories', JSON.stringify(categories));
        localStorage.setItem('miniCmsPosts', JSON.stringify(posts));
    }

    /**
     * Loads categories and posts from localStorage.
     */
    function loadData() {
        const savedCategories = localStorage.getItem('miniCmsCategories');
        const savedPosts = localStorage.getItem('miniCmsPosts');

        if (savedCategories) {
            categories = JSON.parse(savedCategories);
        }
        if (savedPosts) {
            posts = JSON.parse(savedPosts);
        }
    }

    // --- Event Handlers ---

    /**
     * Handles adding a new category.
     */
    function handleAddCategory() {
        const name = newCategoryNameInput.value.trim();
        if (!name) {
            showMessage('Por favor, insira um nome para a categoria.');
            return;
        }

        // Check if category already exists (case-insensitive)
        if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            showMessage('Esta categoria já existe!');
            return;
        }

        const newCategory = { id: generateCategoryId(), name: name };
        categories.push(newCategory);
        saveData();
        renderCategories();
        newCategoryNameInput.value = '';
        showMessage(`Categoria "${name}" adicionada!`);
    }

    /**
     * Handles deleting a category.
     * @param {string} categoryId - The ID of the category to delete.
     */
    function handleDeleteCategory(categoryId) {
        if (confirm('Tem certeza que deseja remover esta categoria? Todas as publicações associadas a ela ficarão sem categoria.')) {
            categories = categories.filter(cat => cat.id !== categoryId);
            
            // Update posts that were in this category
            posts.forEach(post => {
                if (post.category === categoryId) {
                    post.category = ''; // Set to empty string or a default 'Uncategorized' ID
                }
            });

            saveData();
            renderCategories(); // Re-render categories dropdowns
            renderPosts(); // Re-render posts to reflect category changes
            showMessage('Categoria removida com sucesso!');
        }
    }

    /**
     * Handles publishing a new post or updating an existing one.
     */
    function handlePublishPost() {
        const title = postTitleInput.value.trim();
        const content = postContentTextarea.value.trim();
        const categoryId = postCategorySelect.value;

        if (!title || !content) {
            showMessage('Por favor, preencha o título e o conteúdo da publicação.');
            return;
        }
        if (!categoryId) {
            showMessage('Por favor, selecione uma categoria para a publicação.');
            return;
        }

        const postId = publishPostBtn.dataset.editingPostId; // Check if we are editing an existing post

        if (postId) {
            // Editing existing post
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                posts[postIndex].title = title;
                posts[postIndex].content = content;
                posts[postIndex].category = categoryId;
                showMessage('Publicação atualizada com sucesso!');
            }
            publishPostBtn.textContent = 'Publicar'; // Reset button text
            delete publishPostBtn.dataset.editingPostId; // Remove editing flag
        } else {
            // Creating new post
            const newPost = {
                id: generatePostId(),
                title: title,
                content: content,
                category: categoryId,
                date: new Date().toISOString() // Store date as ISO string
            };
            posts.unshift(newPost); // Add to the beginning of the array
            showMessage('Publicação criada com sucesso!');
        }

        saveData();
        renderPosts(); // Re-render posts list
        postTitleInput.value = ''; // Clear form
        postContentTextarea.value = '';
        postCategorySelect.value = ''; // Reset category select
    }

    /**
     * Handles editing a post. Fills the form with post data.
     * @param {string} postId - The ID of the post to edit.
     */
    function handleEditPost(postId) {
        const postToEdit = posts.find(post => post.id === postId);
        if (postToEdit) {
            postTitleInput.value = postToEdit.title;
            postContentTextarea.value = postToEdit.content;
            postCategorySelect.value = postToEdit.category;
            publishPostBtn.textContent = 'Atualizar Publicação';
            publishPostBtn.dataset.editingPostId = postId; // Store ID of post being edited
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see the form
        }
    }

    /**
     * Handles deleting a post.
     * @param {string} postId - The ID of the post to delete.
     */
    function handleDeletePost(postId) {
        if (confirm('Tem certeza que deseja excluir esta publicação?')) {
            posts = posts.filter(post => post.id !== postId);
            saveData();
            renderPosts();
            showMessage('Publicação excluída com sucesso!');
        }
    }

    // --- Event Listeners ---
    addCategoryBtn.addEventListener('click', handleAddCategory);
    publishPostBtn.addEventListener('click', handlePublishPost);
    filterCategorySelect.addEventListener('change', renderPosts); // Re-render posts on filter change

    // Event delegation for dynamically created category delete buttons
    categoriesListUl.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-category-btn')) {
            const categoryId = e.target.dataset.categoryId;
            handleDeleteCategory(categoryId);
        }
    });

    // Event delegation for dynamically created post action buttons (edit/delete)
    postsListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-post-btn')) {
            const postId = e.target.dataset.postId;
            handleEditPost(postId);
        } else if (e.target.classList.contains('delete-post-btn')) {
            const postId = e.target.dataset.postId;
            handleDeletePost(postId);
        }
    });

    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // --- Initialization ---
    loadData(); // Load any saved data
    renderCategories(); // Render categories first to populate selects
    renderPosts(); // Then render posts
});
