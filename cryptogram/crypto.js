window.addEventListener ("load", event =>
{
	const input = document.getElementById ("input-quote");
	input.focus();
	input.addEventListener ("blur", event => quoteBlurHandler (event));
	input.addEventListener ("focus", event => quoteFocusHandler (event));
	input.addEventListener ("input", event => quoteInputHandler (event));

	const encode = document.getElementById ("encode");
	encode.addEventListener ("click", event => encodeClickHandler (event));
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Event handlers for the encode <button>
//

function encodeClickHandler (event)
{	event.preventDefault();
	target = event.target;

	//	This app is intended to be used in the construction of a cryptogram quiz.  It expects a string of text representing
	//	a quote or anecdote and encodes the input using a simple substitution cipher.

	//	Get the solution string as entered in the <textarea>.  Check that it will work within Sporcle's constraints and
	//	convert it to upper case.  Sporcle will convert it anyway, so might as well.

//		let quote = document.getElementById ("input-quote").value;
//		if (quoteIsTooLongForGrid (quote)) return;
//		quote = quote.toUpperCase();
	let solution = document.getElementById ("input-quote").value.toUpperCase();

//		//	If the quote is longer than 30 characters (it probably is), it needs to be broken into shorter segments to fit
//		//	within the constraints of a Sporcle Grid quiz.
//	
//		const solution = breakDownTheQuote (quote);
//	
//		//	Encode the quote...
//	
//		const alphabet = getAlphabet();			//	An array of the English alphabet
//		const cipher = getCipher(alphabet);		//	An array of the cipher.  Elements of cipher have a 1-to-1 coorespondence
//												//	with alphabet
//		const encoded = [];
//	
//		for (let i=0; i<solution.length; i++)
//		{
//			//	Iterate the solution text array and encode it...
//	
//			let arr1 = solution[i].split("");
//			let arr2 = [];
//	
//			for (let j=0; j<arr1.length; j++)
//			{
//				//	Iterate the quote, character by charavter
//				//	1)	find the the current character (from the quote) in alphabet[]
//				//	2)	replace the current character (from the quote) with the corresponding letter in cipher[]
//				//
//				//	It seems simpler, but .replaceAll() doesn't actually work here.
//	
//				//	But only replace charaters that are found in alphabet[].  Characters such as spaces and punctuation should
//				//	not be replaced.
//	
//				const k = alphabet.indexOf (arr1[j]);
//	
//				if (k >= 0)
//					arr2.push (cipher[k]);
//				else
//					arr2.push (arr1[j]);
//			}
//	
//			encoded.push (arr2.join(""));
//		}
//	
//		hideElement ("input-quote");
//		hideElement ("encode");
//		hideElement ("encoded-quote", false);
//	
//		document.getElementById ("encoded-quote").innerText = encoded.join("");

	//	There are at least two (I think only two) quiz type suitable to cryptogram puzzles.  The first, and most obvious,
	//	is the Grid quiz.  The other is a Map quiz.  Either should work, but the grid will work more like a printed
	//	puzzle the a map.
	//
	//	The thing they have in common is the need to encrypt a quotation or phrase.  Cryptograms use a simple substitution
	//	cipher.  Each letter of the alphabet is replaced by a different letter of the alphabet; A => I, B => Q, etc.
	//	Non-alpha characters (numerals, punctuation, spaces, etc.) are not usually encrypted in cryptograms.  And although
	//	not it's not strictly required, no letter should be replaced with itself: A != A, B != B, etc.

	const alphabet = getAlphabet();			//	An array of the English alphabet
	const cipher = getCipher(alphabet);		//	An array of the cipher.  Elements of cipher have a 1-to-1 coorespondence
											//	with alphabet
	const array = solution.split ("");		//	The solution text converted to an array
	const encrypt = [];						//	an array for the encrypted text

	for (let i=0; i<array.length; i++)
	{
		//	Iterate the solution text array and encode it...

//			let arr1 = solution[i].split("");
//			let arr2 = [];
//	
//			for (let j=0; j<arr1.length; j++)
//			{
			//	Iterate the quote, character by charavter
			//	1)	find the the current character (from the quote) in alphabet[]
			//	2)	replace the current character (from the quote) with the corresponding letter in cipher[]
			//
			//	It seems simpler, but .replaceAll() doesn't actually work here.

			//	But only replace charaters that are found in alphabet[].  Characters such as spaces and punctuation should
			//	not be replaced.

//				const k = alphabet.indexOf (arr1[j]);
			const k = alphabet.indexOf (array[i]);
	
			if (k >= 0)
				encrypt.push (cipher[k]);
			else
				encrypt.push (array[i]);
//			}

//			encrypt.push (arr2.join(""));
	}

const encrypted = encrypt.join ("");
formatForGrid (solution, encrypted);

	hideElement ("quote-section");
	hideElement ("encode");
	hideElement ("encryption-section", false);
	document.getElementById("encryption-section").classList.add ("flex");

}

function getAlphabet ()
{
	return [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ]
}

function getCipher (alphabet)
{	//	Create the substitution cipher that will be used.

	const cipher = [];

	//	Remove some random element from the alphabet, and push that value into the array cipher[].  Repeat until no
	//	elements remain in the alphabet.

	const temp = getAlphabet();
	while (temp.length > 0)
	{
		const x = Math.floor ((Math.random() * temp.length));
		cipher.push (temp.splice (x, 1)[0]);
	}

	//	One last thing...  No element of the cipher should have the same value as the corresponding element of the
	//	alphabet; e.g. A != A, B != B, etc.
	//
	//	It might seem better to create cipher[] in such a way that prevents this happening...text the randomly selected
	//	letter and position in cipher[] right away and if they match randonly select another until they don't.  But what
	//	if the failure is with the last remaining chaacter in alphabet[]?  There are no other options and the cipher will
	//	always fail, forcing the app to start over anyway.
	//
	//	This seems cleaner and easier...

	let fail = false;

	for(let i=0; i<cipher.length; i++)
	{
		if (cipher[i] == alphabet[i]) { return getCipher(alphabet); }
	}

	return cipher;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Functions used to format the solution and encrypted text for a Sporcle grid-type quiz
//

function formatForGrid (solution, encrypted)
{
	//	Format the solution and encrypyed text so that it may be imported into a Sporcle Grid quiz.  Sporcle uses the
	//	same format that most spreadsheets use (Excel and Sheets do anyway) to copy-and-paste content.  Sporcle's intent
	//	is to allow quiz developers to develop their quizzes with a spreadsheet and copy the completed data into a quiz.
	//
	//	Rows of data are made up of individual cells.  Cells are separated by tabs and rows are separated by new line.
    //
	//	But there is one huge difference between most spreadsheets and a Sporcle Grid quiz.  Sporcle limits the quiz to
	//	30x30 cells.

	const grid = document.getElementById ("grid-formatted");

	if (solution.length > 300)
	{
		//	Sporcle limits Grid quizzes to a maximum 30x30 grid.  For practical purposes (line spacing, borders, etc.)
		//	this limits the quote to 300 characters, including spaces and punctuation.

		grid.classList.add ("error");

		const div = grid.querySelector("#title");
		div.innetText =  "The text is too long for a Sporcle Grid type quiz";
		return;
	}
	
	if (solution.length > 252)
	{
		//	The puzzle will look better if cells around the perimeter are blank, especially if a background image is
		//	used.  That gives us a practical limit of 252 characters.

		grid.classList.add ("error");
		grid.title = "This text is longer than 252 characters and may not work well within Sporcle Grid constraints.";
		grid.classList.add ("error");
	}

	//	Format it for a grid quiz...

	const array = [];								//	A temporary array

	while (solution.length > 28)
	{
		array.push ("\n");							//	A row of empty cells above each line of the quote

		//	The solution text is longer than 28 characters.  Create a substring of the solution that is no
		//	more than 28 characters long without breaking words.

		let sub = solution.substring (0, 30);		//	The first 30 characters in the quote string
		let pos = sub.lastIndexOf (" ");			//	The last break between words (a space) in the new substring
		sub = sub.substring (0, pos);				//	The substring without partial words
		sub = sub.split("").join("\t");				//	A tab between characters
		array.push (sub);							//	Push the substring into the temporary array[]
		array.push("\n");

		solution = solution.substring (pos);		//	Remove the substring from the solution text

		sub = encrypted.substring (0, pos);			//	The cooresponding portion of the encrypted text 
		sub = sub.split("").join("\t");				//	A tab between characters
		array.push (sub);							//	Push the substring into the temporary array[]
		encrypted = encrypted.substring (pos);		//	Remove the substring from the encrypted text
		array.push("\n");
	}

	array.push ("\n");								//	A row of empty cells at the end of the quiz

	grid.querySelector("#body").innerText = array.join("\n");
}

//	function quoteIsTooLongForGrid (q)
//	{
//		//	Sporcle limits Grid quizzes to a maximum 30x30 grid.  For practical purposes, this limits the quote to
//		//	300 characters, including spaces and punctuation.
//	
//		if (q.length > 300)
//		{
//			alert ("The text is too long for a Sporcle Grid type quiz");
//			return true;
//		}
//	
//		//	But a prettier quiz requires blank rows above and below the puzzle, as well as blank columns to either
//		//	side.  That limits the quote to 252 characters.  The quiz can still be presented as a Grid type, but it 
//		//	won't be as pretty.
//	
//		if (q.length > 252) alert ("This text is longer than 252 characters and may not work well within Sporcle Grid constraints.");
//	
//		return false;
//	}

function breakItDown (q)
{
	//	The maximum size of Sporcle Grid quiz is 30x30 cells, and Sporcle will delete any data that runs past.
	//
	//	This function make multiple smaller strings from the quote string, and returns these strings as an array.
	//	The quote string will be subdivided between words, so each substring may well be a different length.

	let array = [];
	while (q.length > 28)
	{
		let sub = q.substring (0, 30);		//	The first 30 characters in the quote string
		let pos = sub.lastIndexOf (" ");	//	The position of the last space in the new substring
		sub = sub.substring (0, pos);		//	The substring without partial words
		array.push (sub);

		q = q.substring (pos);				//	The quote string without the new substring
	}

	array.push (q);

	return array;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Event handlers for the quote-input <textarea>
//

function quoteBlurHandler (event)
{	event.preventDefault();
	target = event.target;

	//	I thought there were other things to do here, but they seem to work better in the input event handler.  So all I
	//	really wat to do here, is make sure the 'Encode' button has focus...and even that shouldn't be necessary.  If the
	//	input event handler works correctly, the 'Encode' button should receive focus naturally.

	document.getElementById ("encode").focus()
}

function quoteFocusHandler (event)
{	event.preventDefault();
	event.target.select();
}

function quoteInputHandler (event)
{	event.preventDefault();
	target = event.target;

	//	If there is data in the <textarea>, I want to remove the instructions (a background-image) and display the 'Encode'
	//	button.  But the reverse if there is no data -- display the instructions and hide the 'Encode' button.

	if (target.value == "")
	{
		target.classList.add ("instructions");
		hideElement ("encode");
	}
	else
	{
		target.classList.remove ("instructions");
		hideElement ("encode", false);
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Functions used throughout this script
//

function hideElement (element, hide=true)
{
	if (hide)
		document.getElementById (element).classList.add ("hidden");
	else
		document.getElementById (element).classList.remove ("hidden");
}