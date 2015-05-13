// var config = {
//   host: '10.211.55.3',
//   port: 8080,
//   isSecure: false
// };

var config = {
  host: '52.11.126.107/peportal',
  isSecure: false
};

var senseApp;

qsocks.Connect(config).then(function(global){
  global.openDoc('0d7f85c2-fbf0-4964-9d6d-0a8804672c2f').then(render, function(error) {
      if (error.code == '1002') { //app already opened on server
          global.getActiveDoc().then(render);
      } else {
          console.log(error)
      }
  });
});

var objects = {};

function render(app){
  console.log(app);
  senseApp = app;
  //if the url contains additional parameters then we need to use them to make a selection on the data
  var query = window.location.search.substring(1);
  if(query){
    query = query.split('=');
    var lbDef = {
      qInfo:{
        qType: 'ListObject'
      },
      qListObjectDef:{
        qStateName: '$',
        qDef:{
          qFieldDefs:[query[0]]
        }
      }
    };
    app.createSessionObject(lbDef).then(function(response){
      var lb = new qsocks.GenericObject(response.connection, response.handle);
      lb.selectListObjectValues('/qListObjectDef', [parseInt(query[1])], true, false).then(function(response){

      });
    });


  }

  //list page
  $('[data-object]').each(function(){
    var that = this;
    if($(that).attr('data-field')){
      var lbDef = {
        qInfo:{
          qType: 'ListObject'
        },
        qListObjectDef:{
          qStateName: '$',
          qDef:{
            qFieldDefs:[$(that).attr('data-field')]
          }
        }
      };
      app.createSessionObject(lbDef).then(function(response){
        $(that).attr('data-handle', response.handle);
        objects[response.handle] = new qsocks.GenericObject(response.connection, response.handle);
        renderObject(response.handle, $(that).attr('data-object'));
      });
    }
    else{
      app.getObject($(that).attr('data-id')).then(function(response){
        console.log(response);
        $(that).attr('data-handle', response.handle);
        objects[response.handle] = new qsocks.GenericObject(response.connection, response.handle);
        renderObject(response.handle, $(that).attr('data-object'));
      });
    }
  });

  //detail page

}

$('.filter').on('click', 'li', function(event){
  var handle = $(this).parents('.filter').attr('data-handle');
  objects[handle].selectListObjectValues('/qListObjectDef', [parseInt($(this).attr('data-elem'))], true, false).then(function(response){
    console.log(response)
    $('[data-object]').each(function(){
      renderObject($(this).attr('data-handle'), $(this).attr('data-object'))
    });
  });
});

$('.table').on('click','li', function(event){
  var qElemNumber = $(this).attr('data-elem');
});

$('.clear-selections').on('click', function(event){
  senseApp.clearAll().then(function(){
    $('[data-object]').each(function(){
      renderObject($(this).attr('data-handle'), $(this).attr('data-object'))
    });
  });
});

function renderObject(handle, objectType){
  var templateUrl = objectType=='listbox'||objectType=='session-listbox' ? '/templates/filter.html' : '/templates/table.html'
  Handlebars.registerHelper('compareLabel', function(index, name, options){
    if(options.data.root.labels[index].qGroupFieldDefs[0]==name){
      return options.fn(this);
    }
    else{
      return options.inverse(this);
    }
  });
  $.get(templateUrl).success(function(html){
    objects[handle].getLayout().then(function(layout){
      console.log(layout);
      switch(objectType){
        case 'listbox':
        case 'session-listbox':
          objects[handle].getListObjectData('/qListObjectDef', [{qTop:0, qLeft:0, qHeight:layout.qListObject.qSize.qcy, qWidth: 1 }]).then(function(data){
            console.log(data);
            var template = Handlebars.compile(html);
            $("[data-handle="+handle+"]").html(template({title: $("[data-handle="+handle+"]").attr('data-title') , items:data[0].qMatrix}));
          });
          break;
        case 'table':
          objects[handle].getHyperCubeData('/qHyperCubeDef', [{qTop:0, qLeft:0, qHeight:layout.qHyperCube.qSize.qcy, qWidth: layout.qHyperCube.qSize.qcx }]).then(function(data){
            console.log(data);
            var template = Handlebars.compile(html);
            $("[data-handle="+handle+"]").html(template({title: layout.title , labels: layout.qHyperCube.qDimensionInfo, rows:data[0].qMatrix, hyperlink:$("[data-handle="+handle+"]").attr('data-hyperlink')}));
          });
          break;
        case 'text':
          objects[handle].getListObjectData('/qListObjectDef', [{qTop:0, qLeft:0, qHeight:layout.qListObject.qSize.qcy, qWidth: 1 }]).then(function(data){
            console.log(data);
            $("[data-handle="+handle+"]").html(getSelectedOrAvailable(data[0].qMatrix).toString());
          });
          break;
      }
    });
  });
}

function getSelectedOrAvailable(matrix){
  var data=[];
  $(matrix).each(function(index, item){
    if(item[0].qState=="S"||item[0].qState=="O"){
      data.push(item[0].qText);
    }
  });
  return data;
}
