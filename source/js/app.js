'use strict';

var a = [0.4,1];        //начальная точка
var b = [0.6, 1];      //конечная точка


(function(){
  var
    direction,
    currentPos = [a[0], a[1]],
    fractionA = [],
    fractionB = [],
    fullStamp = 0,
    fullPath = 0,
    path = [];
  
  savePath(a[0],a[1]);
  //получим дробные части точки а и b
  fractionA[0] = a[0] - Math.floor(a[0]);
  fractionA[1] = a[1] - Math.floor(a[1]);
  fractionB[0] = b[0] - Math.floor(b[0]); 
  fractionB[1] = b[1] - Math.floor(b[1]);

  function correctCalculations(a, b, action){
    var result = (a*10 + b*10)/10;

    result = (action === '-')? (a*10 - b*10)/10 : result;
    return result;
  }

//принимает название оси по которой нужно двигаться
  function go(axis) {
    axis = (axis === 'x')? 0:1;

    var
      otherAxis = (axis === 0)? 1:0,
      status = testPosition(),
      length = correctCalculations(b[axis], a[axis], '-');

    status = testPosition();
    if (status) {return;}

    //если координаты по другой оси совпадают
    if ( a[otherAxis]-b[otherAxis] === 0 ) {
      a[axis] = correctCalculations(a[axis], length);
      savePath(a[0],a[1]);
      fullPath += Math.abs(length);

      status = testPosition();
      if (status) {return;}
    }

    //узнаем нужное направления по текущей оси, true вперед или вверх false назад или в низ
    direction = (length>=0)? true:false;

    //узнать сколько целих шагов  нужно сделать 
    if ( direction && Math.ceil(a[axis])!=Math.ceil(b[axis]) ) {
      fullStamp = Math.ceil(a[axis]) - Math.floor(b[axis]);
    }else if(!direction && Math.ceil(a[axis])!=Math.ceil(b[axis]) ){
      fullStamp = Math.floor(a[axis]) - Math.ceil(b[axis]);
    }
    fullStamp = Math.abs(fullStamp);

    //теперь нужно узнать в какую сторону и на сколько нужно и выгодней двигаться что бы достичь целочисленной позицыи

    //если точки находяться в одном секторе по текущей оси то есть между теме же улицам
    if ( Math.ceil(a[axis]) == Math.ceil(b[axis]) ) {
      if ( fractionA[axis]+fractionB[axis] >= (1-fractionA[axis]) + (1-fractionB[axis]) ) {
        currentPos[axis] += 1 - fractionA[0];
        fullPath += 1-fractionA[axis];
      }else{
    
        currentPos[axis] -= fractionA[axis];
        fullPath += fractionA[axis];
      }
      //если точки в разных секторах
    }else{
      //делаем дробный шаг в сторону цели
      if (direction) {
        currentPos[axis] += ( 1-fractionA[axis] < 1 )? 1-fractionA[axis]:0;
        fullPath += ( 1-fractionA[axis] < 1 )? 1-fractionA[axis]:0;
      }else{

        currentPos[axis] -= fractionA[axis];
        fullPath += fractionA[axis];
      }
      //Делаем необходимое количество полных шагов в необходимую сторону
      if (fullStamp > 0) {
        if (direction) {
          currentPos[axis] += fullStamp;
          fullPath += fullStamp;
        }else{
          currentPos[axis] -= fullStamp;
          fullPath += fullStamp;
        }
      }
    }
    a[axis] = currentPos[axis];
    savePath(a[0],a[1]);

    status = testPosition();
    if (status) {return;}
    //меняем ось движения для следующего вызова
    axis = (axis === 0)? 'y':'x';
    go(axis);
  }


  //пришли ли мы уже к пункту назначения
  function testPosition(){
    if ( a[0]===b[0] && a[1]===b[1] ) {
      console.log('Success! Shortest path found');
      console.log('perfectCity(departure, destination) = '+fullPath);
      // console.log('******Координаты пути*******');
     // console.log(path);
      return true;
    }else{
      //console.log('Текущие координаты '+path[path.length-1]);
      return false;
    }
  }


  //сохранить координаты точки
  function savePath(x, y){
    path[path.length] = 'x:'+x+'  y:'+y;
  }


  //поиск пути
  (function pathSearch(){
    if (fractionA[0]>0 && fractionA[1]>0) {
      //console.log('Error! at least one coordinate of each point must be an integer ');
      return;
    }else if(fractionB[0]>0 && fractionB[1]>0) {
     // console.log('Error! at least one coordinate of each point must be an integer');
      return;
    }
    
    fractionA[1] = a[1] - Math.floor(a[1]);
    if (fractionA[1]>0) {
      //в таком случае мы пока что не можим двигаться по х
      //console.log('вызываю go(y)'+fullStamp);
      go('y');
    }else{
      //console.log('вызываю go(x)'+fullStamp);
      go('x');
    } 
  })();


})();