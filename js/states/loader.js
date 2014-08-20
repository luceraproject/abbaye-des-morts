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
Abbaye.Loader = function(_game) 
{
	Phaser.State.call(this, _game);
	_game.state.add("Loader", this, false);
};

Abbaye.Loader.prototype = Object.create(Phaser.State.prototype);
Abbaye.Loader.prototype.constructor = Abbaye.Loader;

//-------------------------------------
Abbaye.Loader.prototype.preload = function() 
{
	// background color
	this.game.stage.backgroundColor = "#000";


	this.background = this.game.add.image(Abbaye.SCREEN_WIDTH*0.5, Abbaye.FULL_HEIGHT*0.5 - 10, 'preloadBackground');
	this.preloadBar = this.game.add.image(Abbaye.SCREEN_WIDTH*0.5 - this.background.width * 0.5, Abbaye.FULL_HEIGHT*0.5 + 10, 'preloadBar');

	this.background.anchor.setTo(0.5, 1);
	//this.preloadBar.anchor.setTo(0, 0);

	// Loader
	this.game.load.setPreloadSprite(this.preloadBar);

	//--
	this.game.load.atlas('abbaye_texture256', Abbaye.BASE_PATH + 'assets/graphics/tiles256.png', Abbaye.BASE_PATH + 'assets/graphics/abbaye.json');
	this.game.load.image('tiles256',          Abbaye.BASE_PATH + 'assets/graphics/tiles256.png');
	this.game.load.image('menu256',           Abbaye.BASE_PATH + 'assets/graphics/menu256.png');

	//--
	this.game.load.atlas('abbaye_texture', Abbaye.BASE_PATH + 'assets/graphics/tiles.png', Abbaye.BASE_PATH + 'assets/graphics/abbaye.json');
	this.game.load.image('tiles',          Abbaye.BASE_PATH + 'assets/graphics/tiles.png');
	this.game.load.image('menu',           Abbaye.BASE_PATH + 'assets/graphics/menu.png');

	//--
	this.game.load.tilemap('map',  Abbaye.BASE_PATH + 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
	this.game.load.image('scroll', Abbaye.BASE_PATH + 'assets/graphics/scroll.png');
	this.game.load.image('blood',  Abbaye.BASE_PATH + 'assets/graphics/chunk.png');

	this.game.load.audio(Abbaye.MUSIC_TITLE,      this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_TITLE));
	this.game.load.audio(Abbaye.MUSIC_GAMEOVER,   this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_GAMEOVER));
	this.game.load.audio(Abbaye.MUSIC_PRAYER,     this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_PRAYER));
	this.game.load.audio(Abbaye.MUSIC_MANHUNT,    this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_MANHUNT));
	this.game.load.audio(Abbaye.MUSIC_CHURCH,     this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_CHURCH));
	this.game.load.audio(Abbaye.MUSIC_WOOD,       this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_WOOD));
	this.game.load.audio(Abbaye.MUSIC_HANGMAN,    this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_HANGMAN));
	this.game.load.audio(Abbaye.MUSIC_CAVES,      this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_CAVES));
	this.game.load.audio(Abbaye.MUSIC_EVIL_FIGHT, this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_EVIL_FIGHT));
	this.game.load.audio(Abbaye.MUSIC_HELL,       this.buildAudioArray(Abbaye.BASE_PATH + 'assets/music/' + Abbaye.MUSIC_HELL));

	this.game.load.audio(Abbaye.FX_DOOR,      this.buildAudioArray(Abbaye.BASE_PATH + 'assets/sounds/' + Abbaye.FX_DOOR));
	this.game.load.audio(Abbaye.FX_ITEM,      this.buildAudioArray(Abbaye.BASE_PATH + 'assets/sounds/' + Abbaye.FX_ITEM));
	this.game.load.audio(Abbaye.FX_JUMP,      this.buildAudioArray(Abbaye.BASE_PATH + 'assets/sounds/' + Abbaye.FX_JUMP));
	this.game.load.audio(Abbaye.FX_MECHANISM, this.buildAudioArray(Abbaye.BASE_PATH + 'assets/sounds/' + Abbaye.FX_MECHANISM));
	this.game.load.audio(Abbaye.FX_DEATH,     this.buildAudioArray(Abbaye.BASE_PATH + 'assets/sounds/' + Abbaye.FX_DEATH));
	this.game.load.audio(Abbaye.FX_SHOOT,     this.buildAudioArray(Abbaye.BASE_PATH + 'assets/sounds/' + Abbaye.FX_SHOOT));
	this.game.load.audio(Abbaye.FX_SLASH,     this.buildAudioArray(Abbaye.BASE_PATH + 'assets/sounds/' + Abbaye.FX_SLASH));

	this.game.load.start();
	this.ready = false;
	
	
//    this.scale.pageAlignHorizontally = true;
//    //if (!Abbaye.isMobile)
//    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//    this.scale.setScreenSize(true);
};

//-------------------------------------
Abbaye.Loader.prototype.create = function() 
{
	// Font preloading
	var font = {
		font: "18px venice_classicmedium",
		fill: "#000",
		align: "center"
	};
	this.game.add.text(0, 0, '-', font);

	this.preloadBar.cropEnabled = false;
};

//-------------------------------------
Abbaye.Loader.prototype.update = function() 
{
	if(this.checkDecoded() && this.ready == false)
	{
		this.ready = true;
		this.game.state.start("Menu");
	}
};

//-------------------------------------
Abbaye.Loader.prototype.render = function() 
{
};


//-------------------------------------
Abbaye.Loader.prototype.checkCanPlayAudio = function(name) 
{
	var ret = false;
	var options = this.getAudioArray();
	for(var item in options)
	{
		if(this.game.device.canPlayAudio(options[item]))
		{
			ret = true;
			break;
		}
	}
	return ret;
}

//-------------------------------------
Abbaye.Loader.prototype.getAudioArray = function(name) 
{
	//var options = ['ogg', 'mp3', 'wav'];
	//var options = ['wav'];
	var options = ['ogg', 'mp3'];
	return options;
}

//-------------------------------------
Abbaye.Loader.prototype.buildAudioArray = function(name) 
{
	var ret = [];
	var options = this.getAudioArray();

	for(var opt in options)
	{
		ret[ret.length] = name + '.' + options[opt];
	}
	return ret;
};



//-------------------------------------
Abbaye.Loader.prototype.checkDecoded = function() 
{
	var ret = true;
	
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_TITLE);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_GAMEOVER);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_PRAYER);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_MANHUNT);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_CHURCH);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_WOOD);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_HANGMAN);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_CAVES);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_EVIL_FIGHT);
	ret &= this.cache.isSoundDecoded(Abbaye.MUSIC_HELL);

	ret &= this.cache.isSoundDecoded(Abbaye.FX_DOOR);
	ret &= this.cache.isSoundDecoded(Abbaye.FX_ITEM);
	ret &= this.cache.isSoundDecoded(Abbaye.FX_JUMP);
	ret &= this.cache.isSoundDecoded(Abbaye.FX_MECHANISM);
	ret &= this.cache.isSoundDecoded(Abbaye.FX_DEATH);
	ret &= this.cache.isSoundDecoded(Abbaye.FX_SHOOT);
	ret &= this.cache.isSoundDecoded(Abbaye.FX_SLASH);
	
	if(ret == false && !this.checkCanPlayAudio())
		ret = true;
	
	return ret;
};