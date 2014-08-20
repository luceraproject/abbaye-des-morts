![L'Abbaye des morts](http://lucera-project.com/wp-content/uploads/2014/08/abbaye-480x300.jpg)

# L'Abbaye des morts

L'Abbaye des morts is a game from [locomalito](http://www.locomalito.com/abbaye_des_morts.php) ported to HTML5 + JS by [Lucera Project](http://www.lucera-project.com)

[Play online](http://www.lucera-project.com/products/abbaye/)

### Tools:

 * As code editor we used [Brackets.io](http://brackets.io/)
 * As base framework we used [Phaser](http://www.phaser.io), a very helpfull library
 * The maps have been done with [Tiled](http://www.mapeditor.org/)
 * As an image editor we used [Paint.NET](http://www.getpaint.net/)

### Modifications:

As commented in [this issue](https://github.com/photonstorm/phaser/issues/992) we need to make some modifications to Phaser in order to get the proper behaviour, so we include the modified file in the js/libs folfer.
The file "js/libs/phaser.js" has been modified to let our hero keep flying when collides vertically with the roof in the midle of a jump.
The modified methods are "processTileSeparationX" and "processTileSeparationY".
