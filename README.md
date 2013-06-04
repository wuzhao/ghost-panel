# Ghost Panel

---

固定在特定位置上，幽灵一样跟随页面的面板。运行于 [AraleJS](https://github.com/aralejs) 框架。

[Demo 示例](http://arale.alizoo.com/ghost-panel/examples/)

---


## 配置说明

### element `element`

跟随页面的面板的 jQuery 对象。

### relativeElement `element`

参照物，默认为浏览器窗口。

### horizontal `string`

水平位置，可输入 `left`|`right`|`center`，默认为 `center`。

### vertical `string`

垂直位置，可输入 `top`|`bottom`|`middle`，默认为 `middle`。

### horizontalMargin `number`

水平距离，整数时节点在参照物内部，负数时节点在参数外部。

### verticalMargin `number`

垂直距离，整数时节点在参照物内部，负数时节点在参数外部。

### hideRegion `object`

隐藏面板的滚动区域，有参数如下：

* top `number`可见区域离页面顶部距离。
* bottom `number`可见区域离页面底部距离。

### inner `boolean`

是否一直在窗口内，如果在窗口外则将节点迁移到窗口内。

### ie6Effect `string`

IE6 上的跟随效果，可输入 `fade`|`slide`，默认为 `fade`。


## 方法说明

### destory() 

销毁本对象，比如点击悬浮区域的 `[x]` 后无需再显示，可以销毁对象。


## 最佳实践

1. 让页面上的节点跟随浏览器窗口。

	```js
	seajs.use(['js/6v/lib/icbu/ghost-panel/ghost-panel.js'], function(GhostPanel) {
		new GhostPanel({
			element: '#notice',		// 跟随节点的 jQuery 对象
			horizontal: 'left',		// 水平在窗口左方
			vertical: 'top',		// 垂直在窗口上方
			horizontalMargin: 40,	// 离页面左边 40px
			verticalMargin: 30,		// 离页面顶部 20px
			hideRegion: {top: 200},	// 距页面顶部 200px 的地方, 跟随节点将被隐藏
			ie6Effect: 'slide'		// IE6 中滑动跟随
		}).render();
	});
	```

2. Widget 渲染方式。插入节点并跟随浏览器窗口，插入一直显示在页面右下方的 Go Top 链接。

	```html
	<a href="#" data-widget="js/6v/lib/icbu/ghost-panel/ghost-panel.js" data-relative-element="#container" data-horizontal="right" data-vertical="bottom" data-horizontal-margin="20" data-vertical-margin="20" data-hide-region="{'top':100}">Go Top</a>
	```

3. 插入悬浮提示区，点击 `[x]` 后销毁对象。

	```js
	seajs.use(['$', 'js/6v/lib/icbu/ghost-panel/ghost-panel.js'], function($, GhostPanel) {

		// 创建悬浮提示区
		var notice = $('<div id="notice">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>');

		// 添加关闭按钮
		var close = $('<a class="close">[x]</a>');
		close.appendTo(notice);

		// 使用 GhostPanel 管理悬浮提示区
		var ghostPanel = new GhostPanel({
			element: notice,		// 跟随节点的悬浮提示区
			horizontal: 'center',	// 水平在窗口居中
			vertical: 'middle',		// 垂直在窗口居中
		});

		// 点击 [x] 时销毁 GhostPanel 对象
		close.click(function(ev) {
			ev.preventDefault();	// 阻止默认事件
			notice.remove();		// 移除悬浮提示区
			ghostPanel.destory();	// 销毁 GhostPanel 对象
		}).render();

	});
	```
