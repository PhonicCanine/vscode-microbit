const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "micro-bit" is now active!');

	function buildCurrentDocument(){

		var t;
		var defined = false;
		var terminalName = "MicroBuild";
		if (vscode.window.terminals.length != 0){
			for (var i = 0; i < vscode.window.terminals.length; i++){
				if (vscode.window.terminals[i].name == terminalName){
					t = vscode.window.terminals[i];
					defined = true;
					break;
				}
			}
			if (t === undefined && defined == false){
				t = vscode.window.createTerminal(terminalName);
			}
		} else {
			t = vscode.window.createTerminal(terminalName);
		}

		console.log(vscode.window.activeTextEditor.document.fileName);

		var text = "uflash \"" + vscode.window.activeTextEditor.document.fileName + "\"";
		console.log(text);

		t.sendText(text);

	}

	let buildCommand = vscode.commands.registerCommand('extension.build', function () {
		buildCurrentDocument();
	});

	function fetchMicrobitModule(){

		var t;
		var defined = false;
		var terminalName = "MicroBuild";
		if (vscode.window.terminals.length != 0){
			for (var i = 0; i < vscode.window.terminals.length; i++){
				if (vscode.window.terminals[i].name == terminalName){
					t = vscode.window.terminals[i];
					defined = true;
					break;
				}
			}
			if (t === undefined && defined == false){
				t = vscode.window.createTerminal(terminalName);
			}
		} else {
			t = vscode.window.createTerminal(terminalName);
		}

		console.log(vscode.window.activeTextEditor.document.fileName);
		var openFolders = vscode.workspace.workspaceFolders;
		
		if (openFolders.length == 0){
			vscode.window.showErrorMessage("Please open a folder before importing the micro:bit module")
		}else{
			
			t.sendText("rm -rf microbit")
			t.sendText("rd /s /q microbit")
			t.sendText("git clone https://github.com/PhonicCanine/microbit.git")
			
		}

	}

	let getCommand = vscode.commands.registerCommand('extension.get', function(){
		fetchMicrobitModule();
	})

	context.subscriptions.push(buildCommand);
	context.subscriptions.push(getCommand);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
