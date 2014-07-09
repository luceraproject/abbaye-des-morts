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
Abbaye.Sequence = function(_game)
{
	Phaser.State.call(this, _game);
	_game.state.add("Sequence", this, false);
	
	this._game = _game;
	this.type = Abbaye.Sequence.INTRO;
	this.minDelay = 4000;
	this.music    = null;
};

Abbaye.Sequence.prototype = Object.create(Phaser.State.prototype);
Abbaye.Sequence.prototype.constructor = Abbaye.Sequence;

Abbaye.Sequence.INTRO     = 0;
Abbaye.Sequence.OUTRO     = 1;
Abbaye.Sequence.GAME_OVER = 2;

//-------------------------------------
Abbaye.Sequence.prototype.preload = function() 
{
	// background color
	this.game.stage.backgroundColor = "#000";
};

//-------------------------------------
Abbaye.Sequence.prototype.create = function() 
{	
//	if(this.game.device.desktop)
//	{
		this.game.input.keyboard.onDownCallback  = this.onKeyDown;
		this.game.input.keyboard.callbackContext = this;
//	}
//	else
//	{
		this.game.input.onDown.add(this.onKeyDown, this);
//	}
	
	this.launch();
	
	this.timestamp = new Date();

	var muteKey = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
    muteKey.onDown.add(this.switchMute, this);
};

//-------------------------------------
Abbaye.Sequence.prototype.switchMute = function()
{
	Abbaye.allowMusic      = !Abbaye.allowMusic;
	Abbaye.game.sound.mute = !Abbaye.allowMusic;
};

//-------------------------------------
Abbaye.Sequence.prototype.update = function() 
{
};

//-------------------------------------
Abbaye.Sequence.prototype.render = function() 
{
};


//-------------------------------------
Abbaye.Sequence.prototype.run = function(type) 
{
	this.type = type;
	
	switch(this.type)
	{
		case Abbaye.Sequence.INTRO:
			this.minDelay    = 2000;
		break;
		case Abbaye.Sequence.OUTRO:
			this.minDelay    = 5000;
		break;
		case Abbaye.Sequence.GAME_OVER:
			this.minDelay    = 2000;
		break;
	}
	this._game.state.start("Sequence");
};


//-------------------------------------
Abbaye.Sequence.prototype.launch = function() 
{
    var posX = Abbaye.SCREEN_WIDTH * 0.5;
    var posY = Abbaye.FULL_HEIGHT * 0.5;
	var textUp;
	var textDown;
	var musicId;
	
    var font = {
        font: "18px venice_classicmedium",
        fill: "#fff",
        align: "center"
    };
	
	switch(this.type)
	{
		case Abbaye.Sequence.INTRO:
			
			musicId  = Abbaye.MUSIC_MANHUNT;
			textUp   = this.game.add.text(posX, posY - 24, '13th Century. The Cathars were\nbeing expelled by the Catholics\nChurch out of the Languedoc', font);
			textDown = this.game.add.text(posX, posY + 24, 'The Cathar Jean Raymond\nruns to escape the crusaders...', font);
			textUp.fixedToCamera = true;
			textUp.anchor.setTo(0.5, 1);
			textDown.fixedToCamera = true;
			textDown.anchor.setTo(0.5, 0);
			
			var spriteJean     = this.game.add.sprite(-50,  posY, Abbaye.texture_game, 'walk00');
			var spriteTemplar1 = this.game.add.sprite(-100, posY, Abbaye.texture_game, 'templar00');
			var spriteTemplar2 = this.game.add.sprite(-124, posY, Abbaye.texture_game, 'templar00');
			var spriteTemplar3 = this.game.add.sprite(-148, posY, Abbaye.texture_game, 'templar00');

			spriteJean.scale.x = -1;
			spriteTemplar1.scale.x = -1;
			spriteTemplar2.scale.x = -1;
			spriteTemplar3.scale.x = -1;
			
			spriteJean.animations.add('walk', ['walk00', 'walk01'], 10, true, false);
			spriteTemplar1.animations.add('walk', ['templar00', 'templar01'], 10, true, false);
			spriteTemplar2.animations.add('walk', ['templar00', 'templar01'], 10, true, false);
			spriteTemplar3.animations.add('walk', ['templar00', 'templar01'], 10, true, false);
			
			spriteJean.animations.play('walk');
			spriteTemplar1.animations.play('walk');
			spriteTemplar2.animations.play('walk');
			spriteTemplar3.animations.play('walk');

			this.game.add.tween(spriteJean).to({ x: Abbaye.SCREEN_WIDTH     -  50 + 250 }, 12000, Phaser.Easing.Linear.None).start();
			this.game.add.tween(spriteTemplar1).to({ x: Abbaye.SCREEN_WIDTH - 100 + 250 }, 15000, Phaser.Easing.Linear.None).start();
			this.game.add.tween(spriteTemplar2).to({ x: Abbaye.SCREEN_WIDTH - 124 + 250 }, 15000, Phaser.Easing.Linear.None).start();
			this.game.add.tween(spriteTemplar3).to({ x: Abbaye.SCREEN_WIDTH - 148 + 250 }, 15000, Phaser.Easing.Linear.None).start();
		break;
		case Abbaye.Sequence.OUTRO:
			musicId  = Abbaye.MUSIC_PRAYER;
			textUp   = this.game.add.text(posX, posY - 48, 'Your body has burned\nin the flames,', font);
			textDown = this.game.add.text(posX, posY + 48, 'but your soul has found\na place in Heaven.', font);
			textUp.fixedToCamera = true;
			textUp.anchor.setTo(0.5, 1);
			textUp.alpha = 0;
			textDown.fixedToCamera = true;
			textDown.anchor.setTo(0.5, 0);
			textDown.alpha = 0;
			
			var spriteDoor     = this.game.add.sprite(posX, posY, Abbaye.texture_game, 'heavendoor00');
			spriteDoor.anchor.setTo(0.5, 0.5);
			spriteDoor.animations.add('open', ['heavendoor00', 'heavendoor01', 'heavendoor02', 'heavendoor03', 'heavendoor04', 'heavendoor05'], 2, false, false);
			
			window.setTimeout(function() {
				spriteDoor.animations.play('open');
			}, 500);
			
			this.game.add.tween(textUp).to({ alpha: 0 }, 3500, Phaser.Easing.Linear.None)
    		.to({ alpha: 1 }, 10, Phaser.Easing.Linear.None)
			.start();
			this.game.add.tween(textDown).to({ alpha: 0 }, 3500, Phaser.Easing.Linear.None)
    		.to({ alpha: 1 }, 10, Phaser.Easing.Linear.None)
			.start();
		break;
		case Abbaye.Sequence.GAME_OVER:
			musicId = Abbaye.MUSIC_GAMEOVER;
			textUp  = this.game.add.text(posX, posY, 'Game Over', font);
			textUp.fixedToCamera = true;
			textUp.anchor.setTo(0.5, 0.5);
		break;
	}

	if(this.music !== null)
	{
		this.music.stop();
	}
	
	this.music    = this.game.add.audio(musicId, 1, false);
	this.music.play();
};

//-------------------------------------
Abbaye.Sequence.prototype.onKeyDown = function(key) 
{
    var currentTime = new Date();
    var elapsed = currentTime.getTime() - this.timestamp.getTime();
    if(elapsed < this.minDelay)
        return;
	
    this.game.input.keyboard.onDownCallback  = null;
    this.game.input.keyboard.callbackContext = null;
	this.game.input.onDown.remove(this.onKeyDown, this);
	
	if(this.music !== null)
	{
		this.music.stop();
	}
	
	switch(this.type)
	{
		case Abbaye.Sequence.INTRO:
    		this.game.state.start("Game");
		break;
		case Abbaye.Sequence.OUTRO:
    		this.game.state.start("Menu");
		break;
		case Abbaye.Sequence.GAME_OVER:
    		this.game.state.start("Menu");
		break;
	}
};
