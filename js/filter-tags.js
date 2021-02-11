(function() {

  var $imgs = $('#gallery img');                  // Сохраняем все изображения
  var $buttons = $('#buttons');                   // Сохраняем элементы button
  var tagged = {};                                // Создаем объект tagged

  $imgs.each(function() {                         // Перебираем изображения и
    var img = this;                               // сохраняем их в переменную
    var tags = $(this).data('tags');              // Получаем теги этого элемента

    if (tags) {                                   // Если элемент содержит теги
      tags.split(',').forEach(function(tagName) { // Разбиваем их по запятой
        if (tagged[tagName] == null) {            // Если нет, то
          tagged[tagName] = [];                   // Добавляем в объект пустой массив
        }
        tagged[tagName].push(img);                // Добавляем изображение в массив
      });
    }
  });

  $('<button/>', {                                 // Создаем пустую кнопку
    text: 'Wszystko',                              // Добавляем текст 'Все'
    class: 'active',                               // Делаем ее активной
    click: function() {                            // Добавляем обработчик onclick
      $(this)                                      // Получаем нажатую кнопку
        .addClass('active')                        // Добавляем класс active
        .siblings()                                // Получаем остальные кнопки
        .removeClass('active');                    // Удаляем из них класс active
      $imgs.show();                                // Выводим все изображения
    }
  }).appendTo($buttons);                           // Добавляем к другим кнопкам

  $.each(tagged, function(tagName) {               // Для каждого тега
    $('<button/>', {                               // Создаем пустую кнопку
      text: tagName + ' (' + tagged[tagName].length + ')', // Добавляем имя тега
      click: function() {                          // Добавляем обработчик щелчка
        $(this)                                    // Нажатая кнопка
          .addClass('active')                      // Делаем нажатый элемент активным
          .siblings()                              // Получаем остальные кнопки
          .removeClass('active');                  // Удаляем из них класс active
        $imgs                                      // Все изображения
          .hide()                                  // Прячем их
          .filter(tagged[tagName])                 // Находим те, что имеют данный тег
          .show();                                 // Показываем только их
      }
    }).appendTo($buttons);                         // Добавляем к другим кнопкам
  });

}());














var request;                         // Последнее запрошенное изображение
var $current;                        // Текущее изображение
var cache = {};                      // Объект cache
var $frame = $('#photo-viewer');     // Контейнер для изображения
var $thumbs = $('.thumb');           // Контейнер для эскизов

function crossfade($img) {           // Функция для плавного перехода между изображениями
                   // Передаем новое изображение в качестве параметра
  if ($current) {                    // Если изображение сейчас выводится
    $current.stop().fadeOut('slow'); // Останавливаем анимацию и плавно его скрываем
  }

  $img.css({                         // Задаем для изображения поля с помощью CSS
    marginLeft: -$img.width() / 2,   // Отрицательное значение поля в половину ширины
    marginTop: -$img.height() / 2    // Отрицательное значение поля в половину высоты
  });

  $img.stop().fadeTo('slow', 1);     // Останавливаем анимацию нового изображения и плавно его выводим

  
  $current = $img;                   // Новое изображение становится текущим

}

$(document).on('click', '.thumb', function(e){ // При щелчке по эскизу
  var $img,                               // Создаем локальную переменную $img
      src = this.href;                    // Сохраняем путь к изображению
      request = src;                      // Сохраняем последнее запрошенное изображение
  
  e.preventDefault();                     // Отменяем стандартное поведение ссылки
  
  $thumbs.removeClass('active');          // Удаляем класс active из всех эскизов
  $(this).addClass('active');             // Добавляем класс active к нажатому эскизу

  if (cache.hasOwnProperty(src)) {        // Если cache содержит это изображение
    if (cache[src].isLoading === false) { // И если isLoading равно false
      crossfade(cache[src].$img);         // Вызываем функцию crossfade()
    }
  } else {                                // Если его нет внутри cache
    $img = $('<img/>');                   // Сохраняем пустой элемент <img/> в $img
    cache[src] = {                        // Сохраняем это изображение в cache
      $img: $img,                         // Добавляем путь к изображению
      isLoading: true                     // Присваиваем isLoading значение false
    };

    // Следующие несколько строчек подготовлены заранее, но запустятся после загрузки изображения
    $img.on('load', function(){           // После загрузки изображения
      $img.hide();                        // Скрываем его
      // Удаляем класс is-loading из контейнера и добавляем в него новое изображение
      $frame.removeClass('is-loading').append($img);
      cache[src].isLoading = false;       // Обновляем isLoading внутри cache
      // Если это последнее запрошенное изображение
      if (request === src) {
        crossfade($img);                  // Вызываем функцию crossfade()
      }                                   // Решаем проблему с асинхронной загрузкой
    });

    $frame.addClass('is-loading');        // Добавляем в контейнер класс is-loading

    $img.attr({                           // Назначаем атрибуты элементу img
      'src': src,                         // Добавляем атрибут src для загрузки изображения
      'alt': this.title || ''             // Добавляем заголовок, если таковой был в ссылке
    });

  }

});

// Последняя строка запускается сразу после загрузки остальной части сценария и выводит первое изображение
$('.thumb').eq(0).click();                // Эмулируем щелчок по эскизу


