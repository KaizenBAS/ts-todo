#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import {createSpinner}  from "nanospinner";

const todosList: string[] = [];

// const styledTodosList = todosList.map(todo => chalk.green(todo))

const spin = async (msg: string, successMsg: string) => {
  const spinner = createSpinner().start({ text: msg });
  await new Promise((r) => setTimeout(r, 1000));
  spinner.success({ text: chalk.greenBright(successMsg) });
};

const styledHeader = figlet.textSync("Todo List", {
  font: "Slant",
  horizontalLayout: "default",
  verticalLayout: "default",
});
let divider = chalk.white("=".repeat(50));
console.log(styledHeader);
const main = async () => {
  let { todo } = await inquirer.prompt({
    type: "list",
    choices: [
      "Add new Task",
      "View All Tasks",
      "Update Task",
      "Delete a Task",
      "Exit",
    ],
    message: "what action you want to perform? ",
    name: "todo",
  });

  switch (todo) {
    case "Add new Task":
      let userTodo = await inquirer.prompt({
        type: "input",
        message: "Add new todo: ",
        name: "addTodo",
      });

      if (userTodo.addTodo === "") {
        console.log(chalk.red.bold("Todo cannot be empty"));
      } else {
        await spin("Adding new task...", "Task Added Successfully");
        todosList.push(userTodo.addTodo);
      }
      main();
      break;

    case "View All Tasks":
      let allTodos = todosList
        .filter((todo) => todo !== undefined)
        .map((todo) => chalk.blue.bold(todo));
      if (allTodos.length < 1) {
        console.log(divider);
        console.log(chalk.red.bold("No todos found"));
        console.log(divider);
      } else {
        allTodos.forEach((todo, i) => {
          console.log(divider);
          console.log(`${i + 1}. ${todo}`);
        });
        console.log(divider);
      }

      main();
      break;
    case "Update Task":
      if (todosList.length > 0) {
        let updateTodo = await inquirer.prompt({
          type: "list",
          choices: todosList,
          message: "Update Todo:",
          name: "updatetodo",
        });

        let newUpdatedTodo = await inquirer.prompt({
          type: "input",
          message: "Enter to update this todo: ",
          name: "newtodo",
        });

        todosList[todosList.indexOf(updateTodo.updatetodo)] =
          newUpdatedTodo.newtodo;
        await spin("Updating task...", "Task Updated Successfully");
        main();
        break;
      } else {
        console.log(divider);
        console.log(chalk.red.bold("No todos to Update!"));
        console.log(divider);
        main();
        break;
      }

    case "Delete a Task":
      if (todosList.length > 0) {
        let deleteTodo = await inquirer.prompt({
          type: "checkbox",
          choices: todosList,
          message: "Current Todos:",
          name: "todos",
        });
        await spin("Deleting task...", "Task deleted Successfully");
        todosList.splice(deleteTodo.todos, deleteTodo.todos.length);
        main();
        break;
      } else {
        console.log(divider);
        console.log(chalk.red.bold("No todos to Delete!"));
        console.log(divider);
        main();
        break;
      }

    case "Exit":
      process.exit(0);
  }
};

main();
