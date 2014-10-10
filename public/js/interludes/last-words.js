DAB.interludes.push(new DAB.Interlude({

  el: $('#last-words-interlude'),


  url: 'last-words.json',


  title: 'Last Words',
  subtitle: 'Final Statements of the Condemned in Texas',


  build: function (data) {
    var that = this;

    $('body').append(
      '<div class="words-overlay">' +
        '<div class="words">' +
          '<h1></h1>' +
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

    var fontScale = d3.scale.linear()
      .domain([
        d3.min(nodes[0].children, function (d) { return d.r; }),
        d3.max(nodes[0].children, function (d) { return d.r; })
      ])
      .range([8,60]); // hardcoded for reasons passing understanding.

    that.svg.selectAll('g.bubble-wrapper')
      .data(nodes)
      .enter()
      .append('g').attr('class', 'bubble-wrapper')
      .classed('parent', function (d) { return d.children ? true : false })
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' });

    that.svg.selectAll('g.bubble-wrapper')
      .append('circle')
      .classed('bubble', true)
      .attr('r', function (d) { return d.r - 3 }); // hardcoded 3px padding.

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
      $('.words-overlay').find('.words').append(paragraphize(d.statement));
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
