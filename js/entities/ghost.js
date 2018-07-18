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
Abbaye.Ghost = function(_game, _x, _y, _w, _h, _properties) 
{
	Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'empty');
	_game.add.existing(this);

    this._game       = _game;
    this._properties = _properties;
    this.boundBox    = {x1:1, x2:14, y1:0, y2:15};

    this.animations.add('run', ['ghost00', 'ghost01'], 10, true, false);
    this.animations.play('run');

    this.origX     = _x;
    this.origY     = _y;
    this.damage    = 1;
    this.searching = false;
    this.speedX    = 0;
    this.speedY    = 0;
    this.delay     = 500;

    this.speed       = 20;
    this.x           = _x;
    this.y           = _y;
    this.active      = true;
    
    this.anchor.setTo(0.5, 0.5);
    
    this._game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable    = true;
    this.body.allowGravity = false;
    this.body.setSize(this.boundBox.x2 - this.boundBox.x1, this.boundBox.y2 - this.boundBox.y1, 0, 0);
    
    this.reset();
    this.switchOff();
};

Abbaye.Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.Ghost.prototype.constructor = Abbaye.Ghost;

//-------------------------------------
Abbaye.Ghost.prototype.update = function () 
{
    
    if(this.active === false)
        return;
    var currentTime = new Date();
    var elapsed = currentTime.getTime() - this.startTimestamp.getTime();
    if(elapsed < this.delay)
        return;


    var hero = Abbaye.STATES.game.hero;
    
    // calculate sort path direction and speed
    var destX  = hero.body.center.x;
    var destY  = hero.body.center.y;
    var diffX  = destX - this.body.center.x;
    var diffY  = destY - this.body.center.y;
    var speedY = 0;
    var speedX = 0;
    var forceX = false;
    var forceY = false;

    //--
    this._game.physics.arcade.collide(this, Abbaye.STATES.game.layer, null, null, null);

    //--
    forceX = this.body.blocked.up   || this.body.blocked.down;
    forceY = this.body.blocked.left || this.body.blocked.right;

    if(this.searching === false)
    {
        if(forceX || forceY)
        {
            this.searching = true;
            this.speedX = (diffX < 0) ? -this.speed : this.speed;
            this.speedY = (diffY < 0) ? -this.speed : this.speed;
        }
    }
    else
    {
         if(!forceX && !forceY)
         {
            this.searching = false;
            this.speedX = 0;
            this.speedY = 0;
         }
    }
    
    if(this.searching === false)
    {
        if(Math.abs(diffY) >= 4)
        {
            speedY = (diffY < 0) ? -this.speed : this.speed;
        }
        
        if(Math.abs(diffX) >= 4)
        {
            speedX = (diffX < 0) ? -this.speed : this.speed;
        }
    }
    else
    {
        speedX = this.speedX;
        speedY = this.speedY;
    }

    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;
    
    this.setFlipX(speedX < 0);
};

//-------------------------------------
Abbaye.Ghost.prototype.reset = function () 
{
    this.x         = this.origX;
    this.y         = this.origY;
    this.speedX    = 0;
    this.speedY    = 0;
    this.searching = false;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.startTimestamp = new Date();
};

//-------------------------------------
Abbaye.Ghost.prototype.switchOff = function () 
{
    this.visible        = false;
    this.active         = false;
};

//-------------------------------------
Abbaye.Ghost.prototype.switchOn = function () 
{
    this.visible        = true;
    this.active         = true;
    this.reset();
};