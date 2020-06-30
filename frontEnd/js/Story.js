// var map;
function jQueryLoad() {
  $StoryLineProfile = $('#StoryLineProfile');
  $profile_img = $("#profile_img");
  $StoryLineinfo = $("#StoryLineinfo");
  $StoryLineimgPosition = $("#StoryLineimgPosition");
  $Story_Place = $("#Story_Place");
  $StoryContentBackground = $("#StoryContentBackground");
  $StoryContent = $("#StoryContent");
  $scrolldumi = $("#scrolldumi");
}
//필요한 변수 생성
var page_mode = 'normal'
var storycard = false;


//---------------뒤로가기키 제어부 ---------------
history.pushState(null, null, location.href);
window.onpopstate = function(event) {

  if (storycard == true) {
    storycard = false;
    $("#story_Layer").css({
      'left': '-100%'
    })
    $("#Storyboard").empty();
    history.pushState(null, null, location.href);
  } else if (page_mode == 'map') {
    $("#scrolldumi").css({
      'height': '0px'
    })
    mapMode_off()
    if (layerControl == true) {
      initLayer()
    }
    page_mode = 'normal';
    history.pushState(null, null, location.href);
  } else {
    window.history.go(-1);
  }

}
//--X----X----X--뒤로가기키 제어부 --X----X----X--

function StoryMaker(text, image, video, ar) {

  stroyHTML = "";
  if (video != null) {
    stroyHTML += '<div class="Story Story_imgType"> <img src="' + video + '" alt=""> </div>';
  }
  if (ar != null) {
    stroyHTML += '<div class="Story Story_arType" style="background-image: url(\''+image+'\');" onclick="location.href = \''+ar+'\'";"> <div class="arimg"> <img src="img/ar.png"> <div class="artext">AR컨텐츠<div><div></div>';
  }
  else if (image != null) {
    stroyHTML += '<div class="Story Story_imgType"> <img src="' + image + '" alt=""> </div>';
  }
  if (text != null) {
    stroyHTML += '<div class="Story Story_textType">' + text + '</div>';
  }
  return stroyHTML;
}

function Stroyload(parameter = null) {

  //에러발생시 확인을 위한 구문
  var key
  var parameterError = ""
  for (key in parameter) {
    parameterError += '<p>파라미터의 키 : ' + key + ' 값 : ' + parameter[key] + '</p>';
  }
  // 에러검사

  if (true) {
    // AJAX 통신시작
    selector = $('#Storyboard');
    $.ajax({
      type: "post",
      url: "http://15.164.222.144:3000/find_real_location",
      data: parameter,
      success: function(storyContent) {
        console.log("성공", storyContent)
        console.log(typeof storyContent)
        if (storyContent.hasOwnProperty(0) == false) {
          selector.append('<span class="notice "> 🤔 아직 스토리가 없어요 </span>');
        } else {

          console.log("통신성공")
          try {
            for (var i = 0; i < Object.keys(storyContent).length; i++) {
              console.log(storyContent[i].id)
              $('#Storyboard').append(StoryMaker(storyContent[i].location_text, storyContent[i].location_image, storyContent[i].location_video, storyContent[i].location_ar))
            }
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
          selector.append('<span class="notice"> 📡 인터넷이 연결되어 있지않습니다 <p> 지직~ 지직~ 지지직 </p> </span>');
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


// 위치 필수함수
var layerControl = false;
var mylocation = {
  lon: 0,
  lat: 0
}
var start = {
  lon: 0,
  lat: 0
}

var end = {
  lon: 0,
  lat: 0
}
var markerStartLayer;
var routeLayer;
var marker_s;
var marker_e;

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}
//디바이스 API를 로드합니다

document.addEventListener("deviceready", onDeviceReady, false);
// device APIs are available
//
function onDeviceReady() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 5000
  });
}

// onSuccess Geolocation
//
function onSuccess(position) {
  mylocation.lon = position.coords.longitude;
  mylocation.lat = position.coords.latitude;
  console.log(mylocation.lon, mylocation.lat);
}

//onError Callback receives a PositionError object

function onError(error) {
  console.log('code: ' + error.code + '\n' +
    'message: ' + error.message + '\n');
}


// map 생성
function initTmap() { //$document.ready를 쓰려면 필요함
  var options = {
    div: 'map_div', // map을 표시해줄 div
    width: "100%", // map의 width 설정
    height: "85vh", // map의 height 설정
    httpsMode: true
  }
  map = new Tmap.Map(options);
}



function innerSetRoute() {
  markerStartLayer = new Tmap.Layer.Markers("start"); //마커 레이어 생성
  map.addLayer(markerStartLayer); //map에 마커 레이어 추가

  var size = new Tmap.Size(24, 38); //아이콘 크기 설정
  var offset = new Tmap.Pixel(-(size.w / 2), -size.h); //아이콘 중심점 설정
  var icon = new Tmap.IconHtml('<img src=http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_s.png />', size, offset); //시작 마커 아이콘 설정
  marker_s = new Tmap.Marker(new Tmap.LonLat(start.lon, start.lat).transform("EPSG:4326", "EPSG:3857"), icon); //설정한 좌표를 "EPSG:3857"로 좌표변환한 좌표값으로 설정합니다.
  markerStartLayer.addMarker(marker_s); //마커 레이어에 마커 추가

  // 도착점 마커 아이콘, 위치 설정, size, offset은 marker_s의 size와 offset 그대로 받음
  var icon = new Tmap.IconHtml('<img src=http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_e.png />', size, offset); //도착 마커 아이콘 설정
  marker_e = new Tmap.Marker(new Tmap.LonLat(end.lon, end.lat).transform("EPSG:4326", "EPSG:3857"), icon); //설정한 좌표를 "EPSG:3857"로 좌표변환한 좌표값으로 설정합니다.

  markerStartLayer.addMarker(marker_e); //마커 레이어에 마커 추가

  var headers = {};
  headers["appKey"] = "894c5ae4-5aac-41c6-97fa-6c912ad9d00b"; //실행을 위한 키 입니다. 발급받으신 AppKey를 입력하세요.
  $.ajax({
    crossOrigin: true,
    method: "POST",
    headers: headers,
    url: "https://api2.sktelecom.com/tmap/routes/pedestrian?version=1&format=xml", //보행자 경로안내 api 요청 url입니다.
    data: {
      startX: start.lon,
      startY: start.lat,
      //목적지 위경도 좌표입니다.
      endX: end.lon,
      endY: end.lat,
      //출발지, 경유지, 목적지 좌표계 유형을 지정합니다.
      reqCoordType: "WGS84GEO",
      resCoordType: "EPSG3857",
      //각도입니다.
      angle: "172",
      startName: "출발지",
      endName: "도착지"
    },
    //데이터 로드가 성공적으로 완료되었을 때 발생하는 함수입니다.
    success: function(response) {
      prtcl = response;

      // 결과 출력
      var innerHtml = "";
      var prtclString = new XMLSerializer().serializeToString(prtcl); //xml to String
      xmlDoc = $.parseXML(prtclString),
        $xml = $(xmlDoc),
        $intRate = $xml.find("Document");
      try {
        var tDistance = "<span> " + ($intRate[0].getElementsByTagName("tmap:totalDistance")[0].childNodes[0].nodeValue / 1000).toFixed(1) + "km</span>";
        var tTime = " <span> " + ($intRate[0].getElementsByTagName("tmap:totalTime")[0].childNodes[0].nodeValue / 60).toFixed(0) + "분</span>";
      } catch (e) {

      } finally {

      }



      //$("#result").text(tDistance + tTime);   // 아래 문장이랑 차이가 뭘까
      var resultDiv = document.getElementById("walkinginfo");
      resultDiv.innerHTML = tDistance + tTime;


      prtcl = new Tmap.Format.KML({
        extractStyles: true,
        extractAttributes: true
      }).read(prtcl); //데이터(prtcl)를 읽고, 벡터 도형(feature) 목록을 리턴합니다.
      routeLayer = new Tmap.Layer.Vector("route"); // 백터 레이어 생성
      //표준 데이터 포맷인 KML을 Read/Write 하는 클래스 입니다.
      //벡터 도형(Feature)이 추가되기 직전에 이벤트가 발생합니다.
      routeLayer.events.register("beforefeatureadded", routeLayer, onBeforeFeatureAdded);

      function onBeforeFeatureAdded(e) {
        var style = {};
        switch (e.feature.attributes.styleUrl) {
          /*case "#pointStyle":
            style.externalGraphic = "http://topopen.tmap.co.kr/imgs/point.png"; //렌더링 포인트에 사용될 외부 이미지 파일의 url입니다.
            style.graphicHeight = 16; //외부 이미지 파일의 크기 설정을 위한 픽셀 높이입니다.
            style.graphicOpacity = 1; //외부 이미지 파일의 투명도 (0-1)입니다.
            style.graphicWidth = 16; //외부 이미지 파일의 크기 설정을 위한 픽셀 폭입니다.
            break;*/
          default:
            style.strokeColor = "#AC5BFE"; //stroke에 적용될 16진수 color
            style.strokeOpacity = "1"; //stroke의 투명도(0~1)
            style.strokeWidth = "3"; //stroke의 넓이(pixel 단위)
        };
        e.feature.style = style;
      }

      routeLayer.addFeatures(prtcl); //레이어에 도형을 등록합니다.
      map.addLayer(routeLayer); //맵에 레이어 추가

      map.zoomToExtent(routeLayer.getDataExtent()); //map의 zoom을 routeLayer의 영역에 맞게 변경합니다.
      map.zoomOut(); //지도를 1레벨 올립니다.
    },

    //요청 실패시 콘솔창에서 에러 내용을 확인할 수 있습니다.
    error: function(request, status, error) {
      console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    }
  });
}


function myRoute() {

  if (page_mode == 'normal') {
    clearInterval(finds);
  }
  if (mylocation.lon == 0 || mylocation.lat == 0) {
    console.log("검색중", mylocation.lon, mylocation.lat)
  } else {
    if (page_mode == 'normal') {
      clearInterval(finds);
    }
    console.log("완료", mylocation.lon, mylocation.lat)
    layerControl = true;
    start.lon = mylocation.lon;
    start.lat = mylocation.lat;
    innerSetRoute();
    clearInterval(finds);
  }

}
// 시작
function setRoute(storyNo) {
  console.log(gps_lon[storyNo], gps_lat[storyNo], storyNo)
  end.lon = gps_lon[storyNo];
  end.lat = gps_lat[storyNo];
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 30000
  });
  finds = setInterval(myRoute, 500);
}

function initLayer() {
  // init 레이어는 특정상황에 (지도에 경로가 로드 되지 않을때) 호출될수 있습니다.
  // 그래서 에러가 나도 무시하고 지나갈수 있도록 설계하였습니다
  try {
    map.removeLayer(markerStartLayer);
    map.removeLayer(routeLayer); // startLayer 와 routeLayer를 삭제해주는 구문, 안해주면 layer가 계속 쌓임
    //markerStartLayer.clearMarkers(); //마커 전체 삭제합니다.
    //routeLayer.removeAllFeatures(); // routeLayer에 도형 모두 삭제 vector Layer를 지워주면 굳이 실행할 필요없음
  } catch (e) {

  } finally {

  }
}

function moveMyLocation() {
  // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  var lonlat = new Tmap.LonLat(mylocation.lon, mylocation.lat).transform("EPSG:4326", "EPSG:3857");
  map.setCenter(lonlat, 16); //map의 중심 좌표 설정

}

function showLayerCount() {
  var result = '<p> 전체 레이어 개수 : ' + map.getNumLayers() + '</p>';
  var resultDiv = document.getElementById("result");
  resultDiv.innerHTML = result;
}



function page_up() {
  $StoryLineProfile.css({
    'height': '15vh'
  })
  $profile_img.css({
    'height': '15vh'
  })
  $StoryLineinfo.css({
    'height': '0vh'
  })
  $StoryLineimgPosition.css({
    'height': '15vh'
  })
  $Story_Place.css({
    'height': '85vh'
  })
  $StoryContentBackground.css({
    'height': '85vh',
    'opacity': '1.0'
  })
  $StoryContent.css({
    'height': '85vh'
  })
}

function page_down() {
  $StoryLineProfile.css({
    'height': '45vh'
  })
  $profile_img.css({
    'height': '30vh'
  })
  $StoryLineinfo.css({
    'height': '15vh'
  })
  $StoryLineimgPosition.css({
    'height': '30vh'
  })
  $Story_Place.css({
    'height': '55vh'
  })
  $StoryContentBackground.css({
    'height': '55vh',
    'opacity': '1.0'
  })
  $StoryContent.css({
    'height': '55vh'
  })
}

function mapMode_on() {
  //CSS 에니메이션
  $StoryLineProfile.css({
    'height': '15vh'
  })
  $profile_img.css({
    'height': '15vh'
  })
  $StoryLineimgPosition.css({
    'height': '15vh'
  })
  $StoryLineinfo.css({
    'height': '0vh'
  })
  $Story_Place.css({
    'height': '100px'
  })
  $StoryContentBackground.css({
    'height': '100px',
    'opacity': '0.0'
  })
  $StoryContent.css({
    'height': '100px'
  })
  $StoryContent.css({
    'overflow-y': 'hidden'
  })
}

function mapMode_off() {
  $StoryLineProfile.css({
    'height': '15vh'
  })
  $profile_img.css({
    'height': '15vh'
  })
  $StoryLineimgPosition.css({
    'height': '15vh'
  })
  $StoryLineinfo.css({
    'height': '0vh'
  })
  $Story_Place.css({
    'height': '85vh'
  })
  $StoryContentBackground.css({
    'height': '85vh',
    'opacity': '1.0'
  })
  $StoryContent.css({
    'height': '85vh'
  })
  $StoryContent.css({
    'overflow-y': 'auto'
  })
}

$(document).ready(function() {
  jQueryLoad();
  initTmap();
  console.log(gps_lon, gps_lat)
  // 지도 버튼을 누릅니다
  $(document).on('click', '.story_mapBnt', function(event) {
    mylocation = {
      lon: 0,
      lat: 0
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 30000
    });
    console.log(mylocation.lon == 0)

    if (page_mode == 'normal') {
      page_mode = 'map';
      setRoute($(".story_mapBnt").index(this)); // 지도에 길찾기 시작
      $scrolldumi.css({
        'height': '1000px'
      })
      $StoryContent.animate({
        scrollTop: $(".story_mapBnt").index(this) * 190 + 5
      }, 1000);
      mapMode_on();
      event.stopPropagation();
    }

  });

  // 스토리카드 오픈
  $(document).on('click', '.stroycard', function() {
    if (page_mode == 'map') {
      // 지도에 길찾기 시작
      $("#scrolldumi").css({
        'height': '0px'
      })
      mapMode_off()
      if (layerControl == true) {
        initLayer()
      }
      page_mode = 'normal';
    } else {
      // 스토리 카드 내용보기
      storycard = true;
      var idlist = $(".stroycard").index(this)
      $("#story_Layer").css({
        'left': '0%'
      });
      console.log(storyIDlist, idlist, storyIDlist[0]);
      Stroyload({
        location_id: storyIDlist[idlist]
      });
    }
  });

  $(document).on('click', '#storybackground', function() {
    storycard = false;
    $("#story_Layer").css({
      'left': '-100%'
    })
    $("#Storyboard").empty();
  });


  //스크롤 체커 스토리영역의 스크롤이 맨위에 있지 않은경우 많은 스토리카드를 보여주기 위해 세부내용을 가립니다.
  $StoryContent.scroll(function() {
    scrollmode = 0;
    var scroll = $(this).scrollTop();
    console.log("스크롤 위치 : " + scroll)
    if (scroll > 1 && page_mode == 'normal' && scrollmode == 0) {
      scrollmode = 1;
      page_up();
    }
  });
  $(document).on('click', '#StoryLineProfile', function() {
    if (page_mode == 'map') {
      // 지도에 길찾기 시작
      $("#scrolldumi").css({
        'height': '0px'
      })
      mapMode_off()
      if (layerControl == true) {
        initLayer()
      }
      page_mode = 'normal';
      page_down();
      $StoryContent.scrollTop(0);
    } else {
      scrollmode = 0;
      page_down();
      $StoryContent.scrollTop(0);
    }

  });


});
