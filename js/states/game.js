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
Abbaye.Game = function(_game)
{
	Phaser.State.call(this, _game);
	_game.state.add("Game", this, false);

	this.resetData();
};

Abbaye.Game.prototype = Object.create(Phaser.State.prototype);
Abbaye.Game.prototype.constructor = Abbaye.Game;

//-------------------------------------
Abbaye.Game.prototype.preload = function() {
	// background color
	this.game.stage.backgroundColor = "#000";
};

//-------------------------------------
Abbaye.Game.prototype.create = function() 
{
	this.resetData();
	//this.game.world.scale.setTo(ZOOM);
	
	//--
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.arcade.TILE_BIAS = Abbaye.TILE_SIZE + 2;
	this.game.physics.arcade.gravity.y = 400;
	this.game.physics.arcade.TILEMAP_ALLOW_COLLISION_Y = true;
	this.game.time.timeCap             = (1/60) * 1000;
	this.game.time.advancedTiming      = true;
	//this.game.time.timeCap = 0.001; //(1/40) * 1000;
	
	//--
	this.map = this.game.add.tilemap('map');
	this.map.tilesets[0].name = Abbaye.texture_tiles;
	this.map.addTilesetImage(Abbaye.texture_tiles);
	this.map.setCollisionBetween(1, 15);
	this.map.setCollisionBetween(17, 36);
	this.map.setCollisionBetween(39, 75);
	
	this.layer = this.map.createLayer('map');
	this.layer.resizeWorld();
	this.map.setLayer(this.layer);
	
	//--
	this.createRooms();
	this.createMusic();

	//--
	var tilex = 14; //130; //14;
	var tiley = 42; //108; //42;
	this.hero = new Abbaye.Jean(this.game, tilex*Abbaye.TILE_SIZE, tiley*Abbaye.TILE_SIZE);
	this.debug         = false;
	this.hero.isGod    = this.debug;
	this.hero.numCross = this.debug?12:0;
	
	//--
	this.panel		  = new Abbaye.PanelManager(this.game);
	this.shootManager = new Abbaye.ShootManager(this.game);
	this.inputManager = new Abbaye.InputManager(this.game);
	this.scroll	      = new Abbaye.ScrollManager(this.game);

	//--
	var initValue = false; //false;
	this.setGlobalFlag('PAUSE_ALL',		   false);
	this.setGlobalFlag('CROSS_USED',	   false);
	this.setGlobalFlag('END_GAME',		   false);
	this.setGlobalFlag('SHOW_LAST_SCROLL', false);
	this.setGlobalFlag('JEAN_CATCHED',	   false);
	
	this.setGlobalFlag('BELL',	   initValue);
	this.setGlobalFlag('SWITCH',   true);
	this.setGlobalFlag('TOGGLE00', initValue);
	this.setGlobalFlag('TOGGLE01', initValue);
	this.setGlobalFlag('TOGGLE02', initValue);
	this.setGlobalFlag('ENTER',	   initValue);
	
	this.stairIndex = 0;
	
	this.game.input.keyboard.onDownCallback  = null;
    this.game.input.keyboard.callbackContext = null;
	
	var muteKey = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
    muteKey.onDown.add(this.switchMute, this);
	
	var pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    pauseKey.onDown.add(this.pauseGame, this);
	
	var debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    debugKey.onDown.add(this.switchDebug, this);
};

//-------------------------------------
Abbaye.Game.prototype.switchDebug = function()
{
	this.debug         = !this.debug;
	this.hero.isGod    = this.debug;
	this.hero.numCross = this.debug?12:0;
};

//-------------------------------------
Abbaye.Game.prototype.pauseGame = function()
{
	this.showScroll(8);
};

//-------------------------------------
Abbaye.Game.prototype.switchMute = function()
{
	Abbaye.allowMusic      = !Abbaye.allowMusic;
	Abbaye.game.sound.mute = !Abbaye.allowMusic;
};

//-------------------------------------
Abbaye.Game.prototype.init = function() 
{
};

//-------------------------------------
Abbaye.Game.prototype.shutdown = function() 
{
	this.resetData();
};

//-------------------------------------
Abbaye.Game.prototype.update = function() 
{
	this.inputManager.update();
	if(this.hero.isDying)
	{
	}
	else
	{
		var x = Math.floor(this.hero.x / Abbaye.SCREEN_WIDTH);
		var y = Math.floor(this.hero.y / Abbaye.SCREEN_HEIGHT);
		this.setRoom(x, y);

		this.game.physics.arcade.collide(this.hero, this.layer, null, null, this.hero);

		if(this.currentRoom !== null)
		{
			if(this.currentRoom.blocks !== null)
			{
				this.game.physics.arcade.collide(this.hero, this.currentRoom.blocks, this.hero.blockHandle, this.hero.blockProcess, this.hero);
			}
			if(this.currentRoom.doors !== null)
			{
				this.game.physics.arcade.collide(this.hero, this.currentRoom.doors);
			}
			if(this.currentRoom.enemies !== null)
			{
				this.game.physics.arcade.overlap(this.hero, this.currentRoom.enemies, this.hero.checkKill, null);
			}
			if(this.shootManager !== null)
			{
				this.shootManager.update();
				this.game.physics.arcade.overlap(this.hero, this.shootManager.shootGroup, this.hero.checkKill, null);
			}
			if(this.currentRoom.items !== null)
			{
				this.game.physics.arcade.overlap(this.hero, this.currentRoom.items, this.hero.useItem, null);
			}
		}
	}
};

//-------------------------------------
Abbaye.Game.prototype.render = function() 
{
	
	
	if(!this.debug)
		return;
	
	this.game.debug.text( "FPS: " + this.game.time.fps + "\nFrames: " + this.game.time.frames, 10, 10);
	
	var myGame = this.game;
	
	this.game.debug.body(this.hero);
	
	
	if(this.currentRoom !== null)
	{
		this.currentRoom.doors.forEach(function(item) {
			myGame.debug.body(item);
		});
		this.currentRoom.enemies.forEach(function(item) {
			myGame.debug.body(item);
		});
		this.currentRoom.items.forEach(function(item) {
			myGame.debug.body(item);
		});
		
		this.shootManager.shootGroup.forEach(function(item) {
			myGame.debug.body(item);
		});
	}
};

//-------------------------------------
Abbaye.Game.prototype.resetData = function() 
{
	this.roomsData		  = [];
	this.gameFlags		  = [];
	this.stairIndex	      = 0;
	this.currentRoomIndex = 0;
	this.currentRoom	  = null;
	this.hero			  = null;
	this.satan			  = null;
	this.map			  = null;
	this.layer			  = null;
	this.shootManager	  = null;
	this.musics		      = [];
	this.currentMusic	  = null;
	this.panel			  = null;
	this.scroll		      = null;
	
	this.setGlobalFlag('PAUSE_ALL',        false);
	this.setGlobalFlag('CROSS_USED',       false);
	this.setGlobalFlag('END_GAME',         false);
	this.setGlobalFlag('SHOW_LAST_SCROLL', false);
	this.setGlobalFlag('JEAN_CATCHED',	   false);
	
	this.setGlobalFlag('BELL', false);
	this.setGlobalFlag('SWITCH', true);
	this.setGlobalFlag('TOGGLE00', false);
	this.setGlobalFlag('TOGGLE01', false);
	this.setGlobalFlag('TOGGLE02', false);
	this.setGlobalFlag('ENTER', false);
};

//-------------------------------------
Abbaye.Game.prototype.createRooms = function() 
{
	var enemies;
	var items;
	var doors;
	var blocks;
	
	// this info should be at the map properties
	var roomTitles = [
		"",
		"A prayer of Hope",
		"Tower of the Bell",
		"Wine supplies",
		"",
		"Escape !!!",
		"Death is close",
		"Abandoned church",
		"The Altar",
		"Hangman tree",
		"Pestilent Beast",
		"Cave of illusions",
		"Plagued ruins",
		"Catacombs",
        "Hidden garden",
        "Gloomy tunels",
        "Lake of despair",
        "The wheel of faith",
        "Banquet of Death",
        "Underground river",
        "Unexpected gate",
        "Evil church",
        "Tortured souls",
        "Ashes to ashes",
        "Satan !!!"
    ];

    for(var i = 0; i < 5*5; i++) 
    {
        var rx = Math.floor(i % 5);
        var ry = Math.floor(i / 5);

        var roomName = 'room' + ry + rx;
        window.console.log(' - Parsing room: ' + roomName);
        
        this.roomsData[i] = null;

        enemies = this.game.add.group();
        items   = this.game.add.group();
        doors   = this.game.add.group();
        blocks  = this.game.add.group();

		if(!this.map.objects[roomName])
			continue;

        for(var c = 0, len = this.map.objects[roomName].length; c < len; c++)
        {
            var name  = this.map.objects[roomName][c].name;
            var props = this.map.objects[roomName][c].properties;
            var x     = this.map.objects[roomName][c].x;
            var y     = this.map.objects[roomName][c].y;
            var w     = this.map.objects[roomName][c].width;
            var h     = this.map.objects[roomName][c].height;
            
			var item;
            if(name == "static")
            {
                item = new Abbaye.StaticEntity(this.game, x, y, w, h, props);
                enemies.add(item);
            }
            else if(name == "movable")
            {
                item = new Abbaye.MovableEntity(this.game, x, y, w, h, props);
                enemies.add(item);
                if(i == 24 && item.typeAbbaye == Abbaye.MovableEntity.SATAN)
                {
                    this.satan = item;
                }
            }
            else if(name == "shooter")
            {
                item = new Abbaye.ShooterEntity(this.game, x, y, w, h, props);
                enemies.add(item);
            }
            else if(name == "ghost")
            {
                item = new Abbaye.Ghost(this.game, x, y, w, h, props);
                enemies.add(item);
            }
            else if(name == "actionitem")
            {
                item = new Abbaye.ActionEntity(this.game, x, y, w, h, props);
                items.add(item);
            }
            else if(name == "block")
            {
                item = new Abbaye.Block(this.game, x, y, w, h, props);
                items.add(item);	//its just a decoy, we use the tilemap to block movement, so insert it to the items group
            }
            else if(name == "door")
            {
                item = new Abbaye.Door(this.game, x, y, w, h, props);
                doors.add(item);
            }
            else if(name == "step")
            {
                item = new Abbaye.Step(this.game, x, y, w, h, props);
                blocks.add(item);
            }
        }

        this.roomsData[i] = {
			index: i,
            enemies: enemies,
            items: items,
            doors: doors,
            blocks: blocks,
            title: roomTitles[i]
        };
        
        this.currentRoom = this.roomsData[i];
    }
};

//-------------------------------------
Abbaye.Game.prototype.createMusic = function() 
{
    this.musics[Abbaye.MUSIC_PRAYER]     = this.game.add.audio(Abbaye.MUSIC_PRAYER, 1, false);
    this.musics[Abbaye.MUSIC_MANHUNT]    = this.game.add.audio(Abbaye.MUSIC_MANHUNT, 1, true);
    this.musics[Abbaye.MUSIC_CHURCH]     = this.game.add.audio(Abbaye.MUSIC_CHURCH, 1, true);
    this.musics[Abbaye.MUSIC_WOOD]       = this.game.add.audio(Abbaye.MUSIC_WOOD, 1, true);
    this.musics[Abbaye.MUSIC_HANGMAN]    = this.game.add.audio(Abbaye.MUSIC_HANGMAN, 1, false);
    this.musics[Abbaye.MUSIC_CAVES]      = this.game.add.audio(Abbaye.MUSIC_CAVES, 1, true);
    this.musics[Abbaye.MUSIC_EVIL_FIGHT] = this.game.add.audio(Abbaye.MUSIC_EVIL_FIGHT, 1, true);
    this.musics[Abbaye.MUSIC_HELL]       = this.game.add.audio(Abbaye.MUSIC_HELL, 1, true);
	this.musics[Abbaye.MUSIC_GAMEOVER]   = this.game.add.audio(Abbaye.MUSIC_GAMEOVER, 1, true);
	
    
    this.musics[Abbaye.FX_DOOR]          = this.game.add.audio(Abbaye.FX_DOOR);
    this.musics[Abbaye.FX_ITEM]          = this.game.add.audio(Abbaye.FX_ITEM);
    this.musics[Abbaye.FX_JUMP]          = this.game.add.audio(Abbaye.FX_JUMP);
    this.musics[Abbaye.FX_DEATH]         = this.game.add.audio(Abbaye.FX_DEATH);
    this.musics[Abbaye.FX_SHOOT]         = this.game.add.audio(Abbaye.FX_SHOOT);
    this.musics[Abbaye.FX_SLASH]         = this.game.add.audio(Abbaye.FX_SLASH);
    this.musics[Abbaye.FX_MECHANISM]     = this.game.add.audio(Abbaye.FX_MECHANISM);
	
};

//-------------------------------------
Abbaye.Game.prototype.setRoomByIndex = function(roomIndex) 
{
    if(typeof roomIndex === 'undefined') roomIndex = 0;
    
    var x = Math.floor(roomIndex % 5);
    var y = Math.floor(roomIndex / 5);
    this.setRoom(x, y, true);
};

//-------------------------------------
Abbaye.Game.prototype.setRoom = function(roomX, roomY, force) 
{
    if(typeof roomX === 'undefined') roomX = 0;
    if(typeof roomY === 'undefined') roomY = 0;
	if(typeof force === 'undefined') force = false;
	
    
    var roomIndex = Math.floor(roomY) * 5 + Math.floor(roomX);

    if(roomIndex < 0 || roomIndex >= this.roomsData.length)
        return false;
	
	if(roomIndex == this.currentRoomIndex && !force)
		return false;
		

	// HACK: avoid to kill the hero just when enter into a new room (sometimes happens when reusing Phaser physic bodies)
	if(!force)
		this.hero.enterRoom();
	
    this.game.camera.x    = roomX * Abbaye.SCREEN_WIDTH;
    this.game.camera.y    = roomY * Abbaye.SCREEN_HEIGHT;
    
    this.shootManager.killAll();
    if(this.currentRoom !== null)
    {
        this.enableRoom(this.currentRoom, false);
    }
    
    this.currentRoomIndex = roomIndex;
    this.currentRoom      = this.roomsData[roomIndex];
    
    if(this.currentRoom !== null)
    {
        this.setRoomMusic(this.currentRoomIndex);
        
        this.panel.setNumLives(this.hero.numHearts);
        this.panel.setNumCrosses(this.hero.numCross);
        this.panel.setLevelName(this.currentRoom.title);
		this.enableRoom(this.currentRoom, true);
        
        if(this.currentRoomIndex == 24 && this.hero.numCross == 12 && !this.getGlobalFlag('CROSS_USED'))
        {
            this.buildStairs();
        }
    }

    return true;
};
	
//-------------------------------------
Abbaye.Game.prototype.enableRoom = function(room, isEnabled) 
{
    if(typeof room === 'undefined') return;
    if(typeof isEnabled === 'undefined') isEnabled = false;
	
    var action = isEnabled ? 'switchOn' : 'switchOff';
    if(room !== null)
    {
        if(room.enemies !== null)
        {
			room.enemies.callAll(action);
        }
        if(room.items !== null)
        {
            room.items.callAll(action);
        }
        if(room.doors !== null)
        {
            room.doors.callAll(action);
        }
        if(room.blocks !== null)
        {
            room.blocks.callAll(action);
        }
    }
};

//-------------------------------------
Abbaye.Game.prototype.getRoomBounds = function(roomIndex) 
{
    if(typeof roomIndex === 'undefined' || roomIndex === null) roomIndex = this.currentRoomIndex;

    var x = Math.floor(roomIndex % 5);
    var y = Math.floor(roomIndex / 5);
    var roomBounds = {x:x * Abbaye.SCREEN_COLS, y: y * Abbaye.SCREEN_ROWS, w: Abbaye.SCREEN_COLS, h: Abbaye.SCREEN_ROWS};
    return roomBounds;
};

//-------------------------------------
Abbaye.Game.prototype.stopAllMusic = function() 
{
    if(this.currentMusic !== null)
    {
        this.currentMusic.stop();
    }
    
    if(this.musics[Abbaye.FX_DOOR])      this.musics[Abbaye.FX_DOOR].stop();
    if(this.musics[Abbaye.FX_ITEM])      this.musics[Abbaye.FX_ITEM].stop();
    if(this.musics[Abbaye.FX_JUMP])      this.musics[Abbaye.FX_JUMP].stop();
    if(this.musics[Abbaye.FX_MECHANISM]) this.musics[Abbaye.FX_MECHANISM].stop();
    if(this.musics[Abbaye.FX_DEATH])     this.musics[Abbaye.FX_DEATH].stop();
    if(this.musics[Abbaye.FX_SHOOT])     this.musics[Abbaye.FX_SHOOT].stop();
    if(this.musics[Abbaye.FX_SLASH])     this.musics[Abbaye.FX_SLASH].stop();
};

//-------------------------------------
Abbaye.Game.prototype.playFX = function(fx) 
{
    if(Abbaye.allowFx && fx)
    {
        var sound = this.musics[fx];
        if(sound)
            sound.play();
    }
};

//-------------------------------------
Abbaye.Game.prototype.setRoomMusic = function(currentRoomIndex) 
{
    var music = this.getRoomMusic(currentRoomIndex);
    var nextMusic = null;
    if(music !== null)
    {
        nextMusic = this.musics[music];
    }
    
    if(this.currentMusic !== null)
    {
        if(this.currentMusic == nextMusic)
        {
            if(!this.currentMusic.isPlaying && Abbaye.allowMusic)
                this.currentMusic.play();
            return;
        }
        this.currentMusic.stop();
    }

    if(nextMusic !== null)
    {
        this.currentMusic = nextMusic;
        if(Abbaye.allowMusic)
        {
            this.currentMusic.play();
        }
    }
};

//-------------------------------------
Abbaye.Game.prototype.getRoomMusic = function(currentRoomIndex) 
{
    if(typeof currentRoomIndex === 'undefined') currentRoomIndex = this.currentRoomIndex;
    
    var ret  = null;

	if(currentRoomIndex === 0)
	{
		ret = Abbaye.MUSIC_MANHUNT;
	}
	else if(currentRoomIndex == 1) 
    {
		  ret = Abbaye.MUSIC_PRAYER;
	}
    else if(currentRoomIndex == 2  ||
            currentRoomIndex == 3  ||
            currentRoomIndex == 7  ||
            currentRoomIndex == 8  || 
            currentRoomIndex == 12 || 
            currentRoomIndex == 13 ||
            currentRoomIndex == 17) 
    {
        ret = Abbaye.MUSIC_CHURCH;
	}
	else if(currentRoomIndex == 4) 
    {
        ret = Abbaye.MUSIC_GAMEOVER;
	}
	else if(currentRoomIndex == 5 || 
            currentRoomIndex == 6)
    {
        ret = Abbaye.MUSIC_WOOD;
    }
	else if (currentRoomIndex == 9) 
    {
        ret = Abbaye.MUSIC_HANGMAN;
	}
	else if(currentRoomIndex == 10  ||
            currentRoomIndex == 11  ||
            currentRoomIndex == 14  || 
            currentRoomIndex == 15  ||
            currentRoomIndex == 16  ||
            currentRoomIndex == 19  ||
            currentRoomIndex == 20) 
    {
        ret = Abbaye.MUSIC_CAVES;
	}
    else if(currentRoomIndex == 18) 
    {
        ret = Abbaye.MUSIC_EVIL_FIGHT;
	}
	else if(currentRoomIndex == 21 ||
            currentRoomIndex == 22 ||
            currentRoomIndex == 23) 
    {
        ret = Abbaye.MUSIC_HELL;
	}
	else if(currentRoomIndex == 24) 
    {
        var flag = this.getGlobalFlag('CROSS_USED');
        if(flag)
            ret = Abbaye.MUSIC_EVIL_FIGHT;
        else
            ret = Abbaye.MUSIC_WOOD;
            
	}
    return ret;
};

//-------------------------------------
Abbaye.Game.prototype.playFX = function(fx) 
{
    if(fx && Abbaye.allowFx)
    {
        var sound = this.musics[fx];
        if(sound)
        {
			sound.stop();
            sound.play();
        }
    }
};

//-------------------------------------
Abbaye.Game.prototype.afterKillHero = function() 
{
	if(this.hero.numHearts === 0)
	{
		this.stopAllMusic();
		Abbaye.STATES.sequence.run(Abbaye.Sequence.GAME_OVER);
	}
	else
	{
		this.setRoomByIndex(this.hero.chepointRoom);
		this.hero.resetHero();
	}
};

//---------------------------------
Abbaye.Game.prototype.addShoot = function(x, y, properties) 
{
    return this.shootManager.addShoot(x, y, properties);
};

//---------------------------------
Abbaye.Game.prototype.isCheckPointHere = function(roomIndex) 
{
	if(typeof roomIndex === 'undefined') roomIndex = this.currentRoomIndex;
	
	return (this.hero && roomIndex  ==  this.hero.chepointRoom);
};

//-------------------------------------
Abbaye.Game.prototype.checkTouch = function(a, b)
{
    if(!a || !b)
        return false;
 
    var aW = a.width;
    var aH = a.height;
    var bW = b.width;
    var bH = b.height;

    if(a.scale.x < 0)
        aW = -aW;
    if(a.scale.y < 0)
        aH = -aH;
    if(b.scale.x < 0)
        bW = -bW;
    if(b.scale.y < 0)
        bH = -bH;

    var aL = a.x - aW * a.anchor.x;
    var aT = a.y - aH * a.anchor.y;
    var aR = a.x + aW * (1 - a.anchor.x);
    var aB = a.y + aH * (1 - a.anchor.y);

    var bL = b.x - bW * b.anchor.x;
    var bT = b.y - bH * b.anchor.y;
    var bR = b.x + bW * (1 - b.anchor.x);
    var bB = b.y + bH * (1 - b.anchor.y);

    return !((bT > aB) ||
		     (aT > bB) ||
		     (bL > aR) ||
		     (aL > bR));	
};

//---------------------------------
Abbaye.Game.prototype.setGlobalFlag = function(name, value) 
{
    this.gameFlags[name] = value;
    
    // activate all the room items, so they can check the change
    if(this.currentRoom)
    {
        if(this.currentRoom.items !== null)
        {
            this.currentRoom.items.callAll('switchOn');
        }
        if(this.currentRoom.doors !== null)
        {
            this.currentRoom.doors.callAll('switchOn');
        }
    }
};

//---------------------------------
Abbaye.Game.prototype.getGlobalFlag = function(name) 
{
    if(this.gameFlags && this.gameFlags[name])
		return this.gameFlags[name];
		
	return false;
};

//---------------------------------
Abbaye.Game.prototype.setDelay = function(milliseconds) 
{
    var self = this;
    this.isOnDelay      = true;
    this.hero.isBlocked = true;
    this.game.paused    = true;

	this.game.sound.unsetMute();
    window.setTimeout(function(){
        self.isOnDelay      = false;
        self.hero.isBlocked = false;
        self.game.paused    = false;
    }, milliseconds);
};

//---------------------------------
Abbaye.Game.prototype.showScroll = function(index) 
{
    var scrolls = [{text: 'Twelve crosses\nagainst the devil', color: 0xFFFF00},
                    {text: 'Twelve brothers\nhid and died here', color: 0xFFFF00},
                    {text: 'Four brothers\nchanged their faith', color: 0xFFFF00},
                    {text: 'An invisible path\nover a wood bridge', color: 0xFFFF00},
                    {text: 'Jump to death\nand prove your faith', color: 0xFFFF00},
                    {text: 'Glide through\nthe beast cage', color: 0xFFFF00},
                    {text: 'your doom will come\nnot by my hand,\nbut by human hands', color: 0xFF0000},
                    {text: 'Heresy!!! The Cathar\nis hidden on the throne\nof Satan, burn him!', color: 0x00FFFF},
                    {text: 'Game paused', color: 0xFFFFFF}];
    
	if(typeof index === 'undefined') index = scrolls.length - 1;
    var info = scrolls[index];

    if(info)
    {
        Abbaye.STATES.game.stopAllMusic();
        Abbaye.STATES.game.playFX(Abbaye.FX_ITEM);
        
        this.scroll.show(info.text, info.color);
        this.game.paused = true;
		this.game.sound.unsetMute();

        // Add a input listener that can help us return from being paused
        this.game.input.keyboard.onDownCallback  = Abbaye.Game.prototype.hideScroll;
        this.game.input.keyboard.callbackContext = this;
		this.game.input.onDown.add(Abbaye.Game.prototype.hideScroll, this);
		
		this.scrollTimestamp = new Date();
    }
};

//---------------------------------
Abbaye.Game.prototype.hideScroll = function() 
{
    var currentTime = new Date();
    var elapsed = currentTime.getTime() - this.scrollTimestamp.getTime();
    if(elapsed < 500)
        return;

    this.game.input.keyboard.onDownCallback  = null;
    this.game.input.keyboard.callbackContext = null;
	this.game.input.onDown.remove(Abbaye.Game.prototype.hideScroll, this);
    
    Abbaye.STATES.game.scroll.hide();
    Abbaye.STATES.game.setRoomMusic();
    this.game.paused = false;
    
    if(this.getGlobalFlag('SHOW_LAST_SCROLL'))
    {
		if(this.getGlobalFlag('JEAN_CATCHED'))
		{
			this.sequenceJeanIsBurned();
		}
		else
		{
			this.sequenceCatchJean();
		}
    }
};

//---------------------------------
Abbaye.Game.prototype.buildStairs = function() 
{
    // Lets blok Jean and Satan for a while
    this.hero.isBlocked    = true;
    //this.hero.body.acceleration.x = this.hero.body.velocity.x;
    //this.hero.body.friction.x = 30;
    this.hero.body.velocity.x = 0;
    this.hero.animations.play('idle_stand');
    this.setGlobalFlag('PAUSE_ALL', true);
    this.currentRoom.enemies.callAll('switchOn');
	if(this.stairIndex === 0)
	{
		this.currentMusic.pause();
	}
    
    if(this.stairIndex < 12)
    {
        // Add one step on the stair
        this.playFX(Abbaye.FX_DOOR);
        ++this.stairIndex;
        --this.hero.numCross;
		
        this.panel.setNumCrosses(this.hero.numCross);
        this.currentRoom.items.callAll('switchOn');
        
        window.setTimeout(function() {
            Abbaye.STATES.game.buildStairs();
        }, 400);
    }
    else
    {
		this.currentMusic.resume();
        this.setGlobalFlag('PAUSE_ALL', false);
        this.currentRoom.enemies.callAll('switchOn');
        // Unblock Jean and Satan and show the cup
        this.hero.isBlocked    = false; 
        this.map.setCollisionByIndex(185);
        this.setGlobalFlag('CROSS_USED', true);
    }
};

//---------------------------------
Abbaye.Game.prototype.killSatan = function() 
{
    
	this.shootManager.killAll();
	Abbaye.STATES.game.map.setCollisionByIndex(185, false);
	this.satan.body.velocity.y = 0;
	this.satan.speed = 0;
	this.satan.isBlocked = true;
	Abbaye.STATES.game.setDelay(1000);
    this.currentRoom.items.callAll('switchOff');
	
	window.setTimeout(function() {
    	Abbaye.STATES.game.satan.animations.play('die');
	}, 800);
	
	window.setTimeout(function() {
    	Abbaye.STATES.game.satan.kill();
		Abbaye.STATES.game.setGlobalFlag('SHOW_LAST_SCROLL', true);
	}, 2000);

};


//---------------------------------
Abbaye.Game.prototype.sequenceCatchJean = function() 
{
	Abbaye.STATES.game.setGlobalFlag('CROSS_USED', true);
	Abbaye.STATES.game.setGlobalFlag('SHOW_LAST_SCROLL', true);
	
	this.panel.setVisible(false);
	
	this.hero.animations.play('idle_stand');
	this.hero.x = 28*Abbaye.TILE_SIZE;
	this.hero.y = 16*Abbaye.TILE_SIZE;
	this.hero.body.velocity.y = 0;
	this.hero.body.velocity.x = 0;
	this.hero.isBlocked       = true;
	this.hero.isGod           = true;
	
	Abbaye.STATES.game.setRoomByIndex(0);
};


//---------------------------------
Abbaye.Game.prototype.sequenceJeanIsCatched = function() 
{
	Abbaye.STATES.game.setGlobalFlag('JEAN_CATCHED', true);
	this.showScroll(7);
};

//---------------------------------
Abbaye.Game.prototype.sequenceJeanIsBurned = function() 
{
		
	this.hero.animations.play('jump');
	this.hero.x = 144.5*Abbaye.TILE_SIZE;
	this.hero.y = 17*Abbaye.TILE_SIZE;
	this.hero.body.velocity.y   = 0;
	this.hero.body.velocity.x   = 0;
	this.hero.isBlocked         = true;
	this.hero.isGod             = true;
	this.hero.body.allowGravity = false;
	
	Abbaye.STATES.game.setRoomByIndex(4);
	
	window.setTimeout(function() {
		Abbaye.STATES.game.hero.animations.play('die');
	}, 3000);
	
	window.setTimeout(function() {
		Abbaye.STATES.game.hero.visible = false;
	}, 5000);
	
	window.setTimeout(function() {
		Abbaye.STATES.sequence.run(Abbaye.Sequence.OUTRO);	
	}, 8000);
};