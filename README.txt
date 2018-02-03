Date Created:
	January 24th, 2018

Descripton:
	The following is a Node.JS program that allows the user to enter a song into the text field on the page. Once submitted the user can view the
	song chords/charting in both an interactive draggable menu along with a standard text version below.

Version of Node.js:
	v6.11.2

Installation:
	There are no extra npm modules needed for this program

Testing & launch instructions:

	The code can be compiled through the command exactly as show below (without the single quotes)

	'node server.js'

	Once the server is running, you can access the webpage by going onto a web-browser, preferrably Google Chrome,
	and surfing to the following URL exactly as shown below

	127.0.0.1:3000/example1.html

	Now, if the song entered and submitted (case sensitive) is one of the songs located within the songs folder located in the Assignment1 folder, the chord charting
	will be displayed both on the white space canvas and as standard HTML paragraph text below. A few examples would be as shown below:

	"Brown Eyed Girl"
	"Revolution"
	"All Star"
	"Sister Golden Hair"
	"Peaceful Easy Feeling"

	Now that the song is submitted and exists, the charting can be dragged around on the white space canvas and modified according to the user's preferences.
	If the song does not exist, an alert will appear notifying the user that the song does not exist and the white space canvas will be cleared.
