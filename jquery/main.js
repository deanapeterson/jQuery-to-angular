(function(){
	var peopleWrap = $("#people"); // ul element to wrap
	var people; //data model
	var personTmpl = 	"<li id='person_{{id}}' data-id='{{id}}' class='person'>\
							<span style='float:right' ><btn class='edit'>edit</btn> <btn class='delete'>delete</btn></span>\
							{{id}} - {{firstName}} {{lastName}}\
						</li>";
	var renderPerson;

	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	renderPerson = _.template(personTmpl);


	$.getJSON("../data/people.json", function(data){
		people = data;
		renderPeople();
	});


	function renderPeople(){
		$.each(people, function(index, person){
			peopleWrap.append( $(renderPerson(person)).data(person) );
		});

		updateJsonView();
	}


	peopleWrap.on("click", "btn", function(event){
		var target = $(event.target);
		var id = target.closest("li").attr("data-id");
		var data = target.closest("li").data();
		var command = target.attr("class");

		console.log(data);

		if(command === "delete"){
			// Delete(id);
		}

		if(command === "edit"){
			
		}

	});




	function Delete(id){
		var person = _.where(people, { "id" : parseInt(id, 10) })[0];

		var index = people.indexOf(person);

		if(index === -1){
			console.log(id, " doesn't exist");
		}

		people.splice(index, 1);

		peopleWrap.find("#person_" + id).remove();

		updateJsonView();
	}


	function updateJsonView(){
		$("#jsonView").text( JSON.stringify(people, null, "	") );
	}





}());