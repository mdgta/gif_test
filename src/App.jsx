import {useState, useEffect} from "react";
import {gif} from "./gif.js";
import "./App.css";

function App() {
	const imageData = gif(640, 480);
	console.log(imageData);
	console.log(imageData.map(bit => bit.toString(16).padStart(2, 0)));
	console.log(imageData.map(bit => bit.toString(16).padStart(2, 0)).slice(6, 6+7));
	return (
		<>
			<p>
				Lorem Ipsum<br />
				<a href="https://giflib.sourceforge.net/whatsinagif/bits_and_bytes.html" rel="nofollow noopener noreferrer">specs</a>
			</p>
		</>
	)
}

export default App
