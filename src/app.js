var express = require('express');
const request = require('request');
const Promise = require('bluebird');
const privateInfo = require('../conf/private') 
var app = express(); // here I use the express() method, instead of the createServer()



var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});



function sendToAPiAi(userquery) {
	return new Promise(
		function(resolve, reject) {
		try{
			var accessToken = privateInfo.API_AI_ACCESS_TOKEN;
			var options = {
				"url": privateInfo.API_AI_URL,
				"json": {
					"query": userquery,
					"lang": "eng",
					"sessionId": "123456789"
				},
				"headers": {
					"Authorization": "Bearer " + accessToken,
					"Content-Type": "application/json"
				}
			};
			request.post(options, function(err, response, body) {
				if(err){
					console.log("error");
					reject(err)
				}
				else{
					var result={
						"resolvedQuery" : body.result.resolvedQuery,
						"action" : body.result.action,
						"params" : body.result.parameters,
						"speech" : body.result.fulfillment.speech,
						"messages" : body.result.fulfillment.messages
					}
					console.log(body);
					resolve(result);
				}
			});
		}
		catch(e){
			console.log(e);
			reject(e);
		}
	});
}

function sendToTextToEmotion(userquery){
	return new Promise(
		function (resolve,reject) {
			try{
				var options = {
					"url" : "https://qemotion.p.mashape.com/v1/emotional_analysis/get_emotions",
					"headers":{
					    "X-Mashape-Key": "RkPzTP4ncImshWY3GZImyLqUmj6Op1ysth0jsnc3DvE8ZTrXXR",
					    "Authorization": "Token token='bc55ca0a8f5c8c41556f499a93f7077a'",
					    "Content-Type": "application/json; charset=UTF-8",
					    "lang": "en",
					    "text": userquery,
					    
					  }
				}
				request.post(options, function(err, response, body) {
					if(err){
						console.log("error");
						reject(err)
					}
					else{
						var result=body
						console.log(body);
						resolve(result);
					}
				});
			}
			catch(e){
				console.log("error catch");
				reject(e);
			}
		})
}

app.get('/', function(req, res){
  //res.send('Hello World');
  res.status(200).json({
    message: "Hello world!"
  })
});


app.get('/detectmood', function(req, res){
  //res.send('Hello World');
  console.log("detectmood of = "+req.query["sentence"])
  
  /*res.status(200).json({
    
    result:sendToAPiAi(req.query["sentence"])
  })*/
  sendToAPiAi(req.query["sentence"])
  .then(function(result){
  	console.log(result);

  	res.status(200).json({
    
    "result":result.speech
  	})
  })
});

app.get('/detectemotion', function(req, res){
  //res.send('Hello World');
  console.log("detectemotion of = "+req.query["sentence"])
  
  /*res.status(200).json({
    
    result:sendToAPiAi(req.query["sentence"])
  })*/
  sendToTextToEmotion(req.query["sentence"])
  .then(function(result){
  	console.log(result);
  	res.status(200).json({
    
    "result":result
  	})
  })
});