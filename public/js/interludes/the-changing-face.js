DAB.interludes.push(new DAB.Interlude({



  el: $('#the-changing-face'),
  url: '/the-changing-face.json',
  path: '/the-changing-face',
  title: 'The Changing Face of Executions',
  subtitle: 'Executions from 1776 to 2014',



  activate: function () {
    this.svg.select('g.guts').attr('filter', '');
  },
  deactivate: function () {
    this.svg.select('g.guts').attr('filter', '');
    this.svg.select('g.guts').attr('filter', 'url(#the-changing-face-blur)');    
  },



  build: function (data) {
    


    var that = this;



    that.createSharedElements();


    var defs = that.svg.append('defs');
    var filter = defs.append('filter').attr('id', 'the-changing-face-blur');
    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 10);



    var colorIndex = {
      'lethal injection': 0,
      'electrocution': 1,
      'gas chamber': 2,
      'firing squad': 3,
      'hanging': 4,
      'other': 5      
    };
    var methods = d3.keys(colorIndex);



    var c = d3.scale.ordinal()
      .domain([5,4,3,2,1,0])
      .range([
        'rgb(255,149,207)',
        'rgb(255,0,174)',
        'rgb(255,207,149)',
        'rgb(255,174,0)',
        'rgb(149,207,255)',
        'rgb(0,174,255)'       
      ]);



    var sizes = {
      width: that.el.width(),
      height: that.el.height(),
      top: 55,
      right: 44,
      bottom: 44,
      left: 44,
    }
    sizes.cwidth = sizes.width - sizes.left - sizes.right,
    sizes.cheight = that.el.height() - sizes.top - sizes.bottom
    var guts = that.svg.append('g').attr('class', 'guts')
      .attr('width', sizes.cwidth).attr('height', sizes.cheight)
      .attr('transform', 'translate(' + sizes.left + ',' + sizes.top + ')');
    that.svg.select('g.guts').attr('filter', 'url(#the-changing-face-blur)');



    var createLegend = function () {
      that.el.append('<table class="legend"></table>');
      _.each(methods, function (method) {
        that.el.find('table.legend').append(
          '<tr>' +
            '<td style="background-color:' + c(method) + ';" class="colorblock"></td>' +
            '<td>' + method + '</td>' +
          '</tr>'
        );
      });
    };
    createLegend();


    var years = [];
    var ticks = [];
    for (var i = 1776; i <= 2014; i++) {
      years.push(i + '');
      if ((i - 1776) % 10 === 0) {
        ticks.push(i + '');
      } else {
        ticks.push('');
      }
    }
    var x = d3.scale.ordinal().domain(years).rangeBands([0, sizes.cwidth])
    ,   y = d3.scale.linear().domain([200, 0]).range([0, sizes.cheight]);



    var xAxis = d3.svg.axis().scale(x).orient('bottom').tickValues(ticks);
    guts.append('g').attr('class', 'x-axis')
    guts.select('g.x-axis').call(xAxis).attr('transform', 'translate(0,' + sizes.cheight + ')');
    var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-sizes.cwidth)
    guts.append('g').attr('class', 'y-axis')
    guts.select('g.y-axis').call(yAxis);



    var stack = d3.layout.stack()
    var stackedData = stack(data);


    var groups = guts.selectAll('g.layer')
      .data(stackedData)
      .enter()
      .append('g').classed('layer', true);



    var rects = groups.selectAll('rect')
      .data(function (d) { return d; })
      .enter()
      .append('rect')
      .attr('x', function (d) { return x(d.x); })
      .attr('y', function (d) { return y(d.y0 + d.y); })
      .attr('height', function (d) { return y(d.y0) - y(d.y0 + d.y); })
      .attr('width', function (d) { return x.rangeBand() })
      .style('fill', function (d) { return c(d.method); });
  }





}));