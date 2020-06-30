var storySort = 'loc'
var lineArr = new Array();
var userid = localStorage.getItem("story_line_user_id")
if (userid == null) {
  localStorage.setItem("story_line_user_id", 6)
}

// 초기화
function JQueryLoad() {
  $black_Layer = $("#black_Layer");
  $side_Layer = $("#side_Layer");
  $search_chagne_loc = $("#search_chagne_loc");
  $search_chagne_like = $("#search_chagne_like");
  $content_Layer = $('#content_Layer'); // 컨텐츠가 담기는 화면입니다
  $storyLine_place = $('#storyLine_place');
  $name_sub_place = $('#name_sub_place');
  $writebnt = $('#writebnt');
  $LoginBox = $('#LoginBox');
  $profileBox = $('#profileBox');
}

// 모달창 리셋
function modalreset() {
  modal_Layer = $("#modal_Layer");
  modal_Background = $("#modal_Background");
  modal_serach = $("#serach");
  modal_serach.hide(0)

}

//--------------- GPS 좌표를 로드합니다 ---------------
var mylocation = {
  lon: 0,
  lat: 0
}
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("GPS 탐색시작")
  navigator.geolocation.getCurrentPosition(onSuccess);
}

function onSuccess(position) {
  mylocation.lon = position.coords.longitude;
  mylocation.lat = position.coords.latitude;
  console.log(mylocation.lon, mylocation.lat);
}


// 위치찾기
function distance(lat1, lon1, lat2, lon2) {
  console.log(lat1)
  if (lat1 != 0 || lon1 != 0 || lat2 != 0 || lon2 != 0 || lat2 != null || lon2 != null) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    } else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      alert(dist);
    }
  } else {

  }

}



//[초기화] AJAX를 통해 받은 모든것을 초기화 시킵니다
function PageReset(ViewType, mode, parameter) {
  sideMenu(false);
  $name_sub_place.text(ViewType);
  $storyLine_place.empty();
  //ScrollMove();

  StroyLineRequest($storyLine_place, mode, parameter);
}

function StroyLineMaker(title = "테스트로 출력된 제목입니다", simple_description = "스토리라인에 대한 간단 요약입니다", good = 0, tagName = null, runtime = 0, gps_latitude = 00, gps_longitude = 00, image = "http://pan-creators.com/wp-content/uploads/2018/02/%EC%82%AC%EC%A7%84-1.jpg") {
  //[runtime]스토리라인의 시간을 정합니다
  var taglist = new Array();
  var tags = "";

  // 이미지가 null이면 기본 이미지를 불러옴
  if (image == null) {
    image = "img/StorylineDefault.jpg"
  }
  if (simple_description == null) {
    simple_description = "✒️아직 요약이 작성되지 않았어요"
  }
  if (title == null) {
    title = "이름없는 스토리라인"
  }
  // 태그가 있는경우에만 불러옴
  if (tagName != null) {
    for (var i = 0; i < Object.keys(tagName).length; i++) {
      tags += '<span class="storyLineTag">#' + tagName[i] + '</span>';
    }
  }


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
  playtime = '<div class="storyLineTime' + timecolor + '">' + playtime + '</div>';

  //스토리라인 HTML 을 만듭니다
  stroylineHTML = "";
  stroylineHTML += '<!-- 스토리라인 --> <div class="storyLine"> <div class="storyLineImg"> <img src="';
  stroylineHTML += image + '"> <div class="storyLineImgPosition"> <div class="storyLineImgPositionTop">';
  stroylineHTML += playtime + '</div> <div class="storyLineImgPositionBottom"> <div class="storyLineLocation">';
  stroylineHTML += '</div> <div class="storyLineTitle">';
  stroylineHTML += title + '</div> </div> </div> </div> <div class="storyLineText"> <div class="storyLineTextPosition"> <div class="storyLineTagPlace">'; //이름
  stroylineHTML += tags + '</div> <div class="summary_place">'; //태그
  stroylineHTML += simple_description + '</div> </div> </div> </div> <!-- 스토리라인 -->';

  return stroylineHTML;

}

function StroyLineRequest(selector, mode, parameter = null) {

  //에러발생시 확인을 위한 구문
  var key
  var parameterError = ""
  console.log("ajax 시작전 파라미터값 : " + selector + mode + parameter)
  var ajaxurl = "http://15.164.222.144:3000/" + mode;

  for (key in parameter) {
    parameterError += '<p>파라미터의 키 : ' + key + ' 값 : ' + parameter[key] + '</p>';
  }
  // 에러검사

  if (parameter) {
    // AJAX 통신시작
    $.ajax({
      // crossOrigin: true,
      type: "post",
      url: ajaxurl,
      dataType: "json",
      jsonpCallback: "myCallback",
      data: parameter,
      success: function(stroyline) {
        console.log("성공", stroyline)
        console.log(typeof stroyline)
        if (stroyline.hasOwnProperty(0) == false) {
          selector.append('<span class="notice noti_empty"> 😥 여기는 아무것도 없네요 😥 <p> 이쪽이 아닌가..? </p> </span>');
        } else {

          try {
            for (var i = 0; i < stroyline.length; i++) {
              lineArr[i] = stroyline[i].id
              selector.append(StroyLineMaker(stroyline[i].title, stroyline[i].simple_description, stroyline[i].good, stroyline[i].tagName, stroyline[i].runtime, stroyline[i].gps_latitude, stroyline[i].gps_longitude, stroyline[i].image)) //,stroyline[i].image
            }
          } catch (e) {
            selector.append('<span class="notice noti_empty"> 😥 여기는 아무것도 없네요 😥 <p> 이쪽이 아닌가..? </p> </span>');
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


//새로운 StoryLine 을 생성하기 위한 구문입니다.
function NewStoryLine(parameter = null) {
  var ajaxurl = "http://15.164.222.144:3000/create_storyline"
  // AJAX 통신시작
  $.ajax({
    // crossOrigin: true,
    type: "post",
    url: ajaxurl,
    dataType: "json",
    jsonpCallback: "myCallback",
    data: parameter,
    success: function(newStoryLineID) {
      console.log("AJAX 통신 성공 새 스토리라인의 ID 값:", newStoryLineID);
      location.href = "LineWriter.html?tab=" + newStoryLineID;
    },
    error: function(request, status, error) {
      console.log("AJAX 통신 성공 새 스토리라인의 ID 값:", ajaxdata);
    }
  });

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

//[애니메이션] 버튼 정렬기준을 변경합니다
function click_chagne(click) {
  if (storySort != click) {
    if (click == 'like') {
      $search_chagne_loc.css({
        "background-color": "#FE4365",
        "font-color": "#fff"
      });
      $search_chagne_like.css({
        "background-color": "#FFF",
        "font-color": "#000"
      });
      storySort = 'like';
    }
    if (click == 'loc') {
      $search_chagne_loc.css({
        "background-color": "#FE4365",
        "font-color": "#fff"
      });
      $search_chagne_like.css({
        "background-color": "#FFF",
        "font-color": "#000"
      });
      storySort = 'loc';
    }
  }
}


//[애니메이션] 사이드바를 제어합니다
function sideMenu(on) {
  if (on == true) {
    $black_Layer.css({
      "opacity": "0.7",
      'top': '0%'
    });
    $side_Layer.css({
      "left": "0%"
    });
  } else {
    $black_Layer.css({
      "opacity": "0",
      'top': '-200%'
    });
    $side_Layer.css({
      "left": "-100%"
    });
  }
}



// ScrollMove() 스크롤을맨 위로 올려주는 함수
function ScrollMove(position = 0) {
  $content_Layer.scrollTop(position); // #content_Layer의 스크롤를 올립니다.
}

function storymode() {
  $writebnt.css({
    "right": "-100%"
  });

}

function visitmode() {
  $writebnt.css({
    "right": "-100%"
  });

}

function writemode() {
  $writebnt.css({
    "right": "0%"
  });

}

function loginLoad() {
  if (userid == 6) {
    $profileBox.hide(0);
    $LoginBox.show(0);
  } else {
    $profileBox.show(0);
    $LoginBox.hide(0);
  }

}

function modalserachIn() {
  modal_Layer.css({
    'top': '0%',
  });
  modal_Background.css({
    'opacity': '0.5'
  });
  modal_serach.show(100)
}


function modalserachOut() {
  $("#serach_input").val("")
  modal_Layer.css({
    'top': '-100%',
  });
  modal_Background.css({
    'opacity': '0'
  });
  modal_serach.hide(0)
}
function serachstart(){
  if (StoryLineName == "스토리라인") {
    PageReset("검색결과", "search",{
      search: $("#serach_input").val()
    })
  } else if (StoryLineName == "작성한스토리") {
    PageReset("검색결과", "search_is_writen",{
      user_id : userid,
      search: $("#serach_input").val(),
    })
  }

}

function Request(mode, parameter = null,) {
  var ajaxurl = "http://15.164.222.144:3000/" + mode;
  // AJAX 통신시작
  $.ajax({
    // crossOrigin: true,
    type: "post",
    url: ajaxurl,
    dataType: "json",
    jsonpCallback: "myCallback",
    data: parameter,
    traditional: true,
    success: function(ajaxdata) {
      console.log("데이터",ajaxdata)
      if (mode == "idToNickname" ) {
        $("#username").text(ajaxdata[0].nickName);
      }
    },
    error: function(request, status, error) {
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////

//초기화
var StoryLineName = "스토리라인"

// 제어부
$(document).ready(function() {
  JQueryLoad();
  loginLoad();
  modalreset()
  PageReset(StoryLineName, "main", {
    selectStory: "good",
    num: 10,
  }); // 페이지 내의 모든 파일을 삭제합니다
  if (userid != 6 ) {
    Request("idToNickname", {
      id : userid,
    })
  }
  // 스토리라인 정렬기준 "위치순" 변경예정
  $(document).on('click', '#search_chagne_loc', function() {
    click_chagne('loc');

  });

  // 스토리라인 정렬기준 "추천순"
  $(document).on('click', '#search_chagne_like', function() {
    click_chagne('like');
  });


  $(document).on('click', '.storyLine', function(event) {
    console.log($(".storyLine").index(this));
    if (StoryLineName == "작성한스토리") {
      location.href = "LineWriter.html?tab=" + lineArr[$(".storyLine").index(this)];
    } else
      location.href = "Story.html?tab=" + lineArr[$(".storyLine").index(this)];
  });

  // '#main_menu 버튼을 누르면 사이드바를 엽니다
  $(document).on('click', '#menu_StoryLine', function() {
    sideMenu(true);
  });
  // '#main_menu 버튼을 누르면 사이드바를 엽니다
  $(document).on('click', '#main_menu', function() {
    sideMenu(true);
  });
  // '#black_Layer 를누르면 사이드바를 닫습니다.
  $(document).on('click', '#black_Layer', function() {
    sideMenu(false);
  });

  // 사이드바
  $(document).on('click', '#menu_StoryLine', function() {
    StoryLineName = "스토리라인"
    PageReset(StoryLineName, "main", {
      selectStory: "good"
    });
    storymode();
  });
  $(document).on('click', '#menu_VisitStory', function() {
    sideMenu(false);
    StoryLineName = "다녀간스토리"
    PageReset(StoryLineName, "choose", {
      user_id: userid,
      is_ing: 1
    });
    visitmode();
  });
  $(document).on('click', '#menu_WrittenStory', function() {
    if (userid == 6) {
      location.href = "login.html";
    } else {
      sideMenu(false);
      StoryLineName = "작성한스토리"
      PageReset(StoryLineName, "choose", {
        user_id: userid,
        is_writen: 1
      });
      writemode();
    }
  });
  $(document).on('click', '#menu_NewStory', function() {
    if (userid == 6) {
      location.href = "login.html";
    } else {
      NewStoryLine({
        user_id: userid
      })
    }
  });
  // 스크롤 체커
  $("#content_Layer").scroll(function() {
    var scroll = $(this).scrollTop();
    scrollmode = 0
    if (scroll > 1 && scrollmode == 0) {
      scrollmode = 1
      $("#header_place").css({
        'border-bottom-right-radius': '30px',
        'border-bottom-left-radius': '30px',
        'box-shadow': '0px 3px 15px #777'
      });

    } else {
      scrollmode = 0
      $("#header_place").css({
        'border-bottom-right-radius': '0px',
        'border-bottom-left-radius': '0px',
        'box-shadow': '0px 0px 0px #777'
      });

    }
  });

  $(document).on('click', '#name_sub_place', function() {
    $('#content_Layer').animate({
      scrollTop: 0
    }, 400);
  });

  $(document).on('click', '#writebnt', function() {
    NewStoryLine({
      user_id: 1
    })
  });
  $(document).on('click', '#search', function() {
    modalserachIn();

  });
  $(document).on('click', '#modal_Background', function() {
    modalserachOut();
  });


});
