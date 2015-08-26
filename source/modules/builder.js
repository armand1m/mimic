
/**
 * Builder helper for W3C / ActiveX objects
 */
function Builder() {

};

/**
 * <p>
 * Build a valid XMLHttpRequest object
 * </p>
 * 
 * @param cors
 *            Define if returned implementation must provide CORS (Cross-Origin Resource Sharing) support.
 * @return XMLHttpRequest object.
 */
Builder.buildXHR = function(cors) {
    if(cors) {
		return (typeof XDomainRequest != "undefined") ? new XDomainRequest() : new XMLHttpRequest();
	} else {
		return (typeof XMLHttpRequest != "undefined") ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	}
};

/**
 * <p>
 * Build a valid XML document from string markup.
 * </p>
 * 
 * @param xml
 *            Document markup.
 * @return XMLDocument object.
 */
Builder.buildDOM = function(xml) {
	// Vars
	var parser, names, i;

	if (typeof DOMParser != "undefined") {
		parser = new DOMParser();
		return parser.parseFromString(xml, "text/xml");
	} else {
		names = [ "Microsoft.XMLDOM", "MSXML2.DOMDocument", "MSXML.DOMDocument" ];
		for (i = 0; i < names.length; i++) {
			try {
				parser = new ActiveXObject(names[i]);
				parser.loadXML(xml);
				return parser;
			} catch (e) {
				/* Ignore */
			}
		}
	}
	return null;
};

module.exports = Builder;