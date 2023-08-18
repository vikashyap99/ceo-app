# Employee Organization Application

This TypeScript project demonstrates the implementation of an Employee Organization Application that allows you to manage and visualize an organization's employee hierarchy. It includes the ability to move employees within the hierarchy, undo and redo those moves.


## Project Overview

The Employee Organization Application is implemented using TypeScript and object-oriented programming principles. It includes:

- A class for representing employees with their unique IDs, names, and subordinates.
- An `EmployeeOrgApp` class that implements an interface for moving employees, undoing moves, and redoing undone moves.
- A visual hierarchy representation of employees similar to an organizational chart.

## Usage

This application allows you to:
- Move an employee to a new supervisor.
- Undo the last move action.
- Redo the last undone action.

The hierarchy is visualized using indentation to represent the hierarchical structure of employees.

## Getting Started

1. Clone this repository to your local machine.

```bash
  git clone https://github.com/your-username/employee-organization-app.git
```

1. Open the index.html file in a web browser to view the organizational chart and see the employee hierarchy.
2. Modify the TypeScript code in the script.ts file to customize the employee hierarchy or interactions.
3. You can run TypeScript using the TypeScript compiler (tsc) to transpile the TypeScript code to JavaScript:
```bash
  tsc src/index.ts
```


