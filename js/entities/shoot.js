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
Abbaye.Shoot = function(_game, _x, _y, _properties) 
{
    Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'empty');
	_game.add.existing(this);
    
    this._game = _game;
    
    this._game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable    = true;
    this.body.allowGravity = false;
    
    this.reset(_x, _y, _properties);
};

Abbaye.Shoot.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.Shoot.prototype.constructor = Abbaye.Shoot;

Abbaye.Shoot.ARROW         = 1;
Abbaye.Shoot.SPORE         = 2;
Abbaye.Shoot.FIRE          = 3;
Abbaye.Shoot.DROP          = 4;
Abbaye.Shoot.SPIT          = 6;
Abbaye.Shoot.FISH          = 7;
Abbaye.Shoot.AXE           = 8;
Abbaye.Shoot.BALL          = 9;


//-------------------------------------
Abbaye.Shoot.getId = function(name)
{
    var ret = 0;
    switch(name)
    {
    case 'arrow':
        ret = Abbaye.Shoot.ARROW;
    break;
    case 'spore':
        ret = Abbaye.Shoot.SPORE;
    break;
    case 'fire':
        ret = Abbaye.Shoot.FIRE;
    break;
    case 'drop':
        ret = Abbaye.Shoot.DROP;
    break;
    case 'spit':
        ret = Abbaye.Shoot.SPIT;
    break;
    case 'fish':
        ret = Abbaye.Shoot.FISH;
    break;
    case 'axe':
        ret = Abbaye.Shoot.AXE;
    break;
    case 'ball':
        ret = Abbaye.Shoot.BALL;
    break;
    }
    return ret;
};

//-------------------------------------
Abbaye.Shoot.prototype.reset = function (x, y, properties) {
    this.properties = properties;
    this.boundBox   = {x1:0, x2:8, y1:0, y2:8};

    if(typeof properties.type === "string")
        this.type   = Abbaye.Shoot.getId(properties.type);
    else
        this.type   = properties.type;

    if(typeof properties.dir === "string")
        this.dir = parseInt(properties.dir, 10);
    else
        this.dir = properties.dir;

    if(typeof properties.speed === "undefined")
        this.speed = 1;
    else if(typeof properties.speed === "string")
        this.speed = parseFloat(properties.speed);
    else
        this.speed = properties.speed;

    if(typeof properties.min === "undefined")
        this.limitMin = 0;
    else if(typeof properties.min === "string")
        this.limitMin = parseInt(properties.min, 10);
    else
        this.limitMin = properties.min;
    this.limitMin *= Abbaye.TILE_SIZE;

    this.body.allowGravity = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    
    var names = null;
    switch(this.type)
    {
        case Abbaye.Shoot.ARROW:
            names = ['arrow00'];
            this.boundBox = {x1:3, x2:12, y1:7, y2:11};
            break;
        case Abbaye.Shoot.SPORE:
            names = ['spore01'];
            this.boundBox = {x1:0, x2:4, y1:0, y2:4};
    		this.body.allowGravity = true;
            break;
        case Abbaye.Shoot.FIRE:
            if(properties.offset === 1)
                names = ['fire01', 'fire00'];
            else
                names = ['fire00', 'fire01'];
            this.boundBox = {x1:2, x2:6, y1:2, y2:6};
            break;
        case Abbaye.Shoot.DROP:
            names = ['leak02'];
            this.boundBox = {x1:5, x2:10, y1:5, y2:10};
            break;
        case Abbaye.Shoot.SPIT:
            names = ['spit00'];
            this.boundBox = {x1:0, x2:11, y1:2, y2:3};
            break;
        case Abbaye.Shoot.FISH:
            names = ['fish00', 'fish01'];
            this.boundBox = {x1:2, x2:13, y1:0, y2:9};
            this.body.allowGravity = true;
            break;
        case Abbaye.Shoot.AXE:
            names = ['axe00', 'axe01', 'axe02', 'axe03'];
            this.boundBox = {x1:0, x2:16, y1:0, y2:16};
            break;
        case Abbaye.Shoot.BALL:
            names = ['spore00'];
            this.boundBox = {x1:0, x2:4, y1:0, y2:4};
            break;
    }

    if(properties.boundX1)
        this.boundBox.x1 = parseInt(properties.boundX1, 10);
    if(properties.boundX2)
        this.boundBox.x2 = parseInt(properties.boundX2, 10);
    if(properties.boundY1)
        this.boundBox.y1 = parseInt(properties.boundY1, 10);
    if(properties.boundY2)
        this.boundBox.y2 = parseInt(properties.boundY2, 10);


	var loop = (names && names.length > 0);
    this.animations.add('run', names, 5, loop, false);
    this.animations.play('run');

    this.origX       = x;
    this.origY       = y;
    this.y           = y;
    this.x           = x;
    this.damage      = true;
    this.solid       = true;
    this.immovable   = true;
    this.renderDebug = false;
    this.active      = true;
    this.visible     = true;
    this.alive       = true;
    this.isFalling   = false;
    this.gravity     = 2;
    this.parentEntity = null;

    this.scale.x     = 1;
    this.anchor.setTo(0.5, 0.5);
    
    this.body.velocity.x  = 0;
    this.body.velocity.y  = 0;
    this.body.setSize(this.boundBox.x2 - this.boundBox.x1, this.boundBox.y2 - this.boundBox.y1, 0, 0);

    
    if(typeof properties.speedX === "undefined")
        this.speedX = this.speed;
    else if(typeof properties.speedX === "string")
        this.speedX = parseFloat(properties.speedX);
    else
        this.speedX = properties.speedX;

    if(typeof properties.speedY === "undefined")
        this.speedY = this.speed;
    else if(typeof properties.speedY === "string")
        this.speedY = parseFloat(properties.speedY);
    else
        this.speedY = properties.speedY;
	
	this.speedX *= Abbaye.PixelsPerSecond;
	this.speedY *= Abbaye.PixelsPerSecond;

    if(this.dir == Abbaye.MOVE_LEFT)
    {
        this.body.velocity.x = -this.speedX;
    }
    else if(this.dir == Abbaye.MOVE_RIGHT)
    {
        this.body.velocity.x = this.speedX;
        this.scale.x     = -1;
    }
    else if(this.dir == Abbaye.MOVE_DOWN)
    {
        this.body.velocity.y = this.speedY;
    }
    else if(this.dir == Abbaye.MOVE_UP)
    {
        this.body.velocity.y = -this.speedY;
    }
    else
    {
        this.body.velocity.x = this.speedX;
        this.body.velocity.y = this.speedY;
    }

    if(this.type == Abbaye.Shoot.SPORE)
    {
        this.body.velocity.y  = -this.speedY;
        this.maxVelocity = 80;
    }

    if(this.type == Abbaye.Shoot.AXE)
    {
        this.isFalling = true;
    }
};

//-------------------------------------
Abbaye.Shoot.prototype.completeTween = function () 
{

//    if(this.movementTween != null)
//        this._game.remove(this.movementTween);
    this.parentEntity.killShoot();
};

//-------------------------------------
Abbaye.Shoot.prototype.update = function () 
{
    if(this.active === false)
        return;

    this.checks();
};


//-------------------------------------
Abbaye.Shoot.prototype.checks = function () {
    var map = Abbaye.STATES.game.map;
    var tx, ty;
    //var tw, th;
    var tile = null;

    
    var x = this.x;
    var y = this.y;
    if(this.dir == Abbaye.MOVE_LEFT)
    {
        x -= (this.boundBox.x2 - this.boundBox.x1)*0.5;
    }
    else if(this.dir == Abbaye.MOVE_RIGHT)
    {
        x += (this.boundBox.x2 - this.boundBox.x1)*0.5;
    }
    else if(this.dir == Abbaye.MOVE_DOWN)
    {
        y += (this.boundBox.y2 - this.boundBox.y1)*0.5;
    }
    else if(this.dir == Abbaye.MOVE_UP)
    {
        y -= (this.boundBox.y2 - this.boundBox.y1)*0.5;
    }
    
    tx = Math.floor(x / Abbaye.TILE_SIZE);
    ty = Math.floor(y / Abbaye.TILE_SIZE);
    
    //tw = Math.floor((this.boundBox.x2 - this.boundBox.x1)*0.5 / Abbaye.TILE_SIZE);
    //th = Math.floor((this.boundBox.y2 - this.boundBox.y1)*0.5 / Abbaye.TILE_SIZE);
    switch(this.type)
    {
        case Abbaye.Shoot.FISH:
        case Abbaye.Shoot.ARROW:
        case Abbaye.Shoot.SPIT:
        case Abbaye.Shoot.DROP:
        case Abbaye.Shoot.BALL:
            tile = map.getTile(tx, ty, 'map', true);
            break;
        case Abbaye.Shoot.FIRE:
            tile = map.getTile(tx, ty + 1, 'map', true);
            break;
        case Abbaye.Shoot.SPORE:
            tile  = map.getTile(tx, ty);
            //this.body.velocity.y += this.gravity;
            //if(this.body.velocity.y > this.maxVelocity)
            //	this.body.velocity.y = this.maxVelocity;
            break;
        case Abbaye.Shoot.AXE:
            var tx2 = Math.floor((this.x - (this.boundBox.x2 - this.boundBox.x1)*0.5) / Abbaye.TILE_SIZE);
            var ty2 = Math.floor((this.y - (this.boundBox.y2 - this.boundBox.y1)*0.5) / Abbaye.TILE_SIZE);
            
            var tile1   = map.getTile(tx2,     ty2 + 2, 'map', true);
            var tile2   = map.getTile(tx2 + 1, ty2 + 2, 'map', true);
            if(this.dir == Abbaye.MOVE_LEFT)
                tile1   = map.getTile(tx2 + 2, ty2 + 2, 'map', true);

            if((tile1 && tile1.index > 0 && tile1.index <= 75) ||
                (tile2 && tile2.index > 0 && tile2.index <= 75))
            {
                if(this.dir == Abbaye.MOVE_LEFT)
                    this.body.velocity.x = -this.speedX;
                else if(this.dir == Abbaye.MOVE_RIGHT)
                    this.body.velocity.x = this.speedX;
                this.body.velocity.y = 0;

                this.isFalling = false;
            }
            else
            {
                this.body.velocity.x = 0;
                this.body.velocity.y = this.speedY;

                this.isFalling  = true;
            }
        break;
    }

    if(tile)
    {
        if(tile.index > 0 && tile.index <= 75 && tile.index != 37)
        {
            switch(this.type)
            {
                case Abbaye.Shoot.ARROW:
                case Abbaye.Shoot.SPIT:
                case Abbaye.Shoot.DROP:
                case Abbaye.Shoot.SPORE:
                case Abbaye.Shoot.BALL:
                    this.kill();
                break;
            }
        }
        else
        {
            if(this.type == Abbaye.Shoot.FISH)
            {
                if(this.body.velocity.y > 0 && this.y >= this.origY - Abbaye.TILE_SIZE)
                {
                    this.kill();
                }
            }
            else if(this.type == Abbaye.Shoot.FIRE)
            {
                this.kill();
            }
            else if(this.type == Abbaye.Shoot.BALL && tile.index == 185 && Abbaye.STATES.game.getGlobalFlag('CROSS_USED') === true)
            {
                this.kill();
            }
        }
    }

    var roomBounds = Abbaye.STATES.game.getRoomBounds();
    //Check limits
    if( (tx < roomBounds.x+2) || (tx >= (roomBounds.x+roomBounds.w - 2)) ||
        (ty < roomBounds.y+1) || (ty >= (roomBounds.y+roomBounds.h - 1)))
    {
        this.kill();
    }
};

//-------------------------------------
Abbaye.Shoot.prototype.kill = function () {
    this.active  = false;
    this.visible = false;
    this.alive   = false;
    
    this.body.velocity.y = 0;
    this.body.velocity.y = 0;
    
    if(this.type == Abbaye.Shoot.FISH)
        this.parentEntity.killShoot();
    
    Phaser.Sprite.prototype.kill.apply(this);
};

//-------------------------------------
Abbaye.Shoot.prototype.setParent = function (parent) {
    this.parentEntity  = parent;
};
