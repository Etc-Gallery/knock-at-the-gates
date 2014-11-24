
DAB.interludes.push(new DAB.Interlude({



  wrapper: $('#how-we-kill'),
  url: '/how-we-kill.json',
  path: '/how-we-kill',
  title: 'How We Kill',
  subtitle: 'Methods of Execution from 1776 to 2014',



  activate: function () {
    this.svg.select('g.guts').attr('filter', '');
  },
  deactivate: function () {
    this.svg.select('g.guts').attr('filter', '');
    this.svg.select('g.guts').attr('filter', 'url(#how-we-kill-blur)');
    this.removeFauxGif();
  },



  build: function (data) {



    var that = this;

    that.createSharedElements();


    var defs = that.svg.append('defs');
    var filter = defs.append('filter').attr('id', 'how-we-kill-blur');
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
    that.svg.select('g.guts').attr('filter', 'url(#how-we-kill-blur)');



    var createLegend = function (el) {
      el.append('<table class="legend"></table>');
      _.each(methods, function (method) {
        el.find('table.legend').append(
          '<tr>' +
            '<td style="background-color:' + c(method) + ';" class="colorblock"></td>' +
            '<td>' + method + '</td>' +
          '</tr>'
        );
      });
    };
    createLegend(that.el);


    var isSuperSmall = function () {
      return $(window).width() <= 640 ? true : false;
    }
    var years = [];
    var ticks = [];
    for (var i = 1776; i <= 2014; i++) {
      years.push(i + '');
      var spacer = isSuperSmall ? 25 : 10;
      if ((i - 1776) % spacer === 0) {
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



    var isSmall = function () {
      return $(window).width() <= 1300 ? true : false;
    };
    var generateFauxGif = function () {

      $('body').append(
        '<div class="how-we-kill-gifs">' +
          '<button class="x"></button>' +
          '<div class="svgs-wrapper">' +
            '<h1 class="year"></h1>' +
          '</div>' +
          '<nav>' +
            '<button class="rewind">step back</button>' +
            '<button class="pause-play"><span class="pause">pause</span><span class="play">play</span></button>' +
            '<button class="fast-forward">step forward</button>' +
          '</nav>' +
          '<p class="explanation">In this chart, each year displays the ten previous years&rsquo; data, excluding the decade-long moratorium. You can use the controls below to step through time or simply watch it play.' +
        '</div>'
      );
      createLegend($('.how-we-kill-gifs'));

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

      var r = isSmall() ? 160 : 320;

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
            'start': i - 9 - 1776,
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

        var svg = d3.select($('.how-we-kill-gifs .svgs-wrapper')[0]).append('svg').attr('class', 'pie-svg')
          .data([datum.counts])
          .attr('width', r * 2).attr('height', r * 2)
          .append('g')
          .attr('transform', 'translate(' + r + ',' + r + ')');

        var arc = d3.svg.arc().outerRadius(r).innerRadius(r * (3 / 8));
        var pie = d3.layout.pie()
          .sort(function (a, b) { colorIndex[a.method] > colorIndex[b.method] ? 1 : -1 })
          .value(function (d) { return d.count });


        var arcs = svg.selectAll('g.slice').data(pie).enter().append('g').attr('class', 'slice');
        var paths = arcs.append('path')
          .attr('fill', function (d, i) { return c(methods[i]); })
          .attr('d', arc);

      });

      var index = 0;
      var svgs = d3.select('.how-we-kill-gifs').selectAll('svg');
      var h1   = d3.select('.how-we-kill-gifs').select('h1.year');
      var gifTimer;
      var run = function () {
        gifTimer = setInterval(function () {
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
              h1.text(datas[i].end);
            }
          });
        }, 120);
      };
      run();

      setTimeout(function () {
        $('.how-we-kill-gifs').addClass('active');
        $('.how-we-kill-gifs .pause-play').on('click', function () {
          if ($(this).parent().hasClass('paused')) {
            run();
          } else {
            clearInterval(gifTimer);
          }
          $(this).parent().toggleClass('paused');
        });
        $('.how-we-kill-gifs .rewind').on('click', function () {
          if (!$(this).parent().hasClass('paused')) {
            $(this).parent().toggleClass('paused');
          }
          clearInterval(gifTimer);
          index--;
          if (index < 0) {
            index = svgs[0].length;
          }
          svgs.classed('active', false);
          svgs.each(function (d, i) {
            if (i === index) {
              d3.select(this).classed('active', true);
              h1.text(datas[i].end);
            }
          });
        });
        $('.how-we-kill-gifs .fast-forward').on('click', function () {
          if (!$(this).parent().hasClass('paused')) {
            $(this).parent().toggleClass('paused');
          }
          clearInterval(gifTimer);
          index++;
          if (index > svgs[0].length) {
            index = 0;
          }
          svgs.classed('active', false);
          svgs.each(function (d, i) {
            if (i === index) {
              d3.select(this).classed('active', true);
              h1.text(datas[i].end);
            }
          });
        });
        that.el.find('.legend').addClass('hidden');
        $('.how-we-kill-gifs .x').on('click', that.removeFauxGif);
      }, 1000);
    };

    that.removeFauxGif = function () {
      $('.how-we-kill-gifs').removeClass('active');
      rects
        .transition()
        .duration(500)
        .attr('height', function (d) { return y(d.y0) - y(d.y0 + d.y); })
        .attr('y', function (d) { return y(d.y0 + d.y); })
      rects
        .transition()
        .delay(500)
        .duration(500)
        .attr('width', function (d) { return x.rangeBand() });
      that.el.find('.legend').removeClass('hidden');
      setTimeout(function () {
        $('.how-we-kill-gifs').remove();
      }, 500);
    };


    that.el.append('<button class="how-we-kill-button faux-gif-button">Step through time</button>');
    that.el.find('.faux-gif-button').on('click', generateFauxGif);


  }





}));
