document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const resumePreviewArea = document.getElementById('resume-preview-area');
    const addSectionButtons = document.querySelectorAll('.add-section-btn');
    const exportHtmlBtn = document.getElementById('export-html-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const exportResumeTemplate = document.getElementById
    ('export-resume-template');
    const emptyMessage = document.querySelector('.empty-message');
    let resumeData = []; // Array of section objects
    let sectionCounter = 0; // To generate unique IDs for sections
    let draggedSection = null;
    /**
     * Generates a unique ID for a section.
     * @returns {string} Unique section ID.
     */
    function generateSectionId() {
        return `section-${sectionCounter++}`;
    }
    function renderResumeSections() {
        resumePreviewArea.innerHTML = ''; // Clear existing sections
        if (resumeData.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
        }
        resumeData.forEach(section => {
            const sectionEl = createSectionElement
            (section.id, section.type, section.title, 
                section.content, section.items);
            resumePreviewArea.appendChild(sectionEl);
            attachSectionEventListeners(sectionEl);
        });
    }
    /**
     * Creates a DOM element for a resume section.
     * @param {string} id - The unique ID of the section.
     * @param {string} type - The type of the section (e.g., 'personal', 'education').
     * @param {string} title - The display title of the section.
     * @param {string} content - Main text content for simple sections.
     * @param {Array} items - Array of items for repeatable sections (e.g., education, experience).
     * @returns {HTMLElement} The created section DOM element.
     */
    function createSectionElement(id, type, title, content = '', 
        items = []) {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('resume-section');
        sectionDiv.id = id;
        sectionDiv.dataset.type = type;
        sectionDiv.setAttribute('draggable', 'true'); // Make sections draggable
        let contentHtml = '';
        if (type === 'personal') {
            contentHtml = `
 <input type="text" class="field-name" placeholder="Nome Completo" 
 value="${content.name || ''}">
                <input type="email" class="field-email" 
                placeholder="Email" value="${content.email || ''}">
                <input type="tel" class="field-phone" 
                placeholder="Telefone" value="${content.phone || ''}">
                <input type="text" class="field-linkedin" 
      placeholder="LinkedIn URL" value="${content.linkedin || ''}">
                <input type="text" class="field-location" 
    placeholder="Localização (Cidade, Estado)" 
    value="${content.location || ''}">
            `;
        } else if (type === 'summary' || type === 'custom') {
            contentHtml = `<textarea class="field-content" 
            placeholder="Digite seu ${title.toLowerCase()}...">
            ${content}</textarea>`;
        } else if (type === 'education' || type === 'experience' || 
            type === 'projects' || type === 'languages' || 
            type === 'skills') {
            contentHtml = `
                <div class="section-items-container">
                    ${items.map((item, index) => renderItemEntry
                        (type, item, index)).join('')}
                </div>
                <button class="action-button add-item-btn">
                Adicionar Novo Item</button>
            `;
        }
        sectionDiv.innerHTML = `
            <div class="section-header">
                <h3 contenteditable="true"
                class="section-title-editable">${title}</h3>
                <div class="section-actions">
                    <button class="action-button 
                    delete-section-btn">Remover</button>
                </div>
            </div>
            <div class="section-content">${contentHtml}</div>
        `;
        return sectionDiv;
    }
    /**
     * Renders an individual item entry for repeatable sections.
     * @param {string} sectionType - The type of the parent section.
     * @param {Object} item - The item data.
     * @param {number} index - The index of the item in its array.
     * @returns {string} HTML string for the item entry.
     */
    function renderItemEntry(sectionType, item, index) {
        let itemHtml = '';
        if (sectionType === 'education') {
            itemHtml = `
 <input type="text" class="item-degree" 
 placeholder="Grau/Curso" value="${item.degree || ''}">
                <input type="text" class="item-institution" 
    placeholder="Instituição" value="${item.institution || ''}">
                <input type="text" class="item-years" 
     placeholder="Anos (ex: 2018 - 2022)" value="${item.years || ''}">
                <textarea class="item-description"
 placeholder="Descrição (opcional)">${item.description || ''}</textarea>
            `;
        } else if (sectionType === 'experience') {
            itemHtml = `
             <input type="text" class="item-title" 
             placeholder="Cargo" value="${item.title || ''}">
                <input type="text" class="item-company" 
     placeholder="Empresa" value="${item.company || ''}">
              <input type="text" class="item-years"
 placeholder="Período (ex: Jan 2020 - Dez 2023)" value="${item.years || 
    ''}">
                <textarea class="item-description"
 placeholder="Responsabilidades e Conquistas">${item.description ||
     ''}</textarea>
            `;
    } else if (sectionType === 'skills' || sectionType === 'languages') {
            
 itemHtml = `<input type="text" class="item-name" 
 placeholder="${sectionType === 'skills' ? 'Habilidade' : 'Idioma'}" 
 value="${item.name || ''}">`;
            if (sectionType === 'skills') {
     itemHtml += `<input type="text" class="item-level" 
     placeholder="Nível (ex: Avançado, Intermediário)" value="
     ${item.level || ''}">`;
            }
        } else if (sectionType === 'projects') {
            itemHtml = `
                <input type="text" class="item-name"
      placeholder="Nome do Projeto" value="${item.name || ''}">
                <input type="text" class="item-link" 
  placeholder="Link do Projeto (opcional)" value="${item.link || ''}">
                <textarea class="item-description" 
 placeholder="Descrição do Projeto">${item.description || ''}</textarea>
            `;
        }
        return `
            <div class="item-entry" data-item-index="${index}">
                ${itemHtml}
                <div class="item-actions">
   <button class="action-button remove-item-btn">Remover Item</button>
                </div>
            </div>
        `;
    }
    /**
     * Attaches all necessary event listeners to a newly created or re-rendered section.
     * @param {HTMLElement} sectionEl - The section DOM element.
     */
    function attachSectionEventListeners(sectionEl) {
        const sectionId = sectionEl.id;
        const sectionData = resumeData.find(s => s.id === sectionId);
const sectionTitleEditable = sectionEl.querySelector
('.section-title-editable');
        sectionTitleEditable.addEventListener('input', (e) => {
            sectionData.title = e.target.textContent;
        });
        sectionEl.querySelector
        ('.delete-section-btn').addEventListener('click', () => {
            deleteSection(sectionId);
        });
        if (sectionData.type === 'personal') {
         
   sectionEl.querySelector('.field-name').addEventListener
   ('input', (e) => sectionData.content.name = e.target.value);
           sectionEl.querySelector('.field-email').addEventListener
      ('input', (e) => sectionData.content.email = e.target.value);
     sectionEl.querySelector('.field-phone').addEventListener
 ('input', (e) => sectionData.content.phone = e.target.value);
      sectionEl.querySelector('.field-linkedin').addEventListener
       ('input', (e) => sectionData.content.linkedin = e.target.value);
          sectionEl.querySelector('.field-location').addEventListener
       ('input', (e) => sectionData.content.location = e.target.value);
 } else if (sectionData.type === 'summary' || 
    sectionData.type === 'custom') {
sectionEl.querySelector('.field-content').addEventListener
            ('input', (e) => sectionData.content = e.target.value);
        }

        // Repeatable sections (education, experience, skills, projects, languages)
        if (sectionData.items !== undefined) {
const itemsContainer = sectionEl.querySelector('.section-items-container');
    const addItemBtn = sectionEl.querySelector('.add-item-btn');

            // Add Item Button
            if (addItemBtn) {
                addItemBtn.addEventListener('click', () => {
                    let newItem = {};
      if (sectionData.type === 'education') 
  newItem = { degree: '', institution: '', years: '', description: '' };
    else if (sectionData.type === 'experience') 
     newItem = { title: '', company: '', years: '', description: '' };
                    else if (sectionData.type === 'skills') 
                        newItem = { name: '', level: '' };
                    else if (sectionData.type === 'projects')
              newItem = { name: '', link: '', description: '' };
                    else if (sectionData.type === 'languages') 
                        newItem = { name: '' };
                    
                    sectionData.items.push(newItem);
                    renderItemsForSection(sectionEl, sectionData);
                });
            }
            itemsContainer.addEventListener('input', (e) => {
                const itemEntry = e.target.closest('.item-entry');
                if (itemEntry) {
                    const itemIndex = parseInt(itemEntry.dataset.itemIndex);
                    const item = sectionData.items[itemIndex];
                    if (e.target.classList.contains
                        ('item-degree')) item.degree = e.target.value;
                    else if (e.target.classList.contains
                        ('item-institution')) item.institution = e.target.value;
                    else if (e.target.classList.contains
                        ('item-years')) item.years = e.target.value;
                    else if (e.target.classList.contains
            ('item-description')) item.description = e.target.value;
                    else if (e.target.classList.contains
                        ('item-title')) item.title = e.target.value;
                    else if (e.target.classList.contains
                        ('item-company')) item.company = e.target.value;
                    else if (e.target.classList.contains
                    ('item-name')) item.name = e.target.value;
                    else if (e.target.classList.contains
                        ('item-level')) item.level = e.target.value;
                    else if (e.target.classList.contains
                        ('item-link')) item.link = e.target.value;
                }
            });

            itemsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-item-btn')) {
                    const itemEntry = e.target.closest('.item-entry');
                    if (itemEntry) {
            const itemIndex = parseInt(itemEntry.dataset.itemIndex);
                        sectionData.items.splice(itemIndex, 1);
                        renderItemsForSection(sectionEl, sectionData);
                    }
                }
            });
        }
        sectionEl.addEventListener('dragstart', (e) => {
            draggedSection = sectionEl;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', sectionId);
     setTimeout(() => sectionEl.classList.add('dragging'), 0); // Add class after dragstart fires
        });
        sectionEl.addEventListener('dragend', () => {
            draggedSection.classList.remove('dragging');
            draggedSection = null;
        });
    }
    /**
     * Re-renders items within a specific repeatable section.
     * @param {HTMLElement} sectionEl - The section DOM element.
     * @param {Object} sectionData - The data object for the section.
     */
    function renderItemsForSection(sectionEl, sectionData) {
    const itemsContainer = sectionEl.querySelector
    ('.section-items-container');
        if (itemsContainer) {
            itemsContainer.innerHTML = 
            sectionData.items.map((item, index) => 
                renderItemEntry(sectionData.type, item, index)).join('');
        }
    }
    /**
     * Adds a new section to the resume.
     * @param {string} type - The type of section to add.
     */
    function addSection(type) {
        const id = generateSectionId();
        let title = '';
        let content = '';
        let items = [];
        switch (type) {
            case 'personal':
                title = 'Informações Pessoais';
         content = { name: '', email: '', phone: '', 
            linkedin: '', location: '' };
                break;
            case 'summary':
                title = 'Resumo Profissional';
                content = '';
                break;
            case 'education':
                title = 'Educação';
                items = [{ degree: '', institution: '', 
                years: '', description: '' }];
                break;
            case 'experience':
                title = 'Experiência Profissional';
                items = [{ title: '', company: '', 
                    years: '', description: '' }];
                break;
            case 'skills':
                title = 'Habilidades';
                items = [{ name: '', level: '' }];
                break;
            case 'projects':
                title = 'Projetos';
                items = [{ name: '', link: '', description: '' }];
                break;
            case 'languages':
                title = 'Idiomas';
                items = [{ name: '' }];
                break;
            case 'custom':
                title = 'Seção Personalizada';
                content = '';
                break;
            default:
                return;
        }
        const newSectionData = { id, type, title, content, items };
        resumeData.push(newSectionData);
        renderResumeSections(); // Re-render all sections to include the new one
    }
    /**
     * Deletes a section from the resume.
     * @param {string} id - The ID of the section to delete.
     */
    function deleteSection(id) {
        if (confirm('Tem certeza que deseja remover esta seção?')) {
            resumeData = resumeData.filter(section => section.id !== id);
            renderResumeSections(); // Re-render all sections
        }
    }
    resumePreviewArea.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
        const afterElement = getDragAfterElement
        (resumePreviewArea, e.clientY);
        const currentDraggable = document.querySelector('.dragging');
        if (afterElement == null) {
            resumePreviewArea.appendChild(currentDraggable);
        } else {
            resumePreviewArea.insertBefore(currentDraggable, afterElement);
        }
    });

    resumePreviewArea.addEventListener('drop', () => {
        // Update resumeData order after drop
        const newOrderIds = Array.from(resumePreviewArea.children)
            .filter(el => el.classList.contains('resume-section'))
              .map(el => el.id);
        
        const reorderedResumeData = [];
        newOrderIds.forEach(id => {
            const section = resumeData.find(s => s.id === id);
            if (section) reorderedResumeData.push(section);
        });
        resumeData = reorderedResumeData;
    });
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll
            ('.resume-section:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: -Infinity }).element;
    }
    /**
     * Generates clean HTML content for the resume based on current resumeData.
     * @returns {string} HTML string of the resume.
     */
    function generateResumeHtmlContent() {
        let html = '<div style="padding: 40px; font-family:
         \'Arial\', sans-serif; color: #333; line-height:
          1.6; max-width: 800px; margin: 0 auto; background-color:
           #fff; border-radius: 8px;">';
        resumeData.forEach(section => {
            html += `<h2 style="color: #007bff; 
            border-bottom: 2px solid #007bff; padding-bottom: 
            5px; margin-top: 30px; margin-bottom: 15px;">
            ${section.title}</h2>`;
            
            if (section.type === 'personal') {
  if (section.content.name) html += 
  `<p><strong>Nome:</strong> ${section.content.name}</p>`;
                if (section.content.email) html += 
      `<p><strong>Email:</strong> ${section.content.email}</p>`;
                if (section.content.phone) html +=
  `<p><strong>Telefone:</strong> ${section.content.phone}</p>`;
                if (section.content.linkedin) html +=
 `<p><strong>LinkedIn:</strong> <a href="${section.content.linkedin}" 
 target="_blank">${section.content.linkedin}</a></p>`;
                if (section.content.location) html += 
  `<p><strong>Localização:</strong> ${section.content.location}</p>`;
            } else if (section.type ===
                 'summary' || section.type === 'custom') {
                if (section.content) html += 
                `<p>${section.content.replace(/\n/g, '<br>')}</p>`;
            } else if (section.items && section.items.length > 0) {
                html += '<ul>';
                section.items.forEach(item => {
                    html += '<li>';
                    if (section.type === 'education') {
              if (item.degree) html += `<h3>${item.degree}</h3>`;
  if (item.institution) html += `<p><strong>Instituição:</strong> 
  ${item.institution}</p>`;
     if (item.years) html += `<p><strong>Anos:</strong> ${item.years}</p>`;  if (item.description) html += `<p>${item.description.replace(/\n/g, '<br>')}</p>`;
                    } else if (section.type === 'experience') {
          if (item.title) html += `<h3>${item.title}</h3>`;
      if (item.company) html += `<p><strong>Empresa:</strong>
       ${item.company}</p>`;
     if (item.years) html += `<p><strong>Período:</strong> 
     ${item.years}</p>`;
    if (item.description) html += `<p>
    ${item.description.replace(/\n/g, '<br>')}</p>`;
                    } else if (section.type === 'skills') {
     if (item.name) html += `<strong>${item.name}</strong>
     ${item.level ? `: ${item.level}` : ''}`;
                    } else if (section.type === 'projects') {
                        if (item.name) html += `<h3>
                        ${item.name}</h3>`;
      if (item.link) html += `<p><strong>Link:</strong> <a href="
      ${item.link}" target="_blank">${item.link}</a></p>`;
                        if (item.description) html += `<p>
                        ${item.description.replace(/\n/g, '<br>')}</p>`;
                    } else if (section.type === 'languages') {
      if (item.name) html += `<strong>${item.name}</strong>`;
                    }
                    html += '</li>';
                });
                html += '</ul>';
            }
        });
        html += '</div>';
        return html;
    }
    function exportResumeAsHtml() {
        const resumeHtml = generateResumeHtmlContent();
        const blob = new Blob([resumeHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'curriculo.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    }
    function exportResumeAsPdf() {
        const resumeHtml = generateResumeHtmlContent();
        exportResumeTemplate.innerHTML = resumeHtml; // Put content into the hidden div
        html2pdf(exportResumeTemplate, {
            margin: 10,
            filename: 'curriculo.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, 
                letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).then(() => {
            exportResumeTemplate.innerHTML = ''; // Clear the hidden div after export
        });
    }
    addSectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            addSection(button.dataset.sectionType);
        });
    });
    exportHtmlBtn.addEventListener('click', exportResumeAsHtml);
    exportPdfBtn.addEventListener('click', exportResumeAsPdf);
    renderResumeSections(); // Render any initial sections (or empty message)
});
