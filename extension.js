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
	let defaultBuildMode = 0;
	const enforceOutput = false;
	const executeOrder = ["","python3 -m ","python -m "];

	function tryExecuteCommand(command, success, idx = -1) {
		if (idx === -1) {
			tryExecuteCommand(command,success,defaultBuildMode);
			return;
		}
		console.log(`Trying command ${command} with ${executeOrder[idx]}`);
		child_process.exec(`${executeOrder[idx]}${command}`,(error, stdout, stderr) => {
			
			if (error) {
				if (idx + 1 < executeOrder.length) {
					output.appendLine(`error: ${error.message}. Attempting same command with ${executeOrder[idx]}`);
					tryExecuteCommand(command, success, idx + 1);
				} else {
					output.appendLine(`error: ${error.message}. No more ways to try.`);
				}
				return;
			}
			if (stderr) {
				if (idx + 1 < executeOrder.length) {
					output.appendLine(`error: ${error.message}. Attempting same command with ${executeOrder[idx]}`);
					tryExecuteCommand(command, success, idx + 1);
				} else {
					output.appendLine(`error: ${error.message}. No more ways to try.`);
				}
				return;
			}
			if (!(error || stderr)) {
				output.appendLine(stdout);
				success(stdout);
				defaultBuildMode = idx;
			}
		});
	}

	function checkPython() {
		const fn = vscode.window.activeTextEditor.document.fileName;
		if (!fn.endsWith(".py")) {
			vscode.window.showErrorMessage(`Error: the current document (${fn}) is not a Python file. Please make sure the cursor is in an active Python file, before trying that command again.`)
			return false;
		}
		return true;
	}

	function buildCurrentDocument(){
		if (!checkPython()) return;
		tryExecuteCommand("uflash \"" + vscode.window.activeTextEditor.document.fileName + "\"",(x) => {
			output.appendLine("Successfully built to Microbit");
		});
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
		if (!checkPython()) return;
		tryExecuteCommand("ufs put \"" + vscode.window.activeTextEditor.document.fileName + "\"",(x) => {
			output.appendLine("Successfully copied to Microbit");
		});
	}

	let putCommand = vscode.commands.registerCommand('extension.put', function(){
		ufsPutCommand();
		if (enforceOutput) output.show(true);
	});

	function ufsRm(filename){
		if (filename == "")
			return;
		tryExecuteCommand("ufs rm " + filename,() => {
			output.appendLine(`Deleted ${filename}`);
		});
	}

	function ufsRemoveFiles(files) {
		let filesList = files.split("\n");
		for (let i = 0; i < filesList.length; i++) {
			let file = filesList[i].trim();
			ufsRm(file);
		}
	}

	function ufsClear(){
		tryExecuteCommand("ufs ls",(x) => {
			output.appendLine(`Found files:\n ${x}`);
			ufsRemoveFiles(x);
		});
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
