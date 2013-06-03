# 幽灵面板

- order: 1

---
<style>
body{margin:0;padding:0;font-family:"微软雅黑";font-size:13px;}
#ghost-container{display:block;width:800px;height:2000px;margin:0 auto;background:#E6E6E6;z-index:999;}
.ghost-notice{visibility:hidden;position:absolute;padding:10px 15px;border:1px solid #DCC;line-height:1.65;background:#FFE;}
#notice-ie6{width:100px;}
</style>

## 代码调用

<div id="notice-ie6" class="ghost-notice">您正在使用 Internet Explorer 6 浏览网页，如果您 升级到 Internet Explorer 8 或 转换到另一款浏览器，可以获得更好的网站浏览体验。</div>

````js
seajs.use(['js/6v/lib/icbu/ghost-panel/ghost-panel.js'], function(GhostPanel) {
	new GhostPanel({
		element: '#notice-ie6',
		relativeElement: '#body-wrapper',
		horizontal: 'right',
		vertical: 'top',
		horizontalMargin: -20,
		verticalMargin: 20,
		hideRegion: {top: 300},
		ie6Effect: 'slide'
	}).render();
});
````

## Widget 渲染

````html
<div class="ghost-notice" data-widget="js/6v/lib/icbu/ghost-panel/ghost-panel.js" data-relative-element="#body-wrapper" data-horizontal="right" data-vertical="bottom" data-horizontal-margin="20" data-vertical-margin="20" data-hide-region="{'top':300, 'bottom':100}" data-inner="true">有人回复了你的评论</div>
````

页面底部全局的 Widget 渲染

````js
seajs.use(['js/6v/lib/arale/widget/widget.js'], function(Widget){
    Widget.autoRenderAll();
});
````

<div style="height:2000px;"></div>
