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

	const alphabet = getAlphabet();
	const cipher = getCipher();

	//	alphabet[] and cipher[] have a one-to-one correspondence, and together form the code key.  cipher[x] replaces
	//	alphabet[x].

	//	Encode the quote...
	
	const quote = document.getElementById ("input-quote").value;

	//	...but do it to a copy of the quote to preserve upper and lower case of the original.

	let qUpper = quote.toUpperCase();

	//	First, convert the string to an array for processing

	qUpper = qUpper.split("");

	for (i=0; i<qUpper.length; i++)
	{
		//	Iterate the quote, character by charavter
		//	1)	find the the current character (from the quote) in alphabet[]
		//	2)	replace the current character (from the quote) with the corresponding letter in cipher[]
		//
		//	It seems simpler, but .replaceAll() doesn't actually work here.

		const j = alphabet.indexOf (qUpper[i]);

		//	But only replace charaters that are found in alphabet[].  Characters such as spaces and punctuation should
		//	not be replaced.

		if (j >= 0) qUpper[i] = cipher[j];
	}

	qUpper = qUpper.join("");

	hideElement ("input-quote");
	hideElement ("encode");
	hideElement ("encoded-quote", false);

	document.getElementById ("encoded-quote").innerText = qUpper;

//	Now I need to figure out how to format the data so I can upload it to Sporcle.  When I have that, I can fininsh this
//	app.
}

function getAlphabet ()
{
	return [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ]
}

function getCipher ()
{	//	Create the substitution cipher that will be used.

	const alphabet = getAlphabet();
	const cipher = [];

	//	Remove some random element from the alphabet, and push that value into the array cipher[].  Repeat until no
	//	elements remain in the alphabet.

	while (alphabet.length > 0)
	{
		const x = Math.floor ((Math.random() * alphabet.length));
		cipher.push (alphabet.splice (x, 1)[0]);
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
	const test = getAlphabet();

	for(let i=0; i<cipher.length; i++)
	{
		if (cipher[i] == test[i])
		{
			fail = true;

			//	I don't need to find every match, one is enough to invalidate the cipher key...

			break;
		}
	}

	//	If the cipher fails the test, try again.

	if (fail) return getCipher();

	//	Otherwise, return the cipher

	return cipher;
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