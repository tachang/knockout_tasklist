$.parse.init({
    app_id : "PTB9aRvLMqnKJqB5vpsMVyEnlDAmFENR7JCLjUm4", // <-- enter your Application Id here 
    rest_key : "PiQH3q4MAatwIJ2NnzZXuJslIcht50D3l4r1Ojns" // <--enter your REST API Key here    
});

function Task(data) {
    this.title = ko.observable(data.title);
    this.isDone = ko.observable(data.isDone);
    this.objectId = data.objectId;
}

function TaskListViewModel() {
    // Data
    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() });
    });

    self.newTaskTextLength = ko.computed(function() {
      if( this.newTaskText() ) {
        var tasktext = this.newTaskText() + "";
        return tasktext.length;
      }

      return 0;
      
    }, self);


    // Operations
    self.addTask = function() {
        $.parse.post('task', { title: this.newTaskText() }, function(task) {
        
      	  self.tasks.push(new Task({ title: self.newTaskText(), objectId: task.objectId}));
  	  self.newTaskText("");
  	  
        });
        
    };
    
    self.removeTask = function(task) { 
    	$.parse.delete('task/' + task.objectId, function() {
    	  self.tasks.remove(task);    	
    	});
    };
    

    // Initialize data    
    $.parse.get("task", {}, function(json) {
      for( var i = 0; i < json.results.length ; i++ ) {
        var task = json.results[i];
        // Create a new task
        self.tasks.push(new Task({ title: task.title, objectId: task.objectId }));

      }      
    });

}

ko.applyBindings(new TaskListViewModel());
