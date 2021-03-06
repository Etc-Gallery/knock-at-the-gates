DAB.interludes.push(new DAB.Interlude({

  el: $('#last-words'),


  url: 'last-words.json',

  path: '/last-words',

  title: 'Last Words',
  subtitle: 'Final Statements of the Condemned in Texas',


  activate: function () {
    d3.selectAll('g.bubble-wrapper').attr('filter', '');
  },

  deactivate: function () {
    d3.selectAll('g.bubble-wrapper').attr('filter', '');
    d3.selectAll('g.bubble-wrapper').attr('filter', 'url(#last-words-blur)');
  },

  build: function (data) {
    var that = this;

    $('.words-overlay').remove();
    $('body').append(
      '<div class="words-overlay">' +
        '<div class="words">' +
          '<h1></h1>' +
          '<div class="statement"></div>' +
        '</div>' +
      '</div>'
    );

    that.createSharedElements();

    var paragraphize = function (input) {
      input = '<p>' + input + '</p>';
      input.replace(/<br \/>/g, '</p><p>');
      return input;
    };

    var data = {
      "name": "words",
      "children": data
    };

    var pack = d3.layout.pack()
      .sort(null)
      .size([that.el.width(), that.el.height()])
      .value(function (d) { return d.count; });

    var nodes = pack.nodes(data);

    fontScaleRangeArray = ($(window).width() > 640 ? [8,60] : [6,20]);
    var fontScale = d3.scale.linear()
      .domain([
        d3.min(nodes[0].children, function (d) { return d.r; }),
        d3.max(nodes[0].children, function (d) { return d.r; })
      ])
      .range(fontScaleRangeArray);

    var defs = that.svg.append('defs');
    var filter = defs.append('filter').attr('id', 'last-words-blur');
    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 10);

    that.svg.selectAll('g.bubble-wrapper')
      .data(nodes)
      .enter()
      .append('g').attr('class', 'bubble-wrapper')
      .classed('parent', function (d) { return d.children ? true : false })
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
      .attr('filter', 'url(#last-words-blur)');

    var padding = ($(window).width() > 640 ? 3 : 1);
    that.svg.selectAll('g.bubble-wrapper')
      .append('circle')
      .classed('bubble', true)
      .attr('r', function (d) { return d.r - padding });

    that.svg.selectAll('g.bubble-wrapper')
      .append('text')
      .text(function (d) { return d.word; })
      .style('font-size', function (d) { return fontScale(d.r) })
      .attr('transform', function (d) {
        var yPosition = fontScale(d.r) / 4;
        return 'translate(0,' + yPosition + ')';
      });

    that.svg.selectAll('g.bubble-wrapper').on('click', function (d) {
      ga('send', 'event', 'word bubble', 'click', d.word);
      var openTime = Date.now();

      var d3el = d3.select(this);
      $('#main-content, #primary-header').addClass('blur');
      d3el.classed('active', true);
      $('.words-overlay').find('h1').text(d.name);
      $('.words-overlay').find('.statement').html(paragraphize(d.statement));
      $('.words-overlay').addClass('active');
      $('.words-overlay').on('click', function (e) {
        $(this).removeClass('active');
        var elapsed = Date.now() - openTime;
        ga('send', 'event', 'word bubble', 'closed', d.word, elapsed);
        d3el.classed('active', false);
        $('#main-content, #primary-header').removeClass('blur');
      });
    });

  }
}));
