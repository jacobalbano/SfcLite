export default function sfcLite(source) {
	const parser = document.createElement('template');
	parser.innerHTML = source;

	const content = parser.content;
	const template = content.querySelector('template');
	if (template == null) throw 'Failed to find template';
	const script = content.querySelector('script');
	const style = content.querySelector('style');
	
	// eslint-disable-next-line no-new-func
	const setup = !script ? dummy : new Function('data', script.innerText);
	const factoryId = `sfcLite_${++styleId}_${hashCode(source)}`;

	return function(data) {
		const fragment = template.content.cloneNode(true);
		setup.call(fragment, data);

		return {
			fragment,
			addStyle,
		};
	};
	
	function addStyle() {
		if (style != null && !document.head.querySelector(`#${factoryId}`)) {
			const styleEl = style.cloneNode(true);
			styleEl.id = factoryId;
			document.head.appendChild(styleEl);
		}
	}
}

const dummy = () => null;
const hashCode = (str) => [...str].reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
let styleId = 0;