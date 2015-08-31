require("./date-extensions");

var XmlRpc = require("./xml-rpc")
,	XmlRpcResponse = require("./xml-rpc-response")
,	Builder = require("./builder")
,	Base64 = require("./base64");

/**
 * XmlRpcRequest.
 * 
 * @param url
 *            Server url.
 * @param method
 *            Server side method do call.
 */
function XmlRpcRequest(url, method) {
	this.serviceUrl = url;
	this.methodName = method;
	this.crossDomain = true;
	this.withCredentials = false;	
	this.params = [];
	this.headers = {};
};

/**
 * <p>
 * Add a new request parameter.
 * </p>
 * 
 * @param data
 *            New parameter value.
 */
XmlRpcRequest.prototype.addParam = function(data) {
	// Vars
	var type = typeof data;
	
	switch (type.toLowerCase()) {
	case "function":
		return;
	case "object":
		if (!data.constructor.name){
			return;
		}	
	}
	this.params.push(data);
};

/**
 * <p>
 * Clear all request parameters.
 * </p>
 * 
 * @param data
 *            New parameter value.
 */
XmlRpcRequest.prototype.clearParams = function() {
	this.params.splice(0, this.params.length);
};

/**
 * <p>
 * Define HTTP header value.
 * </p>
 * 
 * @param name
 *            Header name.
 * @param data
 *            Header value. Use <null> to clear the header.
 */
XmlRpcRequest.prototype.setHeader = function(name, value) {
    if(value) {
	  this.headers[name] = value;
	} else {
	  delete this.headers[name];
	}
};

/**
 * <p>
 * Execute a synchronous XML-RPC request.
 * </p>
 *
 * @return XmlRpcResponse object.
 */
XmlRpcRequest.prototype.send = function() {
	
	// Vars
	var xml_params = "", 
	    i = 0, 
	    xml_call, xhr;
    
    // XMLRPC
	for (i = 0; i < this.params.length; i++) {
		xml_params += XmlRpc.PARAM.replace("${DATA}", this.marshal(this.params[i]));
	}
	xml_call = XmlRpc.REQUEST.replace("${METHOD}", this.methodName);
	xml_call = XmlRpc.PROLOG + xml_call.replace("${DATA}", xml_params);	
	
	// XHR
	xhr = Builder.buildXHR(this.crossDomain);
	xhr.open("POST", this.serviceUrl, false);	
	
	// HTTP headers
	for(i in this.headers) {
	    if (this.headers.hasOwnProperty(i)) {
		  xhr.setRequestHeader(i, this.headers[i]);
		}
	}		
	
	// HTTP credentials 
	if(this.withCredentials && "withCredentials" in xhr) {
		xhr.withCredentials = true;
	}	
	xhr.send(Builder.buildDOM(xml_call));
	return new XmlRpcResponse(xhr.responseXML);
};

/**
 * <p>
 * Marshal request parameters.
 * </p>
 * 
 * @param data
 *            A request parameter.
 * @return String with XML-RPC element notation.
 */
XmlRpcRequest.prototype.marshal = function(data) {
	// Vars
	var type = XmlRpc.getDataTag(data), 
	    scalar_type = XmlRpc.SCALAR.replace(/\$\{TYPE\}/g, type), 
	    xml = "", 
	    value, i, member;

	switch (type) {
	case "struct":
		member = "";
		for (i in data) {
			value = "";
			value += XmlRpc.NAME.replace("${DATA}", i);
			value += XmlRpc.VALUE.replace("${DATA}", this.marshal(data[i]));
			member += XmlRpc.MEMBER.replace("${DATA}", value);
		}
		xml = XmlRpc.STRUCT.replace("${DATA}", member);
		break;
	case "array":
		value = "";
		for (i = 0; i < data.length; i++) {
			value += XmlRpc.VALUE.replace("${DATA}", this.marshal(data[i]));
		}
		xml = XmlRpc.ARRAY.replace("${DATA}", value);
		break;
	case "dateTime.iso8601":
		xml = scalar_type.replace("${DATA}", data.toIso8601());
		break;
	case "boolean":
		xml = scalar_type.replace("${DATA}", (data == true) ? 1 : 0);
		break;
	case "base64":
		xml = scalar_type.replace("${DATA}", data.encode());
		break;
	default:
		xml = scalar_type.replace("${DATA}", data);
		break;
	}
	return xml;
};

module.exports = XmlRpcRequest;
