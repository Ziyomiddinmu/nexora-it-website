document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const teamGrid = document.getElementById('teamGrid');
  const employeeNameInput = document.getElementById('employeeName');
  const employeePositionInput = document.getElementById('employeePosition');
  const contactForm = document.getElementById('contactForm');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  const defaultEmployees = [
    { id: 1, name: 'John Smith', position: 'Lead Developer' },
    { id: 2, name: 'Sarah Johnson', position: 'UI/UX Designer' },
    { id: 3, name: 'Michael Chen', position: 'DevOps Engineer' },
    { id: 4, name: 'Emma Davis', position: 'Project Manager' },
    { id: 5, name: 'Alex Rodriguez', position: 'Cybersecurity Specialist' },
    { id: 6, name: 'Lisa Anderson', position: 'Business Analyst' }
  ];

  const STORAGE_KEY = 'nexoraEmployees';

  function getEmployees() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmployees));
      return [...defaultEmployees];
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length ? parsed : [...defaultEmployees];
    } catch (error) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmployees));
      return [...defaultEmployees];
    }
  }

  let employees = getEmployees();

  function saveEmployees() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderTeamMembers() {
    if (!teamGrid) return;

    teamGrid.innerHTML = '';

    if (!employees.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'team-empty';
      emptyState.textContent = 'No team members added yet.';
      teamGrid.appendChild(emptyState);
      return;
    }

    employees.forEach(employee => {
      const card = document.createElement('article');
      card.className = 'team-member';
      card.innerHTML = `
        <h4>${escapeHtml(employee.name)}</h4>
        <p>${escapeHtml(employee.position)}</p>
        <div class="team-member-actions">
          <button class="btn-edit" data-id="${employee.id}">Edit</button>
          <button class="btn-delete" data-id="${employee.id}">Delete</button>
        </div>
      `;
      teamGrid.appendChild(card);
    });

    teamGrid.querySelectorAll('.btn-edit').forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.id);
        editEmployee(id);
      });
    });

    teamGrid.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.id);
        deleteEmployee(id);
      });
    });
  }

  function addEmployee() {
    if (!employeeNameInput || !employeePositionInput) return;

    const name = employeeNameInput.value.trim();
    const position = employeePositionInput.value.trim();

    if (!name || !position) {
      alert('Please enter both employee name and position.');
      return;
    }

    const nextId = employees.length ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;

    employees.push({ id: nextId, name, position });
    saveEmployees();
    renderTeamMembers();

    employeeNameInput.value = '';
    employeePositionInput.value = '';
    employeeNameInput.focus();
  }

  function editEmployee(id) {
    const employee = employees.find(item => item.id === id);
    if (!employee) return;

    const updatedName = prompt('Edit employee name:', employee.name);
    if (updatedName === null) return;

    const updatedPosition = prompt('Edit employee position:', employee.position);
    if (updatedPosition === null) return;

    const trimmedName = updatedName.trim();
    const trimmedPosition = updatedPosition.trim();

    if (!trimmedName || !trimmedPosition) {
      alert('Name and position cannot be empty.');
      return;
    }

    employee.name = trimmedName;
    employee.position = trimmedPosition;

    saveEmployees();
    renderTeamMembers();
  }

  function deleteEmployee(id) {
    const employee = employees.find(item => item.id === id);
    if (!employee) return;

    const confirmed = confirm(`Delete ${employee.name} from the team?`);
    if (!confirmed) return;

    employees = employees.filter(item => item.id !== id);
    saveEmployees();
    renderTeamMembers();
  }

  const addButton = document.querySelector('.btn-add');
  if (addButton) {
    addButton.addEventListener('click', addEmployee);
  }

  if (employeeNameInput && employeePositionInput) {
    [employeeNameInput, employeePositionInput].forEach(input => {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          addEmployee();
        }
      });
    });
  }

  renderTeamMembers();

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const inputs = contactForm.querySelectorAll('input, textarea');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
        }
      });

      if (!isValid) {
        alert('Please fill out all required contact fields.');
        return;
      }

      alert('Thank you! Your message has been sent successfully.');
      contactForm.reset();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
