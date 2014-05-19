function saveinLocalStorage(myArray,caretaker_lname)
{
			var value = JSON.stringify(myArray);
           
            localStorage.setItem(caretaker_lname, value);
			return localStorage.getItem(caretaker_lname);
}

function retrieveFormLocal(cartaker_lname){
if(localStorage.getItem(cartaker_lname) !== null){
	return JSON.parse(localStorage.getItem(cartaker_lname));
}
return false;
}