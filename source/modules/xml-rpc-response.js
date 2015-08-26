require("./date-extensions");

var XmlRpc = require("./xml-rpc")
,	Base64 = require("./base64");

/**
 * XmlRpcResponse.
 * 
 * @param xml
 *            Response XML document.
 */
function XmlRpcResponse(xml) {
	this.xmlData = xml;
};

/**
 * <p>
 * Indicate if response is a fault.
 * </p>
 * 
 * @return Boolean flag indicating fault status.
 */
XmlRpcResponse.prototype.isFault = function() {
	return this.faultValue;
};

/**
 * <p>
 * Parse XML response to JavaScript.
 * </p>
 * 
 * @return JavaScript object parsed from XML-RPC document.
 */
XmlRpcResponse.prototype.parseXML = function() {
	// Vars
	var i, nodesLength;

	nodesLength = this.xmlData.childNodes.length;
	this.faultValue = undefined;
	this.currentIsName = false;
	this.propertyName = "";
	this.params = [];
	for (i = 0; i < nodesLength; i++) {
		this.unmarshal(this.xmlData.childNodes[i], 0);
	}
	return this.params[0];
};

/**
 * <p>
 * Unmarshal response parameters.
 * </p>
 * 
 * @param node
 *            Current document node under processing.
 * @param parent
 *            Current node' parent node.
 */
XmlRpcResponse.prototype.unmarshal = function(node, parent) {
	// Vars
	var obj, tag, i, nodesLength;

	if (node.nodeType == 1) {
		obj = null;
		tag = node.tagName.toLowerCase();
		switch (tag) {
		case "fault":
			this.faultValue = true;
			break;
		case "name":
			this.currentIsName = true;
			break;
		default:
			obj = XmlRpc.getTagData(tag);
			break;
		}
		if (obj != null) {
			this.params.push(obj);
			if (tag == "struct" || tag == "array") {
				if (this.params.length > 1) {
					switch (XmlRpc.getDataTag(this.params[parent])) {
					case "struct":
						this.params[parent][this.propertyName] = this.params[this.params.length - 1];
						break;
					case "array":
						this.params[parent].push(this.params[this.params.length - 1]);
						break;
					}
				}
				parent = this.params.length - 1;
			}
		}
		nodesLength = node.childNodes.length;
		for (i = 0; i < nodesLength; i++) {
			this.unmarshal(node.childNodes[i], parent);
		}
	}
	if ((node.nodeType == 3) && (/[^\t\n\r ]/.test(node.nodeValue))) {
		if (this.currentIsName == true) {
			this.propertyName = node.nodeValue;
			this.currentIsName = false;
		} else {
			switch (XmlRpc.getDataTag(this.params[this.params.length - 1])) {
			case "dateTime.iso8601":
				this.params[this.params.length - 1] = Date.fromIso8601(node.nodeValue);
				break;
			case "boolean":
				this.params[this.params.length - 1] = (node.nodeValue == "1") ? true : false;
				break;
			case "int":
			case "double":
				this.params[this.params.length - 1] = new Number(node.nodeValue);
				break;
			case "string":
				this.params[this.params.length - 1] = new String(node.nodeValue);
				break;
			case "base64":
				this.params[this.params.length - 1] = new Base64(node.nodeValue);
				break;
			}
			if (this.params.length > 1) {
				switch (XmlRpc.getDataTag(this.params[parent])) {
				case "struct":
					this.params[parent][this.propertyName] = this.params[this.params.length - 1];
					break;
				case "array":
					this.params[parent].push(this.params[this.params.length - 1]);
					break;
				}
			}
		}
	}
};

module.exports = XmlRpcResponse;