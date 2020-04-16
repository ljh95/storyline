var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
const sharp = require('sharp');
var bodyParser = require('body-parser')
var mysql      = require('mysql'); 
var connection = mysql.createConnection({
  host     : 'aws2-rds.c5wiyouiqpec.ap-northeast-2.rds.amazonaws.com',
  user     : 'egoing',
  password : 'egoing111111',
  port     : '3306',
  database : 'storyLine'
});
connection.connect();
var iframeReplacement = require('node-iframe-replacement');
app.use(iframeReplacement);

var path = require('path');
var multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
//const sharp = require('sharp');
//const s3Storage = require('multer-sharp-s3');

var http = require('http');
var fs = require('fs');


AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
let s3 = new AWS.S3();

/* const storage2 = gcsSharp({
      s3,
      Bucket: "storyline-image-bucket", // 버킷 이름
      contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
      ACL: 'public-read-write', // 클라이언트에서 자유롭게 가용하기 위함
      resize: {
        width: 800,
        height: 600
      },
      max: true,
      key: (req, file, cb) => {            
            let extension = path.extname(file.originalname);
            console.log('file : ' + file);
            console.log('extension : ' + extension);
            cb(null, Date.now().toString() + file.originalname)
      },
});
const upload2 = multer({ storage: storage2 }); */

// 이미지 저장경로, 파일명 세팅
const upload = multer({      
      storage: multerS3({
          s3: s3,
          bucket: "storyline-image-bucket", // 버킷 이름
          contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
          acl: 'public-read-write', // 클라이언트에서 자유롭게 가용하기 위함
          key: (req, file, cb) => {            
            let extension = path.extname(file.originalname);
            console.log('file : ' + file);
            console.log('extension : ' + extension);
            cb(null, Date.now().toString() + file.originalname)
          },
      }),
      limits: { fileSize: 12 * 1024 * 1024 }, // 용량 제한 5MByte
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* app.get('/index0', function(req, res){
      fs.readFile('index0.html', function(err, data){
            res.writeHead(200, {'ContentType' : 'text/html'});
            res.end(data);
      });
}); */

app.post('/location_ar', function(req, res){      
      var id = req.body.rs_id;

      connection.query(`
      select location_ar from real_story
      where id = ?
      `, [id], function(err, ress){
            if(err) throw err;
            console.log('location_ar = ' + ress[0].location_ar);
            res.send(ress);         
      })
})

app.get('/main',function(req,res) { 
      var user_id = 0;
      if(req.body.user_id != 0 || req.body.user_id != undefined)
            user_id = req.body.user_id;
      
      var html = `
      
      
      <h2>Using the XMLHttpRequest Object</h2>

      <div id="demo">
      <button type="button" onclick="loadXMLDoc()">Change Content</button>
      </div>
      
      <script>
      function loadXMLDoc() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML =
            this.responseText;
          }
        };
        xhttp.open("GET", "http://15.164.222.144:3000/main", true);
        xhttp.send();
      }
      </script>
      
            <h2>ggggggg</h2>
      <h2>Main</h2>
      <p>메인에서 고르기</p>
      <div class="d1">
            <form class="" action="http://15.164.222.144:3000/main" method="post">
              <select name='selectStory'>
                <option value='good'>Good</option>
                <option value='gps'>GPS</option>
              </select>
              <input type="submit">
            </form>
      </div>

      <hr>

      <p>사용자의 id를 받아 진행중인지, 다녀왔는지 등으로 정렬</p>
      <div class="">
        <form class="" action="http://15.164.222.144:3000/choose" method="post">
          <p>user_id값을 넘겨줘야한다.</p>
          <input type="text" name="user_id" placeholder="user_id자동으로 넘겨줘야하는 값">
          <br>
          <br>
          <input type="text" name="is_ing" placeholder="is_ing? 0 or 1">
          <input type="text" name="is_gone" placeholder="is_gone? 0 or 1">
          <input type="text" name="is_recommanded" placeholder="is_recommanded? 0 or 1">
          <input type="text" name="is_writen" placeholder="is_writen? 0 or 1">
          <input type="submit">
        </form>
      </div>

      <hr>

      <p>게시판 하나 보기</p>
      <div class="">
        <p>user_id, story_id를 넘겨줘야 한다.</p>
        <form class="" action="http://15.164.222.144:3000/find_location1" method="post">
          <input type="text" name="user_id" placeholder="user_id">
          <input type="text" name="story_id" placeholder="story_id">
          <br>
          <input type="submit">
        </form>
      </div>

      <hr>

      <p>게시판 하나에 대한 location값 출력하기</p>
      <form class="" action="http://15.164.222.144:3000/find_location2" method="post">
        <input type="text" name="story_id" placeholder="story_id">
        <input type="submit">
      </form>

      <hr>

      
      <p>location에 대한 실제 값들 출력</p>
      <form class="" action="http://15.164.222.144:3000/find_real_location" method="post">
        <input type="text" name="location_id" placeholder="location_id">
        <input type="submit">
      </form>
      <hr>

      <p>검색하기</p>
      <div class="search">
            <form class="" action="http://15.164.222.144:3000/search" method="post">
            <input type="text" name="search" placeholder="검색">
            <input type="submit">
            </form>
      </div>

      <hr>


      <h1>여기부터 Create!</h1>
      <hr>

      <p>스토리 라인 생성하기</p>
      <div class="create_storyline">
            <h5>실제 create_storyline을 실행시킬 경우에는 user_id를 던져주어야한다.</h5>
            <form class="" action="http://15.164.222.144:3000/create_storyline" method="post">
              <input type="text" name="user_id" placeholder="가상으로 넘겨주는 user_id">
              <input type="text" name="runtime" placeholder="runtime">
              <input type="text" name="image" placeholder="image">
              <input type="text" name="title" placeholder="title">
              <input type="text" name="simple_description" placeholder="simple_description">
              <input type="submit">
            </form>
      </div>

      <hr>

      <p>create_location</p>
      <div class="create_location">
            <form class="" action="http://15.164.222.144:3000/create_location" method="post">
            <input type="text" name="location_name" placeholder="location_name">
            <input type="text" name="title"placeholder="title">
            <input type="text" name="location_image" placeholder="location_image">
            <input type="text" name="story_id" placeholder="알아서 넘겨줘야하는 story_id">
            <input type="text" name="gps_latitude" placeholder="gps_latitude">
            <input type="text" name="gps_longitude" placeholder="gps_longitude">
            <input type="submit">
            </form>
      </div>

      <hr>

      <p>create_real_location</p>
      <p>text, image, video type을 정하고 값 입력</p>
      <div class="create_real_location">
        <form class="" action="http://15.164.222.144:3000/create_real_location" method="post">
          <select class="" name="explanation_type">
            <option value="text_type">text_type</option>
            <option value="image_type">image_type</option>
            <option value="video_type">video_type</option>
          </select>
          <input type="text" name="location_id" placeholder="임시 location_id">
          <input type="text" name="explanation_text" placeholder="explanation_text">
          <input type="text" name="explanation_image" placeholder="explanation_image">
          <input type="text" name="explanation_video" placeholder="explanation_video">
          <input type="submit">
        </form>
      </div>

      <hr>

      <p>댓글 작성</p>
      <div class="create_comment">
        <p>작가 아이디를 넘겨주어야 한다.</p>
        <form class="" action="http://15.164.222.144:3000/create_comment" method="post">
          <input type="text" name="user_id" placeholder="임시 user_id">
          <input type="text" name="story_id" placeholder="임시 story_id">
          <input type="text" name="comment" placeholder="comment">
          <input type="text" name="comment_image" placeholder="comment_image">
          <input type="submit">
        </form>
      </div>

      <hr>
      
      <p>create_tag</p>
      <div class="create_tag">
        <form class="" action="http://15.164.222.144:3000/create_tag" method="post">
          <input type="text" name="tag_name" placeholder="tag_name">
          <input type="submit">
        </form>
      </div>

      <hr>

      `
      console.log("Success Main");
      res.send(html);
});//just html code

app.post('/main', function(req, res){
      var selected = req.body.selectStory;
      if(selected === 'good'){
            connection.query(`
            select story_id, name from story_has_tag st
            left join tag t on t.id = st.tag_id    
            `, function(error, results){
                  if(error) throw error;

                  connection.query(`
                  select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                  from story s
                  left join story_has_tag st on st.story_id = s.id  
                  left join tag t on t.id = st.tag_id 
                  left join story_count_good scg on scg.story_id = s.id 
                  group by s.id   
                  order by scg.count_good desc
                  `, function(error2, results2){
                        if(error2) throw error2;

                        let count = 0;
                        var json = {};
                        for (let index = 0; index < results2.length; index++) {
                              for (var index2 = 0; index2 < results.length; index2++) {
                                    if(results2[index].id == results[index2].story_id){
                                          var tag_name = results[index2].name+"";
                                          json[count] = tag_name;
                                          count++;
                                    }
                              }
                              results2[index]["tagName"] = json;
                              count = 0;
                              json = {};                                    
                        }
                        res.send(results2);                              
                  });
            });
      }else if(selected === 'gps'){
            //gps순으로 정렬된 모습
            var gps_la = req.body.gps_la;
            var gps_lo = req.body.gps_lo;
            connection.query(`
            select story_id, name from story_has_tag st
            left join tag t on t.id = st.tag_id    
            `, function(error, results){
                  if(error) throw error;
                  
                  connection.query(`  
                  select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                  from story s
                  left join story_has_tag st on st.story_id = s.id  
                  left join tag t on t.id = st.tag_id 
                  left join story_count_good scg on scg.story_id = s.id 
                  group by s.id  
                  `, function(error2, results2){                        
                        if(error2) throw error2;

                        let count = 0;
                        var json = {};
                        for (let index = 0; index < results2.length; index++) {
                              for (var index2 = 0; index2 < results.length; index2++) {
                                    if(results2[index].id == results[index2].story_id){
                                          var tag_name = results[index2].name+"";
                                          json[count] = tag_name;
                                          count++;
                                    }
                              }
                              results2[index]["tagName"] = json;
                              count = 0;
                              json = {};                                    
                        }

                        for (let index = 0; index < results2.length; index++) {
                              d_la = gps_la - results2[index].gps_latitude;
                              d_lo = gps_lo - results2[index].gps_longitude;
                              d_long = Math.sqrt(d_la*d_la + d_lo*d_lo);
                              results2[index]["distance"] = d_long;
                        }                        
                        
                        results2.sort(function(a, b){
                              if (a.distance > b.distance) {
                                    return 1;
                              }
                              if (a.distance < b.distance) {
                                    return -1;
                              }
                              // a must be equal to b
                              return 0;
                        });                              
                        res.send(results2);                                                                       
                  });
            });

      }else{
            res.send("main 메소드 오류.")
      }
      
});//done

app.post('/choose', function(req, res){
      var user_id = req.body.user_id;
      var is_ing = req.body.is_ing;
      var is_gone = req.body.is_gone;
      var is_recommanded = req.body.is_recommanded;
      var is_writen = req.body.is_writen;

      if(user_id === undefined){
            res.send("user_id값이 존재하지 않습니다.")
      }else if(user_id == 6){
            res.send("로그인을 해주세요");
      }else{
            if(is_ing == 1){
                  connection.query(`
                  select story_id, name from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error, results){
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                        FROM story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id                                         
                        left join user_has_story us on us.story_id = s.id
                        left join story_count_good scg on scg.story_id = s.id 
                        left join user u on u.id = us.story_id
                        where user_id = ? and us.is_ing = ?
                        group by s.id;
                        `,[user_id, is_ing], function(error2, results2){
                              let count = 0;
                              var json = {};
                              for (let index = 0; index < results2.length; index++) {
                                    for (var index2 = 0; index2 < results.length; index2++) {
                                          if(results2[index].id == results[index2].story_id){
                                                var tag_name = results[index2].name+"";
                                                json[count] = tag_name;
                                                count++;
                                          }
                                    }
                                    results2[index]["tagName"] = json;
                                    count = 0;
                                    json = {};                                    
                              }
                              res.send(results2);                              
                        });
                  });
            }
            else if(is_gone == 1){
                  connection.query(`
                  select story_id, name from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error, results){
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                        FROM story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id                                         
                        left join user_has_story us on us.story_id = s.id
                        left join story_count_good scg on scg.story_id = s.id 
                        left join user u on u.id = us.story_id
                        where user_id = ? and us.is_gone = ?
                        group by s.id;
                        `,[user_id, is_gone], function(error2, results2){
                              let count = 0;
                              var json = {};
                              for (let index = 0; index < results2.length; index++) {
                                    for (var index2 = 0; index2 < results.length; index2++) {
                                          if(results2[index].id == results[index2].story_id){
                                                var tag_name = results[index2].name+"";
                                                json[count] = tag_name;
                                                count++;
                                          }
                                    }
                                    results2[index]["tagName"] = json;
                                    count = 0;
                                    json = {};                                    
                              }
                              res.send(results2);                              
                        });
                  });                                    
            }      
            else if(is_recommanded == 1){
                  connection.query(`
                  select story_id, name from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error, results){
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                        FROM story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id                                         
                        left join user_has_story us on us.story_id = s.id
                        left join story_count_good scg on scg.story_id = s.id 
                        left join user u on u.id = us.story_id
                        where user_id = ? and us.is_recommand = ?
                        group by s.id;
                        `,[user_id, is_recommanded], function(error2, results2){
                              let count = 0;
                              var json = {};
                              for (let index = 0; index < results2.length; index++) {
                                    for (var index2 = 0; index2 < results.length; index2++) {
                                          if(results2[index].id == results[index2].story_id){
                                                var tag_name = results[index2].name+"";
                                                json[count] = tag_name;
                                                count++;
                                          }
                                    }
                                    results2[index]["tagName"] = json;
                                    count = 0;
                                    json = {};                                    
                              }
                              res.send(results2);                              
                        });
                  });                  
            }
            else if(is_writen == 1){
                  connection.query(`
                  select story_id, name from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error, results){
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                        FROM story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id                                         
                        left join user_has_story us on us.story_id = s.id
                        left join story_count_good scg on scg.story_id = s.id 
                        left join user u on u.id = us.story_id
                        where user_id = ? and us.is_writen = ?
                        group by s.id;
                        `,[user_id, is_writen], function(error2, results2){
                              let count = 0;
                              var json = {};
                              for (let index = 0; index < results2.length; index++) {
                                    for (var index2 = 0; index2 < results.length; index2++) {
                                          if(results2[index].id == results[index2].story_id){
                                                var tag_name = results[index2].name+"";
                                                json[count] = tag_name;
                                                count++;
                                          }
                                    }
                                    results2[index]["tagName"] = json;
                                    count = 0;
                                    json = {};                                    
                              }
                              res.send(results2);                              
                        });
                  });                  
            }else{
                  res.send("일단 오류")
            }                        
      }
});//done

app.post('/find_location1',function(req, res){
      var user_id = req.body.user_id;
      var story_id = req.body.story_id;
      
      connection.query(`
      select us.is_writen, us.user_id 
      from user_has_story us 
      left join story s on s.id = us.story_id
      where s.id = ?
      group by s.id;
      `,[story_id], function(error1, results1){
            if(error1) throw error1;

            if(results1[0].is_writen == 1 && results1[0].user_id == user_id){
                  console.log("자기 스토리 수정 페이지 구현");
                  res.send("??");
            }else{
                  connection.query(`
                  select name, story_id from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error, results){
                        if(error) throw error;
                        
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                        from story s
                        left join story_has_tag st on st.story_id = s.id
                        left join story_count_good scg on scg.story_id = s.id 
                        where s.id = ?
                        group by s.id
                        `,[story_id],  function(error2, results2){
                              if(error2) throw error2;
                              
                              var json = {};
                              let tag_count = 0;

                              for (let index = 0; index < results.length; index++) {
                                    if(results2[0].id == results[index].story_id){//이 게시판에 태그들이 들어가야하는경우
                                          var kk = results[index].name+"";//값을 만들어준다.
                                          json[tag_count] = kk;//json 객체에 키와 값을 만들어준다.
                                          tag_count++;
                                    }
                              }
                              results2[0]["tagName"]  = json;
                              res.send(results2);
                        })
                  })
            }
      })
});//done( 본인의 스토리에 대해 조회시 ??값을 뜨게 만들었는데 형과 상의가 필요한 부분)

app.post('/find_location2', function(req, res){
      var story_id = req.body.story_id;

      connection.query(`
      select l.* 
      from location l
      left join story s on s.id = l.story_id
      where s.id = ?
      order by lo_index
      `, [story_id], function(error, results){
            if(error) throw error;

            var json = {};          //장소들에 index를 붙여주기 위함
            for (let index = 0; index < results.length; index++) {
                  json[index] = {
                        id : results[index].id,
                        name : results[index].name,
                        title : results[index].title, 
                        location_image : results[index].location_image,
                        gps_latitude : results[index].gps_latitude,
                        gps_longitude : results[index].gps_longitude,
                        story_id : results[index].story_id,
                        summary : results[index].summary
                  }                        
            }
            
            res.send(json);
      });
});//done

app.post('/find_real_location', function(req, res){
      var location_id = req.body.location_id;

      connection.query(`
      select *
      from real_story rl      
      where rl.location_id = ?
      order by rs_index;
      `,[location_id], function(error, results){
            if(error)
                  throw error;

            var json = {};
            for (let index = 0; index < results.length; index++) {
                  json[index] = {
                        id : results[index].id,
                        location_text : results[index].location_text,
                        location_image : results[index].location_image,
                        location_video : results[index].location_video,
                        location_ar    : results[index].location_ar
                  }
            }
            res.send(json);
      })
});//done

app.post('/search', function(req, res){
     var search = req.body.search;
     var searchArr = [];
     var record_overlap =false;

     connection.query(`
     select story_id, name 
     from story_has_tag st
     left join tag t on t.id = st.tag_id    
     `, function(error, results){
           connection.query(`
           select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
           from story s
           left join story_has_tag st on st.story_id = s.id  
           left join tag t on t.id = st.tag_id
           left join story_count_good scg on scg.story_id = s.id 
           where s.title like ?
           group by s.id
           `, '%' + search + '%', function(error2, results2){
                  let count = 0;
                  var json = {};
                  for (let index = 0; index < results2.length; index++) {
                        for (var index2 = 0; index2 < results.length; index2++) {
                              if(results2[index].id == results[index2].story_id){
                                    var tag_name = results[index2].name+"";
                                    json[count] = tag_name;
                                    count++;
                              }
                        }
                        results2[index]["tagName"] = json;
                        count = 0;
                        json = {};                                    
                  }
                  for(var i in results2) {                        
                        searchArr.push({
                              id : results2[i].id,
                              runtime: results2[i].runtime,
                              image: results2[i].image,
                              title: results2[i].title,
                              simple_description: results2[i].simple_description,
                              good: results2[i].good,
                              gps_latitude: results2[i].gps_latitude,
                              gps_longitude: results2[i].gps_longitude,
                              tagName : results2[i].tagName
                        });
                  };
                  //tag name 으로 서치
                  connection.query(`
                  select story_id, name from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error3, results3){
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                        from story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id
                        left join story_count_good scg on scg.story_id = s.id 
                        where t.name like ?
                        group by s.id   
                        `, '%' + search + '%', function(error4, results4){
                               let count = 0;
                               var json = {};
                               for (let index = 0; index < results4.length; index++) {
                                     for (var index2 = 0; index2 < results3.length; index2++) {
                                           if(results4[index].id == results3[index2].story_id){
                                                 var tag_name = results3[index2].name+"";
                                                 json[count] = tag_name;
                                                 count++;
                                           }
                                     }
                                     results4[index]["tagName"] = json;
                                     count = 0;
                                     json = {};                                    
                               }
                               for(var i in results4) {                        
                                    record_overlap = false;
                                    for(var j in searchArr){
                                          if(results4[i].id === searchArr[j].id){
                                                record_overlap = true;
                                          }
                                    }
                                    if(record_overlap)
                                          continue;
                                     searchArr.push({                                           
                                           id : results4[i].id,
                                           runtime: results4[i].runtime,
                                           image: results4[i].image,
                                           title: results4[i].title,
                                           simple_description: results4[i].simple_description,
                                           good: results4[i].good,
                                           gps_latitude: results4[i].gps_latitude,
                                           gps_longitude: results4[i].gps_longitude,
                                           tagName : results4[i].tagName
                                     });
                               };
                               //
                               connection.query(`
                               select story_id, name 
                               from story_has_tag st
                               left join tag t on t.id = st.tag_id    
                               `, function(error5, results5){
                                     connection.query(`
                                     select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                                     from story s
                                     left join story_has_tag st on st.story_id = s.id  
                                     left join tag t on t.id = st.tag_id
                                     left join user_has_story us on us.story_id = s.id
                                     left join user u on us.user_id = u.id
                                     left join story_count_good scg on scg.story_id = s.id 
                                     where us.user_id = (
                                                      select id 
                                                      from user u
                                                      where u.nickName like ?
                                     ) and us.is_writen = 1
                                     group by s.id                                       
                                     `, '%' + search + '%', function(error6, results6){

                                          if(results6 == undefined || results6 == ''){
                                                return res.send(searchArr);
                                          }
                                          //
                                          let count = 0;
                                          var json = {};
                                          for (let index = 0; index < results6.length; index++) {
                                                for (var index2 = 0; index2 < results5.length; index2++) {
                                                      if(results6[index].id == results5[index2].story_id){
                                                            var tag_name = results5[index2].name+"";
                                                            json[count] = tag_name;
                                                            count++;
                                                      }
                                                }
                                                results6[index]["tagName"] = json;
                                                count = 0;
                                                json = {};                                    
                                          }
                                          for(var i in results6) {  
                                              record_overlap = false;
                                              for(var j in searchArr){
                                                    if(results6[i].id === searchArr[j].id){
                                                          record_overlap = true;
                                                    }
                                              }
                                              if(record_overlap)
                                                    continue;                                                                        
                                                searchArr.push({
                                                      id : results6[i].id,
                                                      runtime: results6[i].runtime,
                                                      image: results6[i].image,
                                                      title: results6[i].title,
                                                      simple_description: results6[i].simple_description,
                                                      good: results6[i].good,
                                                      gps_latitude: results6[i].gps_latitude,
                                                      gps_longitude: results6[i].gps_longitude,
                                                      tagName : results6[i].tagName
                                                });
                                          };
                                          res.send(searchArr);
                                     });
                               });             
                        });
                  });
           });
     });
});//done

app.post('/search_is_writen', function(req, res){
      var user_id = req.body.user_id;
      var search = req.body.search;
      var searchArr = [];
      var record_overlap =false;

     
 
      connection.query(`
      select story_id, name 
      from story_has_tag st
      left join tag t on t.id = st.tag_id    
      `, function(error, results){
            connection.query(`
            select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
            from story s
            left join story_has_tag st on st.story_id = s.id  
            left join tag t on t.id = st.tag_id
            left join story_count_good scg on scg.story_id = s.id 
            left join user_has_story us on us.story_id = s.id
            left join user u on u.id = us.user_id
            where s.title like ? and u.id = ?
            group by s.id
            `, ['%' + search + '%', user_id], function(error2, results2){
                   let count = 0;
                   var json = {};
                   for (let index = 0; index < results2.length; index++) {
                         for (var index2 = 0; index2 < results.length; index2++) {
                               if(results2[index].id == results[index2].story_id){
                                     var tag_name = results[index2].name+"";
                                     json[count] = tag_name;
                                     count++;
                               }
                         }
                         results2[index]["tagName"] = json;
                         count = 0;
                         json = {};                                    
                   }
                   for(var i in results2) {                        
                         searchArr.push({
                               id : results2[i].id,
                               runtime: results2[i].runtime,
                               image: results2[i].image,
                               title: results2[i].title,
                               simple_description: results2[i].simple_description,
                               good: results2[i].good,
                               gps_latitude: results2[i].gps_latitude,
                               gps_longitude: results2[i].gps_longitude,
                               tagName : results2[i].tagName
                         });
                   };
                   //tag name 으로 서치
                   connection.query(`
                   select story_id, name from story_has_tag st
                   left join tag t on t.id = st.tag_id    
                   `, function(error3, results3){
                         connection.query(`
                         select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                         from story s
                         left join story_has_tag st on st.story_id = s.id  
                         left join tag t on t.id = st.tag_id
                         left join story_count_good scg on scg.story_id = s.id 
                         left join user_has_story us on us.story_id = s.id
                         left join user u on u.id = us.user_id
                         where t.name like ? and u.id = ?
                         group by s.id   
                         `, '%' + search + '%', function(error4, results4){

                              if(results4 == undefined || results4 == ''){
                                    return res.send(searchArr);
                              }
                                let count = 0;
                                var json = {};
                                for (let index = 0; index < results4.length; index++) {
                                      for (var index2 = 0; index2 < results3.length; index2++) {
                                            if(results4[index].id == results3[index2].story_id){
                                                  var tag_name = results3[index2].name+"";
                                                  json[count] = tag_name;
                                                  count++;
                                            }
                                      }
                                      results4[index]["tagName"] = json;
                                      count = 0;
                                      json = {};                                    
                                }
                                for(var i in results4) {                        
                                     record_overlap = false;
                                     for(var j in searchArr){
                                           if(results4[i].id === searchArr[j].id){
                                                 record_overlap = true;
                                           }
                                     }
                                     if(record_overlap)
                                           continue;
                                      searchArr.push({                                           
                                            id : results4[i].id,
                                            runtime: results4[i].runtime,
                                            image: results4[i].image,
                                            title: results4[i].title,
                                            simple_description: results4[i].simple_description,
                                            good: results4[i].good,
                                            gps_latitude: results4[i].gps_latitude,
                                            gps_longitude: results4[i].gps_longitude,
                                            tagName : results4[i].tagName
                                      });
                                };
                                //
                                connection.query(`
                                select story_id, name 
                                from story_has_tag st
                                left join tag t on t.id = st.tag_id    
                                `, function(error5, results5){
                                      connection.query(`
                                      select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, scg.count_good as good, s.simple_description, tagName
                                      from story s
                                      left join story_has_tag st on st.story_id = s.id  
                                      left join tag t on t.id = st.tag_id
                                      left join user_has_story us on us.story_id = s.id
                                      left join user u on us.user_id = u.id
                                      left join story_count_good scg on scg.story_id = s.id 
                                      where us.user_id = (
                                                       select id 
                                                       from user u
                                                       where u.nickName like ?
                                      ) and us.is_writen = 1
                                      group by s.id                                       
                                      `, '%' + search + '%', function(error6, results6){
 
                                           if(results6[0] == undefined || results6 == ''){
                                                 return res.send(searchArr);
                                           }
                                           //
                                           let count = 0;
                                           var json = {};
                                           for (let index = 0; index < results6.length; index++) {
                                                 for (var index2 = 0; index2 < results5.length; index2++) {
                                                       if(results6[index].id == results5[index2].story_id){
                                                             var tag_name = results5[index2].name+"";
                                                             json[count] = tag_name;
                                                             count++;
                                                       }
                                                 }
                                                 results6[index]["tagName"] = json;
                                                 count = 0;
                                                 json = {};                                    
                                           }
                                           for(var i in results6) {  
                                               record_overlap = false;
                                               for(var j in searchArr){
                                                     if(results6[i].id === searchArr[j].id){
                                                           record_overlap = true;
                                                     }
                                               }
                                               if(record_overlap)
                                                     continue;                                                                        
                                                 searchArr.push({
                                                       id : results6[i].id,
                                                       runtime: results6[i].runtime,
                                                       image: results6[i].image,
                                                       title: results6[i].title,
                                                       simple_description: results6[i].simple_description,
                                                       good: results6[i].good,
                                                       gps_latitude: results6[i].gps_latitude,
                                                       gps_longitude: results6[i].gps_longitude,
                                                       tagName : results6[i].tagName
                                                 });
                                           };
                                           res.send(searchArr);
                                      });
                                });             
                         });
                   });
            });
      });
})

app.post('/search_comment_by_story', function(req, res){
      var story_id = req.body.story_id;

      connection.query(`
      select c.description, c.created, c.image, c.user_id, c.story_id
      from comment c
      where c.story_id = ?
      `, [story_id], function(error, results){
            if(error)
                  throw error;

            res.send(results);
      })
})//done //안쓰일 가능성이 농후함

app.post('/findByContentId', function(req, res){
      var rs_id = req.body.contentId;
      connection.query(`
      select location_id from real_story
      where id = ?
      `,[rs_id], function(err, result){
            if(err) throw err;

            console.log(result[0].location_id);
            res.json(result[0].location_id);
      })
})//작은거 id에 해당하는 location_id전달하기 인국이형 숙제

app.post('/findByStoryId', function(req, res){
      var lo_id = req.body.storyId;
      console.log("lo_id = "+lo_id);
      connection.query(`
      select story_id from location
      where id = ?      
      `, [lo_id], function(err, resutl){
            if(err) throw err;

            console.log(resutl[0].story_id);
            res.json(resutl[0].story_id);            
      })
})//인국이형 숙제

///////////////////////////////////////////////search done

app.post('/update_image', upload.single("imgFile"), async function(req, res, next){
      let imgFile = req.file;      
      res.json(imgFile);
});//이미지 추가 이미지 url반환

app.post('/idToNickname', function(req, res){
      var id = req.body.id*1;
      connection.query(`
      select nickName from user
      where id = ?
      `, [id], function(err, ress){
            if(err) throw err;

            res.send(ress);
      })
})

app.post('/create_user', function(req, res){
      var email = req.body.email;
      var password = req.body.password;
      var nickName = req.body.nickName;

      var bool = false;

      //먼저 목록에 같은 이메일을 가지 유저가 있는지 확인한다.
      connection.query(`
      select email 
      from user
      where email = ?
      `, [email], function(err, results){
            if(err) throw err;

            for (let index = 0; index < results.length; index++) {
                  if(results[index].email == email){
                        bool = true;
                        break;
                  }
            }
            if(!bool){
                  connection.query(`
                  select id
                  from user
                  `, function(err2, results2){
                        if(err2) throw err2;
                        var id = Math.floor(Math.random() * (210000000 - 1)) + 1;
                        
                        connection.query(`
                        select id from user
                        `, function(err3, res3){
                              if(err3) throw res3;

                              var bool = false;
                              while (true) {
                                    for (let index = 0; index < res3.length; index++) {
                                          if(res3[index] == id){
                                                bool = true;
                                          }
                                    }
                                    if(bool){
                                          id = id + 1;
                                          bool = false;
                                    }else{
                                          break;
                                    }      
                              }

                              connection.query(`
                              insert into user (id, email, password, nickName)
                              values (?, ?, ?, ?)
                              `, [id, email, password, nickName] ,function(err1, results1){
                                    if(err1) throw err1;
            
                                    
                                    res.json(id);
                              })                              
                        })
                  })
                  
            }else{
                  res.send("이미 동일한 계정의 아이디가 존재합니다.");
                  //res.json(0);
            }
      })
});

//check 완료.
     
app.post('/create_storyline', function(req, res){

      var user_id = req.body.user_id;
      
      var is_writen = 1;      
      if(user_id == 6){
            res.send("dummy는 안되용~!")
      }else{
            connection.query(`
            INSERT INTO story (created) VALUES (now());
            `, function(error, results){
                  if(error) throw error;
                  console.log("성공적으로 story를 생성하였습니다.");
      
                  var story_id = results.insertId      
                  var records2 = [
                        [user_id,  story_id,  is_writen]
                  ]
      
                  connection.query(`
                  INSERT INTO user_has_story (user_id, story_id, is_writen) 
                  VALUES ?;
                  `, [records2], function(error2, result2){
                        if(error2){
                              console.log(error2);
                              throw error2;
                        }
                        console.log("성공적으로 작가와 story를 연결하였습니다.");
                        console.log("방금 추가된 스토리의 id를 리턴합니다.")
                        console.log(story_id);
                        res.send(story_id+'');
                        });
                  });
      }
      
});//done

app.post('/create_location', function(req, res){
      var story_id = req.body.story_id;
      connection.query(`      
      INSERT INTO location (story_id) VALUES (?);
      `, [story_id], function(error, results){
            if(error) throw error;

            connection.query(`
            select * from location where story_id = ?
            `,[story_id],function(error1, results1){
                  if(error1) throw error1;

                  connection.query(`
                  UPDATE location SET lo_index = ? WHERE (id = ?);
                  `, [results1.length, results.insertId], function(error2, results2){
                        if(error2) throw error2;

                        res.send("location_id = " + results.insertId);
                  });
            });            
      });
});//done

app.post('/create_real_location', function(req, res){
      var location_id = req.body.location_id;
      console.log(1);
      connection.query(`
      INSERT INTO real_story (location_id) VALUES (?);
      `, [location_id], function(error, results){
            if(error) throw error;

            console.log(2);
            connection.query(`
            select * from real_story where location_id = ?
            `, [location_id], function(error2, results2){
                  if(error2) throw error2;
                  console.log(3);      

                  connection.query(`
                  UPDATE real_story SET rs_index = ? WHERE (id = ?);
                  `,[results2.length, results.insertId], function(error3, results3){
                        if(error3) throw error3;

                        console.log("chage rs_index");
                        res.json(results.insertId);
                  })
            })
      })
});//done

app.post('/create_comment', function(req, res){
      var user_id = req.body.user_id;
      var story_id = req.body.story_id;
      connection.query(`
      INSERT INTO comment (user_id, story_id) VALUES (?, ?);
      `, [user_id, story_id], function(error, results){
            if(error) throw error;

            res.send("created comment id = " + results.insertId);
      })
})//done

app.post('/create_tag', function(req, res){
      var tag_name = req.body.tag_name;
      var records = [
            [tag_name],
      ];
      connection.query(`
      INSERT INTO tag (name) 
      VALUES (?);
      `,records,  function(error, results){
            if(error){
                  console.log(error);
                  throw error;                  
            }
            res.send(tag_name+"이 잘 생성되었습니다.");
      })      
})//추후 인국이 형이 보내준 태그배열을 뒤져 보낼 예정 간단한 tag만들기 done

///////////////////////////////////////////////create done

//update user nickname
app.post('/update_nickname', function(req, res){
      var new_nick = req.body.nickname;
      var user_id = req.body.user_id;
      connection.query(`
      UPDATE user SET nickName = ? WHERE (id = ?);
      `, [new_nick, user_id], function(error, results){
            if(error) throw error;

            res.send("new nickname = " + new_nick);
      })
});//done

//update story and tags
app.post('/update_story', function(req, res){
      var story_id      = req.body.story_id;
      var up_runtime    = req.body.runtime;
      var up_image      = req.body.image;
      var up_title      = req.body.title;
      var up_sim_des    = req.body.simple_description;
      var up_gps_la     = req.body.gps_la;
      var up_gps_lo     = req.body.gps_lo;
      var up_tags       = req.body.tags;

      if(up_runtime!=""){
            connection.query(`
            UPDATE story 
            SET runtime = ?
            WHERE (id = ?);            
            `, [up_runtime, story_id], function(error1, results1){
                  if(error1) throw error1;

                   console.log("runtime update 완료.");
            })
      }
      if(up_image!=""){             //S3에 저장된 image의 url을 저장하는 것
            if(up_image != null){
                  connection.query(`
                  UPDATE story 
                  SET image = ?
                  WHERE (id = ?);            
                  `, [up_image, story_id], function(error1, results1){
                        if(error1) throw error1;
      
                         console.log("up_image update 완료.");
                  })
            }            
      }
      if(up_title!=""){
            connection.query(`
            UPDATE story 
            SET title = ?
            WHERE (id = ?);            
            `, [up_title, story_id], function(error1, results1){
                  if(error1) throw error1;

                   console.log("up_title update 완료.");
            })
      }
      if(up_sim_des!=""){
            connection.query(`
            UPDATE story 
            SET simple_description = ?
            WHERE (id = ?);            
            `, [up_sim_des, story_id], function(error1, results1){
                  if(error1) throw error1;

                   console.log("up_sim_des update 완료.");
            })
      }
      if(up_gps_la!=""){
            connection.query(`
            UPDATE story 
            SET gps_latitude = ?
            WHERE (id = ?);            
            `, [up_gps_la, story_id], function(error1, results1){
                  if(error1) throw error1;

                   console.log("up_gps_la update 완료.");
            })
      }
      if(up_gps_lo!=""){
            connection.query(`
            UPDATE story 
            SET gps_longitude = ?
            WHERE (id = ?);            
            `, [up_gps_lo, story_id], function(error1, results1){
                  if(error1) throw error1;

                   console.log("up_gps_lo update 완료.");
            })
      }
      if(up_tags!=""){
            connection.query(`
            UPDATE story 
            SET tagName = ?
            WHERE (id = ?);            
            `, [up_tags, story_id], function(error1, results1){
                  if(error1) throw error1;

                   console.log("up_tags update 완료.");
            })
      }
      res.send("good");
            
});//tags 미 구현

//update location
app.post('/update_location', function(req, res){
      var location_id = req.body.location_id;
      var up_name = req.body.l_name;
      var up_title = req.body.l_title;
      var up_image = req.body.l_image;
      var up_gps_la = req.body.gps_la;
      var up_gps_lo = req.body.gps_lo;
      var up_summary = req.body.summary;

      if(up_name!=''){
            connection.query(`
            UPDATE location SET name = ?
            WHERE (id = ?);
            `, [up_name, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("up_name update Complete!");
            });            
      }
      if(up_title!=''){
            connection.query(`
            UPDATE location SET title = ?
            WHERE (id = ?);
            `, [up_title, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("up_title update Complete!");
            });            
      }
      if(up_image!=''){
            if(up_image != null){
                  connection.query(`
                  UPDATE location SET location_image = ?
                  WHERE (id = ?);
                  `, [up_image, location_id], function(error, results){
                        if(error)
                              throw error;
            
                        console.log("up_image update Complete!");
                  });  
            }
                      
      }
      if(up_gps_la!=''){
            connection.query(`
            UPDATE location SET gps_latitude = ?
            WHERE (id = ?);
            `, [up_gps_la, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("up_gps_la update Complete!");

                  connection.query(`
                  select story_id from location
                  where id = ?
                  `,[location_id], function(err2, results2){
                        if(err2) throw err2;

                        connection.query(`
                        select gps_latitude, lo_index from location
                        where story_id = ?
                        `,[results2[0].story_id], function(err3, results3){
                              if(err3) throw err3;

                              var min = 999;
                              var first_gps_la = null;

                              for (let index = 0; index < results3.length; index++) {
                                    if(results3[index].lo_index < min){
                                          min = results3[index].lo_index;
                                          first_gps_la = results3[index].gps_latitude;
                                    }
                              }

                              if(min != 999){
                                    connection.query(`
                                    update story set gps_latitude = ?
                                    where id = ?
                                    `,[first_gps_la, results2[0].story_id], function(err4, results4){
                                          if(err4) throw err4;

                                          console.log('story gps_latitude was completely changed!');
                                    })
                              }
                        })
                  })

                  
            });            
      }
      if(up_gps_lo!=''){
            connection.query(`
            UPDATE location SET gps_longitude = ?
            WHERE (id = ?);
            `, [up_gps_lo, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("up_gps_lo update Complete!");

                  connection.query(`
                  select story_id from location
                  where id = ?
                  `,[location_id], function(err2, results2){
                        if(err2) throw err2;

                        connection.query(`
                        select gps_longitude, lo_index from location
                        where story_id = ?
                        `,[results2[0].story_id], function(err3, results3){
                              if(err3) throw err3;

                              var min = 999;
                              var first_gps_lo = null;

                              for (let index = 0; index < results3.length; index++) {
                                    if(results3[index].lo_index < min){
                                          min = results3[index].lo_index;
                                          first_gps_lo = results3[index].gps_longitude;
                                    }
                              }

                              if(min != 999){
                                    connection.query(`
                                    update story set gps_longitude = ?
                                    where id = ?
                                    `,[first_gps_lo, results2[0].story_id], function(err4, results4){
                                          if(err4) throw err4;

                                          console.log('story gps_longitude was completely changed!');
                                    })
                              }
                        })
                  })
            });            
      }
      if(up_summary!=''){
            connection.query(`
            UPDATE location SET summary = ?
            WHERE (id = ?);
            `, [up_summary, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("up_summary update Complete!");
            });            
      }
      res.send("?")
      
});//done

app.post('/update_location_lo_index', function(req, res){
      //var location_index_array = req.body.location_index_array;
      var Array = req.body.data; 


      for (let index = 0; index < Array.length; index++) {
            var location_id = Array[index]["id"];
            var location_index = Array[index]["lo_index"];
            console.log("id = " + location_id + ", location_index = " + location_index);
            connection.query(`
            update location set lo_index = ?
            where id = ?
            `,[location_index, location_id], function(error1, results1){
                  if(error1) throw error1;

                  console.log("id = " + location_id + ", location_index = " + location_index);
            })
      }

      res.send("Change Complete!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!z");
      
})//need test

app.post('/update_real_story_rs_index', function(req, res){
      var rs_index_array = req.body.rs_index_array;
     
      for (let index = 0; index < rs_index_array.length; index++) {
            var records = [
                  [rs_index_array[index].lo_index, rs_index_array[index].id]
            ];
            connection.query(`
            update real_story set rs_index = ?
            where id = ?
            `,[records], function(error1, results1){
                  if(error1) throw error1;

                  console.log("change rs_index rs_id: " + rs_index_array[index].id + "rs_index : " + rs_index_array[index].rs_index);
            })
      }
      console.log("change Complete.");
      res.send("change Complete.");
})//need test

//update real_story
app.post('/update_real_story', function(req, res){
      var real_id      = req.body.real_id;
      var up_rl_text = req.body.rl_text;
      var up_rl_image = req.body.rl_image;
      var up_rl_video = req.body.rl_video;

      if(up_rl_text !='' && up_rl_text != '0'){
            connection.query(`
            UPDATE real_story SET location_text = ? WHERE (id = ?);
            `, [up_rl_text, real_id], function(error1, results1){
                  if(error1) throw error1;

                  console.log("up_rl_text update Success!");
            })
      }else if(up_rl_text == 0){
            connection.query(`
            UPDATE real_story SET location_text = ? WHERE (id = ?);
            `, ['', real_id], function(error1, results1){
                  if(error1) throw error1;

                  console.log("up_rl_text update Success!");
            })
      }
      if(up_rl_image !=''){
            connection.query(`
            UPDATE real_story SET location_image = ? WHERE (id = ?);
            `, [up_rl_image, real_id], function(error1, results1){
                  if(error1) throw error1;

                  console.log("up_rl_image update Success!");

                  connection.query(`
                  select location_id from real_story
                  where id = ?
                  `,[real_id], function(err2, results2){

                        connection.query(`
                        select rs_index, location_image 
                        from real_story
                        where location_id = ?
                        `,[results2[0].location_id],function(err, results){
                              if(err) throw err;

                              var min = 999;
                              var first_image = null;
      
                              for (let index = 0; index < results.length; index++) {
                                    if(results[index].location_image != null){
                                          if(results[index].rs_index < min){
                                                min = results[index].rs_index;
                                                first_image = results[index].location_image;
                                                console.log("first_image = " + first_image);
                                          }
                                    }
                              }

                              if(min != 999){
                                    connection.query(`
                                    update location set location_image = ? 
                                    where id = ?
                                    `,[first_image, results2[0].location_id], function(err3, results3){

                                          console.log("location_image is changed!!");
                                    })
                              }
                        })                        
                  })
            })
      }
      if(up_rl_video !=''){
            connection.query(`
            UPDATE real_story SET location_video = ? WHERE (id = ?);
            `, [up_rl_video, real_id], function(error1, results1){
                  if(error1) throw error1;

                  console.log("up_rl_video update Success!");
            })
      }                  
      res.send("Good");      
});//done

//update comment
app.post('/update_comment', function(req, res){
      var up_desc = req.body.description;
      var up_image = req.body.image;
      var comment_id = req.body.comment_id;

      if(up_desc!=""){
            connection.query(`
            UPDATE comment SET description = ?, created = now()
            WHERE (id = ?);
            `, [up_desc, comment_id], function(error, results){
                  if(error)
                        throw error
      
                  console.log("댓글 수정 완료");
            })
      }
      if(up_image!=""){
            connection.query(`
            UPDATE comment SET image = ?, created = now()
            WHERE (id = ?);
            `, [up_image, comment_id], function(error, results){
                  if(error)
                        throw error
      
                  console.log("댓글 수정 완료");
            })
      }
      res.send("123")            
});//done

app.post('/update_story_good', function(req, res){
      var story_id = req.body.story_id;
      var client_id = req.body.client_id;

      if(client_id == 6){
            return res.send("Please Login First");
      }
      
      var bool = false;
      connection.query(`
      select client_id, story_id, good_check 
      from story_good
      where story_id = ? and client_id = ?
      `,[story_id, client_id], function(error, results){
            if(error) throw error;

           //스토리가 존재하지 않는다면 좋아요 스토리를만들고 check를 1로 만들고 
            if(results == undefined || results == ''){
                  connection.query(`
                  insert into story_good 
                  (client_id, story_id, good_check)
                  values (?, ?, 1)
                  `,[client_id, story_id], function(error1, results1){
                        if(error1) throw error1;


                        connection.query(`
                        select * from count_good
                        where story_id = ?                        
                        `, [story_id], function(err4, results4){

                              var count = results4[0].count_good*1;
                              console.log("count = " + count);


                              connection.query(`
                              insert into story_count_good
                              (story_id, count_good)
                              values (?, ?)
                              `, [story_id, 1], function(err2, results2){
                                    if(err2) throw err2;

                                    res.send("좋아요를 올렸습니다.");
                              })
                        })
                  })
            }else if(results[0].good_check == 0){
                  connection.query(`
                  update story_good
                  set good_check = 1
                  where story_id = ? and client_id = ?
                  `, [story_id, client_id], function(error1, results1){
                        if(error1) throw error1;

                        
                        connection.query(`
                        select * from story_count_good
                        where story_id = ?                        
                        `, [story_id], function(err4, results4){
                              var count = results4[0].count_good*1;
                              console.log("count = " + count);

                              connection.query(`
                              update story_count_good 
                              set count_good = ?
                              where story_id = ?
                              `, [count + 1, story_id], function(err2, results2){
                                    if(err2) throw err2;
      
                                    res.send("좋아요를 올렸습니다.");
                              })
                        })


                        
                  })
            }else if(results[0].good_check == 1){
                  connection.query(`
                  update story_good
                  set good_check = 0
                  where story_id = ? and client_id = ?
                  `, [story_id, client_id], function(error1, results1){
                        if(error1) throw error1;

                        connection.query(`
                        select * from story_count_good
                        where story_id = ?                        
                        `, [story_id], function(err4, results4){
                              var count = results4[0].count_good*1;
                              console.log("count = " + count);

                              connection.query(`
                              update story_count_good 
                              set count_good = ?
                              where story_id = ?
                              `, [count - 1, story_id], function(err2, results2){
                                    if(err2) throw err2;
      
                                    res.send("좋아요를 올렸습니다.");
                              })
                        })

                        
                  })
            }
            else{//알 수 없는 경로
                  res.send("뭔짓을 한거죠?");
            }            
      })
});

///////////////////////////////////////////////update done

//delete story ==  and st_tag, location, real_story
app.post('/delete_story', function(req, res){
      var de_story_id = req.body.story_id;

      connection.query(`
      delete from story
      where id = ?
      `,[de_story_id], function(error, results){
            if(error)
                  throw error;

            console.log("delete story with cascasde.");
            res.send("delete story with cascasde.");
      })
})

//delete location
app.post('/delete_location', function(req, res){
      var de_location_id = req.body.location_id;

      connection.query(`
      delete from location
      where id = ?
      `,[de_location_id], function(error, results){
            if(error)
                  throw error;

            console.log("delete location with cascade.");
            res.send("delete location with cascade.")
      })
})

//delete real_story
app.post('/delete_real_story', function(req, res){
      var de_real_id = req.body.real_id;

      connection.query(`
      delete from real_story
      where id = ?
      `, [de_real_id], function(error, results){
            if(error)
                  throw error

            console.log("delete real_story.");
            res.send("delete real_story.")
      })
})

//delete comment
app.post('/delete_comment', function(req, res){
      var de_com_id = req.body.comment_id;

      connection.query(`
      delete from comment
      where id = ?
      `, [de_com_id], function(error, results){
            if(error)
                  throw error;

            console.log("delete comments.");            
      })
})

app.post('/login', function(req, res){
      var email = req.body.email;
      var pw = req.body.pw;

      connection.query(`
      select * from user
      where email = ?
      `,[email], function(error, results){
            if(error) throw error;

            if(results[0].password == pw){
                  res.send(results);
            }else{
                  res.send("login fail!");
            }
      })
});


///////////////////////////////////////////////delete done

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//connection.end();
