## CSS-Unity

这个项目的目的是为了让开发者可以随意的写css，把属于一个类的css都写在一起。
然后由css-unity把所有的属性拆分，只要属性相同的就组成一个新的类，并把所有新的类名添加到对应的dom元素中。

这里在我在src 中放置了测试文件

路径说明
  server.js ---- css-unity的主文件
  basic  --- forKey.js ---object一个拓展文件
  src 这个文件夹里面放着原文件
  dist 输出文件


  问题1：css 优先级无法判断
  