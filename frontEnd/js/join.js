story_runtime = null;

back_key = false; // 백키를 눌러 이전페이지로 돌아가는것을 설정합니다
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

//---------------뒤로가기키 제어부 ---------------
history.pushState(null, null, location.href);
window.onpopstate = function(event) {
  back_key = true;
  modalpageIn();
  $(':focus').blur();
}
//--X----X----X--뒤로가기키 제어부 --X----X----X--

//---------------제이쿼리 애니메이션---------------

function pageout(out){
  if (out=="네") {
    window.history.go(-1);
  } else {
    modalpageOut();
  }
}


// 초기화
function jQueryLoad() {
  $timeSetKind = $('#timeSetKind');
  $timeSetInput = $("#timeSetInput");
  $StoryLineTime = $("#StoryLineTime");
  $profile_img = $("#profile_img");
  $Storylist = $('#Storylist');

  $StoryContentBackground = $("#StoryContentBackground");
  $StoryContent = $("#StoryContent");
  $scrolldumi = $("#scrolldumi");

  // input tag
  $StoryLineTitle = $("#StoryLineTitle");
  $Summary_Place = $("#Summary_Place");
}
// 모달창 리셋
function modalreset() {
  modal_Layer = $("#modal_Layer");
  modal_Background = $("#modal_Background");
  modal_Timeset = $("#timeSet");
  modal_Timeset.hide(0)
  modal_Imguplode = $("#imguplode");
  modal_Imguplode.hide(0)
  modal_pageout = $("#pageout");
  modal_pageout.hide(0)
}
// 소요시간 설정 팝업
function modaltimesetIn() {
  modal_Layer.css({
    'top': '0%',
  });
  modal_Background.css({
    'opacity': '0.5'
  });
  modal_Timeset.show(100)
}


function modaltimesetOut() {
  modal_Layer.css({
    'top': '-100%',
  });
  modal_Background.css({
    'opacity': '0'
  });

  modal_Timeset = $("#timeSet");
  modal_Timeset.hide(0)
}

// 이미지 업로드 팝업
function modalimgIn() {
  modal_Layer.css({
    'top': '0%',
  });
  modal_Background.css({
    'opacity': '0.5'
  });
  modal_Imguplode.show(100)
}

function modalimgOut() {
  modal_Layer.css({
    'top': '-100%',
  });
  modal_Background.css({
    'opacity': '0'
  });

  modal_Imguplode.hide(0)
}

// 페이지 나감 팝업
function modalpageIn() {
  modal_Layer.css({
    'top': '0%',
  });
  modal_Background.css({
    'opacity': '0.5'
  });
  modal_pageout.show(100)
}

function modalpageOut() {
  if (back_key == true) {
    history.pushState(null, null, location.href);
    back_key = false
  }
  modal_Layer.css({
    'top': '-100%',
  });
  modal_Background.css({
    'opacity': '0'
  });
  modal_pageout.hide(0)
}




// modain()
var timeset = 'min';
var runtime = null;

function timeSetBnt(time) {
  $timeSetKind.text(time);
  if (time == '분') {
    timeset = 'min';
  } else if (time == '시간') {
    timeset = 'hour';
  } else if (time == '일') {
    timeset = 'day';
  }
}

function timeSetSubmit() {
  // modalOut()
  story_runtime = $timeSetInput.val();

  if (story_runtime == '' || story_runtime == 0) {
    story_runtime = null;
  } else if (timeset == 'min') {
    if (story_runtime > 59) {
      story_runtime = 59;
    }
  } else if (timeset == 'hour') {
    story_runtime = story_runtime * 100;
    if (story_runtime > 2359) {
      story_runtime = 2300;
    }
  } else if (timeset == 'day') {
    story_runtime = story_runtime * 10000;
    if (story_runtime > 101159) {
      story_runtime = 100000;
    }
  }
  set_Profile();
  modaltimesetOut();
}

// -----------------AJXA 통신부--------------------

// 스토리라인의 정보를 로딩합니다
function load_storyline(title, runtime, summary, image) {

  //[runtime]스토리라인의 처리를 합니다
  story_runtime = runtime;
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
    playtime = '소요시간을<br>설정해주세요';
    timecolor = ' storyLineTimeNone'
  }
  playtime = '<div id="StoryLineTime" class="' + timecolor + '">' + playtime + '</div>';


  $StoryLineTitle.val(title);
  $Summary_Place.val(summary);
  $("#profileTop").html(playtime);

  if (image != null) {
    $profile_img.css({
      'background-image': 'url(' + image + ')',
      'background-size': '100%',
      'background-position': 'center center',
    });
  }
}

function load_story(position,id, title, name, summary, image) {
  // 이미지 처리를 합니다
  if (image != null) {
    img = '<img class="img" src=" ' + image + ' ">';
    style = 'style="background:#fff;"';
  } else {
    img = "";
    style ="";
  }
  // 이름과 타이틀 서머리의 디폴트 값을 지정합니다
  if (title == null) {
    title = "여기를 눌러<br>스토리를 편집하세요"
  }
  if (summary == null) {
    summary = "누르면 스토리를 편집할수 있습니다."
  }
  if (name == null) {
    name = ""
  }
  // 스토리 HTML 을 생성합니다.
  var create_StoryHTML = ""
  create_StoryHTML += '<!-- 하나의 스토리 --> <div class="Storys" data-id="';
  create_StoryHTML += id + '" data-position="'+position+'"'+style+'> <div class="story_background">';
  create_StoryHTML += img + '</div> <div class="story_position"> <div class="StorysTop"> <div class="StorysLeft"> <div class="storyIoc">';
  create_StoryHTML += name + '</div> <div class="StoryTitle">';
  create_StoryHTML += title + '</div> </div> <div class="StorysRight"> <div class="StoryDelBut"> 삭제하기 </div> </div> </div> <div class="StorysBottom"> <div class="StorySummary"> ';
  create_StoryHTML += summary + '</div> </div> </div> </div>';
  return create_StoryHTML;

}


function create_Story() {
  var create_StoryHTML = '<!-- 하나의 스토리 --> <div class="Storys"> <div class="story_background"> </div> <div class="story_position"> <div class="StorysTop"> <div class="StorysLeft"> <div class="storyIoc"> <!-- 위치정보 --> </div> <div class="StoryTitle"> <!-- 스토리의 제목 --> </div> </div> <div class="StorysRight"> <div class="StoryDelBut"> X </div> </div> </div> <div class="StorysBottom"> <div class="StorySummary"> 스토리 요약 </div> </div> </div> </div>';
  return create_StoryHTML;
}

//AJAX 통신을 위한 다용도 함수입니다.
function StroyRequest(mode, parameter = null, selector = null, scroll = 0) {
  //에러발생시 확인을 위한 구문
  var key
  var parameterError = ""
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
      if (mode == "find_location1") {

        for (var i = 0; i < ajaxdata.length; i++) {
          load_storyline(ajaxdata[i].title, ajaxdata[i].runtime, ajaxdata[i].simple_description, ajaxdata[i].image)
        }
      }
      if (mode == "find_location2") {
        for (var i = 0; i < Object.keys(ajaxdata).length; i++) {
          inputdata = load_story(i,ajaxdata[i].id, ajaxdata[i].title, ajaxdata[i].name, ajaxdata[i].summary, ajaxdata[i].location_image);
          selector.append(inputdata);
          console.log($StoryContent.scrollTop(), scroll);
          $StoryContent.scrollTop(scroll);
        }
      }


      // try {
      //
      // } catch (e) {
      //
      // } finally {
      //
      // }

    },
    error: function(request, status, error) {
      if (mode == "create_location") {
        storyLoad();
        console.log("새로운 스토리 생성");
      } else if (mode == "update_story") {
        storylineLoad();
      } else {
        console.log("실패", request, status, error)
      }

    }
  });
}

// 경우에 따라 알맞는 AJAX를 보내주는 부분입니다.
// line Load = 생성, 수정하려는 스토리라인에 저장된 내용이 있으면 저장된 내용을 불러옵니다.
function storylineLoad() {
  StroyRequest("find_location1", {
    story_id: line_id,
  })
}

function storyLoad() {
  var scroll = $StoryContent.scrollTop();
  $Storylist.empty();
  StroyRequest("find_location2", {
    story_id: line_id,
  }, $Storylist, scroll);
  $StoryContent.scrollTop(scroll);
  console.log($StoryContent.scrollTop(), scroll);
}

function storyadd() {
  StroyRequest("create_location", {
    story_id: line_id,
  })
}
// 수정부분 AJAX
function set_Profile() {
  StroyRequest("update_story", {
    story_id: line_id,
    title: $StoryLineTitle.val(),
    runtime: story_runtime,
    simple_description: $Summary_Place.val()
  })
}

function testAjax() {
  StroyRequest("update_location_lo_index", {
    location_index_array: [{
        id: 1
      },
      {
        id: 2
      }
    ]
  })
}


console.log("자바스크립트 로드 완료");
line_id = tabfind();
$(document).ready(function() {
  jQueryLoad();
  modalreset();
  storylineLoad();
  storyLoad();

  $(document).on('click', '#StoryLineTime', function() {
    modaltimesetIn();
  });
  $(document).on('click', '#modal_Background', function() {
    modaltimesetOut();
    modalimgOut();
    modalpageOut();
  });
  $(document).on('click', '#profileImgChange', function() {
    modalimgIn();
  });
  $(document).on('click', '.Storys', function() {
    location.href = "StoryWrite.html?tab="+$(this).data('id');
  });
  $(document).on('click', '#StoryAdd', function() {
    storyadd();
  });

  $StoryLineTitle.blur(function() {
    set_Profile();
  });
  $Summary_Place.blur(function() {
    set_Profile();
  });
});
