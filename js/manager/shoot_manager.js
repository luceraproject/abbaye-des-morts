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
Abbaye.ShootManager = function(game) 
{
    this.game = game;
    this.shootGroup = this.game.add.group();
};

//-------------------------------------
Abbaye.ShootManager.prototype.addShoot = function (x, y, properties) 
{
    var shoot = this.shootGroup.getFirstDead();
    if(shoot === null)
    {
        shoot = new Abbaye.Shoot(this.game, x, y, properties);
        this.shootGroup.add(shoot);
    }
    else
    {
        shoot.revive();
        shoot.reset(x, y, properties);
    }
    return shoot;
};


//-------------------------------------
Abbaye.ShootManager.prototype.update = function ()
{
    this.shootGroup.callAll("update");
};

//-------------------------------------
Abbaye.ShootManager.prototype.killAll = function ()
{
    this.shootGroup.callAll("kill");
};