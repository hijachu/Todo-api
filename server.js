var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Todo API Root');
});

// GET /todos?completed=true&q=house
app.get('/todos', (req, res) => {
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true})
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, (todo) => {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
        });
    }

    res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findByPk(todoId).then((todo) => {
        if (!!todo) { // double !! to deal with null convert to falsy
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, 
    (e) => {
        res.status(500).send();
    });

    // var matchedTodo = _.findWhere(todos, {id: todoId});

    // if (matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }
});

app.post('/todos', (req, res) => {
    var body = _.pick(req.body, 'description', 'completed');

    // call create on db.todo
    //   respond with 200 and todo
    //   res.status(400).json(e)
    db.todo.create(body).then((todo) => {
        res.json(todo.toJSON());
    }, 
    (e) => {
        res.status(400).json(e);
    });
});

app.delete('/todos/:id', (req, res) => {
    var todoId = parseInt(req.params.id, 10);
    // var matchedTodo = _.findWhere(todos, {id: todoId});

    // if (!matchedTodo) {
    //     res.status(404).json({"error": "no todo found with that id"});
    // } else {
    //     todos = _.without(todos, matchedTodo);
    //     res.json(matchedTodo);
    // }

});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, 'completed', 'description');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    } 

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log('Express listening on port ' + PORT + '!');
    });
})

