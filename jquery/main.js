(function(){
	var peopleWrap = $("#people"); // ul element to wrap
	var editFormWrap = $("#editForm");

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
	var renderPerson;
	var renderEditForm;

	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	renderPerson = _.template(personTmpl);
	renderEditForm = _.template(editFormTmpl);

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
		peopleWrap.find("#person_" + id).remove();
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

		editFormWrap.html( renderEditForm(toEdit) );
	}

	editFormWrap.on("click", "button.apply", function(event){
		var id = $(this).data("id");
		var person = _.where(people, {"id" : parseInt(id, 10)})[0];

		toEdit.firstName = editFormWrap.find("#editFirstName").val();
		toEdit.lastName = editFormWrap.find("#editLastName").val();

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

		editFormWrap.empty();
	});


	$("a.addPerson").click(function(event){
		event.preventDefault();
		Edit();
	});

	function updatePersonView(id, person){
		var oldView = peopleWrap.find("#person_" + id);
		var newView = $(renderPerson(person));

		if(oldView.length === 0){
			peopleWrap.append(newView);
		}

		oldView.replaceWith(newView);
	}

	function updateJsonView(){
		$("#jsonView").text( JSON.stringify(people, null, "  ") );
	}

}());