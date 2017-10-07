angular.module('myApp').factory('DataService', function($resource) {
  var factory = [];
  factory.peer_tags_translate = function(tag) {
    switch (tag) {
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
        return tag;
        break;
    }
  }
  factory.topic_tags_translate = function(tag) {
    switch (tag) {
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
        return tag;
        break;
    }
  }
  return factory;
});
