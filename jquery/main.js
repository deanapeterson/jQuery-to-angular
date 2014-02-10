(function(){
	//store references to DOM Views
	var peopleView = $("#people"); // ul element to wrap
	var editFormView = $("#editForm");

	var people, toEdit; //data model

	var personTmpl = 	"<li id='person_{{id}}' data-id='{{id}}' class='person'>\
							<span style='float:right' ><btn class='edit'>edit</btn>&nbsp;&nbsp;<btn class='delete'>delete</btn></span>\
							{{firstName}} {{lastName}}\
						</li>";
	
	var editFormTmpl = "<form>\
							<label for='editFirstName'>First Name:</label> <input type='text' id='editFirstName' value='{{firstName}}' /><br>\
							<label for='editLastName'>Last Name:</label> <input type='text'  id='editLastName' value='{{lastName}}' /><br>\
							<button type='button' data-id='{{id}}' class='apply btn btn-primary'>apply</button>\
						</form>";
	var renderPersonView;
	var renderEditFormView;

	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	renderPersonView = _.template(personTmpl);
	renderEditFormView = _.template(editFormTmpl);


	//
	$.getJSON("../data/people.json", function(data){
		people = data;
		renderPeople();
	});

	function renderPeople(){
		$.each(people, function(index, person){
			peopleView.append( $(renderPersonView(person)).data(person) );
		});

		updateJsonView();
	}

	peopleView.on("click", "btn", function(event){
		var target = $(event.target);
		var id = parseInt(target.closest("li").attr("data-id"), 10);
		var command = target.attr("class");

		if(command === "delete"){
			Delete(id);
		}

		if(command === "edit"){
			Edit(id);
		}

	});

	function Delete(id){
		var person = _.where(people, { "id" : id })[0];
		var index = people.indexOf(person);

		people.splice(index, 1);
		peopleView.find("#person_" + id).remove();
		updateJsonView();
	}

	function Edit(id){

		if(typeof id === 'undefined'){
			toEdit = {
				id : Date.now(),
				firstName : "",
				lastName : ""
			};
		} else {
			toEdit = _.where(people, { "id" : id })[0];
		}

		editFormView.html( renderEditFormView(toEdit) );
	}

	editFormView.on("click", "button.apply", function(event){
		var id = $(this).data("id");
		var person = _.where(people, {"id" : parseInt(id, 10)})[0];

		toEdit.firstName = editFormView.find("#editFirstName").val();
		toEdit.lastName = editFormView.find("#editLastName").val();

		//updateModel
		if(typeof person === 'undefined'){
			person = toEdit;
			people.push(toEdit); // add if new
		} else {
			person = toEdit;
		}

		toEdit = null;

		//updateView
		updatePersonView(id, person);

		updateJsonView();

		editFormView.empty();
	});


	$("a.addPerson").click(function(event){
		event.preventDefault();
		Edit();
	});

	function updatePersonView(id, person){
		var oldView = peopleView.find("#person_" + id);
		var newView = $(renderPersonView(person));

		if(oldView.length === 0){
			peopleView.append(newView);
		}

		oldView.replaceWith(newView);
	}

	function updateJsonView(){
		$("#jsonView").text( JSON.stringify(people, null, "  ") );
	}

}());