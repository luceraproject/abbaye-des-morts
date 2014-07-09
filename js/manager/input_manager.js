//
// Copyright 2014, Carlos Asensio Martinez <c.asensio@lucera-project.com> (www.lucera-project.com)
//
// This file is part of the port to HTML5 of "Abbaye des morts", an original
// game created by locomalito (www.locomalito.com).
// (c) 2010 - Locomalito & Gryzor87
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License, or (at your option)
// any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//
/* jshint undef: true, unused: true  */
/* global Abbaye */
/* global Phaser */
//-------------------------------------
"use strict";
//-------------------------------------

//-------------------------------------
Abbaye.InputManager = function(game) 
{
    this.game    = game;

	this.left        = false;
	this.right       = false;
	this.down        = false;
	this.up          = false;
	this.fire        = false;
	
	this.oldleft     = this.left;
	this.oldright    = this.right;
	this.olddown     = this.down;
	this.oldup       = this.up;
	this.oldfire     = this.fire;
	
	this.usingPad    = false;

	this.leftButton  = null;
	this.rightButton = null;
	this.downButton  = null;
	this.upButton    = null;
	this.fireButton  = null;

	
	this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.SPACEBAR
    ]);
	
	if(!this.game.device.desktop)
	{
		// build UI interface
		var buttonWidth  = 32;
		var buttonHeight = 32;
		var margin       = 0;
		var tintColor    = 0xFFFF00;
		
		var screenLeft   = margin;
		var screenRight  = Abbaye.SCREEN_WIDTH  - margin;
		var screenBottom = Abbaye.SCREEN_HEIGHT - margin;
		var posX;
		var posY;
		
		posX = screenLeft;
		posY = screenBottom - buttonHeight;
		this.leftButton = this.game.add.image(posX, posY, Abbaye.texture_game, 'arrow_left');
		this.leftButton.inputEnabled  = true;
		this.leftButton.fixedToCamera = true;
		this.leftButton.tint          = tintColor;
		this.leftButton.events.onInputDown.add(this.onPressed, this);
		this.leftButton.events.onInputUp.add(this.onReleased, this);
		
		posX = screenLeft + buttonWidth + margin;
		posY = screenBottom - buttonHeight;
		this.rightButton = this.game.add.image(posX, posY, Abbaye.texture_game, 'arrow_right');
		this.rightButton.inputEnabled  = true;
		this.rightButton.fixedToCamera = true;
		this.rightButton.tint          = tintColor;
		this.rightButton.events.onInputDown.add(this.onPressed, this);
		this.rightButton.events.onInputUp.add(this.onReleased, this);
		
		posX = screenRight - buttonWidth;
		posY = screenBottom - buttonHeight;
		this.downButton = this.game.add.image(posX, posY, Abbaye.texture_game, 'arrow_down');
		this.downButton.inputEnabled  = true;
		this.downButton.fixedToCamera = true;
		this.downButton.tint          = tintColor;
		this.downButton.events.onInputDown.add(this.onPressed, this);
		this.downButton.events.onInputUp.add(this.onReleased, this);
		
		posX = screenRight - buttonWidth;
		posY = screenBottom - buttonHeight*2 - margin;
		this.upButton = this.game.add.image(posX, posY, Abbaye.texture_game, 'arrow_up');
		this.upButton.inputEnabled  = true;
		this.upButton.fixedToCamera = true;		
    	this.upButton.tint          = tintColor;
		this.upButton.events.onInputDown.add(this.onPressed, this);
		this.upButton.events.onInputUp.add(this.onReleased, this);
	}
	else
	{
		if(this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.input.gamepad.pad1.connected) 
		{
			this.usingPad = true;
		}
	}
};

//-------------------------------------
Abbaye.InputManager.prototype.update = function()
{
	this.oldleft  = this.left;
	this.oldright = this.right;
	this.olddown  = this.down;
	this.oldup    = this.up;
	this.oldfire  = this.fire;

	if(this.game.device.desktop)
	{
		this.left  = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
		this.right = this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
		this.down  = this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);
		this.up    = this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
		this.fire  = this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);

		if(this.usingPad === true)
		{
			var pad1 = this.game.input.gamepad.pad1;
			
			this.left  = (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)  || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1);
			this.right = (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) >  0.1);
			this.up    = (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)    || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1);
			this.down  = (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)  || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) >  0.1);
    		this.fire  = (pad1.isDown(Phaser.Gamepad.XBOX360_A));
		}
	}
	else
	{
		//this.fire = this.game.input.isDown();
		
		this.leftButton.alpha  = this.left  ? 1.0 : 0.3;
		this.rightButton.alpha = this.right ? 1.0 : 0.3;
		this.downButton.alpha  = this.down  ? 1.0 : 0.3;
		this.upButton.alpha    = this.up    ? 1.0 : 0.3;
	}
};

//-------------------------------------
Abbaye.InputManager.prototype.isChangedToDown = function(key)
{
	var current = false;
	var old     = false;

	switch(key)
	{
		case Phaser.Keyboard.LEFT:
			old     = this.oldleft;
			current = this.left;
		break;
		case Phaser.Keyboard.RIGHT:
			old     = this.oldright;
			current = this.right;
		break;
		case Phaser.Keyboard.DOWN:
			old     = this.olddown;
			current = this.down;
		break;
		case Phaser.Keyboard.UP:
			old     = this.oldup;
			current = this.up;
		break;
		case Phaser.Keyboard.SPACEBAR:
			old     = this.oldfire;
			current = this.fire;
		break;
	}
	
	return (old === false && current === true);
};

//-------------------------------------
Abbaye.InputManager.prototype.isChangedToUp = function(key)
{
	return !this.isChangedToDown(key);
};

//-------------------------------------
Abbaye.InputManager.prototype.setPressed = function(key, pressed)
{
	if(typeof pressed === 'undefined' || pressed === null) pressed = true;
	switch(key)
	{
		case Phaser.Keyboard.LEFT:
			this.oldleft = this.left;
			this.left = pressed;
		break;
		case Phaser.Keyboard.RIGHT:
			this.oldright = this.right;
			this.right = pressed;
		break;
		case Phaser.Keyboard.DOWN:
			this.olddown = this.down;
			this.down = pressed;
		break;
		case Phaser.Keyboard.UP:
			this.oldup = this.up;
			this.up = pressed;
		break;
		case Phaser.Keyboard.SPACEBAR:
			this.oldfire = this.fire;
			this.fire = pressed;
		break;
	}
};

//-------------------------------------
Abbaye.InputManager.prototype.isPressed = function(key)
{
	var pressed = false;
	switch(key)
	{
		case Phaser.Keyboard.LEFT:
			pressed = this.left;
		break;
		case Phaser.Keyboard.RIGHT:
			pressed = this.right;
		break;
		case Phaser.Keyboard.DOWN:
			pressed = this.down;
		break;
		case Phaser.Keyboard.UP:
			pressed = this.up;
		break;
		case Phaser.Keyboard.SPACEBAR:
			pressed = this.fire;
		break;
	}
	return pressed;
};

//-------------------------------------
Abbaye.InputManager.prototype.onPressed = function(sprite)
{
	if(sprite == this.leftButton)
	{
		this.setPressed(Phaser.Keyboard.LEFT, true);
	}
	else if(sprite == this.rightButton)
	{
		this.setPressed(Phaser.Keyboard.RIGHT, true);
	}
	else if(sprite == this.upButton)
	{
		this.setPressed(Phaser.Keyboard.UP, true);
	}
	else if(sprite == this.downButton)
	{
		this.setPressed(Phaser.Keyboard.DOWN, true);
	}
};

//-------------------------------------
Abbaye.InputManager.prototype.onReleased = function(sprite)
{
	if(sprite == this.leftButton)
	{
		this.setPressed(Phaser.Keyboard.LEFT, false);
	}
	else if(sprite == this.rightButton)
	{
		this.setPressed(Phaser.Keyboard.RIGHT, false);
	}
	else if(sprite == this.upButton)
	{
		this.setPressed(Phaser.Keyboard.UP, false);
	}
	else if(sprite == this.downButton)
	{
		this.setPressed(Phaser.Keyboard.DOWN, false);
	}
};
