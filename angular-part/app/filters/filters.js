angular.module('filters', []).filter('user_attr_filter', function() {
    return function(input) {
      switch (input) {
        case 'email':
          return '邮箱';
          break;
        case 'name':
          return '用户名';
          break;
        case 'briefInto':
          return '个人简介';
          break;
        case 'school':
          return '学校';
          break;
        case 'city':
          return '城市';
          break;
        case 'age':
          return '年龄';
          break;
        case 'gender':
          return '性别';
          break;
        case null:
          return '未填写';
          break;
        default:
          return input;
          break;
      }
    };
  })
  .filter('peer_search_filter', function() {
    return function(input, tags) {
      var out = [];
      if (!tags) {
        return input;
      }
      var flag = false;
      angular.forEach(tags, function(tag) {
        if (tag) {
          flag = true;
        }
      });
      if (!flag) {
        return input;
      }

      //
      for (var i = 0; i < input.length; i++) {
        var peer = input[i];
        if (!peer.peer_tags) {
          continue;
        }
        for (var j = 0; j < peer.peer_tags.length; j++) {
          var tag = peer.peer_tags[j];
          if (tags[tag]) {
            out.push(peer);
            break;
          }
        }
      }
      return out;
    };
  })
  .filter('topic_search_filter', function() {
    return function(input, tags) {
      var out = [];
      if (!tags) {
        return input;
      }
      var flag = false;
      angular.forEach(tags, function(tag) {
        if (tag) {
          flag = true;
        }
      });
      if (!flag) {
        return input;
      }

      //
      for (var i = 0; i < input.length; i++) {
        var topic = input[i];
        if (!topic.topic_tags) {
          continue;
        }
        for (var j = 0; j < topic.topic_tags.length; j++) {
          var tag = topic.topic_tags[j];
          if (tags[tag]) {
            out.push(topic);
            break;
          }
        }
      }
      return out;
    };
  })
  .filter('peer_tags_translate', function() {
    return function(input) {
      switch (input) {
        case '1':
          return '学神';
          break;
        case '2':
          return '玩霸';
          break;
        case '3':
          return '创客';
          break;
        case '4':
          return '职咖';
          break;
        case '5':
          return '极客';
          break;
        case '6':
          return '文艺';
          break;
        default:
          return input;
          break;
      }
    };
  })
  .filter('topic_tags_translate', function() {
    return function(input) {
      switch (input) {
        case '1':
          return '职场秘籍';
          break;
        case '2':
          return '创业宝典';
          break;
        case '3':
          return '生活心得';
          break;
        case '4':
          return '技能传授';
          break;
        case '5':
          return '名校探索';
          break;
        case '6':
          return '前人指路';
          break;
        default:
          return input;
          break;
      }
    };
  });
