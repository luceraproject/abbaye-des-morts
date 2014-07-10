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
/* global window */
//-------------------------------------
"use strict";
//-------------------------------------

//-------------------------------------
Abbaye.Menu = function(_game) 
{
	Phaser.State.call(this, _game);
	_game.state.add("Menu", this, false);
	
	this.background = null;
};

Abbaye.Menu.prototype = Object.create(Phaser.State.prototype);
Abbaye.Menu.prototype.constructor = Abbaye.Menu;

//-------------------------------------
Abbaye.Menu.prototype.preload = function() 
{
	// background color
	this.game.stage.backgroundColor = "#fc0";
};

//-------------------------------------
Abbaye.Menu.prototype.create = function() 
{
    this.background = this.add.image(0, 0, Abbaye.texture_menu);
	this.btnQuality = this.game.add.button(128 - 16, 0, Abbaye.texture_game, this.switchQuality, this, 'quality_button', 'quality_button', 'quality_button', 'quality_button');
	this.btnStart   = this.add.image(0, 24, Abbaye.texture_game, 'empty');
	this.btnStart.inputEnabled  = true;
	this.btnStart.width  = Abbaye.SCREEN_WIDTH;
	this.btnStart.height = Abbaye.FULL_HEIGHT;
	this.btnStart.events.onInputDown.add(this.onLaunchGame, this);
	
//	if(this.game.device.desktop)
//	{
    	this.game.input.keyboard.onDownCallback  = this.onKeyDown;
    	this.game.input.keyboard.callbackContext = this;
//	}
//	else
//	{
		//this.game.input.onDown.add(this.onLaunchGame, this);
//	}

	
	this.music    = this.game.add.audio(Abbaye.MUSIC_TITLE, 1, false);
	this.music.play();
	
    this.showInfo = false;

	var muteKey = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
    muteKey.onDown.add(this.switchMute, this);
};

//-------------------------------------
Abbaye.Menu.prototype.switchMute = function()
{
	Abbaye.allowMusic      = !Abbaye.allowMusic;
	Abbaye.game.sound.mute = !Abbaye.allowMusic;
};

//-------------------------------------
Abbaye.Menu.prototype.update = function() 
{
};

//-------------------------------------
Abbaye.Menu.prototype.render = function() 
{
};

//-------------------------------------
Abbaye.Menu.prototype.onKeyDown = function(key) 
{
	var keyCode = key.keyCode || key.which;
    if(keyCode == 32 && this.showInfo === false)
    {
        this.onLaunchGame();
    }
    else if((keyCode == 73 && this.showInfo === false) ||  this.showInfo === true)
    {
        this.onSwitchInfo();
    }
};

//-------------------------------------
Abbaye.Menu.prototype.onSwitchInfo = function() 
{
	this.showInfo           = !this.showInfo;
	//this.btnQuality.visible = !this.showInfo;
	this.btnStart.visible   = !this.showInfo;
    this.background.y       = this.showInfo?(-this.background.height*0.5):0;
	
	if(this.showInfo === false)
	{
		this.music.stop();
		this.music.play();
	}
};

//-------------------------------------
Abbaye.Menu.prototype.onLaunchGame = function() 
{
    this.game.input.keyboard.onDownCallback  = null;
    this.game.input.keyboard.callbackContext = null;
	this.game.input.onDown.remove(this.onLaunchGame, this);
    
	this.music.stop();
	Abbaye.STATES.sequence.run(Abbaye.Sequence.INTRO);
};



//-------------------------------------
Abbaye.Menu.prototype.switchQuality = function() 
{
	if(Abbaye.texture_menu == 'menu')
	{
		Abbaye.texture_menu = 'menu256';
		Abbaye.texture_game = 'abbaye_texture256';
		Abbaye.texture_tiles = 'tiles256';
	}
	else
	{
		Abbaye.texture_menu = 'menu';
		Abbaye.texture_game = 'abbaye_texture';
		Abbaye.texture_tiles = 'tiles';
	}

	this.background.loadTexture(Abbaye.texture_menu);
	this.btnQuality.loadTexture(Abbaye.texture_game, 'quality_button');
	
	//document.getElementById().attributes();
}
