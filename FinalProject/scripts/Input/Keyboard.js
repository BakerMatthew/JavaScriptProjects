/* global Main */

//
// Keyboard input handling support
Main.input.Keyboard = function() {
	'use strict';
	var keys = {};
	var	keyRepeat = {};
	var	handlers = {};
	var	nextHandlerId = 0;
	var	that = {};

	//
	// Allows the client code to register a keyboard handler
	that.registerHandler = function(handler, key, repeat, rate, shootingDir, movementDir) {
		//
		// If no repeat rate was passed in, use a value of 0 so that no delay between
		// repeated keydown events occurs.
		if (rate === undefined) {
			rate = 0;
		}

		//
		// Each entry is an array of handlers to allow multiple handlers per keyboard input
		if (!handlers.hasOwnProperty(key)) {
			handlers[key] = [];
		}
		handlers[key].push({
			id: nextHandlerId,
			key: key,
			repeat: repeat,
			rate: rate,
			elapsedTime: rate,	// Initialize an initial elapsed time so the very first keypress will be valid
			handler: handler,
			shootingDir: shootingDir,
			movementDir: movementDir
		});

		nextHandlerId += 1;

		//
		// We return an handler id that client code must track if it is desired
		// to unregister the handler in the future.
		return handlers[key][handlers[key].length - 1].id;
	};

	//
	// Allows the client code to unregister a keyboard handler
	that.unregisterHandler = function(key, id) {
		var entry = 0;
		
		if (handlers.hasOwnProperty(key)) {
			for (entry = 0; entry < handlers[key].length; entry += 1) {
				if (handlers[key][entry].id === id) {
					handlers[key].splice(entry, 1);
					if (handlers[key].length === 0) {
						delete handlers[key];
					}
					break;
				}
			}
		}
	};

	//
	// Called when the 'keydown' event is fired from the browser.  During
	// this handler we record which key caused the event
	function keyDown(event) {
		if (handlers.hasOwnProperty(event.keyCode)) {
			if (handlers[event.keyCode][0].shootingDir != undefined) {
				Main.model.setShootingDir(handlers[event.keyCode][0].shootingDir);
			}
			if (handlers[event.keyCode][0].movementDir != undefined) {
				Main.model.setMovementDir(handlers[event.keyCode][0].movementDir);
			}
		}
		keys[event.keyCode] = event.timeStamp;
		//
		// Because we can continuously receive the keyDown event, check to
		// see if we already have this property.  If we do, we don't want to
		// overwrite the value that already exists.
		if (keyRepeat.hasOwnProperty(event.keyCode) === false) {
			keyRepeat[event.keyCode] = false;
		}
	}

	//
	// Called when the 'keyrelease' event is fired from the browser.  When
	// a key is released, we want to remove it from the set of keys currently
	// indicated as down
	function keyRelease(event) {
		if (handlers.hasOwnProperty(event.keyCode)) {
			if (handlers[event.keyCode][0].shootingDir != undefined) {
				Main.model.unsetShootingDir(handlers[event.keyCode][0].movementDir);
			}
			if (handlers[event.keyCode][0].movementDir != undefined) {
				Main.model.unsetMovementDir(handlers[event.keyCode][0].movementDir);
			}
		}
		delete keys[event.keyCode];
		delete keyRepeat[event.keyCode];
	}

	//
	// Allows the client to invoke all the handlers for the registered key/handlers
	that.update = function(timeDifference) {
		var key = 0;
		var	entry = null;
		var	event = null;
		var handle = null;

		for (handle in handlers) {
			if (handlers[handle][0].rate > 0) {
				handlers[handle][0].elapsedTime = Math.min(handlers[handle][0].rate, handlers[handle][0].elapsedTime + timeDifference);
			}
		}

		for (key in keys) {
			if (handlers.hasOwnProperty(key)) {
				for (entry = 0; entry < handlers[key].length; entry += 1) {
					event = handlers[key][entry];
					
					if (event.repeat === true) {
						//
						// Check the rate vs elapsed time for this key before invoking the handler
						if (event.elapsedTime >= event.rate) {
							if (event.rate > 0) {
								Main.assets['shooting-sound'].play();
							}
							event.handler(timeDifference);
							keyRepeat[key] = true;
							//
							// Reset the elapsed time, adding in any extra time beyond the repeat
							// rate that may have accumulated.
							event.elapsedTime = (event.elapsedTime - event.rate);
						}
					} else if (event.repeat === false && keyRepeat[key] === false) {
						event.handler(timeDifference);
						keyRepeat[key] = true;
					}
				}
			}
		}
	};

	window.addEventListener('keydown', keyDown);
	window.addEventListener('keyup', keyRelease);

	return that;
};

//
// Source: http://stackoverflow.com/questions/1465374/javascript-event-keycode-constants
Main.input.KeyEvent = (function() {
	'use strict';
	var that = {
		get DOM_VK_CANCEL() { return 3; },
		get DOM_VK_HELP() { return 6; },
		get DOM_VK_BACK_SPACE() { return 8; },
		get DOM_VK_TAB() { return 9; },
		get DOM_VK_CLEAR() { return 12; },
		get DOM_VK_RETURN() { return 13; },
		get DOM_VK_ENTER() { return 14; },
		get DOM_VK_SHIFT() { return 16; },
		get DOM_VK_CONTROL() { return 17; },
		get DOM_VK_ALT() { return 18; },
		get DOM_VK_PAUSE() { return 19; },
		get DOM_VK_CAPS_LOCK() { return 20; },
		get DOM_VK_ESCAPE() { return 27; },
		get DOM_VK_SPACE() { return 32; },
		get DOM_VK_PAGE_UP() { return 33; },
		get DOM_VK_PAGE_DOWN() { return 34; },
		get DOM_VK_END() { return 35; },
		get DOM_VK_HOME() { return 36; },
		get DOM_VK_LEFT() { return 37; },
		get DOM_VK_UP() { return 38; },
		get DOM_VK_RIGHT() { return 39; },
		get DOM_VK_DOWN() { return 40; },
		get DOM_VK_PRINTSCREEN() { return 44; },
		get DOM_VK_INSERT() { return 45; },
		get DOM_VK_DELETE() { return 46; },
		get DOM_VK_0() { return 48; },
		get DOM_VK_1() { return 49; },
		get DOM_VK_2() { return 50; },
		get DOM_VK_3() { return 51; },
		get DOM_VK_4() { return 52; },
		get DOM_VK_5() { return 53; },
		get DOM_VK_6() { return 54; },
		get DOM_VK_7() { return 55; },
		get DOM_VK_8() { return 56; },
		get DOM_VK_9() { return 57; },
		get DOM_VK_SEMICOLON() { return 59; },
		get DOM_VK_EQUALS() { return 61; },
		get DOM_VK_A() { return 65; },
		get DOM_VK_B() { return 66; },
		get DOM_VK_C() { return 67; },
		get DOM_VK_D() { return 68; },
		get DOM_VK_E() { return 69; },
		get DOM_VK_F() { return 70; },
		get DOM_VK_G() { return 71; },
		get DOM_VK_H() { return 72; },
		get DOM_VK_I() { return 73; },
		get DOM_VK_J() { return 74; },
		get DOM_VK_K() { return 75; },
		get DOM_VK_L() { return 76; },
		get DOM_VK_M() { return 77; },
		get DOM_VK_N() { return 78; },
		get DOM_VK_O() { return 79; },
		get DOM_VK_P() { return 80; },
		get DOM_VK_Q() { return 81; },
		get DOM_VK_R() { return 82; },
		get DOM_VK_S() { return 83; },
		get DOM_VK_T() { return 84; },
		get DOM_VK_U() { return 85; },
		get DOM_VK_V() { return 86; },
		get DOM_VK_W() { return 87; },
		get DOM_VK_X() { return 88; },
		get DOM_VK_Y() { return 89; },
		get DOM_VK_Z() { return 90; },
		get DOM_VK_CONTEXT_MENU() { return 93; },
		get DOM_VK_NUMPAD0() { return 96; },
		get DOM_VK_NUMPAD1() { return 97; },
		get DOM_VK_NUMPAD2() { return 98; },
		get DOM_VK_NUMPAD3() { return 99; },
		get DOM_VK_NUMPAD4() { return 100; },
		get DOM_VK_NUMPAD5() { return 101; },
		get DOM_VK_NUMPAD6() { return 102; },
		get DOM_VK_NUMPAD7() { return 103; },
		get DOM_VK_NUMPAD8() { return 104; },
		get DOM_VK_NUMPAD9() { return 105; },
		get DOM_VK_MULTIPLY() { return 106; },
		get DOM_VK_ADD() { return 107; },
		get DOM_VK_SEPARATOR() { return 108; },
		get DOM_VK_SUBTRACT() { return 109; },
		get DOM_VK_DECIMAL() { return 110; },
		get DOM_VK_DIVIDE() { return 111; },
		get DOM_VK_F1() { return 112; },
		get DOM_VK_F2() { return 113; },
		get DOM_VK_F3() { return 114; },
		get DOM_VK_F4() { return 115; },
		get DOM_VK_F5() { return 116; },
		get DOM_VK_F6() { return 117; },
		get DOM_VK_F7() { return 118; },
		get DOM_VK_F8() { return 119; },
		get DOM_VK_F9() { return 120; },
		get DOM_VK_F10() { return 121; },
		get DOM_VK_F11() { return 122; },
		get DOM_VK_F12() { return 123; },
		get DOM_VK_F13() { return 124; },
		get DOM_VK_F14() { return 125; },
		get DOM_VK_F15() { return 126; },
		get DOM_VK_F16() { return 127; },
		get DOM_VK_F17() { return 128; },
		get DOM_VK_F18() { return 129; },
		get DOM_VK_F19() { return 130; },
		get DOM_VK_F20() { return 131; },
		get DOM_VK_F21() { return 132; },
		get DOM_VK_F22() { return 133; },
		get DOM_VK_F23() { return 134; },
		get DOM_VK_F24() { return 135; },
		get DOM_VK_NUM_LOCK() { return 144; },
		get DOM_VK_SCROLL_LOCK() { return 145; },
		get DOM_VK_COMMA() { return 188; },
		get DOM_VK_PERIOD() { return 190; },
		get DOM_VK_SLASH() { return 191; },
		get DOM_VK_BACK_QUOTE() { return 192; },
		get DOM_VK_OPEN_BRACKET() { return 219; },
		get DOM_VK_BACK_SLASH() { return 220; },
		get DOM_VK_CLOSE_BRACKET() { return 221; },
		get DOM_VK_QUOTE() { return 222; },
		get DOM_VK_META() { return 224; }
	};

	return that;
}());

function getKeyEventText(key) {
	switch(key) {
		case 3:
			return 'Cancel';
			break;
		case 6:
			return 'Help';
			break;
		case 8:
			return 'Back Space';
			break;
		case 9:
			return 'Tab';
			break;
		case 12:
			return 'Clear';
			break;
		case 13:
			return 'Return';
			break;
		case 14:
			return 'Enter';
			break;
		case 16:
			return 'Shift';
			break;
		case 17:
			return 'Control';
			break;
		case 18:
			return 'Alt';
			break;
		case 19:
			return 'Pause';
			break;
		case 29:
			return 'Caps Lock';
			break;
		case 27:
			return 'Escape';
			break;
		case 32:
			return 'Space';
			break;
		case 33:
			return 'Page Up';
			break;
		case 34:
			return 'Page Down';
			break;
		case 35:
			return 'End';
			break;
		case 36:
			return 'Home';
			break;
		case 37:
			return 'Left Arrow';
			break;
		case 38:
			return 'Up Arrow';
			break;
		case 39:
			return 'Right Arrow';
			break;
		case 40:
			return 'Down Arrow';
			break;
		case 44:
			return 'Printscreen';
			break;
		case 45:
			return 'Insert';
			break;
		case 46:
			return 'Delete';
			break;
		case 48:
			return '0';
			break;
		case 49:
			return '1';
			break;
		case 50:
			return '2';
			break;
		case 51:
			return '3';
			break;
		case 52:
			return '4';
			break;
		case 53:
			return '5';
			break;
		case 54:
			return '6';
			break;
		case 55:
			return '7';
			break;
		case 56:
			return '8';
			break;
		case 57:
			return '9';
			break;
		case 59:
			return 'Semicolon';
			break;
		case 61:
			return 'Equals';
			break;
		case 65:
			return 'A';
			break;
		case 66:
			return 'B';
			break;
		case 67:
			return 'C';
			break;
		case 68:
			return 'D';
			break;
		case 69:
			return 'E';
			break;
		case 70:
			return 'F';
			break;
		case 71:
			return 'G';
			break;
		case 72:
			return 'H';
			break;
		case 73:
			return 'I';
			break;
		case 74:
			return 'J';
			break;
		case 75:
			return 'K';
			break;
		case 76:
			return 'L';
			break;
		case 77:
			return 'M';
			break;
		case 78:
			return 'N';
			break;
		case 79:
			return 'O';
			break;
		case 80:
			return 'P';
			break;
		case 81:
			return 'Q';
			break;
		case 82:
			return 'R';
			break;
		case 83:
			return 'S';
			break;
		case 84:
			return 'T';
			break;
		case 85:
			return 'U';
			break;
		case 86:
			return 'V';
			break;
		case 87:
			return 'W';
			break;
		case 88:
			return 'X';
			break;
		case 89:
			return 'Y';
			break;
		case 90:
			return 'Z';
			break;
		case 93:
			return 'Menu';
			break;
		case 96:
			return '0';
			break;
		case 97:
			return '1';
			break;
		case 98:
			return '2';
			break;
		case 99:
			return '3';
			break;
		case 100:
			return '4';
			break;
		case 101:
			return '5';
			break;
		case 102:
			return '6';
			break;
		case 103:
			return '7';
			break;
		case 104:
			return '8';
			break;
		case 105:
			return '9';
			break;
		case 106:
			return 'Multiply';
			break;
		case 107:
			return 'Add';
			break;
		case 108:
			return 'Separator';
			break;
		case 109:
			return 'Subtract';
			break;
		case 110:
			return 'Decimal';
			break;
		case 111:
			return 'Divide';
			break;
		case 112:
			return 'F1';
			break;
		case 113:
			return 'F2';
			break;
		case 114:
			return 'F3';
			break;
		case 115:
			return 'F4';
			break;
		case 116:
			return 'F5';
			break;
		case 117:
			return 'F6';
			break;
		case 118:
			return 'F7';
			break;
		case 119:
			return 'F8';
			break;
		case 120:
			return 'F9';
			break;
		case 121:
			return 'F10';
			break;
		case 122:
			return 'F11';
			break;
		case 123:
			return 'F12';
			break;
		case 124:
			return 'F13';
			break;
		case 125:
			return 'F14';
			break;
		case 126:
			return 'F15';
			break;
		case 127:
			return 'F16';
			break;
		case 128:
			return 'F17';
			break;
		case 129:
			return 'F18';
			break;
		case 130:
			return 'F19';
			break;
		case 131:
			return 'F20';
			break;
		case 132:
			return 'F21';
			break;
		case 133:
			return 'F22';
			break;
		case 134:
			return 'F23';
			break;
		case 135:
			return 'F24';
			break;
		case 144:
			return 'Num Lock';
			break;
		case 145:
			return 'Scroll Lock';
			break;
		case 188:
			return 'Comma';
			break;
		case 190:
			return 'Period';
			break;
		case 191:
			return 'Slash';
			break;
		case 192:
			return 'Back Quote';
			break;
		case 219:
			return 'Open Bracket';
			break;
		case 220:
			return 'Back Slash';
			break;
		case 221:
			return 'Close Bracket';
			break;
		case 222:
			return 'Quote';
			break;
		case 224:
			return 'Meta';
			break;
		default:
			return 'UNDEFINED';
	}
}

function getKeyEventValue(key) {
	switch(key) {
		case 'Cancel':
			return 3;
			break;
		case 'Help':
			return 6;
			break;
		case 'Back Space':
			return 8;
			break;
		case 'Tab':
			return 9;
			break;
		case 'Clear':
			return 12;
			break;
		case 'Return':
			return 13;
			break;
		case 'Enter':
			return 14;
			break;
		case 'Shift':
			return 16;
			break;
		case 'Control':
			return 17;
			break;
		case 'Alt':
			return 18;
			break;
		case 'Pause':
			return 19;
			break;
		case 'Caps Lock':
			return 29;
			break;
		case 'Escape':
			return 27;
			break;
		case 'Space':
			return 32;
			break;
		case 'Page Up':
			return 33;
			break;
		case 'Page Down':
			return 34;
			break;
		case 'End':
			return 35;
			break;
		case 'Home':
			return 36;
			break;
		case 'Left Arrow':
			return 37;
			break;
		case 'Up Arrow':
			return 38;
			break;
		case 'Right Arrow':
			return 39;
			break;
		case 'Down Arrow':
			return 40;
			break;
		case 'Printscreen':
			return 44;
			break;
		case 'Insert':
			return 45;
			break;
		case 'Delete':
			return 46;
			break;
		case '0':
			return 48;
			break;
		case '1':
			return 49;
			break;
		case '2':
			return 50;
			break;
		case '3':
			return 51;
			break;
		case '4':
			return 52;
			break;
		case '5':
			return 53;
			break;
		case '6':
			return 54;
			break;
		case '7':
			return 55;
			break;
		case '8':
			return 56;
			break;
		case '9':
			return 57;
			break;
		case 'Semicolon':
			return 59;
			break;
		case 'Equals':
			return 61;
			break;
		case 'A':
			return 65;
			break;
		case 'B':
			return 66;
			break;
		case 'C':
			return 67;
			break;
		case 'D':
			return 68;
			break;
		case 'E':
			return 69;
			break;
		case 'F':
			return 70;
			break;
		case 'G':
			return 71;
			break;
		case 'H':
			return 72;
			break;
		case 'I':
			return 73;
			break;
		case 'J':
			return 74;
			break;
		case 'K':
			return 75;
			break;
		case 'L':
			return 76;
			break;
		case 'M':
			return 77;
			break;
		case 'N':
			return 78;
			break;
		case 'O':
			return 79;
			break;
		case 'P':
			return 80;
			break;
		case 'Q':
			return 81;
			break;
		case 'R':
			return 82;
			break;
		case 'S':
			return 83;
			break;
		case 'T':
			return 84;
			break;
		case 'U':
			return 85;
			break;
		case 'V':
			return 86;
			break;
		case 'W':
			return 87;
			break;
		case 'X':
			return 88;
			break;
		case 'Y':
			return 89;
			break;
		case 'Z':
			return 90;
			break;
		case 'Menu':
			return 93;
			break;
		case '0':
			return 96;
			break;
		case '1':
			return 97;
			break;
		case '2':
			return 98;
			break;
		case '3':
			return 99;
			break;
		case '4':
			return 100;
			break;
		case '5':
			return 101;
			break;
		case '6':
			return 102;
			break;
		case '7':
			return 103;
			break;
		case '8':
			return 104;
			break;
		case '9':
			return 105;
			break;
		case 'Multiply':
			return 106;
			break;
		case 'Add':
			return 107;
			break;
		case 'Separator':
			return 108;
			break;
		case 'Subtract':
			return 109;
			break;
		case 'Decimal':
			return 110;
			break;
		case 'Divide':
			return 111;
			break;
		case 'F1':
			return 112;
			break;
		case 'F2':
			return 113;
			break;
		case 'F3':
			return 114;
			break;
		case 'F4':
			return 115;
			break;
		case 'F5':
			return 116;
			break;
		case 'F6':
			return 117;
			break;
		case 'F7':
			return 118;
			break;
		case 'F8':
			return 119;
			break;
		case 'F9':
			return 120;
			break;
		case 'F10':
			return 121;
			break;
		case 'F11':
			return 122;
			break;
		case 'F12':
			return 123;
			break;
		case 'F13':
			return 124;
			break;
		case 'F14':
			return 125;
			break;
		case 'F15':
			return 126;
			break;
		case 'F16':
			return 127;
			break;
		case 'F17':
			return 128;
			break;
		case 'F18':
			return 129;
			break;
		case 'F19':
			return 130;
			break;
		case 'F20':
			return 131;
			break;
		case 'F21':
			return 132;
			break;
		case 'F22':
			return 133;
			break;
		case 'F23':
			return 134;
			break;
		case 'F24':
			return 135;
			break;
		case 'Num Lock':
			return 144;
			break;
		case 'Scroll Lock':
			return 145;
			break;
		case 'Comma':
			return 188;
			break;
		case 'Period':
			return 190;
			break;
		case 'Slash':
			return 191;
			break;
		case 'Back Quote':
			return 192;
			break;
		case 'Open Bracket':
			return 219;
			break;
		case 'Back Slash':
			return 220;
			break;
		case 'Close Bracket':
			return 221;
			break;
		case 'Quote':
			return 222;
			break;
		case 'Meta':
			return 224;
			break;
		default:
			return 'UNDEFINED';
	}
}
