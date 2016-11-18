var mongoose = require('mongoose');
var GradeLevel = mongoose.model('GradeLevel');
var Section = mongoose.model('Section');
var Student = mongoose.model('Student');
module.exports=(function(){
	return{
		addSection: function(req, res){
			GradeLevel.findOne({_id: req.body.grade_level}, function(err, gradeLevelFromDb){
				if(err){
					res.send('this is an err', err);
				} else{
					for (var i = 0; i<req.body.section_quantity; i++){
						console.log("-----------\n",'Section '+(i+1));
						var new_section = new Section({
							_grade_level: gradeLevelFromDb._id,
							section: 'Section '+(i+1),
							_created_by: req.body.logged_in_user_id,
							_class: req.body.class
						});
						new_section.save(function(err,data){
							if(err){
								console.log('noooo----\n',err);
							}else{
								console.log('haha----\n',data);
							}
						});
						gradeLevelFromDb.sections.push(new_section);
					}
					gradeLevelFromDb.save(function(err, result){
						if(err){
							res.send('err saving the gradeLevelFromDb', err);
						} else{
							new_section.save(function(err, result){
								if(err){
									res.send('err saving new_section', err);
								} else{
									console.log('successfully saved the new sections!!!');
									res.json(result);
								}
							})
						}
					})
				}
			})
		}, 
		getSections: function(req, res){
			GradeLevel.findOne({_id: req.params.id}).populate("sections").populate("_class").exec(function(err,data){
				if(err){
					res.json(err);
				}else{
					console.log('------------\n',data)
					res.json(data);
				}
			});
		}, 
		getStudentsFromSection: function(req, res){
			console.log("---------\n",req.params.id);
			// Section.findOne({_id: req.params.id}).populate("students").exec(function(err,data){
				Section.findOne({_id: req.params.id}).populate({
					path: 'student',
					model: 'User',
					populate: {
						path: 'friends',
						model: 'User'
					}
				}).exec(function(err,data){
					if(err){
						res.json(err);
					}else{
						console.log('hahahahahhahahahahahahahaha\n',data)
						res.json(data);
					}
				});
			}
		}
	})();