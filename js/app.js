// Variables
let userBudget = JSON.parse(localStorage.getItem("Budget")) || prompt("This is your first time here, please tell me, how much do we have? $$$$");
const form = document.getElementById('addExpense');
const edit = document.querySelector('#edit');
const newBudget = document.querySelector('#newBudget');
let amountBudget;

//Clases
//Budget class
class Budget{

    constructor(budget, remaining = budget){
    this.budget = Number(budget);
    this.remaining = Number(remaining);
    }
    //Method to substract from the actual budget.
    remainingBudget(amount = 0, operation = 'substraction'){
        operation === 'substraction' ? this.remaining -= Number(amount) : this.remaining += Number(amount);
        
        //Saving the changes in the remaining.
        localStorage.setItem('Budget', JSON.stringify(amountBudget));
        return this.remaining;
    }
}

// Interface Class to mantain UI in HTML.
class Interface{

    //Inserts budget and remaning at html at the beginning.
    insertBudget(amount, remaining = amount){
        const budgetSpan = document.querySelector('#total');
        const remainingSpan = document.querySelector('#remaining');
        //Insert to the HTML
        budgetSpan.innerHTML = `${amount}`;
        remainingSpan.innerHTML = `${remaining}`;
    }
    
    //Prints all the messages
    printMessage(message,type){

        const divMessage = document.querySelector('#divMessage');
        divMessage.style.opacity = '1';
        form.reset();

        if(type ==='error'){
            divMessage.classList.add('alert-danger');
        }else{
            divMessage.classList.add('alert-success');
        }
        
        document.querySelector('#divMessage p').innerText= `${message}`;
        
        //Quit the alert after 3 seconds.
         setTimeout(function(){
             divMessage.style.opacity = '0';
         },3000);
    }

    //Inserts a new expense to the list.
    addExpenseList(name, amount, previous = false){
        const expensesList = document.querySelector('#expenses ul');

        if(previous){
            //Using the List of expenses in HTML from previous sesions.
            expensesList.innerHTML = localStorage.getItem("ExpensesList");
        }else{

            //Create a deleting button.
            const deleteButton = document.createElement('a');
            deleteButton.className = 'delete-expense';
            deleteButton.innerText = 'X';

            //Create a li element.
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML= `
                <a>${name}</a>
                <span class='badge badge-primary badge-pill amountListed'> $ ${amount}
            `;

            li.appendChild(deleteButton);
            expensesList.appendChild(li);

            //Saving the list of expenses in HTML.
            localStorage.setItem('ExpensesList', expensesList.innerHTML);
        }
    }

    //Removes a new expense to the list.
    removeExpenseList(name, amount){
        const expensesLi = document.querySelectorAll('#expenses li');
        const expensesList = document.querySelector('#expenses ul');
        for(let record of expensesLi){
            if(record.children[0].innerText === name && record.children[1].innerText.replace(/[^\d]/g,'') === amount){  
                record.remove();
                localStorage.setItem('ExpensesList', expensesList.innerHTML);
                break;
            }
        }    
    }
    
    //Checks the remaining budget after add or remove an expense.
    remainingBudget(amount, operation = 'substraction' ){
        const remaining = document.querySelector('#remaining');
        //Read the remaining budget.
        const remainingUserBudget = amountBudget.remainingBudget(amount, operation); 
        remaining.innerHTML=
        `${remainingUserBudget}`;
        this.checkBudget();
    }

    //Change the color of the remaining amount.
    checkBudget(){

        const totalBudget = amountBudget.budget;
        const remainingBudget = amountBudget.remaining;
        const remaining =  document.querySelector('.remaining');
  
        //Checking the 25%
        if((totalBudget/4) > remainingBudget){
            remaining.classList.remove('alert-success', 'alert-warning');
            remaining.classList.add('alert-danger');
         //Checking the 50%
        } else if((totalBudget/2) > remainingBudget){
            remaining.classList.remove('alert-success');
            remaining.classList.add('alert-warning');
        }else{
            remaining.classList.add('alert-success');
            remaining.classList.remove('alert-warning');
            remaining.classList.remove('alert-danger');
        }
    }

    editBudget(action){
        const oldBudget = document.querySelector('#total').parentElement; 
        const newBudget = document.querySelector('#newBudget');
        if (action === 'cancel'){
            
            edit.innerText = action;
            edit.setAttribute('cancel','yes');
            oldBudget.style.color = 'grey';
            newBudget.style.display = 'block';
        }else {
            edit.innerText = action;
            edit.removeAttribute('cancel');
            oldBudget.style.color = 'var(--tittle2)';
            newBudget.value = '';
            newBudget.style.display = 'none';
        }
        
    }
}

//Event Listeners
document.addEventListener('DOMContentLoaded', function(){

if(userBudget === null || userBudget === ''){
    window.location.reload();
}else if(typeof(userBudget) == 'string'){
    userBudget = userBudget.replace(/[^\d]/g,'');
    //Instance of budget with the global variable.
    amountBudget = new Budget(userBudget);
    //Saving the budget object.
    localStorage.setItem('Budget', JSON.stringify(amountBudget));
    //Instance of interface
    const ui = new Interface();
    ui.insertBudget(amountBudget.budget);
    
}else{
    //Assigning the reference object to amountBudge
    amountBudget = new Budget(userBudget.budget, userBudget.remaining);
    //Instance of interface
    const ui = new Interface();
    ui.insertBudget(amountBudget.budget,userBudget.remaining);
    ui.addExpenseList('Na','Na',true);
    ui.checkBudget();
}
});

form.addEventListener('submit', function(e){

e.preventDefault();
//Read from form.

const reasonName = document.querySelector('#reason').value;
const expenseAmount = document.querySelector('#amount').value.replace(/[^\d]/g, '');

//Instancce of interface
const ui = new Interface();

if(reasonName === ''){
    ui.printMessage('There was a mistake with the reason','error');
} else if(expenseAmount === ''){
    ui.printMessage('There was a mistake with the amount','error');
}else{
    ui.printMessage('All done','correct');
    ui.addExpenseList(reasonName,expenseAmount);
    ui.remainingBudget(expenseAmount);
}
});

document.querySelector('#budget').addEventListener('mouseover', function(){
    edit.style.display ="block";
});

document.querySelector('#budget').addEventListener('mouseout', function(){
    document.querySelector('#edit').style.display ="none";
});

document.body.addEventListener('click', function(e){

   const ui = new Interface();

    if(e.target.id === 'edit'){

        if(e.target.hasAttribute('cancel')){
            ui.editBudget('edit');
        }else{
            ui.editBudget('cancel');
        }
        

    } else if (e.target.className === 'delete-expense'){

        if(confirm('Do you want to delete this record?')){

            const name = e.target.parentNode.children[0].innerText;
            const amount = e.target.parentNode.children[1].innerText.replace(/[^\d]/g,''); 
            
            ui.printMessage('Record deleted','correct');
            ui.removeExpenseList(name, amount);
            ui.remainingBudget(amount, 'addition');
        };
    }
});

newBudget.addEventListener('keypress' , function(e){
    
    if (e.keyCode === 13){
        const newValue = newBudget.value.replace(/[^\d]/g,'');
        newBudget.value = '';
        const ui = new Interface();

        if (edit.hasAttribute('cancel') && newValue !== ''){
            amountBudget.budget = newValue;
            ui.insertBudget(amountBudget.budget,userBudget.remaining);
            ui.checkBudget();
            localStorage.setItem('Budget', JSON.stringify(amountBudget));
        }else{
            ui.printMessage('Please write a number','error')
        }
    }
});