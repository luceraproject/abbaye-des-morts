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
Abbaye.Block = function(_game, _x, _y, _w, _h, _properties) 
{
	Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'minicross00');
	_game.add.existing(this);
    
    this._game       = _game;
    this.properties  = _properties;
    this.x           = _x;
    this.y           = _y;
    
    var names        = ['minicross00', 'minicross01', 'minicross02', 'minicross03'];
    this.animations.add('run', names, 10, true, false);
    
    this.switchOff();
};

Abbaye.Block.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.Block.prototype.constructor = Abbaye.Block;
    
//-------------------------------------
Abbaye.Block.prototype.update = function () 
{    
};

//-------------------------------------
Abbaye.Block.prototype.switchOff = function () 
{
    this.visible = false;
    this.active  = false;
    this.exists  = false;
};

//-------------------------------------
Abbaye.Block.prototype.switchOn = function () 
{
    var active = false;
    if(!Abbaye.STATES.game.getGlobalFlag('SHOW_LAST_SCROLL'))
    {
        if(this.properties.index)
        {
            var state = Abbaye.STATES.game.stairIndex;
            var index = parseInt(this.properties.index);
            active = (index<state);
        }

        if(Abbaye.STATES.game.getGlobalFlag('CROSS_USED'))
            this.animations.play('run');
    }
    
    this.visible = active;
    this.active  = active;
    this.exists  = active;

};