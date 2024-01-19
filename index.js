export default function sfcLite(source, globals = {}) {
	const parser = document.createElement('template');
	parser.innerHTML = source;

	const content = parser.content;
	const template = content.querySelector('template');
	if (template == null) throw 'Failed to find template';
	const script = content.querySelector('script');
	const style = content.querySelector('style');

	const globalKeys = Object.keys(globals);
	const globalValues = globalKeys.map(x => globals[x]);
	const setup = makeFunction(script, globalKeys);

	if (style != null) {
		const styleEl = style.cloneNode(true);
		styleEl.id = `sfcLite_${++styleId}_${hashCode(source)}`;
		document.head.appendChild(styleEl);
	}

	return function(data) {
		const fragment = template.content.cloneNode(true);
		const params = [data, ...globalValues];
		setup.call(fragment, ...params);
		return fragment;
	};
}

function makeFunction(script, globalKeys) {
	if (!script) return dummy;

	const paramNames = ['data', ...globalKeys];
	return new (script.async ? AsyncFunction : Function)(...paramNames, script.innerText);
}

// eslint-disable-next-line no-empty-function
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const dummy = () => null;
const hashCode = (str) => [...str].reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
let styleId = 0;