/* Константы */
const bubble = document.getElementById('bubble'),
      button = document.getElementById('button'),
      log = document.getElementById('log'),
      side_one = document.getElementById('side-one'),
      side_two = document.getElementById('side-two');
const texts = {boast: 'Я Мегатрон и я неотразим!',
               crash:
                    ['Аха - ха - ха!',
                     'Минус один!'],
               dodge:
                    ['В меня не так-то просто попасть!',
                     'Ха, мимо!'],
               norms:
                    ['Десептиконы будут властелинами вселенной!',
                     'Каждый мой удар попадает в цель!',
                     'Меня очень трудно победить!',
                     'Мне нет равных в рукопашном бою!',
                     'Никто не смеет бросать мне вызов!'],
               victory: 'Я ещё вернусь!'};

/* Классы */
class Arena
{
    constructor (amount)
    {
        this.amount = amount;
        this.autobots = new Array;
        this.decepticon = new Object;
        this.index = null;
        this.round = null;
        this.start();
    }
    
    check ()
    {
        if (this.amount != 0 && this.decepticon.health > 0)
        {
            this.fight();
            this.render();
            if (this.autobots[this.index].health <= 0)
                this.autobots.splice(this.index, 1);
        }
        else
        {
            if (this.decepticon.health > 0)
                bubble.textContent = texts.boast
            else
            {
                bubble.textContent = texts.victory;
                this.comment('Мегатрон нуждается в ремонте и бежит с поля боя!');
            }
            button.removeAttribute('disabled');
            button.textContent = `В бой!`;
            return;
        }
        setTimeout(() => this.check(), 1000);
    }
    
    comment ( text = '' )
    {
        let string;
        if (text)
        {
            string = document.createElement('span');
            string.textContent = text;
        }
        else
            string = document.createElement('br');
        log.appendChild(string);
    }
    
    create ( identity, number )
    {
        let bot = document.createElement('div');
            bot.classList.add('bot');
            bot.setAttribute('id', 'bot_№' + number);
            bot.innerHTML = `<span class = "name">Bot № ${number}</span>
                             <span class = "life">${identity.health} hp</span>`;
        return bot;
    }
    
    fight ()
    {
        this.index = this.randomize(0, this.amount - 1);
        this.autobots[this.index].hit(this.decepticon.attack());
        this.autobots.forEach
        ( 
            (bot, index, array) =>
            {
                if (bot && bot.health > 0)
                    this.decepticon.hit(bot.attack())
                else
                    this.amount--;
            }
        );
        this.round++;
    }
    
    randomize (min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    render ()
    {
        const bot = this.autobots[this.index];
        let condition;
        this.comment();
        this.comment(this.round + 'я секунда боя');
        if (bot.health > 0)
        {
            hit.call(this, 'bot_' + bot.info);
            this.comment(`Мегатрон наносит удар по роботу ${bot.info} и отнимает ${this.decepticon.attack().damage} hp.`);
        }
        else
        {
            condition = 'crash';
            side_one.removeChild(side_one.querySelector('#bot_' + (bot.info)));
            this.comment(`Мегатрон сокрушительным ударом выводит из строя робота ${bot.info}.`);
        }
        this.autobots.forEach((bot, index) =>
        {
            if (bot.health > 0)
            {
                if (bot.weapon.efficiency)
                {
                    if (!condition)
                        condition = 'norms';
                    hit.call(this, 'bot');
                    this.comment(`Робот ${bot.info} стреляет из оружия и наносит урон в ${bot.weapon.damage} hp.`);
                }
                else
                    this.comment(`Робот ${bot.info} промахивается.`);
            }
        });
        if (!condition)
            condition = 'dodge';
        this.speak(condition);
        this.timer();
        
        function hit ( bot_id, bot = this.decepticon )
        {
            const bot_image = document.getElementById(bot_id),
                  bot_health = bot_image.querySelector('.life');
            if (bot_id.length > 3)
                bot = this.autobots[this.index];
            bot_image.classList.add('hit');
            setTimeout(()=> bot_image.classList.remove('hit'), 50);
            bot_health.textContent = `${bot.health} hp`;
        }
    }
    
    speak ( condition )
    {
        const phrase = texts[condition][this.randomize(0, texts[condition].length - 1)];
        if (phrase && bubble.textContent !== phrase)
            bubble.textContent = phrase
        else
            this.speak(condition);
    }
    
    start ()
    {
        button.setAttribute('disabled', true);
        log.innerHTML = '<u>Ход боя</u>';
        side_one.innerHTML = '';
        for (let number = 1; number <= this.amount; number++)
        {
            this.autobots.push(new Autobot ('№' + number, new Weapon (100, 1000)));
            side_one.appendChild(this.create(this.autobots[number - 1], number));
        }
        this.decepticon = new Decepticon ('Megatron', 10000);
        console.log('Side №1:', this.autobots);
        console.log('Side №2:', this.decepticon);
        setTimeout(() => this.check(), 1000);
    }
    
    timer ()
    {
        const min = Math.floor(this.round/60),
              sec = this.round - min * 60;
        button.textContent = `${min} м. ${sec}  с.`;
    }
}
    
class Transformer
{
    constructor (info, health = 100)
    {
        this.health = health;
        this.info = info;
    }
        
    hit (weapon)
    {
        this.health -= weapon.damage;
        return this.health, weapon.damage;
    }
}
    
class Autobot extends Transformer
{
    constructor (info, weapon)
    {
        super(info);
        this.weapon = new Weapon (100, 1000);
    }
        
    attack ()
    {
        return this.weapon.use();
    }
}

class Decepticon extends Transformer
{
    attack ()
    {
        return {damage: 5, speed: 1000};
    }
}
    
class Weapon
{
    constructor (damage, speed)
    {
        this.damage = damage;
        this.efficiency = null;
        this.speed = speed;
    }
    
    randomize ()
    {
        return Math.floor(Math.random() * 100);
    }
    
    use ()
    {
        const chance = this.randomize();
        if (chance > 50)
        {
            this.efficiency = false;
            return {damage: 0, speed: this.speed};
        }
        else
        {
            this.efficiency = true;
            return {damage: this.damage, speed: this.speed};
        }
    }
}

/* Старт симуляции */
button.onclick = function ()
{
    let amount = prompt ('Сколько роботов нужно добавить на арену (максимум 6)?\nВведите число: ', 1);
        amount = Number(amount);
    if (isNaN(amount))
        amount = 1
    else if (amount > 6)
        amount = 6
    else if (amount < 1)
        amount = 1;
    const arena = new Arena(amount);
}