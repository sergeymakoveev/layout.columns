$(function($){
    $.widget("mo.MultiColumnLayoutManager", {
        widgetEventPrefix: "MultiColumnLayoutManager",
        options: {
            duration:200
        },
        columns:{},
        dividers:{},

        _create: function(){
            console.log(this);
            /*$(window).unload(function(){
              window.sessionStorage.setItem([ths.namespace, this.widgetName].join('.'), ?????));
            });
            this.settings=
              $.parseJSON(window.sessionStorage.getItem([ths.namespace, this.widgetName].join('.')))||
              {columns:{}};
            */
            this.settings={columns:{}};
            this.element.find('>.panel').each(function(i, el){
              var id='mo.mcl-col-'+i;
              $(el)
                  .attr('id', id)
                  .data('width', $(el).width())
                  .data('width-default', $(el).width());
            });
            this.element.find('>.divider').MultiColumnLayoutDivider({parent:this});
        }
    });
    $.widget("mo.MultiColumnLayoutDivider", $.ui.mouse, {
        widgetEventPrefix: "MultiColumnLayoutDivider",
        options: {
            els:{},
            duration:200,
            min_width:10
        },

        _create: function() {
            console.log(this);
            this.buttons={
            left:this.element.find('.button.left')
                             .click($.proxy(function(){
                                var width = { prev:this.options.els.prevContainer.width(),
                                              next:this.options.els.nextContainer.width() };
                                this.options.els.prevContainer.animate(
                                    {width:width.prev?0:this.options.els.prevContainer.data('width')},
                                    {queue:false, duration:this.options.duration}
                                );
                              this.options.els.nextContainer.animate(
                                  {width:width.prev?
                                      (width.next+width.prev):
                                      (width.next-this.options.els.prevContainer.data('width'))},
                                  {
                                      queue:false, duration:this.options.duration,
                                      complete: $.proxy(function(){
                                          this.options.els.nextContainer[
                                              (this.options.els.nextContainer.width()?'remove':'add')+'Class'
                                          ]('collapse');
                                          this.options.els.prevContainer[
                                               (this.options.els.prevContainer.width()?'remove':'add')+'Class'
                                           ]('collapse');
                                      },this)
                                  }
                              );
                              this.options.els.wrapper.removeClass('drag');
                            },this)),
              right:this.element.find('.button.right')
                  .click($.proxy(function(){
                      var width={
                          prev:this.options.els.prevContainer.width(),
                          next:this.options.els.nextContainer.width()
                      };
                      this.options.els.nextContainer.animate(
                          {width:width.next?0:this.options.els.nextContainer.data('width')},
                          {queue:false, duration:this.options.duration}
                      );
                      this.options.els.prevContainer.animate(
                          {width:width.next?
                              (width.prev+width.next):
                              (width.prev-this.options.els.nextContainer.data('width'))},
                          {
                              queue:false, duration:this.options.duration,
                              complete: $.proxy(function(){
                                  this.options.els.nextContainer[
                                      (this.options.els.nextContainer.width()?'remove':'add')+'Class'
                                  ]('collapse');
                                  this.options.els.prevContainer[
                                      (this.options.els.prevContainer.width()?'remove':'add')+'Class'
                                  ]('collapse');
                              },this)
                          }
                      );
                      this.options.els.wrapper.removeClass('drag');
                  },this))
          };
          this.options.els.prevContainer=this.element.prev('.panel').first();
          this.options.els.nextContainer=this.element.next('.panel').first();
          this.options.els.wrapper=this.element.parent();
          this._mouseInit();
        },

      //_init: function() {},

        _mouseCapture: function(event) {
            this.pageX=event.pageX;
            this.dx=0;
            this.dx_skip=0;
            this.capture = {
                pageX:event.pageX,
                width:{
                  prev:this.options.els.prevContainer.width(),
                  next:this.options.els.nextContainer.width()
                }
            };
            this.options.els.wrapper.addClass('drag');
            return true;
        },

        _mouseDrag: function(event) {
            var dx = event.pageX-this.pageX,
                dw = event.pageX-this.capture.pageX;
            this.pageX=event.pageX;
            this.dx+=dx;

            var getColumn=function(cols){
                    return cols.filter(function(i, col){ return $(col).width()>0; })
                               .first();
                },
                columns={
                    prev:dx>0?
                        this.element.prev('.panel'):
                        getColumn(this.element.prevAll('.panel')),
                    next:dx>0?
                        getColumn(this.element.nextAll('.panel')):
                        this.element.next('.panel')
                };
            if(!columns.prev.size()||!columns.next.size())
                return;
            var width = { prev:columns.prev.width()+this.dx,
                          next:columns.next.width()-this.dx };

            if( width.next<this.options.min_width )
              { width.prev+=width.next; this.dx=-width.next; width.next=0; }
            else if( width.prev<this.options.min_width )
                   { width.next+=width.prev; this.dx=width.prev; width.prev=0; }
            //компенсация схлопывания (чтобы курсор не уходил с изначальной позиции относительно разделителя)
            else if( this.dx<0&&dx>0||this.dx>0&&dx<0 )
                     return;
            else this.dx=0;

            //console.log([dx, this.dx, width]);

            columns.prev.css({width:width.prev})
                        .data({width:width.prev});
            columns.next.css({width:width.next})
                        .data({width:width.next});

            width.prev>0?
                columns.prev.removeClass('collapse'):
                columns.prev.addClass('collapse');
            width.next>0?
                columns.next.removeClass('collapse'):
                columns.next.addClass('collapse');
      },

      _mouseStart: function(event){
          //console.log('_mouseStart');
      },

      _mouseStop: function(event){
          //console.log('_mouseStop');
          this.options.els.wrapper.removeClass('drag');
      }
    });

    $('#root.layout.wrapper > .wrapper').MultiColumnLayoutManager({qwerty:12345});

});