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
Abbaye.MovableEntity = function(_game, _x, _y, _w, _h, _properties) 
{
    var anchorX = 0.5; 
    var anchorY = 0.5; 
    _x = _x + (_w * anchorX);
    _y = _y + (_h * anchorY);
    
	Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'empty');
	_game.add.existing(this);
    
    this._game = _game;
    this.properties = _properties;
    this.boundBox   = {x1:0, x2:_w, y1:0, y2:_h};
	this.isBlocked  = false;
	this.rope       = null;

    var dir       = parseInt(_properties.dir, 10);
    var speed     = parseFloat(_properties.speed);
    var limitMin  = parseInt(_properties.min, 10)*Abbaye.TILE_SIZE;
    var limitMax  = parseInt(_properties.max, 10)*Abbaye.TILE_SIZE;
    var type      = this.getId(_properties.type);
    
    if(dir == Abbaye.MOVE_LEFT || dir == Abbaye.MOVE_RIGHT)
    {
        limitMin  += (_w * anchorX);
        limitMax  += (_w * anchorX);
    }
    else
    {
        limitMin  += (_h * anchorY);
        limitMax  += (_h * anchorY);
    }

    var loop = true;
    var names = null;
    switch(type)
    {
        case Abbaye.MovableEntity.RAT:
            names = ['rat00', 'rat01'];
            this.boundBox = {x1:1, x2:13, y1:6, y2:15};
            break;
        case Abbaye.MovableEntity.BAT:
            names = ['bat00', 'bat01'];
            this.boundBox = {x1:2, x2:14, y1:4, y2:14};
            break;
        case Abbaye.MovableEntity.SPIDER:
            this.color = (_properties.color) ? parseInt(_properties.color, 10) : 0;
            switch(this.color)
            {
                case 0:
                names = ['spider00', 'spider01'];
                break;
                case 1:
                names = ['spider02', 'spider03'];
                break;
            }
            this.boundBox = {x1:4, x2:12, y1:4, y2:12};
            break;
        case Abbaye.MovableEntity.FLY:
            this.color = (_properties.color) ? parseInt(_properties.color, 10) : 0;
            switch(this.color)
            {
                case 0:
                names = ['fly00', 'fly01'];
                break;
                case 1:
                names = ['fly02', 'fly03'];
                break;
                case 2:
                names = ['fly04', 'fly05'];
                break;
            }
            this.boundBox = {x1:2, x2:14, y1:3, y2:13};
            break;
        case Abbaye.MovableEntity.DARK_BAT:
            this.boundBox = {x1:2, x2:22, y1:5, y2:11};
            names = ['dark_bat00', 'dark_bat01'];
            break;
        case Abbaye.MovableEntity.WORM:
            this.boundBox = {x1:2, x2:13, y1:6, y2:8};
            names = ['worm00', 'worm01'];
            break;
        case Abbaye.MovableEntity.LAVA:
            this.boundBox = {x1:4, x2:12, y1:4, y2:12};
            names = ['lava00', 'lava01'];
            break;
        case Abbaye.MovableEntity.DEMON:
            this.boundBox = {x1:2, x2:12, y1:7, y2:23};
            names = ['demon00', 'demon01'];
            break;
        case Abbaye.MovableEntity.PALADIN:
            this.boundBox = {x1:3, x2:11, y1:6, y2:24};
            names = ['paladin00', 'paladin01'];
            break;
        case Abbaye.MovableEntity.TEMPLAR:
            anchorY = 1.0;
            this.boundBox = {x1:2, x2:12, y1:4, y2:24};
            names = ['templar00', 'templar01'];
			if(speed == 0)
				names = ['templar00'];
            break;
        case Abbaye.MovableEntity.SKELETON:
            this.boundBox = {x1:2, x2:12, y1:8, y2:24};
            names = ['skeleton00', 'skeleton01'];
            break;
        case Abbaye.MovableEntity.SKELETON_CEIL:
			this.boundBox = {x1:2, x2:12, y1:0, y2:16};
            names = ['skeletonceil00', 'skeletonceil01'];
            break;
        case Abbaye.MovableEntity.PRIEST:
            this.boundBox = {x1:4, x2:12, y1:3, y2:21};
            names = ['priest00'];
            loop = false;
            this.priestId = parseInt(_properties.priest, 10);
			
			var posY = parseFloat(_properties.rope) * Abbaye.TILE_SIZE;
			this.buildRope(this.x, posY);
            break;
        case Abbaye.MovableEntity.DEATH:
            names = ['death00', 'death01'];
            this.animations.add('shoot', ['death02'], 10, false, false);
            this.boundBox   = {x1:2, x2:30, y1:0, y2:20};
            break;
        case Abbaye.MovableEntity.SATAN:
            names = ['satan00', 'satan01'];
            this.animations.add('die', ['smoke00', 'smoke01'], 10, true, false);
            this.boundBox   = {x1:0, x2:32, y1:0, y2:48};
            break;
    }

    if(_properties.boundX1)
        this.boundBox.x1 = parseInt(_properties.boundX1, 10);
    if(_properties.boundX2)
        this.boundBox.x2 = parseInt(_properties.boundX2, 10);
    if(_properties.boundY1)
        this.boundBox.y1 = parseInt(_properties.boundY1, 10);
    if(_properties.boundY2)
        this.boundBox.y2 = parseInt(_properties.boundY2, 10);

    if(_properties.shootDelay)
        this.shootDelay = parseFloat(_properties.shootDelay);
    else
        this.shootDelay = 1.5;

    this.damage    = _properties.damage ? parseInt(_properties.damage, 10) !== 0 : true;

    if(dir == Abbaye.MOVE_LEFT || dir == Abbaye.MOVE_RIGHT)
    {
        limitMin  -= this.boundBox.x1;
        limitMax  += (_w - this.boundBox.x2);
    }
    else
    {
        limitMin  -= this.boundBox.y1;
        limitMax  += (_h - this.boundBox.y2);
    }
    
    if(names !== null)
    {
        this.animations.add('run', names, 10, loop, false);
        this.animations.play('run');
    }
    this.anchor.setTo(anchorX, anchorY);

    this.typeAbbaye    = type;
    this.origX   = _x;
    this.origY   = _y;
    this.origDir = dir;
    this.damage  = 1;

    this.shootTime   = 0;
    this.speed       = speed * Abbaye.PixelsPerSecond;
    this.x           = _x;
    this.y           = _y;
    this.dir         = dir;
    this.limitMin    = limitMin;
    this.limitMax    = limitMax;
    this.solid       = true;
    this.immovable   = true;
    this.renderDebug = true;
    this.active      = true;

    this._game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable    = true;
    this.body.allowGravity = false;
    var offsetX = (this.boundBox.x1 + (this.boundBox.x2 - this.boundBox.x1)*0.5) - (_w * 0.5); 
    var offsetY = (this.boundBox.y1 + (this.boundBox.y2 - this.boundBox.y1)*0.5) - (_h * 0.5); 
    this.body.setSize(this.boundBox.x2 - this.boundBox.x1, this.boundBox.y2 - this.boundBox.y1, offsetX, offsetY);
    
    

    this.reset();
    this.switchOff();
};

Abbaye.MovableEntity.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.MovableEntity.prototype.constructor = Abbaye.MovableEntity;


Abbaye.MovableEntity.RAT           = 1;
Abbaye.MovableEntity.BAT           = 2;
Abbaye.MovableEntity.SPIDER        = 3;
Abbaye.MovableEntity.FLY           = 4;
Abbaye.MovableEntity.DARK_BAT      = 5;
Abbaye.MovableEntity.WORM          = 6;
Abbaye.MovableEntity.DEMON         = 7;
Abbaye.MovableEntity.PALADIN       = 8;
Abbaye.MovableEntity.SKELETON      = 9;
Abbaye.MovableEntity.SKELETON_CEIL = 10;
Abbaye.MovableEntity.PRIEST        = 11;
Abbaye.MovableEntity.DEATH         = 12;
Abbaye.MovableEntity.SATAN         = 13;
Abbaye.MovableEntity.TEMPLAR       = 14;
Abbaye.MovableEntity.LAVA          = 15;

//-------------------------------------
Abbaye.MovableEntity.prototype.getId = function(name)
{
    var ret = 0;
    switch(name)
    {
    case 'rat':
        ret = Abbaye.MovableEntity.RAT;
    break;
    case 'bat':
        ret = Abbaye.MovableEntity.BAT;
    break;
    case 'spider':
        ret = Abbaye.MovableEntity.SPIDER;
    break;
    case 'fly':
        ret = Abbaye.MovableEntity.FLY;
    break;
    case 'dark_bat':
        ret = Abbaye.MovableEntity.DARK_BAT;
    break;
    case 'worm':
        ret = Abbaye.MovableEntity.WORM;
    break;
    case 'demon':
        ret = Abbaye.MovableEntity.DEMON;
    break;
    case 'paladin':
        ret = Abbaye.MovableEntity.PALADIN;
    break;
    case 'skeleton':
        ret = Abbaye.MovableEntity.SKELETON;
    break;
    case 'skeleton_ceil':
        ret = Abbaye.MovableEntity.SKELETON_CEIL;
    break;
    case 'priest':
        ret = Abbaye.MovableEntity.PRIEST;
    break;
    case 'death':
        ret = Abbaye.MovableEntity.DEATH;
    break;
    case 'satan':
        ret = Abbaye.MovableEntity.SATAN;
    break;
    case 'templar':
        ret = Abbaye.MovableEntity.TEMPLAR;
    break;
    case 'lava':
        ret = Abbaye.MovableEntity.LAVA;
    break;
    default:
        window.console.log('Enemy movable of type (' + name + ') not found.');
    break;
    }
    return ret;
};

//-------------------------------------
Abbaye.MovableEntity.prototype.update = function () 
{
	var timestamp;
	
    if(Abbaye.STATES.game.getGlobalFlag('PAUSE_ALL'))
    {
        return;
    }

    if(this.active === false)
        return;

    if(this.origDir == Abbaye.MOVE_LEFT || this.origDir == Abbaye.MOVE_RIGHT)
    {
        if(this.x - 1 > this.limitMax && this.dir == Abbaye.MOVE_RIGHT) 
        {
            this.dir = Abbaye.MOVE_LEFT;
            this.setFlipX(true);
            this.body.velocity.x = -this.speed;
        }
        else if(this.x + 1 < this.limitMin && this.dir == Abbaye.MOVE_LEFT)
        {
            this.dir = Abbaye.MOVE_RIGHT;
            this.setFlipX(false);
            this.body.velocity.x = this.speed;
        }
    }
    else if(this.origDir == Abbaye.MOVE_UP || this.origDir == Abbaye.MOVE_DOWN)
    {
        if(this.y - 1 > this.limitMax && this.dir == Abbaye.MOVE_DOWN) 
        {
            this.dir = Abbaye.MOVE_UP;
            this.setFlipX(true);
            this.body.velocity.y = -this.speed;
        }
        else if(this.y + 1 < this.limitMin && this.dir == Abbaye.MOVE_UP)
        {
            this.dir = Abbaye.MOVE_DOWN;
            this.setFlipX(false);
            this.body.velocity.y = this.speed;
        }
    }

	if(this.typeAbbaye == Abbaye.MovableEntity.PRIEST)
	{
		this.updatedRope();
	}
    else if(this.typeAbbaye == Abbaye.MovableEntity.DEATH)
    {
        timestamp = this.shootTime + this._game.time.elapsed / 1000;
        if(timestamp < this.shootDelay)
        {
            if(timestamp > (this.shootDelay - 0.2))
                this.animations.play('shoot');
            else if(this.shootTime > 0.2)
                this.animations.play('run');
            this.shootTime = timestamp;
        }
        else if(this.x > 48)
        {
            this.shootTime = 0;
			Abbaye.STATES.game.addShoot(this.x, this.y + 14, {dir: ((this.scale.x < 0) ? Abbaye.MOVE_RIGHT : Abbaye.MOVE_LEFT), speedX: 1, speedY: 1.5, type: Abbaye.Shoot.AXE});
            Abbaye.STATES.game.playFX(Abbaye.FX_SHOOT);
        }
    }
    else if(this.typeAbbaye == Abbaye.MovableEntity.SATAN)
    {
		if(this.isBlocked)
			return;
		
        this.setFlipX(true);
        timestamp = this.shootTime + this._game.time.elapsed / 1000;
        if(timestamp < this.shootDelay)
        {
            this.shootTime = timestamp;
        }
        else
        {
            this.shootTime = 0;
            Abbaye.STATES.game.addShoot(this.x, this.y, {dir: Abbaye.MOVE_ANY, speedX: -1.5, speedY: -0.5, type: Abbaye.Shoot.BALL});
            Abbaye.STATES.game.addShoot(this.x, this.y, {dir: Abbaye.MOVE_ANY, speedX: -1.5, speedY: 0,    type: Abbaye.Shoot.BALL});
            Abbaye.STATES.game.addShoot(this.x, this.y, {dir: Abbaye.MOVE_ANY, speedX: -1.5, speedY: 0.5,  type: Abbaye.Shoot.BALL});
            Abbaye.STATES.game.playFX(Abbaye.FX_SHOOT);
        }
    }
    else if(this.typeAbbaye == Abbaye.MovableEntity.TEMPLAR)
    {
		var bounds = Abbaye.STATES.game.getRoomBounds();
		//window.console.log(' templar (' + this.x + ', ' + this.y + ')');
        if(this.dir == Abbaye.MOVE_RIGHT) 
        {
            this.body.velocity.x = this.speed;
        }
        else if(this.x + 1 < this.limitMin && this.dir == Abbaye.MOVE_LEFT)
        {
            this.body.velocity.x = -this.speed;
        }
		
        var tx     = Math.floor(this.x / Abbaye.TILE_SIZE);
		
        // check collisions
		if(tx > bounds.x && tx < bounds.x + bounds.w)
		{
            this.body.allowGravity = true;
			Abbaye.STATES.game.game.physics.arcade.collide(this, Abbaye.STATES.game.layer, null, null, null);
		}
		else if(this.y != this.origY)
		{
			this.body.allowGravity = false;
			this.y = this.origY;
		}
		
        // check jump
		if(Abbaye.STATES.game.currentRoomIndex == 0)
		{
			if(tx == 19 || tx == 20 || tx == 21 || tx == 22)
			{
				if(this.body.blocked.down === false)
					return;

				this.body.velocity.y   = -110;
			}
			
			if(tx >= 25)
			{
				Abbaye.STATES.game.sequenceJeanIsCatched();
			}
		}
		else
		{
			if(tx == 19 || tx == 21 || tx == 59 || tx == 60)
			{
				if(this.body.blocked.down === false)
					return;

				this.body.velocity.y   = -110;
			}
		}
        if(tx == 42 || tx == 48 || tx == 52)
        {
            if(this.body.blocked.down === false)
                return;

            this.body.velocity.y   = -150;
        }
    }
};

//-------------------------------------
Abbaye.MovableEntity.prototype.reset = function () 
{
    this.x   = this.origX;
    this.y   = this.origY;
    this.dir = this.origDir;

    this.body.allowGravity = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.body.blocked.down = false;
    if(this.origDir == Abbaye.MOVE_LEFT || this.origDir == Abbaye.MOVE_RIGHT)
    {
        this.setFlipX(this.dir != Abbaye.MOVE_RIGHT);
        this.body.velocity.x = (this.dir == Abbaye.MOVE_RIGHT) ? this.speed : -this.speed;
    }
    else if(this.origDir == Abbaye.MOVE_DOWN || this.origDir == Abbaye.MOVE_UP)
    {
        this.setFlipX(this.dir != Abbaye.MOVE_DOWN);
        this.body.velocity.y = (this.dir == Abbaye.MOVE_DOWN) ? this.speed : -this.speed;
    }
    this.body.setSize(this.boundBox.x2 - this.boundBox.x1, this.boundBox.y2 - this.boundBox.y1, 0, 0);
    
};

//-------------------------------------
Abbaye.MovableEntity.prototype.buildRope = function (_x, _y) 
{
	var height   = this.y - _y;
	var numTiles = height / Abbaye.TILE_SIZE;
	
	this.rope = this._game.add.tileSprite(_x, _y, 8, height, Abbaye.texture_game, 'rope00');
};

//-------------------------------------
Abbaye.MovableEntity.prototype.updatedRope = function () 
{
	var height   = (this.y - this.height * this.anchor.y - 1) - this.rope.y;
	this.rope.height = height;
};

//-------------------------------------
Abbaye.MovableEntity.prototype.switchOff = function () 
{
    this.visible        = false;
    this.active         = false;
};

//-------------------------------------
Abbaye.MovableEntity.prototype.switchOn = function () 
{
	if(Abbaye.STATES.game.getGlobalFlag('SHOW_LAST_SCROLL') && this.typeAbbaye != Abbaye.MovableEntity.TEMPLAR)
	{
		this.switchOff();
		return;
	}
	
    this.visible = true;
    this.active  = true;
    
    if(Abbaye.STATES.game.getGlobalFlag('PAUSE_ALL'))
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        if(this.typeAbbaye == Abbaye.MovableEntity.SATAN)
        {
            if(Abbaye.STATES.game.getGlobalFlag('END_GAME'))
            {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                this.animations.play('die');
                Abbaye.STATES.game.playFX(Abbaye.FX_DEATH);
            }
            if(Abbaye.STATES.game.getGlobalFlag('SHOW_LAST_SCROLL'))
            {
                this.visible = false;
                this.active  = false;
                this.exists  = false;
            }
        }
    }
    else
    {    
        this.reset();
    }
};
