var Base64 = require("./base64");

/**
 * XmlRpc helper.
 */
function XmlRpc() {};

/**
 * <p>
 * XML-RPC document prolog.
 * </p>
 */
XmlRpc.PROLOG = "<?xml version=\"1.0\"?>\n";

/**
 * <p>
 * XML-RPC methodCall node template.
 * </p>
 */
XmlRpc.REQUEST = "<methodCall>\n<methodName>${METHOD}</methodName>\n<params>\n${DATA}</params>\n</methodCall>";

/**
 * <p>
 * XML-RPC param node template.
 * </p>
 */
XmlRpc.PARAM = "<param>\n<value>\n${DATA}</value>\n</param>\n";

/**
 * <p>
 * XML-RPC array node template.
 * </p>
 */
XmlRpc.ARRAY = "<array>\n<data>\n${DATA}</data>\n</array>\n";

/**
 * <p>
 * XML-RPC struct node template.
 * </p>
 */
XmlRpc.STRUCT = "<struct>\n${DATA}</struct>\n";

/**
 * <p>
 * XML-RPC member node template.
 * </p>
 */
XmlRpc.MEMBER = "<member>\n${DATA}</member>\n";

/**
 * <p>
 * XML-RPC name node template.
 * </p>
 */
XmlRpc.NAME = "<name>${DATA}</name>\n";

/**
 * <p>
 * XML-RPC value node template.
 * </p>
 */
XmlRpc.VALUE = "<value>\n${DATA}</value>\n";

/**
 * <p>
 * XML-RPC scalar node template (int, i4, double, string, boolean, base64,
 * dateTime.iso8601).
 * </p>
 */
XmlRpc.SCALAR = "<${TYPE}>${DATA}</${TYPE}>\n";

/**
 * <p>
 * Get the tag name used to represent a JavaScript object in the XMLRPC
 * protocol.
 * </p>
 * 
 * @param data
 *            A JavaScript object.
 * @return <code>String</code> with XMLRPC object type.
 */
XmlRpc.getDataTag = function(data) {
	try {
		// Vars
		var tag = typeof data;
		
		switch (tag.toLowerCase()) {
		case "number":
			tag = (Math.round(data) == data) ? "int" : "double";
			break;
		case "object":
			if (data.constructor == Base64) {
				tag = "base64";
			} else if (data.constructor == String) {
				tag = "string";
			} else if (data.constructor == Boolean) {
				tag = "boolean";
			} else if (data.constructor == Array) {
				tag = "array";
			} else if (data.constructor == Date) {
				tag = "dateTime.iso8601";
			} else if (data.constructor == Number) {
				tag = (Math.round(data) == data) ? "int" : "double";
			} else {
				tag = "struct";
			}
			break;
		}
		return tag;
	} catch (e) {
		return null;
	}
};

/**
 * <p>
 * Get JavaScript object type represented by XMLRPC protocol tag.
 * <p>
 * 
 * @param tag
 *            A XMLRPC tag name.
 * @return A JavaScript object.
 */
XmlRpc.getTagData = function(tag) {
	// Vars
	var data = null;
	
	switch (tag) {
	case "struct":
		data = new Object();
		break;
	case "array":
		data = new Array();
		break;
	case "datetime.iso8601":
		data = new Date();
		break;
	case "boolean":
		data = new Boolean();
		break;
	case "int":
	case "i4":
	case "double":
		data = new Number();
		break;
	case "string":
		data = new String();
		break;
	case "base64":
		data = new Base64();
		break;
	}
	return data;
};

module.exports = XmlRpc;