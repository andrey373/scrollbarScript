class ScrollBox{
    static SCROLLER_HEIGHT_MIN = 25;

    constructor(element){
        // область просмотра, в которой находится title, контент и скроллбар
        this.viewport = element.querySelector('.viewport');
        // контейнер, в котором будет прокручиваться информация на который установлено свойство overflow
        this.item = element.querySelector('.item');
        // флаг нажатия на левую кнопку мыши
		this.pressed = false;
        this.init();
    }

    init(){
        // высоты полученных элементов
        this.viewportHeight = this.viewport.offsetHeight;
        this.itemHeight = this.item.scrollHeight;
        // если высота контента меньше или равна высоте вьюпорта,
		// выходим из функции
        if(this.viewportHeight >= this.itemHeight) return;

        // возможная максимальная прокрутка контента (разница межу установленной высотой блока и фактической высотой контента)
        this.max = this.viewport.clientHeight - this.itemHeight;
        // соотношение между высотами вьюпорта и контента
        this.ratio = this.viewportHeight / this.itemHeight;
        // формируем полосу прокрутки и ползунок
        this.createScrollBar();
        // устанавливаем обработчики событий
        this.registerEventsHandler();
        // console.log(this);
    }

    createScrollBar(){
        // создаём новые DOM-элементы DIV из которых будет
	    // сформирован скроллбар
        let scrollbar = document.createElement('div'),
            scroller = document.createElement('div');

        // присваиваем созданным элементам соответствующие классы
        scrollbar.classList.add('scrollbar');
        scroller.classList.add('scroller');

        // вставляем созданные элементы в document
        scrollbar.appendChild(scroller);
        this.viewport.appendChild(scrollbar);

        // получаем DOM-объект ползунка полосы прокрутки, вычисляем и
		// устанавливаем его высоту
        this.scrollbar = this.viewport.querySelector('.scrollbar');
        this.scroller = this.viewport.querySelector('.scroller');
        this.scrollerHeight = parseInt(this.ratio * this.viewportHeight);
        this.scrollerHeight = (this.scrollerHeight <= ScrollBox.SCROLLER_HEIGHT_MIN) ? ScrollBox.SCROLLER_HEIGHT_MIN : this.scrollerHeight;
        this.scroller.style.height = this.scrollerHeight + 'px';
    }

    // регистрация обработчиков событий
    registerEventsHandler(evt){
        // вращение колёсика мыши
        this.item.addEventListener('scroll', () => {
            this.scroller.style.top = (this.item.scrollTop * this.ratio) + 'px';
        })

        // нажатие на левую кнопку мыши
        this.scroller.addEventListener('mousedown', (evt) => {
            // координата по оси Y нажатия левой кнопки мыши
            this.start = evt.clientY;
            // устанавливаем флаг, информирующий о нажатии левой кнопки мыши
            this.pressed = true;
        })

        // перемещение мыши
        document.addEventListener('mousemove', this.drop.bind(this));

        // отпускание левой кнопки мыши
        document.addEventListener('mouseup', () => this.pressed = false);
    }


    drop(evt){
        evt.preventDefault();
        // если кнопка мыши не нажата, прекращаем работу функции
        if(this.pressed === false) return;
        // величина перемещения мыши
        let shiftScroller = this.start - evt.clientY;

        // изменяем положение бегунка на величину перемещения мыши
        this.scroller.style.top = (this.scroller.offsetTop - shiftScroller) + 'px';

        // величина, на которую должен переместиться контент
        let shiftContent = this.scroller.offsetTop / this.ratio;
        // сумма высоты ползунка и его отступа от верхней границы вьюпорта
        let totalHeightScroller = this.scroller.offsetHeight + this.scroller.offsetTop;
        // максимальный отступ, который может быть у ползунка в зависимости от его
		// высоты и высоты вьюпорта
        let maxOffsetScroller = this.viewportHeight - this.scroller.offsetHeight;

        // ограничиваем перемещение ползунка
		// по верхней границе вьюпорта
        if(this.scroller.offsetTop < 0) this.scroller.style.top = 0 + 'px';
        // по нижней границе вьюпорта
        if(totalHeightScroller >= this.viewportHeight){
            this.scroller.style.top = maxOffsetScroller + 'px';
        }

        // прокручиваем контент на величину пропорциональную перемещению ползунка
        this.item.scrollTo(0, shiftContent);
        // устанавливаем координату Y начала движения мыши равной текущей координате Y
        this.start = evt.clientY;
    }
}


// выбираем все блоки на странице, в которых может понадобиться прокрутка контента
let containers = document.querySelectorAll('.box');

//перебираем полученную коллекцию элементов

for (let item of containers){
    // создаём экземпляр контейнера, в котором будем прокручивать контент
    let scrollbox = new ScrollBox(item);
}
