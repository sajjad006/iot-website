// Initialize Firebase
var config = {
apiKey: "AIzaSyCS61EXIJczeSVFYz8qKzZpQ_1z7xBurdQ",
authDomain: "android-login-system.firebaseapp.com",
databaseURL: "https://android-login-system.firebaseio.com",
projectId: "android-login-system",
storageBucket: "android-login-system.appspot.com",
messagingSenderId: "75364647470"
};

firebase.initializeApp(config);

var database = firebase.database();		
var storage = firebase.storage();

var ref = firebase.database().ref();
var storageRef = storage.ref();

//uid of  null error. look into it. cannot retreive username
function check() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			document.getElementById('body').style.display='block';
			var login=true;
			var user = firebase.auth().currentUser;
			var uid = user.uid;
					
			console.log(uid);
			getData(uid);
			
		} else {
		    window.location.replace('index.html');
		}
	});
	myVar = setTimeout(showPage, 5000);
}

function getData(uid) {
	ref.on("value", function(snapshot) {
	   lightstatus=convert(snapshot.child("light").val());
	   fanstatus=convert(snapshot.child("fan").val());
	   doorstatus=convert(snapshot.child("door").val());
	   acstatus=convert(snapshot.child("ac").val());
	   name=snapshot.child("Users").child(uid).child('name').val();
	   email=snapshot.child('Users').child(uid).child('email').val();
	   temp=snapshot.child("temperature").val();
	   humi=snapshot.child("humidity").val();
	   motion=snapshot.child("motion").val();


	   if (name === 'null') {
	   		deleteUser();	
	   }
	   if (email === 'null') {
	   		deleteUser();
	   }

	   document.getElementById('name').innerHTML = "WELCOME " + name.toUpperCase();
	   document.getElementById("l").innerHTML = "LIGHT STATUS : "+ lightstatus;
	   document.getElementById("f").innerHTML = "FAN STATUS : "+ fanstatus;
	   document.getElementById("a").innerHTML = "AC STATUS : "+ acstatus;
	   document.getElementById("d").innerHTML = "DOOR STATUS :"+ doorstatus;
	   document.getElementById('temperature').innerHTML = "ROOM TEMPERATURE :"+temp+"<sup>•</sup>C";
	   document.getElementById('humidity').innerHTML = "HUMIDITY :"+humi+" %";
		
	   if (motion==1) {
	   		document.getElementById("motion").innerHTML="MOTION DETECT !!!";
	   }
	   else{
	   		document.getElementById('motion').innerHTML="";
	   }

	});
}

function convert(data) {
	if (data=="1")
		return "ON";
	else if (data=="0")
		return "OFF";
}

function signout() {
	firebase.auth().signOut().then(function() {
		window.location.replace('index.html');
	}).catch(function(error) {
		signin=false;
	});
}

function deleteUser() {
	var user = firebase.auth().currentUser;

	user.delete().then(function() {
		window.location.replace('index.html');
	}).catch(function(error) {
	  // An error happened.
	});
}

function signup() {
	document.getElementById('error').style.display='block';
	document.getElementById('body').style.display='none';
	var name=document.getElementById('username').value;
	var email=document.getElementById('email').value;
	var password=document.getElementById('password').value;
	var mcu_number=document.getElementById('mcu').value;

	if (name=="" || email=="" || password=="" || mcu_number=="") {
		alert("Please fill in all the fields");
		show();
	}
	else{
		if (password.length <6) {
			alert("Password should be 6 characters long.");
			show();
		}
		else{
			if (mcu_number!="502") {
				alert("INVALID MCU NUMBER");
				show();
			}
			else{
				firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
				    var user = firebase.auth().currentUser;
				    var uid = user.uid;
					ref.child('Users').child(uid).child('name').set(name);
					ref.child('Users').child(uid).child('email').set(email);
					window.location.replace('fire.html');
				}, function(error) {
				    // Handle Errors here.
				   	show(); 
				    var errorCode = error.code;
				    var errorMessage = error.message;

				    if (errorCode === 'auth/email-already-in-use') {
				    	alert('You already have an account !!');
				    }
				    else if (errorCode === 'auth/invalid-email' || errorCode === 'auth/operation-not-allowed') {
				    	alert('Invalid email !!');
				    }
				    else if (errorCode === 'auth/weak-password') {
				    	alert('Password should be atleast six characters long');
				    }
				    else{
				    	alert('Sorry couldnot process your request !!');
				    }
				});
			}
		}
	}
}

function signin() {
	document.getElementById('error').style.display='block';
	document.getElementById('body').style.display='none';
	var email=document.getElementById('semail').value;
	var password=document.getElementById('spassword').value;
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
		window.location.replace("fire.html");
	}).catch(function(error) {
		show();
		var errorCode = error.code;
	    var errorMessage = error.message;

	    if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email' || errorCode === 'auth/user-disabled' || errorCode === 'auth/user-not-found') {
	        alert('Invalid e-mail or password !!');
	    }
	    else{
	    	alert('Sorry couldnot process your request !!');
	    }
	    console.log(error);
	});
}	