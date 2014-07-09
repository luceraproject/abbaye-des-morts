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
Abbaye.PanelManager = function(_game) 
{
    var posX = 0;
    var posY = 0;

    var font = {
        font: "18px venice_classicmedium",
        fill: "#fff",
        align: "center"
    };
    
    var margin = Abbaye.TILE_SIZE * 0.5;
    var offset = 0;
	
    this._game = _game;

    this.panel = this._game.add.graphics(0, 0);
    this.panel.lineStyle(1, 0x000000, 1);   // width, color (0x0000FF), alpha (0 -> 1) // required settings
    this.panel.beginFill(0x000000, 1);       // color (0xFFFF0B), alpha (0 -> 1) // required settings
    this.panel.drawRect(0, Abbaye.FULL_HEIGHT - Abbaye.PANEL_HEIGHT, Abbaye.SCREEN_WIDTH, Abbaye.PANEL_HEIGHT);
    this.panel.fixedToCamera = true;
    

    posY = Abbaye.FULL_HEIGHT - (Abbaye.PANEL_HEIGHT * 0.5);

    posX = margin;
    this.iconLives  = this._game.add.image(posX, posY, Abbaye.texture_game, 'bigheart');
    this.iconLives.fixedToCamera = true;
    this.iconLives.anchor.setTo(0, 0.5);
    
    posX = 32 + margin;
    this.iconCrosses= this._game.add.image(posX, posY, Abbaye.texture_game, 'bigcross');
    this.iconCrosses.fixedToCamera = true;
    this.iconCrosses.anchor.setTo(0, 0.5);

    posX = 16 + margin;
    this.txtLives   = this._game.add.text(posX, posY + offset, '0', font);
    this.txtLives.fixedToCamera = true;
    this.txtLives.anchor.setTo(0, 0.5);
    
    posX = 48 + margin;
    this.txtCrosses = this._game.add.text(posX, posY + offset, '0', font);
    this.txtCrosses.fixedToCamera = true;
    this.txtCrosses.anchor.setTo(0, 0.5);
    
    posX = Abbaye.SCREEN_WIDTH - margin;
    this.txtLevel   = this._game.add.text(posX,  posY + offset, 'Escape!!', font);
    this.txtLevel.align = 'right';
    this.txtLevel.fixedToCamera = true;
    this.txtLevel.anchor.setTo(1, 0.5);
};

//-------------------------------------
Abbaye.PanelManager.prototype.setNumLives = function(num) 
{
    this.txtLives.setText(num);
};

//-------------------------------------
Abbaye.PanelManager.prototype.setNumCrosses = function(num) 
{
    this.txtCrosses.setText(num);
};

//-------------------------------------
Abbaye.PanelManager.prototype.setLevelName = function(name) 
{
    this.txtLevel.setText(name);
};

//-------------------------------------
Abbaye.PanelManager.prototype.setVisible = function(visible) 
{
    this.iconLives.visible   = visible;
    this.iconCrosses.visible = visible;
    this.txtLives.visible    = visible;
    this.txtCrosses.visible  = visible;
    this.txtLevel.visible    = visible;
};

