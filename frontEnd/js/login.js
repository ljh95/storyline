

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
      console.log(ajaxdata)
      console.log(ajaxdata[0].id)
      // 16616516@naver.com
      localStorage.setItem("story_line_user_id",ajaxdata[0].id)
      location.href = "index.html";
    },
    error: function(request, status, error) {

    }
  });
}


function keyon() {
  $('#view').css({
    'margin-top': '5vh',
  });
}

function keyout() {
  $('#view').css({
    'margin-top': '10vh',
  });
}

$(document).ready(function() {

  $(document).on('click', '#loginbnt', function() {
    console.log($('#user_id').val(),$('#pw').val())
    Request("login",{
      email: $('#user_id').val(),
      pw: $('#pw').val(),
    })
  });
  $('.key').focus(function() {
    console.log(11);
    keyon();
  });
  $('.key').blur(function() {
    keyout();
  });

  //게스트 입장
  $(document).on('click', '#guest', function() {
    localStorage.setItem("story_line_user_id",6)
    location.href = "index.html";
  });

});
