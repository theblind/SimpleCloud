/* this file should be run in web browser*/
$(document).ready(function(){
	console.log("javascript loaded");
	setTimeout(websocketBench, 1000*5);
});

var bench_buffersize = 10240;

function websocketBench(){
	var ws = new WebSocket("ws://42.159.158.39:3000/");
	ws.binaryType = "arraybuffer";
	ws.bufferindex = 0;
	ws.lastclock = Date.now();
	ws.onopen = function(event){
		console.log("websocket is opened......");
		runWsBench(ws);
	};
	ws.onmessage = function(event){
		console.log("got message from websocket server, index is: %d.....", ws.bufferindex);
		console.log("content length is %d", event.data.length-32);
		if(event.data.length - 32 != bench_buffersize){
			console.log("data received does not match buffsize sent...");
			return ws.close();
		}
		var resultobj = {
			"type": "websocket",
			"buffsize": bench_buffersize,
			"rtt": Date.now() - ws.lastclock,
			"token": event.data.substr(0, 32)
		};
		uploadresult(resultobj);
		ws.bufferindex++;
		setTimeout(websocketBench, 1000);
		ws.close();
		return;
	};
	ws.onclose = onWsClose;
	ws.onerror = onWsError;
}

function ajaxBench(){

	var ajaxBenchObj = new Object({
		bufferindex: 0,
		lastclock: Date.now()
	});

	runAjaxBench(ajaxBenchObj);
}

function runAjaxBench(ajaxBenchObj) {
	if(ajaxBenchObj.bufferindex >= bench_buffersize.length){
		return;
	}
	var rawcallee = this.arguments.callee;
	var recordTime = function(jqxhr){
		ajaxBenchObj.lastclock = Date.now();
	}
	var jqhrx = $.ajax({
		"url": "/ajaxbench",
		"method": 'GET',
		"data": bench_buffersize[ajaxBenchObj.bufferindex],
		"beforeSend": recordTime
	});
	jqhrx.done = function(data, status){
		var receivedTime = Date.now();
		ajaxBenchObj.bufferindex++;
		if(status == 200 && data.length == bench_buffersize[ajaxBenchObj.bufferindex]){
			console.log("ajax benchmark ok, buffer size: %d", ajaxBenchObj.bufferindex);
			var resultobj = {
				"type": "ajax",
				"buffsize": ajaxBenchObj.bufferindex,
				"rtt": receivedTime - ajaxBenchObj.lastclock
			}
			uploadresult(resultobj);
			ajaxBenchObj.bufferindex++;
			rawcallee(ajaxBenchObj);
		}
		else {
			console.log("round-trip data not matched, http status: %d, data length: %d", status, ajaxBenchObj.bufferindex);
		}
	}
}

function onWsClose(event){
	console.log("websocket is closed........");
}

function onWsError(event){
	console.log("error happened in websocket....");
	console.log("eerror detail: ", event);
}

function runWsBench(ws){
	if(ws.readyState != ws.OPEN)
		return;
	var data = JSON.stringify({
		"buffsize": bench_buffersize
	})
	ws.send(data);
	ws.lastclock = Date.now();
}

function uploadresult(resultobj){
	console.log("uploading result to server. result is:", JSON.stringify(resultobj));
	var jqxhr = $.ajax({
		url: "/uploadresult",
		method: "POST",
		data: resultobj,
	});
	jqxhr.done = function(data, status, jqxhr){
		if(status == 200){
			console.log("upload result successfully, buffer size: %d", resultobj.buffsize);
		}
	}
}

