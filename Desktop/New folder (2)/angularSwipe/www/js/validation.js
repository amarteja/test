function textbox_validation(uid,error)  
{  
if (uid.length === 0)  
{  
//alert("Hello");
//document.getElementById(error).innerHTML = 'please fill the field : ' + error;
alert("Please update the text field");
//uid.focus();  
return false;  
}  
return true;  
}  


function getCurrentDate(){
var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
 // document.write("<b>" + day + "/" + month + "/" + year + "</b>");
  return "<b>" + day + "/" + month + "/" + year + "</b>";
}

function getCurrentTime(){
	var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
	
	return "<b>" + h + ":" + m + "</b>";
}




 function zip_validation(zip)
{
//alert("zip validation");
  if( zip === "" || isNaN( zip ) || zip.length != 5 )
   {
 alert("PLease enter Valid Zip code");
     //document.getElementById('zip_validation').innerHTML = 'please enter valid Zip #####!!!';
     //form.Zip.focus() ;
     return false;
   }
   //document.getElementById('Zipvalidation').innerHTML = '';
   return true;
}


function Radio_Validation(radios) {
   // alert(radios.length);
	//alert("inside radio button" + radios[0].checked);
    for (var i = 0; i < radios.length; i++) {
	//alert(radios[i]);
        if (radios[i]) {
        return true; // checked
    }
    }

    // not checked, show error
    //document.getElementById('RadioValidation').innerHTML = 'Please select a Radio button!!!';
	alert("Please select the radio button  +++");
    return false;
}


function CheckBox_Validation(checkboxes) {
    
	for (var i=0; i<checkboxes.length; i++) {
	if (checkboxes[i])
	break;
	}	
	if (i==checkboxes.length){
	//document.getElementById('CheckBoxValidation').innerHTML = 'Please select the options!!!';
	alert("please check any one item");
	return false;
	}
    return true;
}

