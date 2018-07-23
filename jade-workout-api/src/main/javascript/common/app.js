var cdnworkout = "http://7xldv2.com1.z0.glb.clouddn.com/workout/";
// var cdnworkout = "http://localhost:8080/crawler-web2/static/";

var workoutApp = {};
workoutApp.appPath = "/jade-workout";
workoutApp.connTimeout= 8000;

workoutApp.userAuth = { };

workoutApp.userAuth.checkLogin = function (
		username, password, successCallback, failCallback, errorCallback) 
{
	if ('' !== username && '' !== password) {
		var auth = 'Basic ' + jadeUtils.string.base64encode(
				jadeUtils.string.utf16to8(username + ':' + password)); 
		$.ajax({ type: 'POST', dataType: 'json', timeout: workoutApp.connTimeout,
				url: workoutApp.appPath + '/api/workout/user/auth', 
				headers: {Authorization: auth},
				data: { },
				success: function(data, status, xhr) {
					console.debug(status);
					if ('success' == data.status && 'success' == data.auth) {
						successCallback(data);
					} else {
						failCallback(data);
					}
				},
				error: function(xhr, errorType, error) { errorCallback(error); },
				complete: function(xhr, status) {}
			});
	} else {
		console.debug("no username or password");
	}
};

workoutApp.userAuth.barinit = function () {
	$('#div-userinfo').hide();
	$('#mu-workoutrec').hide();

	var login = function (username, password) {
		workoutApp.userAuth.checkLogin(username, password, function(data) {
			jadeUtils.cookieOperator('username', username);
			jadeUtils.cookieOperator('password', password);
			$("#div-userlogin").removeClass("has-error");
			$('#div-userlogin').hide();
			$('#lb-username').html(username);
			$('#div-userinfo').show();
			$('#mu-workoutrec').show();
		}, function (data) {
			console.debug(data.reason);
			$("#div-userlogin").addClass("has-error");
		}, function (data) {
			alert("Ajax Error");
		});
	};
	$('#login').on('click', function(event) {
		var username = $('#username').val();
		var password = $('#password').val();
		login(username, password);
	});

	$('#logout').on('click', function(event) {
		$('#mu-workoutrec').hide();
		$('#div-userinfo').hide();
		$('#div-userlogin').show();
	});

	var username = jadeUtils.cookieOperator('username');
	var password = jadeUtils.cookieOperator('password');
	$('#username').val(username);
	$('#password').val(password);
	login(username, password);
};

function parseDate(str) {
	var d = new Date();
	d.setFullYear( str.substring(0,4) - 0, str.substring(5,7) - 1, 
			str.substring(8,10) - 0);
	return d;
}
