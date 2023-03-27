/* Общие константы */
const elements = document.querySelectorAll('samp'),
      lists = document.querySelectorAll('ul'),
      result = 'OK';

/* Функция для вывода подтверждения выполнения задачи */
const display_results = function (id)
{
    elements[id-1].innerText = result;
    console.log(`Задание ${id}: ${result}`);
};

/* Задание №1 */
lists[0].addEventListener('click', function toggleAnchor (event)
{
    if (event.target.tagName == 'A') event.preventDefault()
    else return;
    const active_link = document.querySelector('a.active');
    if (active_link) active_link.classList.remove('active');
    event.target.classList.add('active');
});

lists[0].addEventListener('click', function one (event)
{
    if (event.target.classList.contains('active'))
    {
        display_results(1);
        lists[0].removeEventListener('click', one);
    }
});

/* Задание №2 */
const button_left = document.getElementById('left_button'),
      button_right = document.getElementById('right_button'),
      standard = lists[1].getElementsByTagName('li').length;

button_left.addEventListener('click', function append_element()
{
    const ul = document.getElementById('list_2'),
          li = document.createElement('li'),
          counter = ul.getElementsByTagName('li').length;
    li.textContent = 'Item ' + (counter + 1);
    ul.appendChild(li);
});

button_right.addEventListener('click', function remove_element()
{
    const ul = document.getElementById('list_2'),
          li = ul.lastElementChild,
          counter = ul.getElementsByTagName('li').length;
    if (counter == 0) return
    else ul.removeChild(li);
});

lists[1].addEventListener('DOMSubtreeModified', function two (event)
{
    if (event.target.children.length != standard)
    {
        display_results(2);
        lists[1].removeEventListener('DOMSubtreeModified', two);
    }
});

/* Задание №3 */
const ul_element = document.querySelector('ul#list_3'),
      li_elements = ul_element.querySelectorAll('li.movable');

li_elements.forEach(element => element.draggable = true);
ul_element.addEventListener('dragstart', event => event.target.classList.add('selected'));
ul_element.addEventListener('dragend', event => event.target.classList.remove('selected'));

ul_element.addEventListener('dragover', event =>
{
    event.preventDefault();
  
    const active_element = ul_element.querySelector('li.selected'),
          current_element = event.target;
    
    if (current_element !== active_element && current_element.hasAttribute('draggable'))
    {
        const next_element = (current_element !== active_element.nextElementSibling)
            ? current_element : current_element.nextElementSibling;
        ul_element.insertBefore(active_element, next_element);
    }
});

lists[2].addEventListener('drag', function three (event)
{
    if (event.target.classList.contains('selected'))
    {
        display_results(3);
        lists[2].removeEventListener('drag', three);
    }
});