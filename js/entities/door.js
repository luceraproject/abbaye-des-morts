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
Abbaye.Door = function(_game, _x, _y, _w, _h, _properties) 
{
	Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'empty');
	_game.add.existing(this);
		
    this._game      = _game;
    this.properties = _properties;
    this.type       = (_properties.type) ? parseInt(_properties.type, 10) : 0;
    this.isAnimated = (_properties.animated) ? (parseInt(_properties.animated, 10) === 1) : false;
    this.boundBox   = {x1:0, x2:_w, y1:0, y2:_h};
    this.closed     = (_properties.close) ? (parseInt(_properties.close, 10) !== 0) : false;
    
    //--
    this.actionIsClose     = (this.properties.close) ? (parseInt(this.properties.close, 10) !== 0) : false;
    this.isClosed          = !this.actionIsClose;
    this.actionOnFlagName  = this.properties.flag;
    this.actionOnFlagValue = (this.properties.value) ? (parseInt(this.properties.value, 10) !== 0) : !Abbaye.STATES.game.getGlobalFlag(this.properties.flag);
    this.activated         = false;
    
    switch(this.type)
    {
        case 0:
            this.boundBox   = {x1:0, x2:8, y1:0, y2:32};
        break;
        case 1:
            this.boundBox   = {x1:0, x2:8, y1:0, y2:32};
        break;
        case 2:
            this.boundBox   = {x1:0, x2:16, y1:-2, y2:16};
        break;
        case 3:
            this.boundBox   = {x1:0, x2:8, y1:0, y2:40};
        break;
    }

    var name = 'door0' + this.type;

    this.animations.add('on', [name], 10, false, false);
    this.animations.play('on');
		
    this._game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable    = true;
    this.body.allowGravity = false;
    
    this.x            = _x;
    this.y            = _y;
    this.stateTime    = 0;
    this.state        = 0;
    this.delay        = 1.0;

    this.solid        = true;
    this.immovable    = true;
    this.renderDebug  = false;
    this.active       = true;

    this.switchOff();
};

Abbaye.Door.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.Door.prototype.constructor = Abbaye.Door;

//-------------------------------------
Abbaye.Door.prototype.update = function () 
{
    if(this.isClosed === false || this.active === false || this.isAnimated === false)
        return;

    var timestamp = this.stateTime + this._game.time.elapsed / 1000;

    if(timestamp < this.delay)
    {
        this.stateTime = timestamp;
    }
    else 
    {
        this.stateTime = 0;
        if(this.state === 0)
        {
            this.state = 1;
            this.delay = 0.2;
            this.x    += 1;
			
			Abbaye.STATES.game.playFX(Abbaye.FX_JUMP);
        }
        else if(this.state === 1)
        {
            this.state = 0;
            this.delay = 1.0 + (Math.random() * 0.5);
            this.x    -= 1;
        }
    }
};

//-------------------------------------
Abbaye.Door.prototype.switchOff = function () 
{
    this.visible = false;
    this.active  = false;
    this.exists  = false;
};

//-------------------------------------
Abbaye.Door.prototype.switchOn = function () 
{
    var self = this;
    if(this.actionOnFlagName)
    {
        var state   = Abbaye.STATES.game.getGlobalFlag(this.actionOnFlagName);
        if(this.actionOnFlagValue == state && this.activated === false)
        {
            self.visible = self.isClosed;
            self.active  = self.isClosed;
            self.exists  = self.isClosed;
            
            this.isClosed = !this.isClosed;
            this.activated = true;
            
            setTimeout(function() {
                Abbaye.STATES.game.setDelay(800);
                setTimeout(function() {
                    self.visible = self.isClosed;
                    self.active  = self.isClosed;
                    self.exists  = self.isClosed;
                    Abbaye.STATES.game.playFX(Abbaye.FX_DOOR);
                }, 500);
            }, 500);
        }
        else
        {
            self.visible = self.isClosed;
            self.active  = self.isClosed;
            self.exists  = self.isClosed;
        }
    }
	else
	{
		self.visible = self.isClosed;
		self.active  = self.isClosed;
		self.exists  = self.isClosed;
	}
};