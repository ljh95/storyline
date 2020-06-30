var map, markerClick, markerLayerClick, markerLayer;
var placeForSearch; // 입력 값 받아옴

maplon=0;
maplat=0;

function initTmap() {


  //map 생성
  // Tmap.map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
  map = new Tmap.Map({
    div: 'map_div', // map을 표시해줄 div
    width: '100%', // map의 width 설정
    height: '75vh' // map의 height 설정
  });
  //map.setCenter(new Tmap.LonLat("126.986072", "37.570028").transform("EPSG:4326", "EPSG:3857"), 15); // 설정한 좌표를 "EPSG:3857"로 좌표변환한 좌표값으로 중심점을 설정합니다.

  map.events.register("click", map, onClick); //map 클릭 이벤트를 등록합니다. 터치용
  map.events.register("touchend", map, onClick); //map 클릭 이벤트를 등록합니다. 마우스용
  markerLayerClick = new Tmap.Layer.Markers(); //맵 레이어 생성
  map.addLayer(markerLayerClick); //map에 맵 레이어를 추가합니다.
}

function onClick(e) {
  markerLayerClick.removeMarker(markerClick); // 기존 마커 삭제
  var lonlat = map.getLonLatFromViewPortPx(e.xy).transform("EPSG:3857", "EPSG:4326"); //클릭 부분의 ViewPortPx를 LonLat 좌표로 변환합니다.
  console.log(lonlat.lon,lonlat.lat);
  maplon =lonlat.lon
  maplat =lonlat.lat
  var size = new Tmap.Size(24, 38); //아이콘 사이즈 설정
  var offset = new Tmap.Pixel(-(size.w / 2), -(size.h)); //아이콘 중심점 설정
  var icon = new Tmap.Icon('http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_a.png', size, offset); //마커 아이콘 설정
  markerClick = new Tmap.Marker(lonlat.transform("EPSG:4326", "EPSG:3857"), icon); //마커 생성
  markerLayerClick.addMarker(markerClick); //마커 레이어에 마커 추가
  map.updateSize();//map의 빈 공간을 채운다.
}

function searchFun() { // 검색 함수 내부 구분
    placeForSearch = document.getElementById("place").value; // 입력 값 받아옴
  $.ajax({
    method: "GET",
    url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=xml&callback=result", // POI 통합검색 api 요청 url입니다.
    async: false,
    data: {
      "searchKeyword": placeForSearch, //검색 키워드 - 변수로 바꿀 부분
      "resCoordType": "EPSG3857", //응답 좌표계 유형
      "reqCoordType": "WGS84GEO", //요청 좌표계 유형
      "appKey": "894c5ae4-5aac-41c6-97fa-6c912ad9d00b", // 실행을 위한 키입니다. 발급받으신 AppKey(appKey)를 입력하세요.
      "count": 5 //페이지당 출력되는 개수를 지정
    },
    //데이터 로드가 성공적으로 완료되었을 때 발생하는 함수입니다.
    success: function(response) {
      prtcl = response;

      // 2. 기존 마커, 팝업 제거
      if (markerLayer != null) {
        markerLayer.clearMarkers();
        map.removeAllPopup();
      }

      // 3. POI 마커 표시
      markerLayer = new Tmap.Layer.Markers(); //마커 레이어 생성
      map.addLayer(markerLayer); //map에 마커 레이어 추가
      var size = new Tmap.Size(24, 38); //아이콘 크기 설정
      var offset = new Tmap.Pixel(-(size.w / 2), -(size.h)); //아이콘 중심점 설정
      var maker;
      var popup;
      var prtclString = new XMLSerializer().serializeToString(prtcl); //xml to String
      xmlDoc = $.parseXML(prtclString),
        $xml = $(xmlDoc),
        $intRate = $xml.find("poi");
      var innerHtml = "";
      $intRate.each(function(index, element) {
        var name = element.getElementsByTagName("name")[0].childNodes[0].nodeValue;
        var id = element.getElementsByTagName("id")[0].childNodes[0].nodeValue;
        var content = "<div style=' position: relative; border-bottom: 1px solid #dcdcdc; line-height: 18px; padding: 0 35px 2px 0;'>" +
          "<div style='font-size: 12px; line-height: 15px;'>" +
          "<span style='display: inline-block; width: 14px; height: 14px; background-image: url(/resources/images/common/icon_blet.png); vertical-align: middle; margin-right: 5px;'></span>" + name +
          "</div>" +
          "</div>";
        innerHtml += "<div><img src='http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_" + index + ".png' style='vertical-align:middle'/><span>" + name + "</span></div>";
        var lon = element.getElementsByTagName("noorLon")[0].childNodes[0].nodeValue;
        var lat = element.getElementsByTagName("noorLat")[0].childNodes[0].nodeValue;

        var icon = new Tmap.Icon('http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_' + index + '.png', size, offset); //마커 아이콘 설정
        var lonlat = new Tmap.LonLat(lon, lat); //좌표설정
        marker = new Tmap.Marker(lonlat, icon); //마커생성
        markerLayer.addMarker(marker); //마커레이어에 마커 추가

        popup = new Tmap.Popup("p1", lonlat, new Tmap.Size(120, 50), content, false); //마우스 오버 팝업
        popup.autoSize = true; //Contents 내용에 맞게 Popup창의 크기를 재조정할지 여부를 결정
        map.addPopup(popup); //map에 popup추가
        //popup.hide(); //마커에 마우스가 오버되기 전까진 popup을 숨김
        //popup.show();
        //마커 이벤트등록
        // marker.events.register("mouseover", popup, onOverMarker);
        // //마커에 마우스가 오버되었을 때 발생하는 이벤트 함수입니다.
        // function onOverMarker(evt) {
        //   this.show(); //마커에 마우스가 오버되었을 때 팝업이 보입니다.
        // }
        // //마커 이벤트 등록
        // marker.events.register("mouseout", popup, onOutMarker);
        // //마커에 마우스가 아웃되었을 때 발생하는 함수입니다.
        // function onOutMarker(evt) {
        //   this.hide(); //마커에 마우스가 없을땐 팝업이 숨겨집니다.
        // }
      });
      $("#searchResult").html(innerHtml);
      map.zoomToExtent(markerLayer.getDataExtent()); //마커레이어의 영역에 맞게 map을 zoom합니다.
    },
    //요청 실패시 콘솔창에서 에러 내용을 확인할 수 있습니다.
    error: function(request, status, error) {
      console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
    }
  });
}



/*function showLayerCount() {
  var result = '<p> 전체 레이어 개수 : ' + map.getNumLayers() + '</p>';
  var resultDiv = document.getElementById("result");
  resultDiv.innerHTML = result;
}*/
