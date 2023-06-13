function buttonListener(docid,ControlDiv,secretKeyString){
    console.log("Masuk view button");
        ControlDiv.addEventListener("click", async e => {
            console.log("Masuk view button 2");
            if(e.target.classList.contains("viewBtn") && e.target.id === `${docid}`){
                console.log("Masuk view button 3");
                console.log("View button clicked with id:", docid);
    
                // const pdfF = document.getElementById("pdfViewer");
                //view full
                const viewRef = doc(db, "pdf", docid);
                const docSnap = await getDoc(viewRef);
                if (docSnap.exists()) {
                    console.log(docSnap.data().pdfName);
                    // console.log("Secret key: ", docSnap.data().secret_key);
                    const decryptedURL = decryption(docSnap.data().pdfUrl, docSnap.data().secret_key); //return a data object
                    // console.log("Decrypted url: ", decryptedURL);
                    // var pdfWindow = window.open(docSnap.data().pdfUrl, "blank");
                    // pdfWindow.focus();
                    // const pdfViewer = document.getElementById("pdfContainer");
    
                    // Create a new PDF viewer element.latest
                    // const iframe = document.querySelector(".pdf-overlay iframe");
                    // iframe.src = decryptedURL;
                    // const pdfViewer = document.getElementById("pdfViewer");
                    // pdfViewer.src = decryptedURL;
                    console.log("pdfViewer1");
                    const modal = new bootstrap.Modal(document.getElementById("pdfModal"));
                    const pdfModalLabel = document.getElementById("pdfModalLabel");
                    pdfModalLabel.innerHTML = docSnap.data().pdfName;
                    const pdfViewer = document.getElementById("pdfViewer");
                    pdfViewer.src = decryptedURL;
                    console.log("pdfViewer2");
                    modal.show();
    
                    //check this later why PDFObject error
                    // console.log("pdfViewer3");
                    // var options = {
                    //     pdfOpenParams: {
                    //         toolbar: 0, // Set toolbar to 0 to hide the toolbar
                    //     },
                    // };
                    // // PDFObject.embed(decryptedURL, "#pdfViewerContainer", options);
                    // try {
                    //     PDFObject.embed(decryptedURL, "#pdfViewerContainer", options);
                    // } catch (error) {
                    //     // Handle the error here
                    //     console.error("Error embedding PDF:", error);
                    // }
    
                    const pdfViewerIframe = document.getElementById("pdfViewer");
                    pdfViewerIframe.src = decryptedURL;
    
                    // const pdfViewer = document.createElement("embed");
                    // pdfViewer.type = "application/pdf";
    
                    // Disable print and download.
                    // function disablePrint() {
                    // var printButton = document.getElementById("printButton");
                    // printButton.disabled = true;
                    // console.log("PDF viewer disable print");
                    // }
    
                    // function disableDownload() {
                    // var downloadButton = document.getElementById("downloadButton");
                    // downloadButton.disabled = true;
                    // console.log("PDF viewer disable download");
                    // }
    
                    // function loadPDF(url){
                    //     console.log("PDF viewer 1");
                    //     pdfViewer.innerHTML = '';
                    //     // Create a new object element
                    //     const objectElement = document.createElement('iframe');
                    //     // objectElement.type = 'application/pdf';
                    //     objectElement.src = url;
                    //     objectElement.height   = '600px';
                    //     objectElement.width = '800px';
                    //     // objectElement.down = 'disabled';
                    //     // objectElement.sandbox = 'allow-modals';
                    //     objectElement.oncontextmenu = "return false;";
                    //     objectElement.scroll="return true;";
    
    
                    //     // Append the object element to the PDF viewer
                    //     pdfViewer.appendChild(objectElement);
                    //     console.log("PDF viewer 2");
                    //     // disableDownload();
                    //     // disablePrint();
                    // }
                    // loadPDF(docSnap.data().pdfUrl);
    
                    // pdfViewer.src = docSnap.data().pdfUrl;
                    // pdfViewer.style.width = "100%";
                    // pdfViewer.style.height = "100%";
    
    
                    // Add the PDF viewer to the DOM.
                    // document.body.appendChild(pdfViewer);
                    // console.log("PDF viewer after body");
    
                    // pdfViewer.onload = function() {
                    //     console.log("PDF viewer loaded");
                    //     try {
                    //         disablePrint();
                    //         disableDownload();
                    //     } catch (err) {
                    //         console.log("Error", err);
                    //     }
                    // };
    
                }
                else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            } else if(e.target.classList.contains("delBtn") && e.target.id === `${docid}`){
                // console.log("del button: ", e.target.id);
                
                // console.log(`Delete button clicked with id:`, docid);
                
                // Create a reference to the file to delete collection
                const delRef = doc(db, "pdf", docid);
    
                // // Create a reference to the file to delete storage
                // const desertRef = sRef(storage, "pdf/"+docid.pdfName);
                const docSnap = await getDoc(delRef);
                // console.log("Pdf to Del: ", docid.pdfName);
    
                if (docSnap.exists()) {
                    // console.log("Opening modal");
                    const modal = new bootstrap.Modal(document.getElementById("delRes"));
                    modal.show();
    
                    const DelDocName = document.getElementById('documentName');
                    DelDocName.value = docSnap.data().pdfName;
                    DelDocName.placeholder = docSnap.data().name;
                    
                    var DelDocReason = document.getElementById("deleteReason");
                    
                    const optionObsolete = document.getElementById("obsolete");
                    optionObsolete.textContent = "Obsolete";
                    if (optionObsolete.selected) {
                        DelDocReason = optionObsolete.value;
                    }
                    
                    const optionNotUsed= document.getElementById("notused");
                    optionNotUsed.textContent = "Not being used";
                    if (optionNotUsed.selected) {
                        DelDocReason = optionNotUsed.value;
                    }
    
                    const optionOther = document.getElementById("otherR");
                    optionOther.textContent = "Other";
                    if (optionOther.selected) {
                        DelDocReason = optionOther.value;
                    }
                  
                    const delForm = document.getElementById('deleteForm');
                    delForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        // Handle form submission here
                        var pdfName = DelDocName.value;
                        var pdfUrl = docSnap.data().pdfUrl;
                        var delReason = document.getElementById('deleteReason').value;
    
    
                        console.log("pdfName: ", DelDocName);
                        console.log("pdfUrl: ", docSnap.data().pdfUrl);
                        console.log("Reason: ", DelDocReason.value);
                        const timestamp = Date.now();
                        const arcRef = doc(db, "archive", docid);
                        const data = {
                            pdfName: pdfName,
                            date: new Date(timestamp).toLocaleString(),
                            deletedBy: currentUser.email,
                            DelDocReason: delReason,
                            pdfUrl: pdfUrl
                        };
                        setDoc(arcRef, data)
                            .then(() => {
                                console.log("Document has been moved to archive folder successfully");
                            })
                            .catch(error => {
                                console.log(error);
                            });
    
                        deleteDoc(delRef)
                            .then(() => {
                                console.log("Document has been deleted successfully");
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    });
                }
                else{
                    console.log("No such document");
                }
            }
        });
    }