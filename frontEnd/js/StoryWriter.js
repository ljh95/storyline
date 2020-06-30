// 위치값을 정하기전의 값
var loc_lat = null;
var loc_lon = null;
var deletecontent_id = null;;
var userid = localStorage.getItem("story_line_user_id")
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
story_id = tabfind();

// 초기화
function jQueryLoad() {
  $content_Layer = $('#content_Layer');
  $Storylist = $('#Storylist');
  $Storylistzone = $('#Storylistzone');
  $StoryTitle = $('#StoryTitle');
  $Summary_Place = $('#Summary_Place');
  $StoryLineTitle = $('#StoryLineTitle');
  $Storyprofileimg = $('#StoryLineTitleZone > img');

}
// 모달창 리셋
function modalreset() {
  modal_Layer = $("#modal_Layer");
  modal_Background = $("#modal_Background");
  modal_map = $("#modal_map");
  modal_map.hide(0)
  // 텍스트 모달
  modal_storytext = $("#modal_storytext");
  modal_storytext.hide(0)
  modal_textchange = $("#text_change");

  // 이미지 모달
  modal_storyimg = $("#modal_storyimg");
  modal_storyimg.hide(0)
  modal_imgchange = $("#img_change");
  modal_imgchangetext = $("#img_changetext");

}

function modalmapIn() {
  modal_Layer.css({
    'top': '0%',
  });
  modal_Background.css({
    'opacity': '0.5'
  });
  modal_map.show(100)
}

function modalmapOut() {
  modal_Layer.css({
    'top': '-100%',
  });
  modal_Background.css({
    'opacity': '0'
  });
  modal_map.hide(0)
}

// 텍스트타입 수정
function modalstorytextIn(text, id) {
  console.log(text);
  changetext_id = id;
  deletecontent_id = id;
  modal_textchange.val(text);
  modal_Layer.css({
    'top': '0%',
  });
  modal_Background.css({
    'opacity': '0.5'
  });
  modal_storytext.show(100)
}

function modalstorytextOut() {
  deletecontent_id = null
  $("#imgtype_uplode").val("");
  modal_Layer.css({
    'top': '-100%',
  });
  modal_Background.css({
    'opacity': '0'
  });
  modal_storytext.hide(0)
}

// 텍스트 포커스
function modalstorytextfocus() {
  modal_Layer.css({
    'justify-content': 'flex-start',
  });
}

function modalstorytextblur() {
  modal_Layer.css({
    'justify-content': 'space-around',
  });
}

// 이미지
function modalstoryimgIn(id) {
  console.log($(".ImgType[data-id=" + id + "] > img").attr('src'));
  oldimg = $(".ImgType[data-id=" + id + "] > img").attr('src')
  changeimg_id = id
  deletecontent_id = id
  console.log(oldimg);
  modal_Layer.css({
    'top': '0%',
  });
  modal_Background.css({
    'opacity': '0.5'
  });
  if (oldimg != null) {
    modal_imgchange.attr('src', oldimg);
  } else {
    modal_imgchange.attr('src', "img/imgtypeDefault.jpg");
  }
  modal_storyimg.show(100)
}

function modalstoryimgOut() {
  deletecontent_id = null
  modal_Layer.css({
    'top': '-100%',
  });
  modal_Background.css({
    'opacity': '0'
  });
  modal_storyimg.hide(0)
}

//Ajax 통신
function contentMaker(selector, id, image, text, video, ar, obj) {
  // 초기화 구문
  create_ContentHTML = ''
  // '<div class="contentbox">'

  if (image != null) {
    if (image == 0) {
      image = '<div class="Noimg" > 여기를 눌러 이미지를 업로드하세요 </div>'
    } else {
      image = '<img src="' + image + '">'
    }
    create_ContentHTML += '<div data-type="image" data-id="' + id + '" class="Story ImgType"  onclick="modalstoryimgIn(' + id + ');"> <div class="IMGicon"></div>'
    // create_ContentHTML += image + '<div class=" ImgTypePosition"> <div class="IMGicon"></div></div></div>'
    create_ContentHTML += image + '</div>'
  }
  if (text != null) {
    create_ContentHTML += '<div data-type="text" data-id="' + id + '" class="Story TextType"> <div class="StoryText" onclick="modalstorytextIn($(this).text(),' + id + ');" >';
    create_ContentHTML += text + '</div> </div>'
  }
  if (video != null) {

  }
  if (ar != null) {


  }
  if (obj != null) {

  }
  // create_ContentHTML = '</div>'
  selector.append(create_ContentHTML);

}

//AJAX 통신을 위한 다용도 함수입니다.
function storyRequest(mode, parameter = null, selector = null, scroll = 0, type = 0) {

  console.log("ajax 시작전 파라미터값 : " + selector + " mode = " + mode)
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
      console.log("AJAX 통신 성공", mode, ":", ajaxdata)
      console.log(mode, ajaxdata.length)
      if (mode == "find_real_location") {
        for (var i = 0; i < Object.keys(ajaxdata).length; i++) {
          // console.log(ajaxdata[i].id, ajaxdata[i].location_image, ajaxdata[i].location_text, ajaxdata[i].location_video, ajaxdata[i].location_vr, ajaxdata[i].location_3d);
          contentMaker($Storylistzone, ajaxdata[i].id, ajaxdata[i].location_image, ajaxdata[i].location_text, ajaxdata[i].location_video, ajaxdata[i].location_vr);
          $Storylist.scrollTop(scroll);
        }
      }
      if (mode == "findByStoryId") {
        profiledata(ajaxdata);
        locdata(ajaxdata);
      }
      // 해당 스토리의 기본정보를 불러옴
      if (mode == "find_location2") {
        for (var i = 0; i < Object.keys(ajaxdata).length; i++) {
          if (ajaxdata[i].id == story_id) {
            console.log(ajaxdata[i].title, ajaxdata[i].summary)
            $StoryTitle.val(ajaxdata[i].title);
            $Summary_Place.val(ajaxdata[i].summary);
            loc_lat = ajaxdata[i].gps_latitude
            loc_lon = ajaxdata[i].gps_longitude
          }
        }
      }
      // 스토리라인의 제목과 이미지를 불러옴
      if (mode == "find_location1") {
        $StoryLineTitle.text(ajaxdata[0].title);
        if (ajaxdata[0].image == null) {

        } else {
          $Storyprofileimg.attr('src', ajaxdata[0].image);
        }
      }
      // 새로운 스토리를 생성함
      if (mode == "create_real_location") {
        console.log(ajaxdata);
        createContent_type(ajaxdata, type);
      }
    },
    error: function(request, status, error) {
      if (mode == "update_real_story") {
        console.log("데이터 전송 완료")
        contentLoad()
      }
      if (mode == "create_real_location") {
        console.log(request, status, error);
      }
      if (mode == "delete_real_story") {
        contentLoad();
      }
    }
  });
}

function storyLoad() {
  // var scroll = $StoryContent.scrollTop();
  // $Storylist.empty();
  // StroyRequest("find_location2", {
  //   story_id: line_id,
  // }, $Storylist, scroll);
  // $StoryContent.scrollTop(scroll);
  // console.log($StoryContent.scrollTop(), scroll);
}

function contentLoad() {
  var scroll = $Storylist.scrollTop()
  console.log("스크롤위치:", scroll)
  $Storylistzone.empty()
  storyRequest("find_real_location", {
    location_id: story_id
  }, $Storylistzone, scroll)
}


function storyLoad() {
  storyRequest("findByStoryId", {
    storyId: story_id
  })
}

function profiledata(storyid) {
  storyRequest("find_location1", {
    story_id: storyid,
  })
}

function locdata(storyid) {
  storyRequest("find_location2", {
    story_id: storyid,
  })
}

function createContent(val) {
  storyRequest("create_real_location", {
    location_id: story_id,
  }, $Storylistzone, 0, val)
}

function changeText(id, val) {
  console.log('test : ', id, val)
  storyRequest("update_real_story", {
    real_id: id,
    rl_text: val
  })
  modalstorytextOut();
}



function imgFormClick() {
  $("#imgtype_uplode").trigger("click");
}
function changeImg(id) {
  img_upload(id);
}
function img_upload(id) {
  var form = $('#img_form')[0];
  var formData = new FormData(form);
  $.ajax({
    url: 'http://15.164.222.144:3000/update_image',
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data', //매 우 중 요
    data: formData,
    type: 'POST',
    success: function(result) {
      modalstoryimgOut();
      storyRequest("update_real_story", {
        real_id: id,
        rl_image: result.location
      })
    }
  });
}

function mapupload() {
  if (loc_lon != null && loc_lat != null) {
    console.log(loc_lat, loc_lon);
    storyRequest("update_location", {
      location_id: story_id,
      gps_la: loc_lat,
      gps_lo: loc_lon,
      l_title: $StoryTitle.val(),
      summary: $Summary_Place.val()
    })
  }
}

function set_Story() {
  console.log("자동저장 : ", $StoryTitle.val(), $Summary_Place.val())
  storyRequest("update_location", {
    location_id: story_id,
    gps_la: loc_lat,
    gps_lo: loc_lon,
    l_title: $StoryTitle.val(),
    summary: $Summary_Place.val()
  })
}

function createContent_type(contentNo, type) {
  console.log(contentNo, type)
  if (type == "텍스트") {
    storyRequest("update_real_story", {
      real_id: contentNo,
      rl_text: 0,
    }, $Storylistzone, 0)
  }
  if (type == "이미지") {
    storyRequest("update_real_story", {
      real_id: contentNo,
      rl_image: 0,
    }, $Storylistzone, 0)
  }
  if (type == "비디오") {
    storyRequest("update_real_story", {
      real_id: contentNo,
      rl_video: 0,
    }, $Storylistzone, 0)
  }
  // if (type=="증강현실") {
  //   storyRequest("update_real_story", {
  //     real_id: contentNo,
  //   },$Storylistzone, 0, val)
  // }
  // if (type=="3D") {
  //   storyRequest("update_real_story", {
  //     real_id: contentNo,
  //   },$Storylistzone, 0, val)
  // }
}

function content_delete(){
  if (deletecontent_id != null) {
    storyRequest("delete_real_story", {
      real_id: deletecontent_id,
    })
  }
  modalstorytextOut();
  modalstoryimgOut();
}


$(document).ready(function() {
  jQueryLoad();
  modalreset();
  storyLoad();
  contentLoad();
  initTmap();
  $(document).on('click', '#mapSelector', function() {
    modalmapIn();
  });
  $(document).on('click', '#modal_Background', function() {
    modalmapOut();
    modalstorytextOut();
    modalstoryimgOut();
  });
  $(document).on('click', '#mapSubmit', function() {
    modalmapOut();
    loc_lat = maplat;
    loc_lon = maplon;
    mapupload()
  });

  $(document).on('click', '#img_changetext', function() {
    imgFormClick()
  });

  $("#imgtype_uplode").on('change', function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(this.files[0]);
      reader.onload = function(e) {
        $('#img_change').attr('src', e.target.result);
      }
    }
  });


  $StoryTitle.blur(function() {
    set_Story();
  });

  $Summary_Place.blur(function() {
    set_Story();
  });

  modal_textchange.blur(function() {
    modalstorytextblur();
  });
  modal_textchange.focus(function() {
    modalstorytextfocus();
  });

});
