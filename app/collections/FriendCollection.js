FriendCollection = Backbone.Collection.extend({
  model: FriendModel,

  initialize: function(){
  },
  /**
  * This method searches in the list of friends the
  * proprertys sent, it searches each property separated
  * by a comma. Par exemple if the query is: "David 1990"
  * it returns all the friends that has or David or 1990
  * as values.
  **/
  filterByAnything: function(values){
    var friends = new Array();
    values.trim().split(" ").forEach(function(value){
       friends = friends.concat(this.filter(function(friend){
        return friend.get('first_name').toLowerCase().indexOf(value.toLowerCase()) !== -1;
      }));
      friends = friends.concat(this.filter(function(friend){
        return friend.get('last_name').toLowerCase().indexOf(value) !== -1;
      }));

      friends = friends.concat(this.filter(function(friend){
        if(friend.get('birthday_date')!= null)
          return friend.get('birthday_date').indexOf(value) !== -1;
        else 
          return false;
      }));
      friends = friends.concat(this.filter(function(friend){
        if(friend.get('current_location') != null)
          return friend.get('current_location').city.toLowerCase().indexOf(value) !== -1;
        else
          return false;
      }));
      friends = friends.concat(this.filter(function(friend){
        if(friend.get('relationship_status') != null)
          return friend.get('relationship_status').toLowerCase().indexOf(value) !== -1;
        else
          return false;
      }));
    }, this);
    this.trigger('reset', new FriendCollection(friends));
  },
  
  sortByNumberFriends: function(){
   this.trigger ('reset', new FriendCollection(this.sortBy(function(model){return parseInt(model.get('friend_count') || 0, 10);}).reverse() )) ;
  },

  statistics: function(){
    var stats={
      men: this.filter(function(friend){
            return friend.get('sex') == "male";
           }).length,
      women: this.filter(function(friend){
               return friend.get('sex') == "female";
             }).length,
    }
    return stats;
  },

  topCountries: function(){
    var countries= new Array();
    var countryString = "";
    this.forEach(function(friend){
      if(friend.get('current_location') != null){
        var country = friend.get('current_location').country;
        var flag = false;
        countries.forEach(function(value){
          if(value.country == country){
            value.count++;
            flag = true;
          }
        });
        if(!flag)
          countries.push({country: country, count: 1});
      }
    });
    countries.sort(function(a,b){return b.count-a.count});
    console.log(countries);
    for(var i = 0; i < 5 && i < countries.length; i++){
      countryString += "<li>" + countries[i].country + " : " + countries[i].count + "</li>";
    }
    return countryString;
    
  },

  topFriendCounter: function(){
    var friendString = "";
    var friends = this.sortBy(function(model){
      return parseInt(model.get('mutual_friend_count'), 10);
    }).reverse();
    console.log(friends);
    for(var i = 0; i < 5 && i < friends.length; i++){
      friendString += "<li>" + friends[i].get('first_name') + " " 
      + friends[i].get('last_name') + " : " + friends[i].get('mutual_friend_count') + "</li>";
    }
    return friendString;
  }

});

