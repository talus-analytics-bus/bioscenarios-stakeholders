// grabbed from https://bl.ocks.org/mbostock/7555321
// credit to @mbostock
function wrap(text, width) {
	text.each(function () {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			y = text.attr("y"),
			x = text.attr('x');
		dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			// @zoe-20180131: don't add a <tspan> if it's the first word
			if ((tspan.node().getComputedTextLength() > width) && (line.length > 1)) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
}

// https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
function wordWrap(str, maxWidth, x, y, yspacing = null) {

	const dy = yspacing || (i => `${i}em`);

	const newLineStr = (s, yCoord, i) => `<tspan x='${x}' y='${yCoord}' dy=${dy(i)}>${s}</tspan>`;
	if (str.length <= maxWidth) {
		return newLineStr(str, y, 0);
	}
	function testWhite(x) {
		var white = new RegExp(/^[\s-]$/);
		return white.test(x.charAt(0));
	}

	var done = false;
	res = '';
	lineNum = 0;
	var lines = [];
	do {
		found = false;
		// Inserts new line at first whitespace of the line
		for (i = maxWidth - 1; i >= 0; i--) {
			if (testWhite(str.charAt(i))) {
				res = res + newLineStr(str.slice(0, i), y, lineNum);
				lines.push([str.slice(0, i), lineNum]);
				str = str.slice(i + 1);
				found = true;
				break;
			}
		}
		// Inserts new line at maxWidth position, the word is too long to wrap
		if (!found) {
			res += newLineStr(str.slice(0, maxWidth), lineNum);
			str = str.slice(maxWidth);
			lines.push([str.slice(0, i), lineNum]);
		}

		if (str.length < maxWidth)
			done = true;
		lineNum++;
	} while (!done);

	if (lineNum > 1) {
		let response = '';
		lines.push([str, lineNum]);
		lines.forEach(d => {
			let yCoord = y - lineNum * 7;
			response += newLineStr(d[0], yCoord, d[1]);
		});
		return response;

	}
	else {
		return res + newLineStr(str, y, lineNum);
	}
}
