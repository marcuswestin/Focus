jsio.path.shared = 'js';
jsio.path.client = 'js';

jsio('from shared.javascript import bind');
jsio('import net');
jsio('import shared.itemFactory');

jsio('import client.dimensions as dimensions');
jsio('import client.events as events');
jsio('import client.css as css');

jsio('import client.Client');
jsio('import client.Drawer');
jsio('import client.panelManager');
jsio('import client.resizeManager');
jsio('import client.keystrokeManager');
jsio('import client.LabelCreator');

jsio('import client.overlay');

css.loadStyles('client.app');

gClient = new client.Client();
gDrawer = new client.Drawer();
gPanelManager = client.panelManager;
gCreateLabelFn = function() {
	var labelCreator = new client.LabelCreator(function(labelName){
		gDrawer.addLabel(labelName);
		client.overlay.hide();
	});
	client.keystrokeManager.requestFocus(function(){}, true);
	client.overlay.show(labelCreator.getElement());
}

gPanelManager.subscribe('PanelFocused', function(panel) {
	var item = panel.getItem();
	document.location.hash = '#/panel/' + item.getType() + '/' + item.getId();
})

gClient.connect(function(){

	document.body.appendChild(gPanelManager.getElement());
	document.body.appendChild(gDrawer.getElement());
	
	gDrawer.subscribe('LabelClick', bind(gPanelManager, 'showLabel'));
	client.resizeManager.onWindowResize(function(size) {
		var drawerSize = gDrawer.layout();
		gPanelManager.setOffset(drawerSize.width + 40);
		gPanelManager.layout({ width: size.width, height: size.height - 58 });
	});
	
	Meebo('addButton', { id: 'create-label', label: 'Create label', 
		icon: 'img/crystal/16/kdvi.png', onClick: gCreateLabelFn });

	Meebo('addButton', { id: 'create-item', label: 'Create item', 
		icon: 'img/crystal/16/new window.png', onClick: function() {
		var type = prompt('What type of item should I create? (user, bug)');
		gClient.createItem(type, bind(gPanelManager, 'showItem'));
	} });
	
	(function(){
		var parts = document.location.hash.substr(2).split('/')
		if (parts[0] == 'panel') {
			var item = shared.itemFactory.getItem(parts[2]);
			item.setType(parts[1]);
			gPanelManager.showItem(item);
		} else {
			gDrawer.focus();
		}
	})()
});

