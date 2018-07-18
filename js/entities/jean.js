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
/* global window */
//-------------------------------------
"use strict";
//-------------------------------------

//-------------------------------------
Abbaye.Jean = function(_game, _x, _y) 
{
	Phaser.Sprite.call(this, _game, _x, _y, Abbaye.texture_game);
	_game.add.existing(this);
    
    this._game = _game;
    this.lastAnimation  = 'idle_stand';
    this.isIdle         = true;
    this.canJump        = true;
    this.isDying        = false;
    this.isBlocked      = false;
    this.isJumping      = false;
    this.isFalling      = true;
    this.isCrawling     = false;
    this.isOnGround     = false;
    this.x              = _x;
    this.y              = _y;
    this.jumpSpeed      = 4.5  * Abbaye.PixelsPerSecond;
    this.walkSpeed      = 1    * Abbaye.PixelsPerSecond;
    this.crawlSpeed     = 0.25 * Abbaye.PixelsPerSecond;
    this.chepointRoom   = 5;
    this.chepointX      = _x;
    this.chepointY      = _y;
    this.numHearts      = 9;
    this.numCross       = 0;
    this.renderDebug    = false;
    this.boundBoxStand  = {x:0, y:0, w:8, h: 20};
    this.boundBoxCrawl  = {x:0, y:0, w:10, h: 8};
    this.boundBox       = this.boundBoxStand;
    this.isGod          = false;

    
    this.animations.add('idle_stand', ['walk00'], 10, true, false);
    this.animations.add('idle_crawl', ['crawl00'], 10, true, false);
    this.animations.add('jump', ['walk02'], 10, true, false);
    this.animations.add('walk', ['walk00', 'walk01'], 10, true, false);
    this.animations.add('crawl', ['crawl00', 'crawl01'], 10, true, false);
    this.animations.add('die', ['dead00', 'dead01', 'dead02'], 10, true, false);
    this.animations.play(this.lastAnimation);
    this.anchor.setTo(0.5, 1);
    
    this.emitter = this._game.add.emitter(0, 0, 200);
    this.emitter.makeParticles('blood');
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;
    this.emitter.gravity     = 150;
    this.emitter.bounce.setTo(0.5, 0.5);
        
    this._game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSizeCustom(this.boundBoxStand.w, this.boundBoxStand.h, this.boundBoxStand.x, this.boundBoxStand.y);
    this.body.collideWorldBounds = true;
    
    this.cursors = this._game.input.keyboard.createCursorKeys();
	this.timestamp = new Date();
    
};

Abbaye.Jean.prototype = Object.create(Phaser.Sprite.prototype);
Abbaye.Jean.prototype.constructor = Abbaye.Jean;

//-------------------------------------
Abbaye.Jean.prototype.processCallback = function(obj1, obj2) 
{
    if(obj2.index >= 1 && obj2.index <= 75)
        return true;
    
    return false;
};

//-------------------------------------
Abbaye.Jean.prototype.collideCallback = function(obj1, obj2) 
{
    if (obj2.index == 16 && obj2.index == 37 && obj2.index == 38)
    {
        return false;
    }
    
    return true;
};

//-------------------------------------
Abbaye.Jean.prototype.blockProcess = function(obj1, obj2) 
{
    if(obj1.y > obj2.y)
        return false;
    
    return true;
};

//-------------------------------------
Abbaye.Jean.prototype.blockHandle = function(obj1, obj2) 
{
    this.body.blocked.none = false;
    this.body.blocked.down = true;
    return true;
};

//---------------------------------
Abbaye.Jean.prototype.update = function () 
{
    var inc            = this.walkSpeed;
    var lastCrawling   = this.isCrawling;
    var lastIdle       = this.isIdle;
    var lastGround     = this.isOnGround;
    var lastJumping    = this.isJumping;
    var lastFalling    = this.isFalling;
    var crawlingChange = false;
    var idleChange     = false;
    var groundChange   = false;
    var jumpingChange  = false;
    var falling        = false;
    //var keyboard       = this._game.input.keyboard;
    
    if(this.isDying)
        return;
	
	if(this.isBlocked)
	{
		if(Abbaye.STATES.game.getGlobalFlag('SHOW_LAST_SCROLL'))
		{
			var currentTime = new Date();
			var elapsed = currentTime.getTime() - this.timestamp.getTime();
			if(elapsed > 1200)
			{
                this.toggleFlipX();
				this.timestamp = new Date();
			}
		}
		return;
	}
    
	var leftIsPressed  = Abbaye.STATES.game.inputManager.isPressed(Phaser.Keyboard.LEFT);
	var rightIsPressed = Abbaye.STATES.game.inputManager.isPressed(Phaser.Keyboard.RIGHT);
	var upIsPressed    = Abbaye.STATES.game.inputManager.isPressed(Phaser.Keyboard.UP);
	var downIsPressed  = Abbaye.STATES.game.inputManager.isPressed(Phaser.Keyboard.DOWN);
	
    // update horizontal movement
    if(leftIsPressed == rightIsPressed)
    {
        this.isIdle = true;
        this.body.velocity.x  = 0;
    }
    else
    {
        if(this.isCrawling)
            inc = this.crawlSpeed;

        if(leftIsPressed)
        {
            this.setFlipX(true);
            if(this.body.blocked.left === false)
                this.body.velocity.x  = -inc;
        }
        if(rightIsPressed)
        {
            this.setFlipX(false);
            if(this.body.blocked.right === false)
                this.body.velocity.x  = inc;
        }
        this.isIdle = false;
    }
    
    this.isOnGround = this.body.blocked.down;
    if(this.body.blocked.down)
    {
        if(upIsPressed && this.canJump)
        {
            if(this.isCrawling === false)
            {
                Abbaye.STATES.game.playFX(Abbaye.FX_JUMP);
                this.body.velocity.y = -this.jumpSpeed;
                this.velocityBackup  = this.body.velocity.y;
                this.canJump         = false;
            }
        }
        else if(upIsPressed === false && this.canJump === false)
        {
            this.canJump = true;
        }
        else
        {
            if(downIsPressed)
            {
                this.isCrawling = true;
            }
            else
            {
                if(this.isCrawling && this.canStandUp())
                    this.isCrawling = false;
            }
        }
    }

    //--
    // update animation
    crawlingChange = this.isCrawling != lastCrawling;
    idleChange     = this.isIdle     != lastIdle;
    groundChange   = this.isOnGround != lastGround;
    jumpingChange  = this.isJumping  != lastJumping;
    falling        = this.isFalling  != lastFalling;

    if(this.isOnGround)
    {
        if(groundChange || crawlingChange || idleChange)
        {
            this.setCurrentAnimation();
        }
    }
    else if(groundChange || jumpingChange || falling)
    {
        this.animations.play('jump');
        this.lastAnimation = 'jump';
    }

    if(crawlingChange)
    {
        if(this.isCrawling)
        {
            this.body.setSizeCustom(this.boundBoxCrawl.w, this.boundBoxCrawl.h, this.boundBoxCrawl.x, this.boundBoxCrawl.y);
        }
        else
        {
            this.body.setSizeCustom(this.boundBoxStand.w, this.boundBoxStand.h, this.boundBoxStand.x, this.boundBoxStand.y);
        }
    }
};

//---------------------------------
Abbaye.Jean.prototype.render = function () 
{
	Abbaye.pixelContext.drawImage(this._game.canvas, this.x, this.y, this.width, this.height, 0, 0, Abbaye.width, Abbaye.height);
};

//---------------------------------
Abbaye.Jean.prototype.setCurrentAnimation = function() 
{
    var anim = null;
    if(this.isCrawling === false && this.isIdle)
        anim = 'idle_stand';
    if(this.isCrawling && this.isIdle)
        anim = 'idle_crawl';
    if(this.isCrawling === false && this.isIdle === false)
        anim = 'walk';
    if(this.isCrawling && this.isIdle === false)
        anim = 'crawl';

    if(this.lastAnimation !== anim && anim !== null)
    {
        this.lastAnimation = anim;
        this.animations.play(anim);
        //console.log('Animation: ' + anim);
    }
};

//---------------------------------
// Checks if can stand up while crawling
Abbaye.Jean.prototype.canStandUp = function()
{

    var left   = this.body.x - (this.body.width * this.anchor.x);
    //var right  = this.body.x + (this.body.width * (1 - this.anchor.x));
    var top    = this.body.y - (this.body.height * this.anchor.y);
    //var bottom = this.body.y - (this.body.height * (1 - this.anchor.y));
    var tiles = Abbaye.STATES.game.layer.getTiles(left, top, this.body.width, this.body.height, true);
    if(tiles.length > 0)
    {
        for(var i = 0; i < tiles.length; ++i)
        {
            if(tiles[i].faceBottom)
                return false;
        }
    }

    return true;
};

//---------------------------------
Abbaye.Jean.prototype.kill = function(killer)
{
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.animations.play('die');
    this.isDying = true;
    this.body.allowGravity = false;
    --this.numHearts;
    Abbaye.STATES.game.panel.setNumLives(this.numHearts);

    Abbaye.STATES.game.playFX(Abbaye.FX_DEATH);
    
    window.setTimeout(function() {
        Abbaye.STATES.game.afterKillHero();
    }, 1000);
	
	//window.console.log('Jean is killed !!');
};

//---------------------------------
Abbaye.Jean.prototype.resetHero = function()
{
    this.animations.play('idle_stand');
    this.body.allowGravity = true;
    this.isDying        = false;
    this.isOnGround     = false;
    this.isJumping      = false;
    this.isFalling      = true;
    this.isIdle         = true;
    this.x       = this.chepointX;
    this.y       = this.chepointY;
    this.body.x  = this.chepointX;
    this.body.y  = this.chepointY;
    this.body.velocity.x  = 0;
    this.body.velocity.y  = 0;
	
	//window.console.log('Jean is reset !!');
	
	this.enterRoom();
};

//---------------------------------
Abbaye.Jean.prototype.enterRoom = function()
{
	this.timestamp = new Date();
};

//---------------------------------
Abbaye.Jean.prototype.checkKill = function(object, collider)
{
	// HACK: Avoid kill when just entered in a room
	var currentTime = new Date();
	var elapsed = currentTime.getTime() - object.timestamp.getTime();
	if(elapsed < 200)
		return;
	
	// If the enemy can kill us, we die
    if(collider.visible && collider.active && collider.damage)
    {
        if(object.isGod)
        {
            object.emitter.x = object.x;
            object.emitter.y = object.y;
            object.emitter.start(true, 2000, null, 1);
        }
        else
        {
            object.kill(collider);
        }
    }
};

//---------------------------------
Abbaye.Jean.prototype.useItem = function(object, collider)
{
	// If we can use it, we do it
    if(collider.used === true)
        return;

    collider.doAction(object);
};

//---------------------------------
Abbaye.Jean.prototype.setCheckPoint = function(roomIndex, x, y) 
{
    this.chepointRoom = roomIndex;
    this.chepointX    = x;
    this.chepointY    = y;
};

//---------------------------------
Abbaye.Jean.prototype.addHeart = function() 
{
    if(this.numHearts < 9)
    {
        this.numHearts++;
        Abbaye.STATES.game.panel.setNumLives(this.numHearts);
    }
};

//---------------------------------
Abbaye.Jean.prototype.addCross = function() 
{
    this.numCross++;
    Abbaye.STATES.game.panel.setNumCrosses(this.numCross);
};