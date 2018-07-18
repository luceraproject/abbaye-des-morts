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
Abbaye.ActionEntity = function(_game, _x, _y, _w, _h, _properties)
{
	Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game, 'empty');
	_game.add.existing(this);
    
    this._game = _game;
    this.properties  = _properties;
    this.boundBox = {x1:0, x2:_w, y1:0, y2:_h};
    this.hideWhenUsed = false;
    this.repeat       = false;

    var type      = Abbaye.ActionEntity.getId(_properties.type);

    var namesOn = null;
    var namesOff = null;
    switch(type)
    {
        case Abbaye.ActionEntity.CHECKPOINT:
            namesOn  = ['checkpoint01'];
            namesOff = ['checkpoint00'];
            this.boundBox = {x1:4, x2:12, y1:12, y2:24};
        break;
        case Abbaye.ActionEntity.BELL:
            namesOn  = ['bell00'];
            namesOff = ['bell01'];
        break;
        case Abbaye.ActionEntity.SWITCH:
            namesOn  = ['switch00'];
            namesOff = ['switch01'];
            this.repeat = true;
        break;
        case Abbaye.ActionEntity.TOGGLE:
            namesOn  = ['toggle00'];
            namesOff = ['toggle01'];
            this.offset = (_properties.mode) ? parseInt(_properties.mode, 10) : 0;
        break;

        case Abbaye.ActionEntity.HEART:
            namesOn  = ['heart00', 'heart01'];
            namesOff = ['heart00', 'heart01'];
            this.boundBox = {x1:4, x2:12, y1:4, y2:12};
            this.hideWhenUsed = true;
        break;
        case Abbaye.ActionEntity.CROSS:
            namesOn  = ['cross00', 'cross01', 'cross02', 'cross03'];
            namesOff = ['anticross00', 'anticross01', 'anticross02', 'anticross03'];
            this.hideWhenUsed = true;
            this.mode = (_properties.mode) ? parseInt(_properties.mode, 10) == 1 : true;
            this.boundBox = {x1:4, x2:12, y1:4, y2:12};
        break;
        case Abbaye.ActionEntity.SCROLL:
            this.hideWhenUsed = true;
            this.offset = (_properties.mode) ? parseInt(_properties.mode, 10) : 0;
            var color   = (_properties.visible) ? 0 : 1;
            namesOn  = ['scroll0' + color];
            namesOff = ['scroll0' + color];
            this.boundBox = {x1:2, x2:14, y1:2, y2:14};
        break;
        case Abbaye.ActionEntity.CUP:
            this.hideWhenUsed = true;
            namesOn  = ['cup00'];
            namesOff = ['cup00'];
            this.boundBox = {x1:2, x2:14, y1:2, y2:14};
        break;
        case Abbaye.ActionEntity.TELETRANSPORT:
            namesOn  = ['tele00', 'tele01', 'tele02', 'tele03'];
            namesOff = ['tele00', 'tele01', 'tele02', 'tele03'];
            this.boundBox = {x1:4, x2:12, y1:14, y2:24};
            this.repeat = true;
        break;
        case Abbaye.ActionEntity.TRIGGER:
            namesOn  = ['empty'];
            namesOff = ['empty'];
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

    this.animations.add('off', namesOff, 5, true, false);
    this.animations.add('on',  namesOn,  5, true, false);
    this.animations.play('on');
    
    if(_properties.repeat && parseInt(this.properties.repeat, 10) !== 0)
        this.repeat = true;

    this.type         = type;
    this.x            = _x;
    this.y            = _y;
    //this.touched      = false;
    this.used         = false;

    //this.solid        = true;
    //this.immovable    = true;
    //this.renderDebug  = true;
    this.active       = true;

    Abbaye.STATES.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSizeOriginal(this.boundBox.x2 - this.boundBox.x1, this.boundBox.y2 - this.boundBox.y1, this.boundBox.x1, this.boundBox.y1);
    this.body.immovable    = true;
    this.body.allowGravity = false;

    this.switchOff();
};

Abbaye.ActionEntity.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.ActionEntity.prototype.constructor = Abbaye.ActionEntity;


Abbaye.ActionEntity.CHECKPOINT    = 1;
Abbaye.ActionEntity.BELL          = 2;
Abbaye.ActionEntity.SWITCH        = 3;
Abbaye.ActionEntity.TOGGLE        = 4;
Abbaye.ActionEntity.HEART         = 5;
Abbaye.ActionEntity.CROSS         = 6;
Abbaye.ActionEntity.SCROLL        = 7;
Abbaye.ActionEntity.CUP           = 8;
Abbaye.ActionEntity.TELETRANSPORT = 9;
Abbaye.ActionEntity.TRIGGER       = 10;


//-------------------------------------
Abbaye.ActionEntity.getId = function(name)
{
    var ret = 0;
    switch(name)
    {
    case 'checkpoint':
        ret = Abbaye.ActionEntity.CHECKPOINT;
    break;
    case 'bell':
        ret = Abbaye.ActionEntity.BELL;
    break;
    case 'switch':
        ret = Abbaye.ActionEntity.SWITCH;
    break;
    case 'toggle':
        ret = Abbaye.ActionEntity.TOGGLE;
    break;
    case 'heart':
        ret = Abbaye.ActionEntity.HEART;
    break;
    case 'cross':
        ret = Abbaye.ActionEntity.CROSS;
    break;
    case 'scroll':
        ret = Abbaye.ActionEntity.SCROLL;
    break;
    case 'cup':
        ret = Abbaye.ActionEntity.CUP;
    break;
    case 'teletransport':
        ret = Abbaye.ActionEntity.TELETRANSPORT;
    break;
    case 'trigger':
        ret = Abbaye.ActionEntity.TRIGGER;
    break;
    default:
        console.log('Action item of type (' + name + ') not found.');
    break;
    }
    return ret;
};
    
//-------------------------------------
Abbaye.ActionEntity.prototype.update = function () 
{
    if(this.used && this.repeat) //(this.type == Abbaye.ActionEntity.SWITCH || this.type == Abbaye.ActionEntity.TELETRANSPORT))
    {
        //check collision with hero and set (this.used = false) if dont collides
        if(Abbaye.STATES.game.hero)
            this.used = Abbaye.STATES.game.checkTouch(Abbaye.STATES.game.hero, this);
    }
};

//-------------------------------------
Abbaye.ActionEntity.prototype.doAction = function (hero) 
{
    if(this.used)
        return;

    var fxIndex = Abbaye.FX_ITEM;
    switch(this.type)
    {
        case Abbaye.ActionEntity.CHECKPOINT:
            Abbaye.STATES.game.hero.setCheckPoint(Abbaye.STATES.game.currentRoomIndex, this.x + this.width*0.5, this.y + this.height);
            fxIndex = Abbaye.FX_DOOR;
        break;
        case Abbaye.ActionEntity.BELL:
            Abbaye.STATES.game.setGlobalFlag('BELL', true);
            Abbaye.STATES.game.setDelay(1000);
            fxIndex = Abbaye.FX_MECHANISM;
        break;
        case Abbaye.ActionEntity.TOGGLE:
            Abbaye.STATES.game.setGlobalFlag('TOGGLE0' + this.offset, true);
            Abbaye.STATES.game.setDelay(1000);
            fxIndex = Abbaye.FX_MECHANISM;
        break;
        case Abbaye.ActionEntity.SWITCH:
            var currentSwitch = Abbaye.STATES.game.getGlobalFlag('SWITCH');
            currentSwitch = !currentSwitch;
            this.animations.play(currentSwitch ? 'on' : 'off');
            Abbaye.STATES.game.setGlobalFlag('SWITCH', currentSwitch);
            Abbaye.STATES.game.setDelay(1000);
            fxIndex = Abbaye.FX_MECHANISM;
        break;
        case Abbaye.ActionEntity.HEART:
            hero.addHeart();
        break;
        case Abbaye.ActionEntity.CROSS:
            var gameSwitch = Abbaye.STATES.game.getGlobalFlag('SWITCH');
            if(this.mode != gameSwitch)
                return;
            hero.addCross();
        break;
        case Abbaye.ActionEntity.SCROLL:
            //Abbaye.STATES.game.playFX(Abbaye.FX_ITEM);    // fx is played inside 'showScroll'
            Abbaye.STATES.game.showScroll(this.offset);
            fxIndex = null;
        break;
        case Abbaye.ActionEntity.CUP:
            Abbaye.STATES.game.killSatan();
            fxIndex = Abbaye.FX_MECHANISM;
        break;
        case Abbaye.ActionEntity.TELETRANSPORT:
            hero.x = (this.properties.x) ? parseInt(this.properties.x, 10)*Abbaye.TILE_SIZE : this.x;
            hero.y = (this.properties.y) ? parseInt(this.properties.y, 10)*Abbaye.TILE_SIZE : this.y;
            hero.body.velocity.y = 0;
            Abbaye.STATES.game.setRoomByIndex(parseInt(this.properties.room, 10));
        break;
        case Abbaye.ActionEntity.TRIGGER:
            if(this.properties.flag)
			{
                Abbaye.STATES.game.setGlobalFlag(this.properties.flag, true);

				if(this.properties.flag.toUpperCase() == 'ENTER')
				{
					var tilex = 66;
					var tiley = 40;
					Abbaye.STATES.game.hero.setCheckPoint(Abbaye.STATES.game.currentRoomIndex, tilex*Abbaye.TILE_SIZE, tiley*Abbaye.TILE_SIZE);
				}
			}
            fxIndex = null;
        break;
    }
    
    Abbaye.STATES.game.playFX(fxIndex);

    this.used = true;
    if(this.type != Abbaye.ActionEntity.SWITCH)
    {
        if(this.hideWhenUsed === false)
            this.animations.play('off');
    }
    this.visible = !this.hideWhenUsed;
};

//-------------------------------------
Abbaye.ActionEntity.prototype.switchOff = function ()
{
    this.visible        = false;
    this.active         = false;
};

//-------------------------------------
Abbaye.ActionEntity.prototype.switchOn = function ()
{
	var value;
    this.visible        = this.hideWhenUsed ? !this.used : true;
    this.active         = this.hideWhenUsed ? !this.used : true;

    if(this.type == Abbaye.ActionEntity.CUP)
    {
        value = Abbaye.STATES.game.getGlobalFlag('CROSS_USED');

		if(value && !this.used)
        	Abbaye.STATES.game.playFX(Abbaye.FX_DOOR);
		
        this.visible        = (value && !this.used);
        this.active         = (value && !this.used);
    }
    else if(this.type == Abbaye.ActionEntity.CROSS)
    {
        value = Abbaye.STATES.game.getGlobalFlag('SWITCH');
        this.animations.play(this.mode == value ? 'on' : 'off');
    }
    else if(this.type == Abbaye.ActionEntity.SWITCH)
    {
        value = Abbaye.STATES.game.getGlobalFlag('SWITCH');
        this.animations.play(value ? 'on' : 'off');
    }
    else if(this.type == Abbaye.ActionEntity.CHECKPOINT)
    {
        value = Abbaye.STATES.game.isCheckPointHere();
        this.animations.play(value ? 'off' : 'on');
        this.used = value;
    }
    else if(this.type == Abbaye.ActionEntity.TELETRANSPORT)
    {
        if(Abbaye.STATES.game.hero)
            this.used = Abbaye.STATES.game.checkTouch(Abbaye.STATES.game.hero, this);
    }
    else if(this.type == Abbaye.ActionEntity.SCROLL)
    {
        if(Abbaye.STATES.game.currentRoomIndex == 24)
        {
            if(Abbaye.STATES.game.getGlobalFlag('SHOW_LAST_SCROLL'))
            {
                this.visible = true;
                this.active  = true;
            }
            else
            {
                this.visible = false;
                this.active  = false;
            }
        }
    }
};