import { auth, db } from "./index.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const login = document.getElementById('login');
login.addEventListener("click", function(){
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      // alert(`${user.email} logged in`);

      sessionStorage.setItem('currentUser', JSON.stringify(user));
      userLogin(user);

      const uid = user.uid;
      const docRef=doc(db, "employees", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()  && docSnap.data().estatus == "Active") {
        if (docSnap.data().role == "Admin") {
            // sessionStorage.setItem('userRole', 'Admin');
            window.location = "Aprofile.html";
        }
        else {
            // sessionStorage.setItem('userRole', 'Employee');
            window.location = "profile.html";
        }
      } else {
        // alert("You're not belong to this system. CONTACT ADMIN!");
        const inactiveBtn = document.getElementById("inactiveBtn");
        showSuccessModal();
        // Function to show the success modal
        function showSuccessModal() {
            inactiveBtn.click();
        }
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    });
});

function userLogin(user) {
  console.log("In userLogin");
  const uid = user.uid;
  const docRef = doc(db, "employees", uid);

  getDoc(docRef)
    .then((docSnap) => {
      console.log("Current User:", docSnap.data().name);
      if (docSnap.exists()) {
        document.getElementById("name1").innerText = docSnap.data().name;
      }
    })
    .catch((error) => {
      console.log("Error retrieving user details:", error);
    });
}


// Reset password link start
let reset = document.querySelector('#reset');
reset.addEventListener('click', function() {
  let email = document.querySelector('#resetEmail');
  alert(email.innerHTML);
  sendPasswordResetEmail(auth, email.value).then(()=>{
    console.log('reset email sent');
  })
  .catch((error)=>{
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    alert('error: ' + errorCode);
  });
});

// Reset password link end
// show step of the Create button start
const formR = document.getElementById('request-user-form');

formR.addEventListener('submit', (e) => {
  e.preventDefault();
  // Handle form submission here
});

const reqUser = document.getElementById('reqUser');
reqUser?.addEventListener("click", function(){
  // Show thank you message element
  // document.getElementById('thank_you').style.display = 'block';
  var email = document.getElementById('emailR').value;
  var emp_id = document.getElementById('emp-idR').value;
  var role = document.getElementById('roleR').value;
  var message = document.getElementById('messageR').value;

  //send email notification start
  // Create a new email message
  //security token: b4c1629a-689f-49b0-a47a-502594770ede
  Email.send({
      SecureToken : "b4c1629a-689f-49b0-a47a-502594770ede",
      To : "eutsusm@gmail.com",
      From : email,
      Subject : "Request to check access to EUTS System",
      Body : `Please check access to the EUTS system for the following user: ${email} , Employee ID: ${emp_id}
      Role: ${role}    
      Message: ${message}`,
  }).then((message) => {
    alert(message);
    window.location = "Home.html";
  })
  .catch((error) => {
  // Handle the error here
    console.error("Error sending email:", error);
  // Additional error handling or notification logic can be added here
  });
});

// Request to activate account link start

// show step of the Create button start
// const formR = document.getElementById('request-user-form');

// formR.addEventListener('submit', (e) => {
//   e.preventDefault();
//   // Handle form submission here
// });

// const reqUser = document.getElementById('reqUser');
// reqUser?.addEventListener("click", function(){
//   // Show thank you message element
//   // document.getElementById('thank_you').style.display = 'block';
//   var email = document.getElementById('emailR').value;
//   var emp_id = document.getElementById('emp-idR').value;
//   var role = document.getElementById('roleR').value;
//   var message = document.getElementById('messageR').value;

//   //send email notification start
//   // Create a new email message
//   //security token: b4c1629a-689f-49b0-a47a-502594770ede
//   Email.send({
//       SecureToken : "b4c1629a-689f-49b0-a47a-502594770ede",
//       To : "eutsusm@gmail.com",
//       From : email,
//       Subject : "Request to check access to EUTS System",
//       Body : `Please check access to the EUTS system for the following user: ${email} , Employee ID: ${emp_id}
//       Role: ${role}    
//       Message: ${message}`,
//   }).then((message) => {
//     alert(message);
//     window.location = "Home.html";
//   })
//   .catch((error) => {
//   // Handle the error here
//     console.error("Error sending email:", error);
//   // Additional error handling or notification logic can be added here
//   });
// });

// Request to activate account link end



(function() {
    "use strict";
  
    /**
     * Hero carousel indicators
     */
    let heroCarouselIndicators = document.querySelector("#hero-carousel-indicators");
    let heroCarouselItems = document.querySelectorAll('#heroCarousel .carousel-item');
  
    heroCarouselItems.forEach((item, index) => {
      heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "'" +
        (index === 0 ? " class='active'" : "") + "></li>";
    });
})();