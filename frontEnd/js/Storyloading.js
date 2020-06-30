function jQueryLoad() {
  $StoryContent = $('#StoryContent');
}

function DeviceCheck(check = 'all') {
  // 체크를 위한 변수부분입니다.
  var networkState;
  // 네트워크 체크
  if (check == 'network' || check == 'all') {
    console.log('네트워크를 체크합니다');
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
      checkConnection();
    }

    function checkConnection() {
      var networkState = navigator.connection.type;

      var states = {};
      states[Connection.UNKNOWN] = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI] = 'WiFi connection';
      states[Connection.CELL_2G] = 'Cell 2G connection';
      states[Connection.CELL_3G] = 'Cell 3G connection';
      states[Connection.CELL_4G] = 'Cell 4G connection';
      states[Connection.CELL] = 'Cell generic connection';
      states[Connection.NONE] = 'No network connection';

      console.log(states[networkState]);
      return states[networkState];
    }
  }
}

var gps_lon = new Array();
var gps_lat = new Array();
var storyIDlist = new Array();

// stroy[i].story_id, stroy[i].id, stroy[i].name, stroy[i].title, stroy[i].location_image, stroy[i].gps_latitude, stroy[i].gps_longitude
function StroyMaker(story_id = "테스트로 출력된 제목입니다", id = "스토리라인에 대한 간단 요약입니다", loc = 0, title = null, image = "img/StoryDefault.png", gps_latitude = 37.487224, gps_longitude = 126.825224, summary = "") {

  if (image==null) {
  image = "img/StoryDefault.png"
  }
  if (loc==null) {
  loc = ""
  }
  if (summary==null) {
  summary = ""
  }
  if (title==null) {
  title = "이름없는 스토리라인"
  }


  // image = "https://cdn.pixabay.com/photo/2019/10/02/16/56/landscape-4521413_960_720.jpg",
  //스토리라인 HTML 을 만듭니다
  stroyHTML = "";
  stroyHTML += '<!-- 스토리라인 --> <div class="stroycard"> <img src="'; // 시작부분
  stroyHTML += image + '"> <div class="story_info"> <div class="story_upper"> <div class="story_titlebox"> <div class="story_position">';
  stroyHTML += loc + '</div> <div class="story_title">';
  stroyHTML += title + '</div> </div> <div class="story_mapBnt"> 지도 </div> </div> <div class="story_summary">'; //이름
  stroyHTML += summary + '</div></div></div>';
  return stroyHTML;

}

function TimeMaker(runtime) {
  //[runtime]스토리라인의 시간을 정합니다
  var timearr = runtime.split(':');
  var playtime, timecolor;
  if (timearr[0] != '00') {
    playtime = Number(timearr[0]) + '일 소요';
    timecolor = ' storyLineTimeDay'
  } else if (timearr[1] != '00') {
    playtime = Number(timearr[1]) + '시간 소요';
    timecolor = ' storyLineTimeHour'
  } else if (timearr[2] != '00') {
    playtime = Number(timearr[2]) + '분 소요';
    timecolor = ' storyLineTimeMin'
  } else {
    playtime = '소요시간 미정';
    timecolor = ' storyLineTimeNone'
  }
  playtime = '<div id="StoryLineTime" class="' + timecolor + '">' + playtime + '</div>';
  return playtime;
}

function StroyLineinfo(parameter = null) {

  //에러발생시 확인을 위한 구문
  var key
  var parameterError = ""
  for (key in parameter) {
    parameterError += '<p>파라미터의 키 : ' + key + ' 값 : ' + parameter[key] + '</p>';
  }
  // 에러검사

  if (true) {
    // AJAX 통신시작
    selector = $('#StoryContent');
    $.ajax({
      type: "post",
      url: "http://15.164.222.144:3000/find_location1",
      data: parameter,
      success: function(info) {
        console.log("성공", info)
        console.log(typeof info)
        if (info.hasOwnProperty(0) == false) {
          selector.append('<span class="notice noti_empty"> 😥 여기는 아무것도 없네요 😥 <p> 이길이 아닌가벼..? </p> </span>');
        } else {
          // 디폴트 디자인
          if(info[0].image == null){
            image = "img/StorylineDefault.jpg"
          }else {
            image = info[0].image
          }
          $('#StoryLineTitle').text(info[0].title)
          $('#likeval').text(info[0].good)
          $('#Summary_Place').text(info[0].simple_description)
          $('#profile_img > img').attr("src",image);
          $('#TimePosition').append(TimeMaker(info[0].runtime))
          var lineTag = info[0].tagName;
          for (var i = 0; i < Object.keys(lineTag).length; i++) {
            $('#StoryLineTagzone').append('<span class="storyLineTag">#' + lineTag[i] + '</span>');
          }
          try {

          } catch (e) {
            // selector.append('<span class="notice"> 🌅 여기는 아무것도 없네요 🌅 </span>');
            // selector.append('<span class="warning"> ⚠️ 잘못된 데이터 받음 ⚠️  <p>이는 서버에서 받아오는 매개변수가 이상합니다</p> <p>선택자의 ID : ' + selector.attr('id') + '<br>선택자의 Class : ' + selector.attr('class') + '</p>' + parameterError + '<p> JSON 객체의 값 : ' + stroy + '</p>' + ' </span>');
          } finally {


          }
        }
      },
      error: function(request, status, error) {
        var device = DeviceCheck('network')
        console.log(device)
        if (navigator.onLine == false) {
          selector.append('<span class="notice noti_disconnect"> 📡 인터넷이 연결되어 있지않습니다 <p> 지직~ 지직~ 지지직 </p> </span>');
        }
        // else if (device = 'No Cordova') {
        //   selector.append('<span class="warning"> 모바일 네트워크가 아닙니다 <p>이는 모바일 환경이 아니거나</p>  <p>플러그인이 지원되지 않는 환경일수 있습니다. </p> </span>');
        //   selector.append('<span class="warning"> 서버와 통신 오류 <p>이는 AJAX 크로스도메인 이슈거나</p>  <p>서버가 실행중이지 않거나 인터넷이 실행중이지 않습니다. </p> <p>선택자의 ID : ' + selector.attr('id') + '<br>선택자의 Class : ' + selector.attr('class') + '</p>' + parameterError + ' </span>');
        // }
        else {
          selector.append('<span class="warning"> ⚠️ 서버와 통신 오류 ⚠️ <p>이는 AJAX 크로스도메인 이슈거나</p>  <p>서버가 실행중이지 않을수 있습니다.</p> <p>선택자의 ID : ' + selector.attr('id') + '<br>선택자의 Class : ' + selector.attr('class') + '</p>' + parameterError + ' </span>');
        }

      }
    });
  } else {
    selector.append('<span class="warning"> ⚠️ 잘못된 AJAX 요청. ⚠️ <p>AJAX 파라미터값이 없습니다</p> <p>선택자의 ID : ' + selector.attr('id') + '<br>선택자의 Class : ' + selector.attr('class') + '</p>' + parameterError + ' </span>');
  }

}


function Stroyloading(parameter = null) {

  //에러발생시 확인을 위한 구문
  var key
  var parameterError = ""
  for (key in parameter) {
    parameterError += '<p>파라미터의 키 : ' + key + ' 값 : ' + parameter[key] + '</p>';
  }
  // 에러검사

  if (true) {
    // AJAX 통신시작
    selector = $('#StoryContent');
    $.ajax({
      type: "post",
      url: "http://15.164.222.144:3000/find_location2",
      data: parameter,
      success: function(stroy) {
        console.log("성공", stroy)
        console.log(typeof stroy)
        if (stroy.hasOwnProperty(0) == false) {
          selector.append('<span class="notice noti_empty"> 😥 여기는 아무것도 없네요 😥 <p> 이길이 아닌가벼..? </p> </span>');
        } else {

          for (var i = 0; i < Object.keys(stroy).length; i++) {
            selector.append(StroyMaker(stroy[i].story_id, stroy[i].id, stroy[i].name, stroy[i].title, stroy[i].location_image, stroy[i].gps_latitude, stroy[i].gps_longitude, stroy[i].summary)) //,stroy[i].image
            selector.append('<div id="scrolldumi"> </div>');
            gps_lat[i] = stroy[i].gps_latitude;
            gps_lon[i] = stroy[i].gps_longitude;
            storyIDlist[i] = stroy[i].id;
          }
          try {

          } catch (e) {
            selector.append('<span class="notice noti_empty"> 😥 여기는 아무것도 없네요 😥 <p> 이길이 아닌가벼..? </p> </span>');
            selector.append('<span class="warning"> ⚠️ 잘못된 데이터 받음 ⚠️  <p>이는 서버에서 받아오는 매개변수가 이상합니다</p> <p>선택자의 ID : ' + selector.attr('id') + '<br>선택자의 Class : ' + selector.attr('class') + '</p>' + parameterError + '<p> JSON 객체의 값 : ' + stroy + '</p>' + ' </span>');
          } finally {


          }
        }
      },
      error: function(request, status, error) {
        var device = DeviceCheck('network')
        console.log(device)
        if (navigator.onLine == false) {
          selector.append('<span class="notice noti_disconnect"> 📡 인터넷이 연결되어 있지않습니다 <p> 지직~ 지직~ 지지직 </p> </span>');
        }
        // else if (device = 'No Cordova') {
        //   selector.append('<span class="warning"> 모바일 네트워크가 아닙니다 <p>이는 모바일 환경이 아니거나</p>  <p>플러그인이 지원되지 않는 환경일수 있습니다. </p> </span>');
        //   selector.append('<span class="warning"> 서버와 통신 오류 <p>이는 AJAX 크로스도메인 이슈거나</p>  <p>서버가 실행중이지 않거나 인터넷이 실행중이지 않습니다. </p> <p>선택자의 ID : ' + selector.attr('id') + '<br>선택자의 Class : ' + selector.attr('class') + '</p>' + parameterError + ' </span>');
        // }
        else {
          selector.append('<span class="warning"> ⚠️ 서버와 통신 오류 ⚠️ <p>이는 AJAX 크로스도메인 이슈거나</p>  <p>서버가 실행중이지 않을수 있습니다.</p> <p>선택자의 ID : ' + selector.attr('id') + '<br>선택자의 Class : ' + selector.attr('class') + '</p>' + parameterError + ' </span>');
        }

      }
    });
  } else {
    selector.append('<span class="warning"> ⚠️ 잘못된 AJAX 요청. ⚠️ <p>AJAX 파라미터값이 없습니다</p> <p>선택자의 ID : ' + selector.attr('id') + '<br>선택자의 Class : ' + selector.attr('class') + '</p>' + parameterError + ' </span>');
  }

}

function tabfind() {
  var address = unescape(location.href);
  var no = "";
  if (address.indexOf("tab", 0) != -1) {
    no = address.substring(address.indexOf("tab", 0) + 4);
  } else {
    no = "1";
  }
  return no;
}

$(document).ready(function() {
  jQueryLoad()
  var no = tabfind()
  StroyLineinfo({
    story_id: no
  })
  Stroyloading({
    user_id: "1",
    story_id: no
  });
  console.log(gps_lon, gps_lat)
});
