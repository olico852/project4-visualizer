jQuery(document).ready(function ($) {
var socket = io() // socket between front and back end of dashboard

var usersData

socket.on('connect', function () {
  console.log('Connected!')
})

socket.on('usersUpdate', function (usersDataSocket) {
  usersData = usersDataSocket
  var timestamp = new Date()
  $('.time').hide().text('Last updated: ' + timestamp).fadeIn('slow')
  if ($('#userposts')) {
    d3.select('#userposts').remove()
    d3.select('#usersPostsGraphRate').remove()
    $('#postsfigure').text('')
    usersPostsGraphGenerate()
  } else {
    usersPostsGraphGenerate()
  }

  if ($('#usercomments')) {
    d3.select('#usercomments').remove()
    d3.select('#userCommentsGraphRate').remove()
    $('#commentsfigure').text('')
    commentGraphGenerate()
  } else {
    commentGraphGenerate()
  }
})

function usersPostsGraphGenerate () {
  // calc avg article posts/user, total posts and users
  var postsCount = 0
  usersData.forEach(function (val) {
    postsCount += val.posts.length
    return postsCount
  })

  var calc = (postsCount / usersData.length).toFixed(2)

  $('#usersfigure').text(usersData.length)
  $('#postsfigure').text(postsCount)
  $('#userPostsGraph').append('<h5 id="usersPostsGraphRate" class="title"> Posts/User: ' + calc + '</h5>')

  // setting dimensions of canvas
  var margin = { top: 20, right: 20, bottom: 70, left: 40 }
  var width = (600 - margin.left - margin.right)
  var height = (350 - margin.top - margin.bottom)

  // setting the ranges
  var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.5)

  var y = d3.scale.linear().range([height, 0])

  // define the axis
  var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')

  var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .ticks(10)

  var usersdatasvg = d3.select('#userPostsGraph').append('svg')
          .attr('id', 'userposts')
          .attr('height', height + margin.top + margin.bottom)
          .attr('width', width + margin.left + margin.right)
      .append('g')
          .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')')

  usersData.forEach(function (d) {
    d.name.firstname = d.name.firstname
    d.posts.length = d.posts.length
    d.role = d.role
  })

  // scaling range of data
  x.domain(usersData.map(function (d) { return d.name.firstname }))
  y.domain([0, d3.max(usersData, function (d) { return d.posts.length })])

  // creating tips to show number of posts created & roles
  var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function (d) {
            return '<strong>Author is a </strong> <span style="color:red">' + d.role + '</span> <br>' +
            '<strong>Written:</strong> <span style="color:red">' + d.posts.length + ' posts</span>'
          })

  usersdatasvg.call(tip)

  // add axis
  usersdatasvg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)
      .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '-.55em')
          .attr('transform', 'rotate(-90)')

  usersdatasvg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
      .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 5)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Article Posting Frequency')

  // add bars
  usersdatasvg.selectAll('bar')
          .data(usersData)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', function (d) { return x(d.name.firstname) })
          .attr('width', x.rangeBand())
          .attr('y', function (d) { return y(d.posts.length) })
          .attr('height', function (d) { return height - y(d.posts.length) })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
}

function commentGraphGenerate () {
  // calc rate of comment posts
  var commentCount = 0
  usersData.forEach(function (object) {
    commentCount += object.comments.length
    return commentCount
  })
  var calc = (commentCount / usersData.length).toFixed(2)

  $('#commentsfigure').text(commentCount)
  $('#userCommentsGraph').append('<h5 id="userCommentsGraphRate" class="title"> Comments/User: ' + calc + '</h5>')

  // setting dimensions of canvas
  var margin = { top: 20, right: 20, bottom: 70, left: 40 }
  var width = (600 - margin.left - margin.right)
  var height = (350 - margin.top - margin.bottom)

  // setting the ranges
  var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05)

  var y = d3.scale.linear().range([height, 0])

  // define the axis
  var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')

  var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .ticks(10)

  var usersdatasvg = d3.select('#userCommentsGraph').append('svg')
          .attr('id', 'usercomments')
          .attr('height', height + margin.top + margin.bottom)
          .attr('width', width + margin.left + margin.right)
      .append('g')
          .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')')

  usersData.forEach(function (d) {
    d.name.firstname = d.name.firstname
    d.comments.length = d.comments.length
  })

  // creating tips to show number of posts created & roles
  var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function (d) {
            return '<strong>Posted: </strong> <span style="color:red">' + d.comments.length + ' comments</span>'
          })

  usersdatasvg.call(tip)

  // scaling range of data
  x.domain(usersData.map(function (d) { return d.name.firstname }))
  y.domain([0, d3.max(usersData, function (d) { return d.comments.length })])

  // add axis
  usersdatasvg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis)
      .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '-.55em')
          .attr('transform', 'rotate(-90)')

  usersdatasvg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
      .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 5)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Commenting Frequency')

  // add bars
  usersdatasvg.selectAll('bar')
          .data(usersData)
      .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', function (d) { return x(d.name.firstname) })
          .attr('width', x.rangeBand())
          .attr('y', function (d) { return y(d.comments.length) })
          .attr('height', function (d) { return height - y(d.comments.length) })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
}
})

/* don't need this any longer as server would have resolved async issue(*/
/* this is used when you want to use d3 to get files on your behalf which i am not doing */
// d3.queue(5)
//   // .defer(usersData)
//   .defer(postsData)
//   // .defer(repliesData)
//   // .defer(guestInteractionData)
//   // .defer(userInteractionData)
//   .awaitAll(ready)
