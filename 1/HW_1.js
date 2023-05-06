/* Variables */
var custom_array,
    custom_function,
    custom_number,
    custom_string,
    element,
    item,
    object,
    object_one,
    object_two,
    result;

/* Функция для вывода подтверждения выполнения задачи */
const display_results = function (id, print = false)
{
    if (print) result = print_array(result);
    element = document.getElementById(id),
    element.innerText = result;
    console.log(`Задание ${id}: ${result}`);
};

/* Функция для строчного вывода содержания массива */
const print_array = function (array, space) 
{
    space = space || " ";
    let iterator = 0,
        result = " " + (array.length ? "Array" : "Object") + space + "(";
        
    for (let item in array)
    {
        iterator++;
        
        if (array[item] != null)
        {
            if ((array[item].length > 0 || typeof (array[item]) === "object")
                && typeof (array[item]) !== "string")
            {
                result += space + "[ " + item + " ] =>" + space + print_array(array[item], space);
            } else {
                result += space + "[ " + item + " ] =>" + space + array[item];
            }
            if (iterator < Object.keys(array).length)
            {
                result += ",";
            }
        }
    }
        
    return result + space + ")";
}

/* Задание №0 */
custom_string = 'Я - строка !',
custom_function = (string) => string.length,
result = custom_function(custom_string);
    
display_results(0);

/* Задание №1a */
custom_array = ['Я короткая строка','Я вроде бы тоже короткая строка','А я длинная строка'],
custom_number = 20,
custom_function = (array, limit) =>
 array.filter(string => string.length <= limit),
result = custom_function(custom_array, custom_number);
    
display_results('1a', true);

/* Задание №1b */
custom_function = (array, limit) =>
{
    result = [];
    for (item = 0; item < array.length; item++)
    {
        if (array[item].length <= limit) result.push(array[item]);
    }
    return result;
},
result = custom_function(custom_array, custom_number);
    
display_results('1b', true);

/* Задание №2a */
custom_array = [{ name: 'shark', likes: 'ocean' },
                { name: 'turtle', likes: 'pond' },
                { name: 'otter', likes: 'fish biscuits' }],
custom_function = (array) =>
 array.map(object => object.name + ' ' + Object.keys(object)[1] + ' ' + object.likes),
result = custom_function(custom_array);
    
display_results('2a', true);

/* Задание №2b */
custom_string = 'likes',
custom_function = (array) =>
{
    result = [];
    for (item = 0; item < array.length; item++)
    {
        object = array[item];
        result.push(object.name + ' ' + custom_string + ' ' + object.likes);
    }
    return result;
},
result = custom_function(custom_array, custom_string);
    
display_results('2b', true);

/* Задание №3a */
object_one = { name: 'Алиса' },
object_two = { age: 11 },
custom_function = (object_one, object_two) =>
 object = {...object_one, ...object_two},
result = custom_function(object_one, object_two);
    
display_results('3a', true);

/* Задание №3b */
object_one = { name: 'Александра' },
object_two = { age: 8 },
custom_function = (object_one, object_two) =>
 Object.assign({}, object_one, object_two),
result = custom_function(object_one, object_two);
    
display_results('3b', true);

/* Задание №4 */
custom_array = [1,2,3,4],
custom_function = (array) =>
 Math.min(...array),
result = custom_function(custom_array);
    
display_results(4);

/* Задание №5 */
custom_array = [1,2,3,4],
custom_function = (array) =>
 array.reduce((list, value) => {value % 2 != 0 && list.push(value); return list}, []),
result = custom_function(custom_array);
    
display_results(5, true);

/* Задание №6 */
custom_array = [{ price: 10, count: 2 },
                { price: 100, count: 1 },
                { price: 2, count: 5 },
                { price: 15, count: 6 }],
custom_function = (array) =>
 array.reduce((sum, item) => sum + item.count * item.price, 0),
result = custom_function(custom_array);
    
display_results(6);

/* Задание №7 */
custom_array = [1, 2, 2, 4, 5, 5],
custom_function = (array) =>
 array.reduce((set, value) => {set.indexOf(value) == -1 && set.push(value); return set}, []),
result = custom_function(custom_array);
    
display_results(7, true);

/* Задание №8 */
object = {'401': 'Ошибка авторизации',
          '402': 'Требуется оплата',
          '403': 'Доступ запрещен',
          '404': 'Не найдено',
          '500': 'Ошибка сервера'},
custom_function = (error) =>
{
    if (isFinite(error))
    {
        if (object[error] != undefined) console.warn(`Обнаружена проблема: ошибка ${error}!`)
        else {error = 'unknown'; console.warn(`Код ошибки - не известен!`)};
    }
    else if (isNaN(error))
    {
        error = Object.keys(object)[Math.floor(Math.random() * Object.keys(object).length)];
        console.warn(`Режим симуляции активирован: сгенерирована ошибка ${error}.`);
    }
    switch (error)
    {
        case 'unknown':
            error = `Неизвестная ошибка`;
            break;
        default:
            error = `${error} => ${object[error]}`;
    };
    return error;
},
result = custom_function('abracadabra');
    
display_results(8);

/* Задание №9 */
custom_array = [4,3,2,1],
custom_function = (array) =>
 array.sort((a, b) => a - b).slice(0, 2),
result = custom_function(custom_array);
    
display_results(9, true);

/* Задание №10 */
custom_array = {firstName: 'Петр',
                secondName: 'Васильев',
                patronymic: 'Иванович'},
custom_function = (array) =>
 `ФИО => ${[].concat(array.firstName, array.patronymic, array.secondName).join(' ')}`,
result = custom_function(custom_array);
    
display_results(10);

/* Задание №11 */
custom_array = [1,2,3,4],
custom_number = 5,
custom_function = (array, multiplier) =>
 array.map(number => number * multiplier),
result = custom_function(custom_array, custom_number);
    
display_results(11, true);

/* Задание №12 */
custom_array = [{name: 'Batman', franchise: 'DC'},
                {name: 'Ironman', franchise: 'Marvel'},
                {name: 'Thor', franchise: 'Marvel'},
                {name: 'Superman', franchise: 'DC'}],
custom_function = (array, franchise) =>
 franchise + ' => ' +
 array.filter(string => string.franchise == franchise).map(string => string.name).join(', '),
result = custom_function(custom_array, 'Marvel');
    
display_results(12);
