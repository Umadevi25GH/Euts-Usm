// Initialize Firebase
const firebaseConfig = {
    // Your Firebase configuration
  };
  
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Fetch number of employees from Firebase
  function fetchEmployees() {
    const employeesRef = database.ref('employees');
    employeesRef.on('value', (snapshot) => {
      const employees = snapshot.val();
      let employeesList = '';
      for (const role in employees) {
        employeesList += `<li>${role}: ${employees[role]}</li>`;
      }
      document.getElementById('employees-list').innerHTML = employeesList;
    });
  }
  
  // Fetch number of files uploaded from Firebase
  function fetchFilesCount() {
    const filesRef = database.ref('files');
    filesRef.on('value', (snapshot) => {
      const filesCount = snapshot.numChildren();
      document.getElementById('files-count').textContent = filesCount;
    });
  }
  
  // Fetch data on page load
  document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();
    fetchFilesCount();
  });
  