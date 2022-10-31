// https://giflib.sourceforge.net/whatsinagif/bits_and_bytes.html

function push(typedArray, ...newData) {
	const len = typedArray.length;
	for (let i = 0; i < newData.length; i++) {
		typedArray[len + i] = newData[i];
	}
}

function addHeaderBlock(imgData) {
	push(imgData, 0x47, 0x49, 0x46, 0x38, 0x39, 0x61);
}

function calcPackedField(colors) {
	//return 69; // debugging
	return (
		// [BIT   1] global color table flag (0 or 1)
		((colors.length > 0 ? 1 : 0) << 7) |

		// [BIT 2-4] color resolution
		// just assume there are 256 entries by default, will rework this later
		(0b111 << 5) |

		// [BIT   5] sort flag- default to 0 since it was only really relevant in the 80s due to limited computational power
		0 |

		// [BIT 6-8] global color table size
		// keep same as color resolution for now
		0b111
	);
}

function addLogicalScreenDescriptor(imgData, width, height) {
	push(
		imgData,

		// canvas width
		width >> 0b1000, // take the first 2 hex characters from the width (0x<NN>nn), using the bitwise RIGHT-SHIFT operator (will trim the last 8 binary digits)- no need for the UNSIGNED-RIGHT-SHIFT (>>>) because width cannot be negative so the first binary digit will always be a 0
		width & 0b11111111, // take the last 2 hex characters from the width (0xnn<NN>), using the bitwise AND operator (will only match binary 1s from the first 8 binary digits, 0s from this range will still remain 0s)
		
		// canvas height (same as width)
		height >> 0b1000, // take the first 2 hex characters from the width (0x<NN>nn), using the bitwise RIGHT-SHIFT operator (will trim the last 8 binary digits)- no need for the UNSIGNED-RIGHT-SHIFT (>>>) because width cannot be negative so the first binary digit will always be a 0
		height & 0b11111111,

		// packed field (to be added)
		calcPackedField(imgData),

		// background index
		69, // <-- @@@@@@@@@@@@ TO ADD

		// pixel aspect ratio
		0 // (in practice, unused in spec- default to 0)
	);
}

function addTrailer(imgData) {
	push(imgData, 0x3b);
}

function addCommentExtension(imgData, comment) {
	if (!comment) {
		return;
	}
	const bytes = comment.split(""), // comment, split to individual characters
		dataBlocks = []; // all the sub-blocks as a single array
	while (bytes.length > 0) {
		const currSubBlock = bytes.splice(0, 256);
	}
	push(
		imgData,

		// extension introducer (always 0x21)
		0x21,

		// comment extension label (always 0xfe)
		0xfe,

		// data blocks
		...dataBlocks,

		// block termination
		0x00
	);
}

export function gif(width, height, comment) {
	// width and height can be from 0x0000 to 0xffff
	const imgData = []||new Uint8Array(); // <///= @@@

	// header block
	addHeaderBlock(imgData);

	// logical screen descriptor
	addLogicalScreenDescriptor(imgData, width, height)

	// comment extension

	addCommentExtension(imgData, comment);

	// trailer
	addTrailer(imgData);

	// return
	return imgData;
}