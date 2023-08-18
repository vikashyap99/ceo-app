"use strict";
// Employes
// John Smith - 15
//     - Margot Donald -14
//         - Cassandra Reynolds -13
//             - Mary Blue - 12
//             - Bob Saget - 11
//                 - Tina Teff - 10
//                     - Will Turner - 9
//     - Tyler Simpson - 8
//         - Harry Tobs - 7
//             - Thomas Brown - 6
//         - George Carrey - 5
//         - Gary Styles - 4
//     - Ben Willis - 3
//     - Georgina Flangy - 2
//         - Sophie Turner - 1
;
class Employee {
    constructor(name, subordinates) {
        this.uniqueId = Employee.id;
        this.name = name;
        this.subordinates = subordinates;
        Employee.id += 1;
    }
}
Employee.id = 1;
const SophieTurner = new Employee('Sophie Turner', []);
const GeorginaFlangy = new Employee('Georgina Flangy', [SophieTurner]);
const BenWillis = new Employee('Ben Willis', []);
const GaryStyles = new Employee('Gary Styles', []);
const GeorgeCarrey = new Employee('George Carrey', []);
const ThomasBrown = new Employee('Thomas Brown', []);
const HarryTobs = new Employee('Harry Tobs', [ThomasBrown]);
const TylerSimpson = new Employee('Tyler Simpson', [HarryTobs, GeorgeCarrey, GaryStyles]);
const WillTurner = new Employee('Will Turner', []);
const TinaTeff = new Employee('Tina Teff', [WillTurner]);
const BobSaget = new Employee('Bob Saget', [TinaTeff]);
const MaryBlue = new Employee('Mary Blue', []);
const CassandraReynolds = new Employee('Cassandra Reynolds', [MaryBlue, BobSaget]);
const MargotDonald = new Employee('Margot Donald', [CassandraReynolds]);
const JohnSmith = new Employee('John Smith', [MargotDonald, TylerSimpson, BenWillis, GeorginaFlangy]);
console.log(JohnSmith);
class EmployeeOrgApp {
    constructor(ceo) {
        this.history = [];
        this.redoHistory = [];
        this.move = (employeeID, supervisorID) => {
            const EmployeeToMove = this.findEmployee(employeeID, this.ceo);
            const newSupervisor = this.findEmployee(supervisorID, this.ceo);
            const oldSupervisor = this.findPrevSupervisor(employeeID, this.ceo);
            //console.log( 'employee->',EmployeeToMove)
            // console.log('next', nextSupervisor)
            // console.log('prev', prevSupervisor)
            if (!EmployeeToMove) {
                console.log("Invalid employeeID provided.");
                return;
            }
            if (!newSupervisor) {
                console.log("Invalid supervisorID provided.");
                return;
            }
            this.history.push({
                employeeID,
                oldSupervisor,
                newSupervisor,
            });
            this.redoHistory = [];
            if (oldSupervisor) {
                oldSupervisor.subordinates = oldSupervisor.subordinates.filter((emp) => emp.uniqueId !== employeeID);
            }
            else {
                this.ceo.subordinates = this.ceo.subordinates.filter((emp) => emp.uniqueId !== employeeID);
            }
            newSupervisor.subordinates.push(EmployeeToMove);
        };
        this.ceo = ceo;
    }
    findEmployee(id, employee) {
        if (employee.uniqueId === id)
            return employee;
        for (const subordinate of employee.subordinates) {
            const emp = this.findEmployee(id, subordinate);
            if (emp)
                return emp;
        }
        return null;
    }
    // findNextSupervisor  = (id: number, employee: Employee): Employee | null => {
    //     return null
    // }
    findPrevSupervisor(employeeID, employee) {
        for (const subordinate of employee.subordinates) {
            if (subordinate.uniqueId === employeeID) {
                return employee;
            }
            const foundSupervisor = this.findPrevSupervisor(employeeID, subordinate);
            if (foundSupervisor) {
                return foundSupervisor;
            }
        }
        return null;
    }
    undo() {
        const lastMove = this.history.pop();
        if (!lastMove) {
            console.log("Nothing to undo.");
            return;
        }
        this.redoHistory.push({
            employeeID: lastMove.employeeID,
            oldSupervisor: this.findPrevSupervisor(lastMove.employeeID, this.ceo),
            newSupervisor: this.findEmployee(lastMove.employeeID, this.ceo),
        });
        const oldSupervisor = lastMove.oldSupervisor;
        const newSupervisor = lastMove.newSupervisor;
        if (oldSupervisor) {
            oldSupervisor.subordinates.push(newSupervisor);
        }
        else if (newSupervisor) {
            this.ceo.subordinates.push(newSupervisor);
        }
        if (newSupervisor) {
            newSupervisor.subordinates = newSupervisor.subordinates.filter((emp) => emp.uniqueId !== lastMove.employeeID);
        }
    }
    redo() {
        const lastUndoneMove = this.redoHistory.pop();
        if (!lastUndoneMove) {
            console.log("Nothing to redo.");
            return;
        }
        this.history.push({
            employeeID: lastUndoneMove.employeeID,
            oldSupervisor: this.findPrevSupervisor(lastUndoneMove.employeeID, this.ceo),
            newSupervisor: this.findEmployee(lastUndoneMove.employeeID, this.ceo),
        });
        const oldSupervisor = lastUndoneMove.oldSupervisor;
        const newSupervisor = lastUndoneMove.newSupervisor;
        if (oldSupervisor) {
            oldSupervisor.subordinates = oldSupervisor.subordinates.filter((emp) => emp.uniqueId !== lastUndoneMove.employeeID);
        }
        else if (newSupervisor) {
            this.ceo.subordinates = this.ceo.subordinates.filter((emp) => emp.uniqueId !== lastUndoneMove.employeeID);
        }
        if (newSupervisor) {
            newSupervisor.subordinates.push((this.findEmployee(lastUndoneMove.employeeID, this.ceo)));
        }
    }
}
const app = new EmployeeOrgApp(JohnSmith);
console.log(app);
app.move(2, 14); // moving Georgina Flangy(id = 2) moves under Margot Donald(id= 14)
console.log(app);
app.undo();
console.log(app);
