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
//-------------------------------------
"use strict";
//-------------------------------------

//-------------------------------------
Abbaye.ScrollManager = function(_game) 
{
    var posX = 0;
    var posY = 0;

    var font = {
        font: "18px venice_classicmedium",
        fill: "#000",
        align: "center"
    };
    
    //var margin = Abbaye.TILE_SIZE * 0.5;
    
    this._game = _game;

    this.panel = this._game.add.graphics(0, 0);
    this.panel.lineStyle(1, 0x000000, 1);   // width, color (0x0000FF), alpha (0 -> 1) // required settings
    this.panel.beginFill(0x000000, 1);       // color (0xFFFF0B), alpha (0 -> 1) // required settings
    this.panel.drawRect(0, 0, Abbaye.SCREEN_WIDTH, Abbaye.FULL_HEIGHT);
    this.panel.fixedToCamera = true;

    posX = Abbaye.SCREEN_WIDTH * 0.5;
    posY = Abbaye.FULL_HEIGHT  * 0.5;
	
    this.background               = this._game.add.image(posX, posY, 'scroll');
    this.background.fixedToCamera = true;
    this.background.anchor.setTo(0.5, 0.5);
    
    this.text               = this._game.add.text(posX, posY, '', font);
    this.text.fixedToCamera = true;
    this.text.anchor.setTo(0.5, 0.5);
    
    this.hide();
};

//-------------------------------------
Abbaye.ScrollManager.prototype.show = function(text, color) 
{
    this.text.setText(text);
    this.background.tint = color;
    
    this.panel.visible      = true;
    this.background.visible = true;
    this.text.visible       = true;
};

//-------------------------------------
Abbaye.ScrollManager.prototype.hide = function() 
{
    this.panel.visible      = false;
    this.background.visible = false;
    this.text.visible       = false;
};