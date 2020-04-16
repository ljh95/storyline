const express = require('express')
const cors = require('cors')

const app = express()
const bodyParser = require('body-parser')
const port  = 3000

//mysql 
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    port: '',
    database: ''
})
connection.connect()

// //s3
// const path = require('path')
// const multer = require('multer')
// const multerS3 = require('multer-s3')
// const AWS = require('aws-sdk')

// // 이미지 저장경로, 파일명 세팅
// const upload = multer({      
//     storage: multerS3({
//         s3: s3,
//         bucket: "storyline-image-bucket", // 버킷 이름
//         contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
//         acl: 'public-read-write', // 클라이언트에서 자유롭게 가용하기 위함
//         key: (req, file, cb) => {            
//           let extension = path.extname(file.originalname);
//           console.log('file : ' + file);
//           console.log('extension : ' + extension);
//           cb(null, Date.now().toString() + file.originalname)
//         },
//     }),
//     limits: { fileSize: 12 * 1024 * 1024 }, // 용량 제한 5MByte
// });

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//router


app.listen(port, function(){
    console.log(`app2 is listening on port: ${port}`)
})