
// Employes with ids
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



interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
};


interface IEmployeeOrgApp {
    ceo: Employee;
    /**
    * Moves the employee with employeeID (uniqueId) under a supervisor
    * (another employee) that has supervisorID (uniqueId).
    * E.g. Move Bob(employeeID) to be subordinate of
    * Georgina (supervisorID).
    * @param employeeID
    * @param supervisorID
    */
    move(employeeID: number, supervisorID: number): void;
    /** Undo last move action */
    undo(): void;
    /** Redo last undone action */
    redo(): void;
    }


class Employee{

    uniqueId: number;
    name: string
    subordinates: Employee[]
    
    static id: number = 1
    constructor(name: string, subordinates: Employee[]){

        this.uniqueId = Employee.id
        this.name = name
        this.subordinates = subordinates
        
        Employee.id += 1
    }

}

// Employee creation with their subordinates

const SophieTurner = new Employee('Sophie Turner', [])
const GeorginaFlangy = new Employee('Georgina Flangy', [SophieTurner])

const BenWillis = new Employee('Ben Willis', [])

const GaryStyles = new Employee('Gary Styles', [])
const GeorgeCarrey = new Employee('George Carrey', [])
const ThomasBrown = new Employee('Thomas Brown', [])
const HarryTobs = new Employee('Harry Tobs', [ThomasBrown])
const TylerSimpson = new Employee('Tyler Simpson', [HarryTobs,GeorgeCarrey,GaryStyles])

const WillTurner = new Employee('Will Turner', [])
const TinaTeff = new Employee('Tina Teff', [WillTurner])
const BobSaget = new Employee('Bob Saget', [TinaTeff])
const MaryBlue = new Employee('Mary Blue', [])
const CassandraReynolds = new Employee('Cassandra Reynolds', [MaryBlue,BobSaget])
const MargotDonald= new Employee('Margot Donald', [CassandraReynolds])

const JohnSmith = new Employee('John Smith', [MargotDonald,TylerSimpson,BenWillis,GeorginaFlangy ])

console.log(JohnSmith)


class EmployeeOrgApp implements IEmployeeOrgApp {

    // history to store last action
    private history: {
        employeeID: number;
        oldSupervisor: Employee | null;
        newSupervisor: Employee;
      }[] = [];
      private redoHistory: {
        employeeID: number;
        oldSupervisor: Employee | null;
        newSupervisor: Employee;
      }[] = [];

    ceo: Employee

    constructor(ceo: Employee){
        this.ceo = ceo
    }

    // method to find emoplyee with given id
    private findEmployee (id: number, employee: Employee): Employee | null {

        if(employee.uniqueId === id)
            return employee
        
        for (const subordinate of employee.subordinates) {
            const emp = this.findEmployee(id,subordinate)
            if(emp) 
                return emp
        }
        return null
    }

    // findNextSupervisor  = (id: number, employee: Employee): Employee | null => {

    //     return null
    // }
    // method to find emoplyee supervisor with given id
    private findPrevSupervisor( employeeID: number,employee: Employee,): Employee | null {
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

    move = (employeeID: number, supervisorID: number): void => {

        const EmployeeToMove = this.findEmployee(employeeID,this.ceo)
        const newSupervisor = this.findEmployee(supervisorID, this.ceo)
        const oldSupervisor = this.findPrevSupervisor(employeeID, this.ceo)

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
    // storing current data in history which used later while undo ans redo
    this.history.push({
      employeeID,
      oldSupervisor,
      newSupervisor,
    });

    this.redoHistory = [];
    
    // removing employee from old supervisor
    if (oldSupervisor) {
      oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
        (emp) => emp.uniqueId !== employeeID
      );
    } else {
      this.ceo.subordinates = this.ceo.subordinates.filter(
        (emp) => emp.uniqueId !== employeeID
      );
    }
    // moving employee to new supervisor
    newSupervisor.subordinates.push(EmployeeToMove);

    }

    undo(): void {
        const lastMove = this.history.pop();
      
        if (!lastMove) {
          console.log("Nothing to undo.");
          return;
        }
       // Record the undone move for redo
        this.redoHistory.push({
          employeeID: lastMove.employeeID,
          oldSupervisor: this.findPrevSupervisor(lastMove.employeeID, this.ceo ),
          newSupervisor: this.findEmployee( lastMove.employeeID ,this.ceo)!,
        });
      
        const oldSupervisor = lastMove.oldSupervisor;
        const newSupervisor = lastMove.newSupervisor;
      
        if (oldSupervisor) {
          oldSupervisor.subordinates.push(newSupervisor);
        } else if (newSupervisor) {
          this.ceo.subordinates.push(newSupervisor);
        }
      
        if (newSupervisor) {
          newSupervisor.subordinates = newSupervisor.subordinates.filter(
            (emp) => emp.uniqueId !== lastMove.employeeID
          );
        }
      }
      
      redo(): void {
        const lastUndoneMove = this.redoHistory.pop();
      
        if (!lastUndoneMove) {
          console.log("Nothing to redo.");
          return;
        }
      // Record the redone move for undo
        this.history.push({
          employeeID: lastUndoneMove.employeeID,
          oldSupervisor: this.findPrevSupervisor( lastUndoneMove.employeeID, this.ceo),
          newSupervisor: this.findEmployee(lastUndoneMove.employeeID, this.ceo)!,
        });
      
        const oldSupervisor = lastUndoneMove.oldSupervisor;
        const newSupervisor = lastUndoneMove.newSupervisor;
      
        if (oldSupervisor) {
          oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
            (emp) => emp.uniqueId !== lastUndoneMove.employeeID
          );
        } else if (newSupervisor) {
          this.ceo.subordinates = this.ceo.subordinates.filter(
            (emp) => emp.uniqueId !== lastUndoneMove.employeeID
          );
        }
      
        if (newSupervisor) {
          newSupervisor.subordinates.push(
            (this.findEmployee(lastUndoneMove.employeeID, this.ceo, ))!
          );
        }
      }

}

const app = new EmployeeOrgApp(JohnSmith)
console.log(app)
app.move(2,14)  // moving Georgina Flangy(id = 2) moves under Margot Donald(id= 14)
console.log(app)
app.undo()
console.log(app)


