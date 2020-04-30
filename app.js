const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const { exec } = require('child_process');
const fs = require('fs');

const dir = __dirname;

app.use(express.urlencoded({extended: false})); //analysis http request
app.use(express.static(path.join(dir, 'public/'))); // default public
app.use(express.static(path.join(dir, 'image/'))); // image file
app.set('view engine', 'ejs'); // tell express  use ejs
app.use('/static/compacted', express.static('compactedFiles'));
app.use('/static/original', express.static('originalFiles'));

let count = 0;

// get file name that is stored in directory originalFiles
function getOriginalFileName(filename) {
    filename = filename.replace(/[- ]+/g, '_');
    const index = filename.lastIndexOf('.pdf');
    if (index == -1) {
        return filename + '.pdf';
    }
    return filename;
}

function getCompactedFileName(filename) {
    const index = filename.lastIndexOf('.pdf');
    if (index != -1) {
        return filename.substring(0, index) + '-' + 'compacted.pdf';
    }
    return filename + '-' + 'compacted.pdf';
}


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(dir, 'originalFiles'));
    },

    filename: function(req, file, cb) {
        console.log(file);
        let filename = getOriginalFileName(file.originalname);
        req.filename = filename; //req is a object optional
        cb(null, filename);
    }
})

const fileFilter = function(req, file, cb) {
    // if (!file) {   // do not have to bool
    //     req.error = 'Error: File not exists';
    //     console.log(req.error);
    //     cb();
        
    // }
    
    console.log(file);
    const type = file.mimetype;

    if (type === 'application/pdf') {
        cb(null, true);
    }
    //else {
    //    req.error = 'Error: This is not a pdf file.';
    //    console.log(req.error);
    //    cb();
    //}
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: {fileSize: 30*1024*1000}}); // 上传文件的中间件

app.get('/', function(req, res) {
    res.render('index', {count: count});
});

app.post('/upload', upload.single('pdf'),  function(req, res) {
    if (req.error) {
        res.render('error', {error: req.error});
        return;
    }
    res.render('uploaded', {filename: req.filename});
});

app.post('/compact', function(req, res) {
    const originalFile = req.body.filename;
    let stats = fs.statSync(path.join(dir, "originalFiles/" + originalFile));
    console.log(stats.size);
    const compactedFile = getCompactedFileName(originalFile);
    const resolution = req.body.resolution;

    const quality = req.body.level;
    var command = `${dir}/shrinkpdf.bat ./originalFiles/${originalFile} ./compactedFiles/${compactedFile}`;
    if (quality == 300 || quality == 144 || quality == 60) {
        command = `${dir}/shrinkpdf.bat ./originalFiles/${originalFile} ./compactedFiles/${compactedFile} ${quality}`;
    }
    else {
        command = `${dir}/shrinkpdf.bat ./originalFiles/${originalFile} ./compactedFiles/${compactedFile} ${resolution}`;

    }
    console.log(command);
    exec(command, (err, stdout, stderr) => {  //execute
      if (err) {
          console.log('Error: Compacting error');
          res.render('error', {error: err});
      } else {
          console.log('Compacting successfully');
          let statsCompress = fs.statSync(path.join(dir, "compactedFiles/" + compactedFile));
          console.log(statsCompress.size);

          const html = ejs.render('<a href="/static/compacted/<%= compactedFile %>" target="_blank">download</a>', {compactedFile: compactedFile});
          res.render('compacted', {compactedFile: compactedFile, stats: Math.floor(stats.size / 1000), statsCompress: Math.floor(statsCompress.size / 1000)});
        //  res.render('compacted', {compactedFilename: compactedFile});
      }
    });
    count++;
})

// [[original, compacted], [], []]
app.get('/history', async function(req, res) {
    const files = await fs.promises.readdir('./originalFiles');
    const PDFfiles = [];
    for (const file of files) {
        if (file.endsWith('.pdf')) {
            PDFfiles.push([file, getCompactedFileName(file)]);
        }
    }
    console.log(PDFfiles);
    // res.send('done');
    res.render('history', {pdfFiles: PDFfiles});
})

app.get('/delete', function(req, res) {
    console.log(req.query.fileName);
    const fileName = req.query.fileName;
    fs.unlinkSync('originalFiles/' + fileName);
    fs.unlinkSync('compactedFiles/' + getCompactedFileName(fileName));
    res.json({status: 'success'});
});

app.listen(3000, function() {
    console.log("Server Listenining on port 3000");
});
