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
Abbaye.Step = function(_game, _x, _y, _w, _h, _properties) 
{
	Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'empty');
	_game.add.existing(this);
    
    this._game       = _game;
    this.properties  = _properties;
    this.x           = _x;
    this.y           = _y;
    this.renderDebug = false;
    this.active      = true;
    
    var width   = 8;
    var offsetx = 0;
    
    if(_properties.width)
    {
        width = Math.floor(parseInt(_properties.width, 10));
    }
    if(_properties.side)
    {
        if(_properties.side == 'right')
            offsetx = Abbaye.TILE_SIZE - width;
    }
    
    this._game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable    = true;
    this.body.allowGravity = false;
    this.body.setSize(width, 2, offsetx, 0);
};

Abbaye.Step.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.Step.prototype.constructor = Abbaye.Step;


    
//-------------------------------------
Abbaye.Step.prototype.update = function () 
{    
    this.active = (Abbaye.STATES.game.hero.y < this.y);
};

