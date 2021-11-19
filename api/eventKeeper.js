/**
 * Объект со всеми событиями.
 */
let events = {};

/**
 * Добавляет функцию в событие.
 * @param {*} event Название события.
 * @param {*} func Функция.
 */
function on(event, func) {
    events[event]
        ? events[event].push(func)
        : events[event] = [func];
}

/**
 * Вызывает выполнение функций события.
 * @param {*} event Название события.
 * @param  {...any} args Аргументы, с которыми вызвать функции.
 */
function rise(event, ...args) {
    events[event]?.forEach(func => func(...args));
}

module.exports = {
    on: on,
    rise: rise
}