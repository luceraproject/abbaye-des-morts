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
/* global Phaser */
/* global window */
//-------------------------------------
"use strict";
//-------------------------------------

var Abbaye;

if(!Abbaye)
	Abbaye = {};

Abbaye.BASE_PATH       = "";

Abbaye.SCREEN_COLS     = 32;
Abbaye.SCREEN_ROWS     = 22;
Abbaye.PANEL_ROWS      = 2;
Abbaye.TILE_SIZE       = 8;
Abbaye.TILE_HALF_SIZE  = 4;
Abbaye.PixelsPerSecond = 40;

Abbaye.SCREEN_WIDTH  = Abbaye.SCREEN_COLS   * Abbaye.TILE_SIZE;
Abbaye.SCREEN_HEIGHT = Abbaye.SCREEN_ROWS   * Abbaye.TILE_SIZE;
Abbaye.PANEL_HEIGHT  = Abbaye.PANEL_ROWS    * Abbaye.TILE_SIZE;
Abbaye.FULL_HEIGHT   = Abbaye.SCREEN_HEIGHT + Abbaye.PANEL_HEIGHT;

Abbaye.STATES = {};

Abbaye.MUSIC_TITLE      = 'music_title';
Abbaye.MUSIC_GAMEOVER   = 'music_gameover';
Abbaye.MUSIC_PRAYER     = 'music_prayer';
Abbaye.MUSIC_MANHUNT    = 'music_manhunt';
Abbaye.MUSIC_CHURCH     = 'music_church';
Abbaye.MUSIC_WOOD       = 'music_wood';
Abbaye.MUSIC_HANGMAN    = 'music_hangman';
Abbaye.MUSIC_CAVES      = 'music_caves';
Abbaye.MUSIC_EVIL_FIGHT = 'music_evil_fight';
Abbaye.MUSIC_HELL       = 'music_hell';

Abbaye.FX_DOOR      = 'door';
Abbaye.FX_ITEM      = 'item';
Abbaye.FX_JUMP      = 'jump';
Abbaye.FX_MECHANISM = 'mechanism';
Abbaye.FX_DEATH     = 'death';
Abbaye.FX_SHOOT     = 'shoot';
Abbaye.FX_SLASH     = 'slash';

Abbaye.MOVE_LEFT  = 0;
Abbaye.MOVE_RIGHT = 1;
Abbaye.MOVE_UP    = 2;
Abbaye.MOVE_DOWN  = 3;
Abbaye.MOVE_ANY   = 4;

Abbaye.allowMusic = true;
Abbaye.allowFx    = true;

Abbaye.game       = null;
Abbaye.orientated = true;

Abbaye.texture_menu = 'menu';
Abbaye.texture_game = 'abbaye_texture';
Abbaye.texture_tiles = 'tiles';

//-------------------------------------
window.onload = function() 
{
	var game = new Phaser.Game(Abbaye.SCREEN_WIDTH, Abbaye.FULL_HEIGHT, Phaser.CANVAS, 'abbaye', null, false, false);
	
	Abbaye.game = game;
	Abbaye.STATES.boot      = new Abbaye.Boot(game);
	Abbaye.STATES.loader    = new Abbaye.Loader(game);
	Abbaye.STATES.menu      = new Abbaye.Menu(game);
	Abbaye.STATES.sequence  = new Abbaye.Sequence(game);
	Abbaye.STATES.game      = new Abbaye.Game(game);
    
	game.state.start("Boot");
};
