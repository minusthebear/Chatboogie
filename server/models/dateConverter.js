
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
	return x;
}

function setValues(z, nowDate, oldDate, w, x, y, val, msg){
	var v;
	var c = parseInt(nowDate.substring(w,x));
	var d = parseInt(oldDate.substring(w,x));
	var e = parseInt(nowDate.substring(x,y));
	var f = parseInt(oldDate.substring(x,y));				
	if (c === d){
		console.log("Chogiyo");
		var num = e - f;
		v = num + msg;
	} else {
		console.log("Yogiyo");
		var first = e + val;
		var num = first - f;
		v = num + msg;
	}
	return v;
}	


function setMonth(value){
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

function setMinutes(value){
	return minSecDay(value, "min");
}

function setSeconds(value){
	return minSecDay(value, "sec");
}

function setDay(value){
	return minSecDay(value, "day");
}

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

exports.setDay = setDay;
exports.setMonth = setMonth;
exports.setSeconds = setSeconds;
exports.setMinutes = setMinutes;