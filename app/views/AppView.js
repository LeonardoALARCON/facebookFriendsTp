AppView = Backbone.View.extend({
  template: _.template($('#tmpl_friend').html()),
  statistics: _.template($('#templ_statistics').html()),

  events:{
    'keyup #search': 'search',
    'click #orderBy': 'order'
  },

  initialize: function(){
    this.listenTo(this.collection, 'reset', this.render.bind(this));
  },

  search: function(e){
    this.collection.filterByAnything(e.target.value);
  },
  
  order: function(e){
    if(e.target.checked){
      $('#search').val('');
      collection.sortByNumberFriends();
    }
    else{
      $('#search').val('');
      collection.trigger('reset', this.collection);
    }
  },

  render: function(friends){
    var $trombinoscope = this.$el.find('#trombinoscope');
    var $statistics = this.$el.find('#statistics');
    $trombinoscope.empty();
    $statistics.empty();

    $statistics.append($(this.statistics({
      hommes: friends.statistics().men,
      femmes: friends.statistics().women,
      countries: friends.topCountries(),
      friend_counter: friends.topFriendCounter()
    })));

    friends.forEach(function(friend, i){
      $trombinoscope.append($(this.template({
        pic: friend.get('pic'),
        last_name: friend.get('last_name'),
        first_name: friend.get('first_name'),
        friend_count: friend.get('friend_count'),
        date_naissance: friend.get('birthday_date'),
      })));
    }, this);
  }
});

