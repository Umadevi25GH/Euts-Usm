import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendSignInLinkToEmail } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
alert("Masuk Admin Create Employee");

// const user = auth.currentUser;

//     if (user) {
//     const uid = user.uid;
// 	// alert(uid);
// 	const docRef=doc(db, "employees", uid);
// 	const docSnap = await getDoc(docRef);

// 	if (docSnap.exists()) {
// 	// console.log("Document data:", docSnap.data());
// 	// console.log(docSnap.id);//firebase document id
// 	    document.getElementById("name1").innerText = docSnap.data().name;
//     }
// }

// onAuthStateChanged(auth, async (user) => {
//     if (user) {
//     const uid = user.uid;
// 	// alert(uid);
// 	const docRef=doc(db, "employees", uid);
// 	const docSnap = await getDoc(docRef);

// 	if (docSnap.exists()) {
// 	// console.log("Document data:", docSnap.data());
// 	// console.log(docSnap.id);//firebase document id
// 	    document.getElementById("name1").innerText = docSnap.data().name;
//     }
// }
// })

const form = document.getElementById('create-user-form');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('addUser');
const steps = Array.from(document.querySelectorAll('[id^=step-]'));

let currentStep = 1;

function showStep(currentStep) {
    steps.forEach((step) => {
    step.style.display = 'none';
    });
    steps[currentStep - 1].style.display = 'block';
    if (currentStep === 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    if (currentStep === steps.length) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

prevBtn.addEventListener('click', () => {
  currentStep--;
  showStep(currentStep);
});

nextBtn.addEventListener('click', () => {
  currentStep++;
  showStep(currentStep);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Handle form submission here
});

showStep(currentStep);


// // NEW USER CREATE START
const addUser = document.getElementById('addUser');
addUser?.addEventListener("click", function(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in
        const user = userCredential.user;
        const uid = user.uid;
        inFirestore(uid);

        // const axios = require('axios');
        const emailParams = {
        apiKey: '88DB049125C1BC6FAC2F1FEF9CA8B98D9C96D8377787774BCAC3EAFB4404BE573B4DCFCDB101AD7927C7898D2CD8BE15',
        subject: 'Test email',
        from: 'kreeti2503@gmail.com',
        fromName: 'John Doe',
        to: 'eutsusm@gmail.com',
        bodyHtml: '<p>This is a test email.</p>',
        };

        axios.post('https://api.elasticemail.com/v2/email/send', emailParams)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

        // Email.send({
        //     SecureToken : "1e5cebbf-1b9c-4ee9-bde8-6d00fc4e1960",
        //     username : 'eutsusm@gmail.com',
        //     password : 'rqkzlhykuilhhdsg',
        //     To : 'kreeti2503@gmail.com',
        //     From : "eutsusm@gmail.com",
        //     Subject : "Its a testing email",
        //     Body : "Body of the email sent"
        // }).then(
        //   message => alert("successfu")
        // );
        alert('email sent successfully');
        //send email notification start
        // const fname = document.getElementById('fname');
        // const lname = document.getElementById('lname');
        // const submit = document.getElementById('submit');

        // submit.addEventListener('submit',(e)=>{
        //     e.preventDefault();
        //     Email.send({
        //         SecureToken : "1e5cebbf-1b9c-4ee9-bde8-6d00fc4e1960",
        //         To : 'kreeti2503@gmail.com',
        //         From : "eutsusm@gmail.com",
        //         Subject : "Its a testing email",
        //         Body : "Body of the email sent"
        //     }).then(
        //       message => alert(message)
        //     );
        // });
        
        //send email notification end
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(errorMessage);
    // ..
    });
  

    function inFirestore(uid){

      var name = document.getElementById('first-name').value;
      var emp_id = document.getElementById('emp-id').value;
      var email = document.getElementById('email').value;
      var gender = document.getElementById('employee-gender').value;
      var age = document.getElementById('employee-age').value;
      var race = document.getElementById('employee-race').value;
      var nationality = document.getElementById('employee-nationality').value;
      var education = document.getElementById('employee-education').value;
      var mstatus = document.getElementById('employee-mstatus').value;
      var role = document.getElementById('role').value;
      // var uid = auth.uid;
      // console.log("uid: " + uid);

      const docRef = doc(db, "employees", uid);
      const data = {
          name: name,
          emp_id: emp_id,
          email:email,
          gender: gender,
          age:age,
          race:race,
          nationality: nationality,
          mstatus:mstatus,
          education:education,
          role:role
      };
      setDoc(docRef, data)
      .then(() => {
          console.log("Document has been added successfully");
      })
      .catch(error => {
          console.log(error);
      })
    }
});


// NEW USER CREATE END




// sendSignInLinkToEmail(auth, email, actionCodeSettings)
//   .then(() => {
//     // The link was successfully sent. Inform the user.
//     // Save the email locally so you don't need to ask the user for it again
//     // if they open the link on the same device.
//     window.localStorage.setItem('emailForSignIn', email);
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ...
//   });

//user signout
const signout = document.getElementById("nav-link-logout");
signout.addEventListener("click", () =>{
    signOut(auth).then(() => {
        window.location = "Home.html";
    }).catch((error) => {
      // An error happened.
    });
})



// Get the user's unique ID

// app.auth().onAuthStateChanged((user) => {
// 	if (user) {
// 		const uid = user.uid;
        
// 		// Get the user's data from Firestore
// 		// const db = firebase.firestore();
// 		db.collection("employees").doc(uid).getDoc().then((doc) => {
// 			if (doc.exists) {
// 				const data = doc.data();

// 				// Update the profile fields with the user's data
// 				document.getElementById("name").innerHTML = data.name;
// 				document.getElementById("eid").innerText = data.eid;
// 				document.getElementById("email").innerText = data.email;
//                 document.getElementById("gender").innerText = data.gender;
//                 document.getElementById("age").innerText = data.age;
//                 document.getElementById("mstatus").innerText = data.mstatus;
//                 document.getElementById("race").innerText = data.race;
//                 document.getElementById("nationality").innerText = data.nationality;
//                 document.getElementById("edu").innerText = data.edu;
// 			} else {
// 				console.log("No such document!");
// 			}
//         });
//     }
//     else { console.log("No such user!"); }
// });