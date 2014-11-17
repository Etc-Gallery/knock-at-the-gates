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
      bottom: 88,
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



    var generateFauxGif = function () {
      that.el.append(
        '<div class="gifs">' +
          '<h1></h1>' +
        '</div>'
      );


      rects
        .transition()
        .duration(500)
        .attr('width', 1);
      rects
        .transition()
        .delay(500)
        .duration(500)
        .attr('height', 0)
        .attr('y', sizes.height);

      var r = 320;

      /*var plans = [
        { 'start': 0, 'end': 50 },
        { 'start': 50, 'end': 100 },
        { 'start': 100, 'end': 150 },
        { 'start': 150, 'end': 200 },
        { 'start': 200, 'end': 239 }
      ];*/
      var plans = [];
      for (var i = 1776; i < 2014; i += 1) {
        if (i >= 1968 && i <= 1976) {

        } else {
          plans.push({
            'start': i - 1776,
            'end': (i + 1) - 1776
          });        
        }
      }
      var datas = [];
      _.each(plans, function (plan, i) {
        var counts = [];
        _.each(data, function (methodArray, j) {
          var count = 0;
          var method = methodArray[0].method;
          for (var k = plan.start; k < plan.end; k++) {
            if (methodArray[k]) {
              count += methodArray[k].y;  
            }
          }
          counts.push({'method': method, 'count': count});
        });
        datas.push({
          'start': plan.start + 1776,
          'end': plan.end + 1776,
          'counts': counts
        });
      });


      _.each(datas, function (datum) {

        var svg = d3.select(that.el.find('.gifs')[0]).append('svg').attr('class', 'pie-svg')
          .data([datum.counts])
          .attr('width', r * 2).attr('height', r * 2)
          .append('g')
          .attr('transform', 'translate(' + r + ',' + r + ')');

        var arc = d3.svg.arc().outerRadius(r).innerRadius(r * (7 / 8));
        var pie = d3.layout.pie()
          .sort(function (a, b) { colorIndex[a.method] > colorIndex[b.method] ? 1 : -1 })
          .value(function (d) { return d.count });


        var arcs = svg.selectAll('g.slice').data(pie).enter().append('g').attr('class', 'slice');
        var paths = arcs.append('path')
          .attr('fill', function (d, i) { return c(methods[i]); })
          .attr('d', arc);

      });


      var index = 0;
      var svgs = d3.select(that.el[0]).select('.gifs').selectAll('svg');
      var h1   = d3.select(that.el[0]).select('.gifs').select('h1');
      var run = function () {
        var gifTimer = setInterval(function () {
          index++;
          if (index > svgs[0].length) {
            index = 0;
            clearInterval(gifTimer);
            setTimeout(run, 1000);
          }
          svgs.classed('active', false);
          svgs.each(function (d, i) {
            if (i === index) {
              d3.select(this).classed('active', true);
              h1.text(d3.select(this).datum().start);
            }
          });
        }, 300);     
      };
      run();

      that.el.find('.gifs').addClass('active');
  
    };


    that.el.append('<button class="the-changing-face-button faux-gif-button">Step through time</button>');
    that.el.find('.faux-gif-button').on('click', generateFauxGif);


  }





}));