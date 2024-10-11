import todoStore, {Filters} from '../store/todo.store';
import { renderPending, renderTodos } from './use-cases';
import html from './app.html?raw';


const ElementIds = {
    ClearCompletedButton : '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input', //referencia al cuadro de texto de entrada de nueva tarea, en la webapp
    TodoFilters: '.filtro',
    PendingCountLabel : '#pending-count'
}

/**
 * 
 * @param {String} elementID 
 */
export const App = (elementID) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos (ElementIds.TodoList, todos);
        updatePendirngCount();
    };

    const updatePendirngCount = () =>{
        renderPending(ElementIds.PendingCountLabel);
    };

    //Cuando la función App() se llama
    (() =>{
        const app = document.createElement ('div');
        app.innerHTML = html;
        document.querySelector(elementID).append(app);
        displayTodos();
    }
    )();

    //referencias HTML
    const newDescriptionInput = document.querySelector (ElementIds.NewTodoInput); //accedemos al cuadro de entrada de texto
    const todoListUL = document.querySelector (ElementIds.TodoList);
    const clearCompletedButton = document.querySelector(ElementIds.ClearCompletedButton);
    const filtersLi = document.querySelectorAll(ElementIds.TodoFilters);
    

    //listeners
    newDescriptionInput.addEventListener ('keyup', (event)=>{  //monitorizamos qué se escribe en el cuadro de texto con este listener
        
        if (event.keyCode !== 13) return; //13 es el código para ENTER
        if (event.target.value.trim().length === 0) return; //si no se escribe nada
        todoStore.addTodo (event.target.value); //al escribir añadimos texto a la tarea que vamos a crear
        displayTodos();//se llama a la función para rendereizar las tareas con la nueva ya incluida
        event.target.value = '';
    });

    todoListUL.addEventListener ('click', (event) =>{
        const element = event.target.closest('[data-id]'); //así busca el elemento html más cercano al que provoca el evento
        todoStore.toggleTodo (element.getAttribute ('data-id'));
        console.log (event.target.getAttribute('done'));
        displayTodos();
    });

    todoListUL.addEventListener ('click', (event) =>{
        const isDestroyElement = event.target.className ==='destroy'; //buscamos botones de borrar o destruir tarea
        const element = event.target.closest('[data-id]');
        if (!element || !isDestroyElement) return;
        todoStore.deleteTodo (element.getAttribute('data-id'))
        displayTodos();
    });

    clearCompletedButton.addEventListener ('click', (event) =>{
        todoStore.deleteCompleted();
        displayTodos();
    } );

    filtersLi.forEach (element => {
        element.addEventListener ('click', (element) => { //en este bucle creamos el efecto visual para que se vea seleccionado el botón
            filtersLi.forEach (el=> el.classList.remove ('selected'));
            element.target.classList.add ('selected');
            switch (element.target.text){
                case 'Tasks':
                    todoStore.setFilter(Filters.All);
                    break;
                case 'Pending':
                    todoStore.setFilter(Filters.Pending);
                    break;
                case 'Completed':
                    todoStore.setFilter(Filters.Completed);
                    break;
            }
            displayTodos();
        });
    } );
}