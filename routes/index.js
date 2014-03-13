
var fs = require('fs'),
    path = require('path');
module.exports = function(app){
	app.get('/upload', function (req, res) {
		console.log("upload");
		res.render('upload', {
			title: '文件上传',
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	
app.post('/upload', function (req, res) {
			if (!req.files){
				console.log("无文件");
			} else {
				
				var date = new Date();
				var type = req.files.file.type;
				
				if(type.indexOf("image")>=0){
					var typepath = "images/";
				}else{
					var typepath = "audios/";
				}
				var dateurl=typepath + req.body.name +"/"+ date.getFullYear() + (date.getMonth() + 1) + date.getDate()+"/";
				var target_path =  './public/' +dateurl;
		                 mkdir(target_path);
                 		fs.rename(req.files.file.path, target_path + req.files.file.name,function(err){
					if(err){
				        console.log(err);								
					res.json(500,{ status: 'error' });
					
					}else{
						console.log("success");
					res.json(200,{ status: 'success' ,
								uri:  'http://14.23.162.138:3000/'+ dateurl + req.files.file.name
					          });
						
					}
				});

			}
	});
function mkdir(dirpath,dirname){
			//判断是否是第一次调用
			if(typeof dirname === "undefined"){ 
				if(fs.existsSync(dirpath)){
					return;
				}else{
					mkdir(dirpath,path.dirname(dirpath));
				}
			}else{
				//判断第二个参数是否正常，避免调用时传入错误参数
				if(dirname !== path.dirname(dirpath)){ 
					mkdir(dirpath);
					return;
				}
				if(fs.existsSync(dirname)){
					fs.mkdirSync(dirpath)
				}else{
					mkdir(dirname,path.dirname(dirname));
					fs.mkdirSync(dirpath);
				}
			}
	}
};
