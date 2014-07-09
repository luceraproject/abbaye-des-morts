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
Abbaye.StaticEntity = function(_game, _x, _y, _w, _h, _properties)
{
	Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'empty');
	_game.add.existing(this);
    
    this._game = _game;
    this.properties  = _properties;
    this.boundBox    = {x1:0, x2:_w, y1:0, y2:_h};
    this.type        = Abbaye.StaticEntity.getId(_properties.type);
	this.damage      = _properties.damage ? parseInt(_properties.damage, 10) !== 0 : true;
	this.offset      = _properties.offset ? parseInt(_properties.offset, 10) : 0;
    this.x           = _x;
    this.y           = _y;
    this.renderDebug = false;
    this.active      = true;

    var names = null;
    var loop  = true;
    switch(this.type)
    {
        case Abbaye.StaticEntity.SPEAR:
            names = ['spear00'];
            loop  = false;
            this.boundBox = {x1:0, x2:8, y1:4, y2:8};
            //this.body.setSize(8, 4, 0, 4);
        break;
        case Abbaye.StaticEntity.WATER:
            names = [];
			// The water animation is separated have two animations, one from 0 to 3, and another from 4 to 7
			// Blocks should be placed alternately, so first animation is continued by the second one.
			// So animation needs two blocks that will animate as follows: [0, 4], [1, 5], [2, 6], [3, 7], [4, 0], [5, 1], [6, 2], [7, 3], and repeat
            for(var i = 0; i < 8; ++i)
            {
                names.push('water0' + ((i+this.offset) % 8));
            }
        break;
        case Abbaye.StaticEntity.LAVA:
            if(this.offset === 0)
                names = ['fire00', 'fire01'];
            else
                names = ['fire01', 'fire00'];
        break;
        case Abbaye.StaticEntity.DRAGON:
            this.boundBox = {x1:0, x2:82, y1:4, y2:39};
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
    
    if(names !== null)
    {
        this.animations.add('run', names, 10, loop, false);
        this.animations.play('run');
    }
    
    this._game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(this.boundBox.x2 - this.boundBox.x1, this.boundBox.y2 - this.boundBox.y1, this.boundBox.x1, this.boundBox.y1);
    this.body.immovable    = true;
    this.body.allowGravity = false;


    this.switchOff();
};

Abbaye.StaticEntity.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.StaticEntity.prototype.constructor = Abbaye.StaticEntity;


Abbaye.StaticEntity.SPEAR  = 1;
Abbaye.StaticEntity.WATER  = 2;
Abbaye.StaticEntity.LAVA   = 3;
Abbaye.StaticEntity.DRAGON = 4;


//-------------------------------------
Abbaye.StaticEntity.getId = function(name)
{
    var ret = 0;
    switch(name)
    {
    case 'spear':
        ret = Abbaye.StaticEntity.SPEAR;
    break;
    case 'water':
        ret = Abbaye.StaticEntity.WATER;
    break;
    case 'lava':
        ret = Abbaye.StaticEntity.LAVA;
    break;
    case 'dragon':
        ret = Abbaye.StaticEntity.DRAGON;
    break;
    default:
        console.log('Enemy static of type (' + name + ') not found.');
    break;
    }
    return ret;
};
    
//-------------------------------------
Abbaye.StaticEntity.prototype.update = function () {
};

//-------------------------------------
Abbaye.StaticEntity.prototype.switchOff = function () {
    this.visible = false;
    this.active  = false;
};

//-------------------------------------
Abbaye.StaticEntity.prototype.switchOn = function () {
    var defaultValue = true;
    if(this.type == Abbaye.StaticEntity.CROSS)
    {
        defaultValue = true;
        defaultValue = Abbaye.STATES.game.getGlobalFlag('CROSS_USED');
    }

    this.visible = defaultValue;
    this.active  = defaultValue;
};
