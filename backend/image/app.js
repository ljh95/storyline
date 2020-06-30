var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mysql      = require('mysql'); 
var fs = require('fs');
var http = require('http')
var Canvas = require('canvas')
var connection = mysql.createConnection({
  host     : 'aws2-rds.c5wiyouiqpec.ap-northeast-2.rds.amazonaws.com',
  user     : 'egoing',
  password : 'egoing111111',
  port     : '3306',
  database : 'mydb'
});

connection.connect();

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/main',function(req,res) { 
      var user_id = 0;
      if(req.body.user_id != 0 || req.body.user_id != undefined)
            user_id = req.body.user_id;
      
      var html = `
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
});

app.post('/main', function(req, res){
      var selected = req.body.selectStory;
      if(selected === 'good'){
            connection.query(`
            select story_id, name from story_has_tag st
            left join tag t on t.id = st.tag_id    
            `, function(error, results){
                  connection.query(`
                  select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
                  from story s
                  left join story_has_tag st on st.story_id = s.id  
                  left join tag t on t.id = st.tag_id      
                  group by s.id   
                  order by s.good desc
                  `, function(error2, results2){
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
      }else{
            res.send("main 메소드 오류.")
      }
      
});//gps값을 가져와 가까운 순으로 정렬 미구현

app.post('/choose', function(req, res){
      var user_id = req.body.user_id;
      var is_ing = req.body.is_ing;
      var is_gone = req.body.is_gone;
      var is_recommanded = req.body.is_recommanded;
      var is_writen = req.body.is_writen;

      if(user_id === undefined){
            res.send("user_id값이 존재하지 않습니다.")
      }else{
            if(is_ing == 1){
                  connection.query(`
                  select story_id, name from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error, results){
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
                        FROM story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id                                         
                        left join user_has_story us on us.story_id = s.id
                        left join mydb.user u on u.id = us.story_id
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
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
                        FROM story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id                                         
                        left join user_has_story us on us.story_id = s.id
                        left join mydb.user u on u.id = us.story_id
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
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
                        FROM story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id                                         
                        left join user_has_story us on us.story_id = s.id
                        left join mydb.user u on u.id = us.story_id
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
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
                        FROM story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id                                         
                        left join user_has_story us on us.story_id = s.id
                        left join mydb.user u on u.id = us.story_id
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
      select us.is_writen, us.user_id from user_has_story us 
      left join story s on s.id = us.story_id
      where s.id = ?
      group by s.id;
      `,[story_id], function(error1, results1){
            if(error1)
                  throw error1;

            console.log(results1)
            console.log(results1[0])
            console.log(results1[0].user_id)
            var own_id = results1[0].user_id;
            if(results1[0].is_writen == 1 && user_id == own_id){
                  //본인 스토리 수정
                  res.send("??");
            }else{
                  connection.query(`
                  select name, story_id from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error, results){
                        if(error)
                              throw error;
                        
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
                        from story s
                        left join story_has_tag st on st.story_id = s.id
                        where s.id = ?
                        group by s.id
                        `,[story_id],  function(error2, results2){
                              if(error2)
                                    throw error2;
                              
                              var json = {};
                              let tag_count = 0;

                              for (let index = 0; index < results.length; index++) {
                                    var st_id = results[index].story_id;

                                    if(results2[0].id == st_id){//이 게시판에 태그들이 들어가야하는경우
                                          var kk = results[index].name+"";//값을 만들어준다.
                                          json[tag_count] = kk;//json 객체에 키와 값을 만들어준다.
                                          tag_count++;                                          
                                    }else{
                                          continue;
                                    }
                              }
                              results2[0]["tagName"]  = json;                                                            
                              res.send(results2);                              
                        }) 
                        
                  })                  
            }
      })
});//done

app.post('/find_location2', function(req, res){
      var story_id = req.body.story_id;

      connection.query(`
      select l.* from location l
      left join story s on s.id = l.story_id
      where s.id = ?
      `, [story_id], function(error, results){
            if(error)
                  throw error;

            var json = {};
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
      select rl.id, rl.location_text, rl.location_image, rl.location_video from real_story rl
      where rl.location_id = ?
      `,[location_id], function(error, results){
            if(error)
                  throw error;

            var json = {};
            for (let index = 0; index < results.length; index++) {
                  json[index] = {
                        id : results[index].id,
                        location_text : results[index].location_text,
                        location_image : results[index].location_image,
                        location_video : results[index].location_video
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
     select story_id, name from story_has_tag st
     left join tag t on t.id = st.tag_id    
     `, function(error, results){
           connection.query(`
           select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
           from story s
           left join story_has_tag st on st.story_id = s.id  
           left join tag t on t.id = st.tag_id
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
                  //
                  connection.query(`
                  select story_id, name from story_has_tag st
                  left join tag t on t.id = st.tag_id    
                  `, function(error3, results3){
                        connection.query(`
                        select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
                        from story s
                        left join story_has_tag st on st.story_id = s.id  
                        left join tag t on t.id = st.tag_id
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
                               select story_id, name from story_has_tag st
                               left join tag t on t.id = st.tag_id    
                               `, function(error5, results5){
                                     connection.query(`
                                     select s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description, tagName
                                     from story s
                                     left join story_has_tag st on st.story_id = s.id  
                                     left join tag t on t.id = st.tag_id
                                     left join user_has_story us on us.story_id = s.id
                                     left join user u on us.user_id = u.id
                                     where u.name like ?
                                     group by s.id   
                                     `, '%' + search + '%', function(error6, results6){
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
                                            //
                                            res.send(searchArr);
                                     });
                               });             
                        });
                  });
           });
     });
});//done

app.post('/search_comment_by_story', function(req, res){
      var story_id = req.body.story_id;

      connection.query(`
      select c.description, c.created, c.image, c.user_id
      from comment c
      where c.story_id = ?
      `, [story_id], function(error, results){
            if(error)
                  throw error;

            res.send(results);
      })
})

app.post('/getImage', function(req, res){
      var img = new Canvas.Image()
      img.src = Buffer.concat(chunks)
      
})

app.get('/file/:name', function (req, res, next) {
      var options = {
        root: path.join(__dirname, 'public'),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
    
      var fileName = req.params.name
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err)
        } else {
          console.log('Sent:', fileName)
        }
      })
})

app.get('/main/:image_id', function (req, res) {
      var filepath = /home/ubuntu/app/node/SecondProject/image/image_id;
     res.sendFile(filepath);
  });

///////////////////////////////////////////////search done
     
app.post('/create_storyline', function(req, res){

      var runtime = req.body.runtime;
      var image  = req.body.image;
      var title = req.body.title;
      var simple_description = req.body.simple_description;

      var records = [
            [runtime, image, title, simple_description]
      ]
      
      connection.query(`
      insert into story (runtime, image, title, simple_description)
      values ?;
      `, [records], function(error, results){
            if(error){
                  console.log(error);
                  throw error;
            }
            console.log("성공적으로 story를 추가하였습니다.");

            //만든 사람과 스토리를 이어주는 모습
            var user_id = req.body.user_id;
            var story_id = results.insertId
            var is_writen = 1;

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
            //작가와 연결해 주는 부분이 필요합니다.
});//done

app.post('/create_location', function(req, res){      
      var l_name = req.body.location_name;
      var l_title = req.body.title;
      var l_image = req.body.location_image; 
      var l_story_id = req.body.story_id; 
      var l_gps_latitude = req.body.gps_latitude;
      var l_gps_longitude =req.body.gps_longitude;      

      var records = [
            [l_name, l_title, l_image, l_story_id, l_gps_latitude, l_gps_longitude],
          ];
      connection.query(`      
      INSERT INTO location (name, title, location_image, story_id, gps_latitude, gps_longitude) 
      VALUES ?;
      `, [records], function(error, results){
            if(error){
                  console.log(error);
                  throw error;
            }
            console.log("장소 레코드 추가 완료.")
            res.send("장소 레코드 추가 완료.");
      });
});//done

app.post('/create_real_location', function(req, res){

      var location_id = req.body.location_id;      

      var explanation_type = req.body.explanation_type;      
      var explanation_text = req.body.explanation_text;
      var explanation_image = req.body.explanation_image;
      var explanation_video = req.body.explanation_video;
      console.log("explanation_text = " + explanation_text);
      console.log("explanation_image = " + explanation_image);
      console.log("explanation_video = " + explanation_video);
      if(explanation_type === 'text_type' && explanation_text != ""){
            

            var records = [
                  [ location_id, explanation_text],
            ];

            connection.query(`
            INSERT INTO real_story (location_id, location_text) 
            VALUES ?
            `, [records], function(error, results){
                  if(error)
                        throw error;
                  res.send("Create Real_Story_Text Success!")
            });
      }else if(explanation_type === 'image_type' && explanation_image != ""){
            

            var records = [
                  [location_id, explanation_image],
            ];

            connection.query(`
            INSERT INTO real_story (location_id, location_image) 
            VALUES ?
            `, [records], function(error, results){
                  if(error)
                        throw error;
                  res.send("Create Real_Story_Image Success!")
            });
      }else if(explanation_type === 'video_type'&& explanation_video != ""){
            

            var records = [
                  [location_id, explanation_video],
            ];

            connection.query(`
            INSERT INTO real_story (location_id, location_video) 
            VALUES ?
            `, [records], function(error, results){
                  if(error)
                        throw error;
                  res.send("Create Real_Story_Video Success!")
            })
      }else{
            res.send('잘못된 타입을 지정하였습니다.')
      }
});//done

app.post('/create_comment', function(req, res){
      var user_id = req.body.user_id;
      var story_id = req.body.story_id;
      var comment = req.body.comment;
      var comment_image = req.body.comment_image;

      if(comment_image === ''){
            var records = [
                  [comment, user_id, story_id],
            ];

            connection.query(`
            INSERT INTO comment (description, user_id, story_id) 
            VALUES ?;
            `, [records], function(error, results){
                  if(error)
                        throw error;
                  res.send("Text Comment Success!");
            })

      }else if(comment === ''){
            var records = [
                  [comment_image, user_id, story_id],
            ];

            connection.query(`
            INSERT INTO comment (image, user_id, story_id) 
            VALUES ?;
            `, [records], function(error, results){
                  if(error)
                        throw error;
                  res.send("Image Comment Success!");
            });

      }else if(comment != '' && comment_image != ''){
            var records = [
                  [comment, comment_image, user_id, story_id],
            ];

            connection.query(`
            INSERT INTO comment (description, image, user_id, story_id) 
            VALUES ?;
            `, [records], function(error, results){
                  if(error)
                        throw error;
                  res.send("Text, Image Comment Success!");
            });
      }else{
            res.send("둘 중 하나의 값은 입력 해야 합니다.")
      }
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
      connection.query(`
      select name, id from user
      `, function(error, results){
            if(error)
                  throw error;
            var own_id = req.body.own_id;
            var no_id = false;
            for (let index = 0; index < results.length; index++) {
                  var user_id = results[index].id;
                  var new_nick_name = req.body.new_nick_name;
                  
                  if(user_id == own_id){
                        no_id = true;
                        break;                        
                  }       
            }
            if(no_id == false){
                  res.send("nop");
            }
            else{
                  console.log(4)
                  connection.query(`
                  UPDATE user 
                  SET nickName = ? WHERE (id = ?);
                  `, [new_nick_name, user_id], function(error2, results2){
                        if(error2)
                              throw error2;
      
                        console.log(5);
                        res.send("good change");
                  })
            }
      })
});//done

//update story and tags
app.post('/update_story', function(req, res){
      var up_runtime = req.body.runtime*1;
      var up_image = req.body.image;
      var up_title = req.body.title;
      var up_simple_description = req.body.simple_description;
      var story_id = req.body.story_id*1;
      /* var up_tags = req.body.tags;
      var json = {};
      let count = 0;
      for (let index = 0; index < up_tags.length; index++) {
            var tag = up_tags[index]+'';
            json[count] = tag;
            count++;
      } */       
      
      /* var records = [
            [up_runtime, up_image, up_title, up_simple_description, story_id]
      ] */

      if(up_runtime!=""){
            connection.query(`
            UPDATE story 
            SET runtime = ?
            WHERE (id = ?);            
            `, [up_runtime, story_id], function(error1, results1){
                  if(error1)
                        throw error1;

                   console.log("runtime update 완료.");
            })
      }
      if(up_image!=""){
            connection.query(`
            UPDATE story 
            SET image = ?
            WHERE (id = ?);            
            `, [up_image, story_id], function(error1, results1){
                  if(error1)
                        throw error1;

                   console.log("up_image update 완료.");
            })
      }
      if(up_title!=""){
            connection.query(`
            UPDATE story 
            SET title = ?
            WHERE (id = ?);            
            `, [up_title, story_id], function(error1, results1){
                  if(error1)
                        throw error1;

                   console.log("up_title update 완료.");
            })
      }
      if(up_simple_description!=""){
            connection.query(`
            UPDATE story 
            SET simple_description = ?
            WHERE (id = ?);            
            `, [up_simple_description, story_id], function(error1, results1){
                  if(error1)
                        throw error1;

                   console.log("up_simple_description update 완료.");
            })
      }
      res.send("??");
            
});//tags 미실험

//update location
app.post('/update_location', function(req, res){
      var up_name = req.body.l_name;
      var up_title = req.body.l_title;
      var up_image = req.body.l_image;
      var gps_la = req.body.gps_la;
      var gps_lo = req.body.gps_lo;
      var location_id = req.body.location_id;

      if(up_name!=""){
            connection.query(`
            UPDATE location SET name = ?
            WHERE (id = ?);
            `, [up_name, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("up_name update Complete!");
            });            
      }
      if(up_title!=""){
            connection.query(`
            UPDATE location SET title = ?
            WHERE (id = ?);
            `, [up_title, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("up_title update Complete!");
            });            
      }
      if(up_image!=""){
            connection.query(`
            UPDATE location SET location_image = ?
            WHERE (id = ?);
            `, [up_image, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("up_image update Complete!");
            });            
      }
      if(gps_la!=""){
            connection.query(`
            UPDATE location SET gps_latitude = ?
            WHERE (id = ?);
            `, [gps_la, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("gps_la update Complete!");
            });            
      }
      if(gps_lo!=""){
            connection.query(`
            UPDATE location SET gps_longitude = ?
            WHERE (id = ?);
            `, [gps_lo, location_id], function(error, results){
                  if(error)
                        throw error;
      
                  console.log("gps_lo update Complete!");
            });            
      }
      res.send("?")
      
});//done

//update real_story
app.post('/update_real_story', function(req, res){
      var select_type = req.body.type;
      var up_rl_text = req.body.rl_text;
      var up_rl_image = req.body.rl_image;
      var up_rl_video = req.body.rl_video;

      var up_l_id = req.body.real_id;

      if(select_type === 'text' && up_rl_text != ""){
            connection.query(`
            UPDATE real_story SET location_text = ? WHERE (id = ?);
            `, [up_rl_text, up_l_id], function(error, results){
                  if(error)
                        throw error;

                  //text update 완료
                  console.log("text update 완료");
            })
      }else if(select_type === 'image' && up_rl_image != ""){      
            connection.query(`
            UPDATE real_story SET location_image = ? WHERE (id = ?);
            `, [up_rl_image, up_l_id], function(error, results){
                  if(error)
                        throw error;

                  //image update 완료
                  console.log("image update 완료");
            })
      }else if(select_type === 'video' && up_rl_video != ""){
            connection.query(`
            UPDATE real_story SET location_video = ? WHERE (id = ?);
            `, [up_rl_video, up_l_id], function(error, results){
                  if(error)
                        throw error;

                  //video update 완료
                  console.log("video update 완료");
            })            
      }else{
            //잘못된 요청
            console.log("잘못된 요청")
      }
      res.send("???");
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
      })
})

//delete location
app.post('/delete_loaction', function(req, res){
      var de_location_id = req.body.location_id;

      connection.query(`
      delete from location
      where id = ?
      `,[de_location_id], function(error, results){
            if(error)
                  throw error;

            console.log("delete location with cascade.");
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

///////////////////////////////////////////////delete done

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//connection.end();


/* ceate tag 부분
var tagnames = new Array();
            var tagids = new Array();
            for (let index = 0; index < results.length; index++) {
                  tagnames[index] = results[index].name;
                  tagids[index] = results[index].id;
            }            
            //현재 태그목록에 동일한 이름을 가진 태그가 있는경우.
            for (let index = 0; index < tagnames.length; index++) {
                  
            }
            //동일한 이름의 태그가 없는 경우
            connection.query(`
            INSERT INTO tag (name) VALUES (?)
            `, [tag_name], function(error, results){
                  if(error)
                        throw error;
                  console.log("태그 생성 완료.")
                  var tag_id = results.insertId;
                  var story_id = req.body.story_id;
      
                  var records = [
                        [story_id, tag_id],
                  ];
                  connection.query(`
                  INSERT INTO story_has_tag (story_id, tag_id) 
                  VALUES ?;
                  `, [records], function(error2, results2){
                        if(error2)
                              throw error2;
                        
                        console.log("story_has_tag 생성 완료");
                        res.send("story_has_tag 생성 완료");
                  })
            })

*/



/* connection.query(`
                  SELECT t.name, s.id, s.image, s.runtime, s.title, s.gps_latitude, s.gps_longitude, s.good, s.simple_description 
                  FROM story s
                  left join story_has_tag st on s.id = st.story_id
                  left join tag t on st.tag_id = t.id
                  left join user_has_story us on us.story_id = s.id
                  left join user u on us.user_id = u.id
                  where u.name like ?
                  group by s.id;
                  `, '%' + search + '%', function(error3, result3){
                        if(error3){
                              throw error3;
                        }
                        
                        for(var i in result3) {
                              record_overlap = false;
                              for(var j in searchArr){
                                    if(result3[i].id === searchArr[j].id){
                                          record_overlap = true;
                                    }
                              }
                              if(record_overlap)
                                    continue;
                                    
                              searchArr.push({
                                    id : result3[k].id,
                                    name : result3[k].name,
                                    image: result3[k].image,
                                    runtime: result3[k].runtime,
                                    title: result3[k].title,
                                    gps_latitude: result3[k].gps_latitude,
                                    gps_longitude: result3[k].gps_longitude,
                                    good: result3[k].good,
                                    simple_description: result3[k].simple_description
                                    
                              });                              
                        }
                        //만약 story이름이 같다면 보이지 않게한다.
                        res.send(searchArr);
                  });
 */








/* connection.query(`
select l.gps_latitude, l.gps_longitude
from location l
left join story_has_location sl on sl.location_id = l.id
left join story s on s.id = sl.story_id
where s.id = (?);
`, story_id, function(error3, results3){
      if(error3){
            throw error3;
      }
      console.log("story_id = ");
      console.log(story_id);
      var s_latitude = results3[0].gps_latitude;
      var s_longitude = results3[0].gps_longitude;

      console.log("s_latitude = ");
      console.log(s_latitude);
      console.log("s_longitude = ");
      console.log(s_longitude);

      connection.query(`
      UPDATE story 
      SET gps_latitude = ?, gps_longitude = ? 
      WHERE id = ?;
      `, [s_latitude, s_longitude, story_id], function(error4, result4){
            if(error4){
                  throw error4;
            }
            console.log("스토리에gps 업데이트 완료.");
            res.send("모두 성공");
      });
}); */