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
Abbaye.ShooterEntity = function(_game, _x, _y, _w, _h, _properties)
{
    var anchorX = 0.5; 
    var anchorY = 0.5; 
    _x = _x + (_w * anchorX);
    _y = _y + (_h * anchorY);
    
    Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'empty');
    _game.add.existing(this);

    this._game = _game;
    this.properties = _properties;
    this.boundBox   = {x1:0, x2:8, y1:0, y2:8};

    this.head      = null;
    this.type      = Abbaye.ShooterEntity.getId(_properties.type);
    this.damage    = _properties.damage ? parseInt(_properties.damage, 10) !== 0 : true;
	
	this.initialDelay = 0;
	this.firstDelay   = 0;
	this.firstAnim    = null;
	this.secondDelay  = 0;
	this.secondAnim   = null;
	this.shootOnFirst = false;
	
    switch(this.type)
    {
        case Abbaye.ShooterEntity.ARCHER:
            this.firstAnim    = ['archer01'];
            this.secondAnim   = ['archer00'];
			this.initialDelay = 30/40;
			this.firstDelay   = 30/40;
			this.secondDelay  = 50/40;
            this.boundBox     = {x1:5, x2:14, y1:11, y2:23};
            break;
        case Abbaye.ShooterEntity.PLANT:
            this.firstAnim    = ['plant01'];
            this.secondAnim   = ['plant00'];
			this.initialDelay = 60/40;
			this.firstDelay   = 50/40;
			this.secondDelay  = 70/40;
			this.shootOnFirst = true;
            this.boundBox     = {x1:4, x2:12, y1:8, y2:16};
            break;
        case Abbaye.ShooterEntity.LEAK:
            this.firstAnim    = ['leak01'];
            this.secondAnim   = ['leak00'];
			this.initialDelay = 60/40;
			this.firstDelay   = 30/40;
			this.secondDelay  = 70/40;
            this.boundBox     = {x1:0, x2:16, y1:0, y2:8};
            this.damage       = false;
            break;
        case Abbaye.ShooterEntity.FLAME:
            this.firstAnim    = ['flame00', 'flame01'];
            this.secondAnim   = ['empty'];
			this.initialDelay = 0/40;
			this.firstDelay   = 70/40;
			this.secondDelay  = 30/40;
            this.boundBox     = {x1:2, x2:22, y1:0, y2:48};
            this.damage       = false;
            this.head       = this._game.add.image(_x - 2, _y - 8, Abbaye.texture_game, 'dragon00');
            this.head.anchor.setTo(anchorX, anchorY);
            break;
        case Abbaye.ShooterEntity.GARGOYLE:
            this.firstAnim    = ['gargoyle01'];
            this.secondAnim   = ['gargoyle00'];
			this.initialDelay = 40/40;
			this.firstDelay   = 30/40;
			this.secondDelay  = 40/40;
            this.boundBox     = {x1:2, x2:16, y1:0, y2:12};
            this.damage       = false;
            break;
        case Abbaye.ShooterEntity.FLUSH:

            this.firstAnim    = ['flush00', 'flush01', 'flush02', 'flush03', 'empty'];
            this.secondAnim   = ['empty'];
			this.initialDelay = 60/40;
			this.firstDelay   = 80/40;
			this.secondDelay  = 0/40;
            this.boundBox     = {x1:0, x2:16, y1:0, y2:8};
            this.damage       = false;
			this.visible      = false;
			this.shootOnFirst = true;
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
    

    if(_properties.delay)
        this.initialDelay += parseFloat(_properties.delay);

	var loop = (this.type == Abbaye.ShooterEntity.FLAME);
	var rate = (this.type == Abbaye.ShooterEntity.FLAME)?30:15;
    this.animations.add('first',  this.firstAnim,  rate, loop, false);
    this.animations.add('second', this.secondAnim, rate, loop, false);
    this.animations.play('first');
    this.anchor.setTo(anchorX, anchorY);

    this.stateTime   = 0;
    this.state       = Abbaye.ShooterEntity.STATE_INIT;

    this.x           = _x;
    this.y           = _y;
    this.solid       = true;
    this.immovable   = true;
    this.renderDebug = false;
    this.active      = true;
    
    this._game.physics.enable(this, Phaser.Physics.ARCADE);

    var offsetX = (this.boundBox.x1 + (this.boundBox.x2 - this.boundBox.x1)*0.5) - (_w * 0.5); 
    var offsetY = (this.boundBox.y1 + (this.boundBox.y2 - this.boundBox.y1)*0.5) - (_h * 0.5); 
    this.body.setSize(this.boundBox.x2 - this.boundBox.x1, this.boundBox.y2 - this.boundBox.y1, offsetX, offsetY);
    this.body.immovable    = true;
    this.body.allowGravity = false;

    this.switchOff();
};

Abbaye.ShooterEntity.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.ShooterEntity.prototype.constructor = Abbaye.ShooterEntity;

Abbaye.ShooterEntity.ARCHER   = 1;
Abbaye.ShooterEntity.PLANT    = 2;
Abbaye.ShooterEntity.LEAK     = 3;
Abbaye.ShooterEntity.GARGOYLE = 5;
Abbaye.ShooterEntity.FLUSH    = 6;
Abbaye.ShooterEntity.FLAME    = 7;


Abbaye.ShooterEntity.STATE_INIT   = 0;
Abbaye.ShooterEntity.STATE_FIRST  = 1;
Abbaye.ShooterEntity.STATE_SECOND = 2;

//-------------------------------------
Abbaye.ShooterEntity.getId = function(name)
{
    var ret = 0;
    switch(name)
    {
		case 'archer':
			ret = Abbaye.ShooterEntity.ARCHER;
		break;
		case 'plant':
			ret = Abbaye.ShooterEntity.PLANT;
		break;
		case 'leak':
			ret = Abbaye.ShooterEntity.LEAK;
		break;
		case 'gargoyle':
			ret = Abbaye.ShooterEntity.GARGOYLE;
		break;
		case 'flush':
			ret = Abbaye.ShooterEntity.FLUSH;
		break;
		case 'flame':
			ret = Abbaye.ShooterEntity.FLAME;
		break;
		default:
			window.console.log('Enemy shooter of type (' + name + ') not found.');
		break;
    }
    return ret;
};

//-------------------------------------
Abbaye.ShooterEntity.prototype.update = function () 
{
    if(this.active === false)
        return;

    if(this.type == Abbaye.ShooterEntity.ARCHER)
    {
        var hero = Abbaye.STATES.game.hero;
        this.scale.x = (this.x < hero.x) ? -1 : 1;
    }

    var timestamp = this.stateTime + this._game.time.elapsed / 1000;
    var limit = 0;
    switch(this.state)
    {
        case Abbaye.ShooterEntity.STATE_INIT:
            limit = this.initialDelay;
            break;
        case Abbaye.ShooterEntity.STATE_FIRST:
            limit = this.firstDelay;
            break;
        case Abbaye.ShooterEntity.STATE_SECOND:
            limit = this.secondDelay;
            break;
    }


    if(timestamp < limit)
    {
        this.stateTime = timestamp;
    }
    else 
    {
        this.stateTime = 0;
        if(this.state == Abbaye.ShooterEntity.STATE_INIT)
        {
            this.state = Abbaye.ShooterEntity.STATE_FIRST;
        }
        else if(this.state == Abbaye.ShooterEntity.STATE_FIRST)
        {
            this.state = Abbaye.ShooterEntity.STATE_SECOND;
			if(limit <= 0)
				return;

            this.animations.play('first');
			if(this.shootOnFirst == true)
			{
				this.doShoot();
			}
            if(this.type == Abbaye.ShooterEntity.FLAME)
            {
                this.head.y += Abbaye.TILE_HALF_SIZE;
                this.damage  = true;
				this.visible = true;

				Abbaye.STATES.game.playFX(Abbaye.FX_SHOOT);
            }
        }
        else if(this.state == Abbaye.ShooterEntity.STATE_SECOND)
        {

            this.state = Abbaye.ShooterEntity.STATE_FIRST;
			if(limit <= 0)
				return;
			
            this.animations.play('second');
			if(this.shootOnFirst == false)
			{
				this.doShoot();
			}
			
            if(this.type == Abbaye.ShooterEntity.FLAME)
            {
				this.head.y -= Abbaye.TILE_HALF_SIZE;
				this.damage  = false;
				this.visible = false;
			}
        }
    }
};

//-------------------------------------
Abbaye.ShooterEntity.prototype.doShoot = function () 
{
	//var width      = (this.boundBox.x2 - this.boundBox.x1);
	var height     = (this.boundBox.y2 - this.boundBox.y1);
	//var halfWidth  = width * 0.5;
	var halfHeight = height * 0.5;

	var fx_sound = Abbaye.FX_SHOOT;
	switch(this.type)
	{
		case Abbaye.ShooterEntity.ARCHER:
			Abbaye.STATES.game.addShoot(this.x, this.y + 2, {dir: ((this.scale.x == -1) ? Abbaye.MOVE_RIGHT : Abbaye.MOVE_LEFT), speed: 4, type: Abbaye.Shoot.ARROW});
			break;
		case Abbaye.ShooterEntity.PLANT:
			Abbaye.STATES.game.addShoot(this.x, this.y, {dir: Abbaye.MOVE_LEFT,  speedX: 1.125, speedY: 3.75, type: Abbaye.Shoot.SPORE});
			Abbaye.STATES.game.addShoot(this.x, this.y, {dir: Abbaye.MOVE_RIGHT, speedX: 1.125, speedY: 3.75, type: Abbaye.Shoot.SPORE});
			break;
		case Abbaye.ShooterEntity.LEAK:
			Abbaye.STATES.game.addShoot(this.x, this.y, {dir: Abbaye.MOVE_DOWN, speed: 2, type: Abbaye.Shoot.DROP});
			fx_sound = null;
			break;
		case Abbaye.ShooterEntity.GARGOYLE:
			Abbaye.STATES.game.addShoot(this.x, this.y + Abbaye.TILE_HALF_SIZE, {dir: Abbaye.MOVE_LEFT, speed: 4, type: Abbaye.Shoot.SPIT});
			break;
		case Abbaye.ShooterEntity.FLUSH:
			var min = 0;
			if(this.properties.min)
				min = parseInt(this.properties.min, 10);

			var properties = {dir: Abbaye.MOVE_UP, speed: 5, type: Abbaye.Shoot.FISH, min: min};
			var shoot = Abbaye.STATES.game.addShoot(this.x, this.y - 8, properties);
			shoot.setParent(this);
			fx_sound = Abbaye.FX_SLASH;
			break;
		case Abbaye.ShooterEntity.FLAME:
			Abbaye.STATES.game.addShoot(this.x - Abbaye.TILE_SIZE,      this.y + halfHeight - Abbaye.TILE_HALF_SIZE, {dir: Abbaye.MOVE_LEFT,  speed: 0.5, offset: 0, type: Abbaye.Shoot.FIRE});
			Abbaye.STATES.game.addShoot(this.x,                         this.y + halfHeight - Abbaye.TILE_HALF_SIZE, {dir: Abbaye.MOVE_LEFT,  speed: 0.5, offset: 1, type: Abbaye.Shoot.FIRE});
			Abbaye.STATES.game.addShoot(this.x,                         this.y + halfHeight - Abbaye.TILE_HALF_SIZE, {dir: Abbaye.MOVE_RIGHT, speed: 0.5, offset: 0, type: Abbaye.Shoot.FIRE});
			Abbaye.STATES.game.addShoot(this.x + Abbaye.TILE_SIZE,      this.y + halfHeight - Abbaye.TILE_HALF_SIZE, {dir: Abbaye.MOVE_RIGHT, speed: 0.5, offset: 1, type: Abbaye.Shoot.FIRE});
			fx_sound = null;
			break;
	}
	
	Abbaye.STATES.game.playFX(fx_sound);
	
}


//-------------------------------------
Abbaye.ShooterEntity.prototype.reset = function ()
{
    this.state = Abbaye.ShooterEntity.STATE_INIT;
    this.stateTime = 0;
    if(this.head)
    {
        this.head.y = this.y - this.head.height - 4;
    }

    this.animations.play('second');
};

//-------------------------------------
Abbaye.ShooterEntity.prototype.switchOff = function () 
{
    this.visible        = false;
    this.active         = false;
    if(this.head)
        this.head.visible = false;
};

//-------------------------------------
Abbaye.ShooterEntity.prototype.switchOn = function () 
{
	if(Abbaye.STATES.game.getGlobalFlag('SHOW_LAST_SCROLL'))
	{
		this.switchOff();

		if(this.head)
		{
        	this.head.y = this.y - this.head.height - 4;
			this.head.visible = true;
		}
		return;
	}
	
    this.visible        = true;
    this.active         = true;
    if(this.head)
        this.head.visible = true;
    this.reset();
};

//-------------------------------------
Abbaye.ShooterEntity.prototype.killShoot = function () 
{
    switch(this.type)
    {
        case Abbaye.ShooterEntity.FLUSH:
            this.animations.play('second');
            this.animations.play('first');
        break;
    }
};
