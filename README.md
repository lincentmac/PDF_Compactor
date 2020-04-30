# PDF Compactor Project
a web application that allows users to upload a pdf file and return a compacted version of the file based on the user’s specified DPI. 

# Process Of the whole full_stack
<img alt="frontend-backend-diagram.png" src="frontend-backend-diagram.png" width="400" text-align="center">

# Tools
## Frontend
 Bootstrap + HTML + JQuery + CSS
## Backend  
 Node.js + express + multer + Ghostscript
## The pdf compression rools URL
https://github.com/ourarash/shrinkpdf


# Before start the project
For Windows: ignore this part.
For Mac: Turn to the app.js.Change the line from 95 to 102 into the following coding:
    
    var command = `./shrinkpdf.sh ./originalFiles/${originalFile} ./compactedFiles/${compactedFile}`;
    if (quality == 300 || quality == 144 || quality == 60) {
        command = `./shrinkpdf.sh ./originalFiles/${originalFile} ./compactedFiles/${compactedFile} ${quality}`;
    }
    else {
        command = `./shrinkpdf.sh ./originalFiles/${originalFile} ./compactedFiles/${compactedFile} ${resolution}`;

    } 

# Start The Project
Firstly, install NodeJs (https://nodejs.org/en/download/) and Ghostscript (check this link carefully https://github.com/ourarash/shrinkpdf). 
```bash
git clone https://github.com/lincentmac/PDF_Compactor.git
cd PDF_Compactor
npm install
```

Running:
```bash
node app.js
```

Now open your browser to http://localhost:3000
<img alt="first-page" src="first-page.png" width="400">
Upload a pdf file and the page is switched.
<img alt="second-page" src="second-page.png" width="400">
CLick Process button to do the compression
<img alt="third-page" src="third-page.png" width="400">
See your history files
<img alt="fourth-page" src="fourth-page.png" width="400">

# Group members
Linxin Mai linxinma@usc.edu
Guiquan Sun  gsun@usc.edu
