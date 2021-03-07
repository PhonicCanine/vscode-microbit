const vscode = require('vscode');
const child_process = require('child_process');
const rimraf = require("rimraf");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let output = vscode.window.createOutputChannel("MicroBuild");
	let defaultFallbackBuild = false;
	const enforceOutput = false;
	function buildCurrentDocument(){

		console.log(vscode.window.activeTextEditor.document.fileName);

		function python3Func() {
			child_process.exec("python3 -m uflash \"" + vscode.window.activeTextEditor.document.fileName + "\"", (error, stdout, stderr) => {
			
				if (error) {
					console.log();
					output.appendLine(`error: ${error.message}.`);
					return;
				}
				if (stderr) {
					output.appendLine(`error: ${error.message}.`);
					return;
				}
				if (!(error || stderr)) {
					output.appendLine(stdout);
					output.appendLine("Successfully built to Microbit");
					defaultFallbackBuild = true;
				}
			});
		}

		if (!defaultFallbackBuild) {
			child_process.exec("uflash \"" + vscode.window.activeTextEditor.document.fileName + "\"", (error, stdout, stderr) => {
				
				if (error) {
					console.log();
					output.appendLine(`error: ${error.message}. Trying again with Python3.`);
					python3Func();
					return;
				}
				if (stderr) {
					output.appendLine(`error: ${error.message}. Trying again with Python3.`);
					python3Func();
					return;
				}
				if (!(error || stderr)) {
					output.appendLine(stdout);
					output.appendLine("Successfully built to Microbit");
				}
			});
		} else {
			python3Func();
		}
		
	}

	let buildCommand = vscode.commands.registerCommand('extension.build', function () {
		buildCurrentDocument();
		if (enforceOutput) output.show(true);
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
		} else {
			
			rimraf("microbit", (err) => {
				if (err) {
					output.appendLine(`Error -- Could not delete existing folder ${err}`);
				} else {
					output.appendLine("Deleted existing microbit folder");
					t.sendText("git clone https://github.com/PhonicCanine/microbit.git");
				}
			});
			
			
		}

	}

	let getCommand = vscode.commands.registerCommand('extension.get', function(){
		fetchMicrobitModule();
	});

	function ufsPutCommand(){
		console.log(vscode.window.activeTextEditor.document.fileName);

		function python3Func() {
			child_process.exec("python3 -m ufs put \"" + vscode.window.activeTextEditor.document.fileName + "\"", (error, stdout, stderr) => {
			
				if (error) {
					console.log();
					output.appendLine(`error: ${error.message}.`);
					return;
				}
				if (stderr) {
					output.appendLine(`error: ${error.message}.`);
					return;
				}
				if (!(error || stderr)) {
					output.appendLine(stdout);
					output.appendLine("Successfully copied to Microbit");
					defaultFallbackBuild = true;
				}
			});
		}

		if (!defaultFallbackBuild) {
			child_process.exec("ufs put \"" + vscode.window.activeTextEditor.document.fileName + "\"", (error, stdout, stderr) => {
				
				if (error) {
					console.log();
					output.appendLine(`error: ${error.message}. Trying again with Python3.`);
					python3Func();
					return;
				}
				if (stderr) {
					output.appendLine(`error: ${error.message}. Trying again with Python3.`);
					python3Func();
					return;
				}
				if (!(error || stderr)) {
					output.appendLine(stdout);
					output.appendLine("Successfully copied to Microbit");
				}
			});
		} else {
			python3Func();
		}
	}

	let putCommand = vscode.commands.registerCommand('extension.put', function(){
		ufsPutCommand();
		if (enforceOutput) output.show(true);
	});

	function ufsRm(filename){
		if (filename == "")
			return;

		function python3Func() {
			child_process.exec("python3 -m ufs rm " + filename, (error, stdout, stderr) => {
			
				if (error) {
					console.log();
					output.appendLine(`error: ${error.message}.`);
					return;
				}
				if (stderr) {
					output.appendLine(`error: ${error.message}.`);
					return;
				}
				if (!(error || stderr)) {
					defaultFallbackBuild = true;
					output.appendLine(`Deleted ${filename}`);
				}
			});
		}

		if (!defaultFallbackBuild) {
			child_process.exec("ufs rm " + filename, (error, stdout, stderr) => {
				
				if (error) {
					console.log();
					output.appendLine(`error: ${error.message}. Trying again with Python3.`);
					python3Func();
					return;
				}
				if (stderr) {
					output.appendLine(`error: ${error.message}. Trying again with Python3.`);
					python3Func();
					return;
				}
				if (!(error || stderr)) {
					output.appendLine(`Deleted ${filename}`);
				}
			});
		} else {
			python3Func();
		}
	}

	function ufsRemoveFiles(files) {
		let filesList = files.split("\n");
		for (let i = 0; i < filesList.length; i++) {
			let file = filesList[i].trim();
			ufsRm(file);
		}
	}

	function ufsClear(){
		function python3Func() {
			child_process.exec("python3 -m ufs ls", (error, stdout, stderr) => {
			
				if (error) {
					console.log();
					output.appendLine(`error: ${error.message}.`);
					return;
				}
				if (stderr) {
					output.appendLine(`error: ${error.message}.`);
					return;
				}
				if (!(error || stderr)) {
					defaultFallbackBuild = true;
					ufsRemoveFiles(stdout);
				}
			});
		}

		if (!defaultFallbackBuild) {
			child_process.exec("ufs ls", (error, stdout, stderr) => {
				
				if (error) {
					console.log();
					output.appendLine(`error: ${error.message}. Trying again with Python3.`);
					python3Func();
					return;
				}
				if (stderr) {
					output.appendLine(`error: ${error.message}. Trying again with Python3.`);
					python3Func();
					return;
				}
				if (!(error || stderr)) {
					ufsRemoveFiles(stdout);
				}
			});
		} else {
			python3Func();
		}
	}

	let clearCommand = vscode.commands.registerCommand('extension.clear', function(){
		ufsClear();
		if (enforceOutput) output.show(true);
	});

	context.subscriptions.push(buildCommand);
	context.subscriptions.push(getCommand);
	context.subscriptions.push(putCommand);
	context.subscriptions.push(clearCommand);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
