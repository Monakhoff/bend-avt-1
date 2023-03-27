/* Константы и Переменные */
const add_button = document.getElementById('add-button'),
      load_button = document.getElementById('load-button'),
      rem_button = document.getElementById('rem-button'),
      save_button = document.getElementById('save-button'),
      u_list = document.getElementById('list');

var items = document.getElementsByClassName('item'),
    item_count;

/* Обработчики событий */
add_button.addEventListener('click', function add_item()
{
    const input = document.querySelector('input.console');
    if (input.value == '' && add_button.textContent == 'Добавить') input.value = 'Задача №' + (item_count+1)
    else if (!input.value.trim())
    {
        alert ('Введите описание для задачи!')
        return;
    };
    const item = document.createElement('li');
    item.classList.add('item');
    item.setAttribute('draggable', true);
    item.innerHTML = `<input class = "checkbox" type = "radio">
                      <span> ${input.value} </span>
                      <button class = "x-button" type = "button">X</button>`;
    const items = u_list.querySelectorAll('input:checked');
    if (items.length != 0)
    {
        items.forEach((item, index) =>
        {
            check_status(item);
            if (index == 0)
            {
                let span = item.nextElementSibling;
                span.innerHTML = `<span>&nbsp;${input.value}</span>`;
                if (span.classList.contains('crossed')) span.classList.remove('crossed');
            }
            else
            {
                item = item.parentElement;
                u_list.removeChild(item);
                item_count--;
            };
        });
    }
    else
    {
        u_list.appendChild(item);
        add_listeners(item_count);
        item_count++;
    };
    input.placeholder = 'Введите задачу для списка';
    input.value = '';
    check_buttons();
});

load_button.addEventListener('click', function load_items()
{
    const data = localStorage.getItem('TDL');
    if (data == undefined)
    {
        alert ('Вы не сохраняли список дел!');
        return;
    }
    else
    {
        u_list.innerHTML = localStorage.getItem('TDL');
        alert ('Список дел загружен!');
        check_buttons();
        set_listeners();
    }
});

rem_button.addEventListener('click', function remove_item()
{
    if (item_count == 0)
    {
        alert ('Вcе задачи уже удалены из списка!');
        return;
    };
    const items = document.querySelectorAll('span.crossed');
    if (items.length == 0)
    {
        alert ('Вычеркните задачу для удаления из списка!');
        return;
    }
    else
    {
        items.forEach(item =>
        {
            item = item.parentElement;
            u_list.removeChild(item);
            item_count--;
        })
    };
    check_buttons();
});

save_button.addEventListener('click', function save_items()
{
    const items = document.querySelectorAll('li.item');
    if (items.length == 0)
    {
        alert ('Список дел пуст!');
        return;
    }
    else
    {
        localStorage.setItem('TDL', u_list.innerHTML);
        alert ('Список дел сохранён!');
    }
});

u_list.addEventListener('dragstart', event => event.target.classList.add('selected'));
u_list.addEventListener('dragend', event => event.target.classList.remove('selected'));
u_list.addEventListener('dragover', event =>
{
    event.preventDefault();
    const active_element = u_list.querySelector('li.selected'),
          current_element = event.target;
    if (current_element !== active_element && current_element.hasAttribute('draggable'))
    {
        const next_element = (current_element !== active_element.nextElementSibling)
            ? current_element : current_element.nextElementSibling;
        u_list.insertBefore(active_element, next_element);
    }
});

/* Функции */
function add_listeners (index)
{                       
    const item = items[index],
          button = item.querySelector('button'),
          input = item.querySelector('input'),
          span = item.querySelector('span');
    button.addEventListener('click', function()
    {
        span.classList.toggle('crossed');
        check_buttons();
    });
    input.addEventListener('click', function()
    {
        check_status(this);
        check_buttons();
    });
}

function check_buttons ()
{
    const inputs = u_list.querySelectorAll('input:checked');
    if (inputs.length != 0)
    {
        add_button.style.backgroundColor = 'green';
        add_button.textContent = 'Заменять?';
    }
    else
    {
        add_button.style.backgroundColor = 'blue';
        add_button.textContent = 'Добавить';
    };
    const spans = u_list.querySelectorAll('span.crossed');
    if (spans.length != 0)
    {
        rem_button.style.backgroundColor = 'red';
        rem_button.textContent = 'Удалять?';
    }
    else
    {
        rem_button.style.backgroundColor = 'blue';
        rem_button.textContent = 'Удалить';
    };
}

function check_status (item)
{
    item.checked = !item.isChecked;
    item.isChecked = item.checked;
}

function set_listeners ()
{
    item_count = items.length;
    for (index = 0; index < item_count; index++)
    {
        add_listeners(index);
    };
}
set_listeners();