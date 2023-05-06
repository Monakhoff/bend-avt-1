/* Константы и Переменные */
const delays = [1000, 800, 1200, 750, 500],
      list = [{id: 1, title: 'Задача №1', status: true},
              {id: 2, title: 'Задача №2', status: false}];
var array,
    element,
    promise;

/* Функция для проверки подключения к сети */
const check_connection = function (id)
{
    const online = navigator.onLine;
    if (online) return 'Нет данных!'
    else display_results(id, 'Отсутствует подключение к сети!');
}

/* Функция для вывода подтверждения выполнения задачи */
const display_results = function (id, result, resume = result)
{
    element = document.getElementById(id);
    element.innerText += ' ' + result;
    console.log(`Задание ${id}: ${resume}`);
};

/* Задание №1 */
promise = new Promise((resolve, reject) => resolve(1));
promise.then(result => display_results(1, result));

/* Задание №2 */
promise = new Promise((resolve, reject) => setTimeout(() => resolve(1), 2000));
promise.then(result => display_results(2, result));

/* Задание №3 */
function getList (list)
{
    return setTimeout(function()
    {
        promise = new Promise((resolve, reject) => list ? resolve(list) : reject('Ошибка!'));
        promise.then(list =>
                     list.forEach(item => display_results(3, `${item.title}: ${item.status};`)))
               .catch(error => display_results(3, error));
    }, 2000);
}
getList(list);

/* Задание №4 */
array = ['Я', 'использую', 'цепочки', 'promises'];

function getProposition1 (array)
{
    let string = "";
    new Promise(resolve => resolve(string)).then(string =>
        new Promise (resolve => setTimeout(() =>
        {
            string += array[0] + ' ';
            display_results(4, array[0], string);
            return resolve (string);
        }, 1000))).then(string =>
        new Promise (resolve => setTimeout(() =>
        {
            string += array[1] + ' ';
            display_results(4, array[1], string);
            return resolve (string);
        }, 1000))).then(string =>
        new Promise (resolve => setTimeout(() =>
        {
            string += array[2] + ' ';
            display_results(4, array[2], string);
            return resolve (string);
        }, 1000))).then(string =>
        new Promise (resolve => setTimeout(() =>
        {
            string += array[3] + '!';
            display_results(4, array[3] + '!', string);
            return resolve (string);
        }, 1000)));
}
getProposition1(array);

/* Задание №5 */
array = ['Я', 'использую', 'параллельный', 'вызов', 'promises'];

function getProposition2 (array, delays)
{
    let promises = [];
    array.forEach((item, index) =>
        promises.push(new Promise(resolve =>
                      setTimeout(() => resolve(item), delays[index]))));
    return Promise.all(promises).then(string => string.join(' ') + '!');
}
getProposition2(array, delays).then(result => display_results(5, result));

/* Задание №6 */
function delay (delay = 2000, item = "")
{
    return new Promise(resolve => setTimeout(() => resolve(item), delay));
}
delay().then(result => display_results(6, 'Это сообщение вывелось через пару секунд.'));

/* Задание №7 */
function getProposition3 (array, delays)
{
    let promises = [];
    array.forEach((item, index) => promises.push(delay(delays[index], item)));
    return Promise.all(promises).then(string => string.join(' ') + '!');
}
getProposition3(array, delays).then(result => display_results(7, result));

/* Задание №8 */
async function getData1 (key_word, subsection, link = 'https://swapi.dev/api/films/')
{
    let message = check_connection(8);
    promise = await fetch(link).then(response => response.json());
    const data = promise.results;
    for (let index = 0; index < data.length; index++)
    {
        const array = await Promise.all(data[index][subsection].map(url =>
                            fetch(url).then(response => response.json())));
        if (array.find(item => item.name === key_word)) return message = data[index].title;
    }
    return message;
}
getData1('Tatooine', 'planets').then(result => display_results(8, result));

/* Задание №9 */
async function getData2 (key_word, subsection, link = 'https://swapi.dev/api/people/')
{
    let message = check_connection(9);
    promise = await fetch(link).then(response => response.json());
    const amount = promise.count;
    for (let index = 1; index < amount; index++)
    {
        let url = link + index;
        const array = await fetch(url).then(response => response.json());
        if (array.name === key_word)
        {
            url = array[subsection][0];
            let result = await fetch(url).then(response => response.json());
            return message = result.name;
        }
    }
    return message;
}
getData2('Anakin Skywalker', 'vehicles').then(result => display_results(9, result));

/* Задание №10 (SES: Simplest Echo Server) */
async function sendData (data = new Object, link = 'https://bbmods.ru/echo')
{
    check_connection(10);
    data.message = document.querySelector('textarea').value;
    const response = await fetch(link,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(data)
          }),
          result = await response.text();
    return result;
}
element = document.getElementById('button');
element.onclick = () =>
        sendData().then(result => display_results(10, result));
