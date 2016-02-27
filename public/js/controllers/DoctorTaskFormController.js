app.controller('DoctorTaskFormController', ['$store', '$http', '$scope', '$state', '$window', 'doctorFactory', 'dateService',
	function DoctorTaskFormController($store, $http, $scope, $state, $window, doctorFactory, dateService) {
	
		$scope.task = {};

		var info = doctorFactory.getData();
		var id = $store.get('doctor_id')

		$scope.submit = function(task){

			var d = new Date();
			var x = dateService.setMonth(d.getMonth()), 
				y = dateService.setMinutes(d.getMinutes()), 
				z = dateService.setSeconds(d.getSeconds()),
				w = dateService.setDay(d.getDate()),
				DT = d.getFullYear().toString() + x + w + d.getHours().toString() + y + z;

			return $http.post('/newTask', {id: id, task: task, date: DT}).then(function(res){
				if (res.data.success === true){
					$state.go('doctor');
					$window.location.href = '/doctor';
				} else {
					// Add in some sort of error notification here.
					$state.go('doctor');
					$window.location.href = '/doctor';					
				}
			}).catch(function(err){
				console.log(err);
			});
		};
	}]);

app.service('dateService', function(){
	var month, day, minutes, seconds;

	function equation(value, nowDate, oldDate){
		var z;
	
		switch(true) {
			case (0 <= value && value < 100):
				z = "Just now";
				break;
			case (10 <= value && value < 10000):
				z = setValues(z, nowDate, oldDate, 8, 10, 12, 60, " minutes ago");
				break;
			case (10000 <= value && value < 1000000):
				z = setValues(z, nowDate, oldDate, 6, 8, 10, 24, " hours ago");
				break;
			case (1000000 <= value && value < 100000000):
				z = setValues(z, nowDate, oldDate, 4, 6, 8, 30, " days ago");
				break;
			case (100000000 <= value && value < 10000000000):
				z = setValues(z, nowDate, oldDate, 0, 4, 6, 12, " months ago");
				break;
			case (10000000000 <= value):
				var c = parseInt(nowDate.substring(0,4));
				var d = parseInt(oldDate.substring(0,4));			
				var num = c - d;
				z = num + " years ago";
				break;
		}
		return z;
	}	

	function minSecDay(value, id){
		var x;
		if ((value >= 10) && (value <= 59)){
			x = value.toString();
		} else {
			switch(value){
				case 0:
			        x = "00";
			        break;
			    case 1:
			        x = "01";
			        break;
			    case 2:
			        x = "02";
			        break;
			    case 3:
			        x = "03";
			        break;
			    case 4:
			        x = "04";
			        break;
			    case 5:
			        x = "05";
			        break;
			    case 6:
			        x = "06";
			        break;
			    case 7:
			        x = "07";
			        break;
			    case 8:
			        x = "08";
			        break;
			    case 9:
			        x = "09";
			        break;
			}
		}
		switch(id){
			case "min":
				minutes = x;
				break;
			case "sec":
				seconds = x;
				break;
			case "day":
				day = x;
				break;
		}
		return x;
	}

	function setValues(z, nowDate, oldDate, w, x, y, val, msg){
		var v;
		var c = parseInt(nowDate.substring(w,x));
		var d = parseInt(oldDate.substring(w,x));
		var e = parseInt(nowDate.substring(x,y));
		var f = parseInt(oldDate.substring(x,y));				
		if (c === d){
			var num = e - f;
			v = num + msg;
		} else {
			var first = e + val;
			var num = first - f;
			v = num + msg;
		}
		return v;
	}	

	function setDay(value){
		var x = minSecDay(value, "day");
		return x;
	}
	function setSeconds(value){
		return minSecDay(value, "sec");
	}
	function setMinutes(value){
		return minSecDay(value, "min");
	}
	function setMonth(value){
		var y;
		switch(value) {
		    case 0:
		        y = "01";
		        break;
		    case 1:
		        y = "02";
		        break;
		    case 2:
		        y = "03";
		        break;
		    case 3:
		        y = "04";
		        break;
		    case 4:
		        y = "05";
		        break;
		    case 5:
		        y = "06";
		        break;
		    case 6:
		        y = "07";
		        break;
		    case 7:
		        y = "08";
		        break;
		    case 8:
		        y = "09";
		        break;
		    case 9:
		        y = "10";
		        break;
		    case 10:
		        y = "11";
		        break;
		    case 11:
		        y = "12";
		        break;		        
		}
		return y;
	}

	function setFullNum(d){
		var x = setMonth(d.getMonth());
		var	y = setMinutes(d.getMinutes());
		var	z = setSeconds(d.getSeconds());
		var	w = setDay(d.getDate());
		var	DT = d.getFullYear().toString() + x  +  w + d.getHours().toString()  + y +  z;
		return DT;
	}		
	
	return {
		setMonth: setMonth,
		setMinutes: setMinutes,
		setSeconds: setSeconds,
		setDay: setDay,
		equation: equation,
		setFullNum: setFullNum,
		doEquation: function (val, d){
			var DT = setFullNum(d);

			function setDate(e, t){
				var year = e.substring(0,4), 
					month = e.substring(4,6), 
					day = e.substring(6,8), 
					hour = e.substring(8,10), 
					minutes = e.substring(10,12);

				t['date'] = month + "/" + day + "/" + year;
				t['clock'] = hour + ":" + minutes;
			}

			for (var t in val){
				var num = parseInt(DT) - parseInt(t);
				setDate(t, val[t])
				val[t].time = equation(num, DT, t);
			}
			return val;
		}	
	};	
});