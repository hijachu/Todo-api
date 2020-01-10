var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync(/* {force: true} */).then(() => {
    console.log('Everything is synced');

    Todo.findByPk(3).then((todo) => {
        if (todo) {
            console.log(todo.toJSON());
        } else {
            console.log('Todo not found');
        }
    })

    // Todo.create({
    //     description: 'Take out trash',
    //     // completed: false
    // }).then((todo) => {
    //     // console.log('Finished!');
    //     // console.log(todo);
    //     return Todo.create({
    //         description: 'Clean office'
    //     });
    // }).then(() => {
    //     // return Todo.findByPk(1);
    //     return Todo.findAll({
    //         where: { 
    //             // completed: false//,
    //             description: {
    //                 [Sequelize.Op.like]: '%Office%'
    //             } 
    //         }
    //     });
    // }).then((todos) => {
    //     if (todos) {
    //         todos.forEach((todo) => {
    //             console.log(todo.toJSON());
    //         });
    //     } else {
    //         console.log('no todo found!');
    //     }
    // })
    // .catch((e) => {
    //     console.log(e);
    // });
})
