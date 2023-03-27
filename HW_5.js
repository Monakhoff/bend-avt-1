/* Классы */
class Audio
{
    constructor ()
    {
        this.buffer = new Array;
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.list = ['Star Wars - Imperial March Remix',
                     'Star Wars - Main Theme Remix'];
        this.number = 0;
        this.loadTracks();
    }
    
    changeTrack ()
    {
        this.number++;
        if (this.number == this.list.length)
            this.number = 0;
        this.playTrack();
    }
    
    async loadTracks ()
    {
        for (let index = 0; index < this.list.length; index++)
        {
            const link = `https://centurion-x.github.io/bend-avt-1/audio/${this.list[index]}.mp3`,
                  temp = await this.sendRequest(link);
            this.buffer.push(await this.context.decodeAudioData(temp, data => data));
            if (index < 1)
                this.playTrack();
        }
    }
    
    playTrack ()
    {
        let source = this.context.createBufferSource();
        if (!source.start)
            source.start = source.noteOn;
        source.buffer = this.buffer[this.number];
        source.connect(this.context.destination);
        source.start(0);
        source.onended = () =>
        {
            source = null;
            this.changeTrack();
        }
    }
    
    async sendRequest ( link )
    {
        const response = await fetch(link).then(response => response.arrayBuffer());
        return response;
    }
}

class Data
{
    constructor ()
    {
        this.counter;
        this.data = new Array;
        this.keys = {'planets': ['name', 'diameter', 'population', 'gravity', 'terrain', 'climate'],
                     'films': ['episode_id', 'title', 'release_date'],
                     'residents': ['name', 'gender', 'birth_year', 'homeworld']};
        this.load = false;
        this.page = 1;
        this.getInformation('planets', 'name');
    }
    
    capitalizeText ( text )
    {
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text;
    }
    
    changePage ( value )
    {
        this.page += value;
        if (value == 0)
            this.page = 0
        else if (this.page < 1)
            this.page = Math.round(this.counter/10)
        else if (this.page > Math.round(this.counter/10))
            this.page = 1;
        this.generatePage(this.page);
    }
    
    generateCard ( id )
    {
        const card = document.createElement('div');
              card.classList.add('card');
              card.classList.add('cursor');
              card.classList.add('v-container');
              card.addEventListener('click', () => this.generateWindow(id));
        for (let index = 0; index < this.keys['planets'].length; index++)
        {
            const element = this.showInformation(id, index, true);
            card.appendChild(element);
        }
        const list = document.getElementById('list');
              list.appendChild(card);
    }
    
    generatePage ( min, max = min * 10 )
    {
        if (this.page == 0)
        {
            min++;
            max = this.counter;
        }
        const list = document.getElementById('list');
              list.innerHTML = '';
        for (let index = 1 + (min - 1) * 10; index <= max; index++)
        {
            this.generateCard(index);
        }
        const button = document.getElementById('show'),
              next = document.getElementById('next'),
              page = document.getElementById('page'),
              prev = document.getElementById('prev');
        if (this.page == 0)
        {
            button.style.display = 'none';
            page.textContent = `(01-${this.counter} /${this.counter})`;
            next.textContent = next.nextElementSibling.textContent = '';
            prev.textContent = prev.previousElementSibling.textContent = '';
        }
        else
        {
            const prefix = value => (value * 10 - 9 < 10) ? '0' : '';
            page.textContent = `(${prefix(min)}${max - 9} - ${max} /${this.counter})`;
            let value_n, value_p;
            value_n = value_p = min;
            if (min == Math.round(this.counter/10))
                value_n = 0;
            next.nextElementSibling.textContent =
                `${prefix(value_n + 1)}${(value_n + 1) * 10 - 9} - ${(value_n + 1) * 10}`;
            if (min == 1)
                value_p = 1 + Math.round(this.counter/10);
            prev.previousElementSibling.textContent =
                `${prefix(value_p - 1)}${(value_p - 1) * 10 - 9} - ${(value_p - 1) * 10}`;
        }
    }
    
    async generateTable ( id, key )
    {
        const keys = this.keys[key],
              rows = this.data[id - 1][key].length;
        const table = document.getElementById(key);
              table.innerHTML = '';
        if (rows)
        {
            const caption = table.createCaption();
                  caption.textContent = 'Loading data...';
            for (let index = -1; index < rows; index++)
            {
                const row = table.insertRow(),
                      cells = keys.length;
                let info;
                if (index >= 0)
                    info = await this.sendRequest(this.data[id - 1][key][index]);
                for (let index = 0; index < cells; index++)
                {
                    const cell = row.insertCell();
                          cell.textContent = ' ... ';
                    if (info)
                    {
                        if (keys[index] == 'homeworld')
                            cell.textContent = this.data[id - 1]['name'];
                        else
                            cell.textContent = info[keys[index]]
                    }
                    else
                    {
                        let field = keys[index];
                        if (field.length > 9)
                            field = field.split('_').join(' ');
                        cell.textContent = field;
                    }
                }
            }
            caption.textContent = this.capitalizeText(key);
        }
    }
    
    generateWindow ( id )
    {
        const content = modal_window.querySelector('div.v-container');
              content.textContent = '';
        const substrate = document.getElementById('inform');
              substrate.classList.add('disabled');
        for (let index = 1; index < this.keys['planets'].length; index++)
        {
            let element = this.showInformation(id, index);
            content.appendChild(element);
        }
        const title = modal_window.querySelector('span.title');
              title.textContent = this.data[id - 1]['name'];
        this.generateTable(id, 'films');
        this.generateTable(id, 'residents');
        modal_window.style.display = 'block';
    }
    
    async getInformation ( key, value )
    {
        const link = 'https://swapi.dev/api/' + key + '/';
        this.counter = await this.sendRequest(link)
                                 .then(response => response.count);
        for (let index = 1; index <= Math.ceil(this.counter / 10); index++)
        {
            const array = await this.sendRequest(link +'?page='+ index)
                                    .then(response => response.results);
            array.forEach(item => this.data.push(item));
        }
        this.data.sort((a, b) => a[value] >= b[value] ? 1 : -1);
        this.generatePage(this.page);
        this.load = true;
    }
    
    async sendRequest ( link )
    {
        const response = await fetch(link).then(response => response.json());
        return response;
    }
    
    showInformation ( id, index = 0, check = false )
    {
        let element = document.createElement('span'),
            field = this.keys['planets'][index],
            text = this.data[id - 1][field];
        if (check)
        {
            if ( text.length > 7 && index == 3)
                text = this.sliceText(text, 7);
            if ( text.length > 15 && index > 3)
                text = this.sliceText(text, 15, ',');
        }
        field = this.capitalizeText(field);
        element.textContent = `${field}: ${text}`;
        return element;
    }
    
    sliceText ( text, max, sep = ' ' )
    {
        let string = text.slice(0, max);
        const array = string.split(sep);
              array.splice(array.length - 1, 1);
        string = array.join(',');
        text = string + '...';
        return text;
    }
}
const database = new Data(),
      modal_window = document.getElementById('modal_window');

/* События */
const elements = document.querySelectorAll('*.cursor'),
      scroll = document.getElementById('scroll');
elements.forEach(element =>
{
    let value = 0;
    if (element.classList.contains('audio'))
    {
        element.addEventListener('click', () => 
        {
            const audio_player = new Audio();
            element.style.display = 'none';
        });
        element.click();
        return;
    }
    else if (element.classList.contains('cross'))
    {
        element.addEventListener('click', () => 
        {
            const substrate = document.getElementById('inform');
                  substrate.classList.remove('disabled');
            modal_window.style.display = 'none';
        });
        return;
    }
    else if (element.classList.contains('next'))
        value = 1;
    else if (element.classList.contains('prev'))
        value = -1;
    element.addEventListener('click', () => database.changePage(value));
});
scroll.addEventListener('animationend', function checkScroll()
{
    if (database.load)
    {
        const inform = document.getElementById('inform'),
              titres = document.getElementById('titres');
        titres.style.display = 'none';
        inform.style.display = 'flex';
    }
    else setTimeout(checkScroll, 1000);
});