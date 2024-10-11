import { Todo } from '../models/todo-model';

/**
 * 
 * @param {Todo} todo 
 */
export const createTodoHTML=  (todo) =>{
    if (!todo) throw new Error("A TODO object is required");

    //creando esta constante desestructuramos su contenido, y no nos hace falta invocar el todo para cada propiedad
    //por ejemplo, más abajo debería ser todo.done, ahora es done tan sólo
    const {done, description, id} = todo;

    //const html = `<h1>${ todo.description }</h1>`;
    const html = `
                <div class="view">
                    <input class="toggle" type="checkbox" ${done ? 'checked' : ''}>
                    <label>${description}</label>
                    <button class="destroy"></button>
                </div>
                <input class="edit" value="Create a TodoMVC template">
               `;

    const liElement = document.createElement ('li');
    liElement.innerHTML = html;

    liElement.setAttribute ('data-id', id);
    if (done){
        liElement.classList.add ('completed');
    }  
    return liElement;    
}