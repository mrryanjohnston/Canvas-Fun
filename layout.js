/**
* Prevents click-based selection of text in all matched elements.
*/

jQuery.fn.disableTextSelection = function(){
    return this.each(function(){   
        if (typeof this.onselectstart != "undefined"){ //IE
            this.onselectstart = function() { return false; };
        }else if (typeof this.style.MozUserSelect != "undefined"){ //Firefox
            this.style.MozUserSelect = "none";
        }else{ // All others
            this.onmousedown = function() { return false; };
        }   
    }); 
};

$(document).ready(function() {

    $('#container').disableTextSelection();

    var newDeck = new deck();
    var stage = new Kinetic.Stage({
        container: "container",
        width: 600,
        height: 400
    });
    var layer = new Kinetic.Layer();
    var table = new Kinetic.Layer();
    var tablerect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 600,
        height: 400,
        fill: "grey",
        stroke: "black",
        strokeWidth: 4
    });

    table.add(tablerect);

    var rect = new Kinetic.Rect({
        x: snapArea.x,
        y: snapArea.y,
        width: 75,
        height: 100,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 4
    });

    layer.add(rect);
    stage.add(table);
    stage.add(layer);

    $('#deckCount1').html(newDeck.numberInDeck);

    $('#dealbutton').click(function() {
        newDeck.deal(function(card) {
        var imageObj = new Image();
        imageObj.onload = function() {
            if (!this.initialized) {
                var image = new Kinetic.Image({
                    x: stage.getWidth() / 2 - 53,
                    y: stage.getHeight() / 2 - 59,
                    crop: cardsprite[card.suit + card.value],
                    width: canvascardwidth,
                    height: canvascardheight,
                    image: imageObj,
                    draggable: true,
                    offset: [canvascardwidth/2, canvascardheight/2],
                });
                image.type    = "card";
                image.tapped  = false;
                image.value   = card.value;
                image.suit    = card.suit;
                this.initialized = true;
                image.tap     = function() {
                    if(!image.tapped) {
                        image.rotateDeg(90);
                    } else {
                        image.rotateDeg(-90);
                    }
                    image.tapped = !(image.tapped);
                }
                layer.add(image);
                stage.add(layer);
                image.on("mouseover", function() {
                    document.body.style.cursor = "pointer";
                });
                image.on("mouseout", function() {
                    document.body.style.cursor = "default";
                });
                image.on('dragstart', function() {
                    image.moveToTop();
                });
                image.on('dblclick', function() {
                    image.tap();
                    layer.draw();
                });
                image.on('dragend', function() {
                    // If this is near the right side, snap the card to it.
                    if(isNearSnapArea(image, snapArea)) {
                        image.attrs.x = snapArea.x;
                        image.attrs.y = snapArea.y;
                        layer.draw();
                    }
                    isNearCardSnapArea(image, layer, function(snapTo) { 
                        image.attrs.x = snapTo.x;
                        image.attrs.y = snapTo.y;
                        layer.draw();
                    }); 
                });
            }
        }
        imageObj.src = spriteurl;
        var notificationText = "<p>Dealt one card. It was a " + card.name + " with a value of " + card.value + ", suit of " + card.suit + ", and color of " + card.color + ".</p> ";
        $(notificationText).hide().prependTo('#actionarea').slideToggle("slow");
        $('#deckCount1').html(newDeck.numberInDeck);
        });
    });

    $('#cardspriteheightwidth').click(function() {
        cardheight = $('#cardonspriteheight').val();
        cardwidth  = $('#cardonspritewidth').val();
        initSprites(cardheight, cardwidth);
        // Retroactively apply this new setting to old cards
        for (var x = 0; x < layer.children.length; x++) {
            if(layer.children[x].type === "card") {
                //layer.children[x].setImage(imageObj);
                layer.children[x].setCrop(cardsprite[layer.children[x].suit + layer.children[x].value]);
            }
        }
    layer.draw();
    });

    $('#cardheightwidth').click(function() {
        canvascardheight = $('#cardheight').val();
        canvascardwidth  = $('#cardwidth').val();
        // Retroactively apply this new sprite to old cards
        for (var x = 0; x < layer.children.length; x++) {
            if(layer.children[x].type === "card") {
                layer.children[x].setHeight(canvascardheight);
                layer.children[x].setWidth(canvascardwidth);
                layer.children[x].setOffset(canvascardwidth/2, canvascardheight/2);
            }
        }
        layer.draw();
    });

    $('#roundUp').click(function() {
        var roundNum = parseInt($('span#roundCount').html())+1;
        $('span#roundCount').html(roundNum);
    });
        
    $('#roundDown').click(function() {
        var roundNum = parseInt($('span#roundCount').html())-1;
        $('span#roundCount').html(roundNum);
    });

    $('#rollDie').click(function() {
        var dieRoll = Math.floor(Math.random() * (parseInt($('input#dieSides').val())))+1;
        $('span#dieValue').html(dieRoll);
        // Report the die rolling results in the actionarea
        //var notificationText = "<p>Rolled a die of X sides with a result of <b>Y<b></p> ";
        //$(notificationText).hide().prependTo('#actionarea').slideToggle("slow");
    });

    $('#spritebutton').click(function() {
        spriteurl = $('#spriteurl').val();
        // Retroactively apply this new sprite to old cards
        // We'll have to just remove the card and then create a new one in its place.
        var numberOfChildren = layer.children.length;
        for (var x = 0; x < numberOfChildren; x++) {
            if(layer.children[x].type === "card") {
                //var oldCard = layer.children[x];
                var imageObj = layer.children[x].getImage();
                imageObj.src = spriteurl
                // layer.children[x].attrs.image.src = spriteurl
                layer.children[x].setImage(imageObj);
            }
        }
    layer.draw();
    });

    table.on('mouseup', function(mouse) {
        this.off('mousemove.tableselect');
        var tableselect = this.get('.tableselect');
        if(tableselect.length > 0) {
            var group = new Kinetic.Group({
                name: 'selectgroup',
                draggable: true
            });
            var selectCoverage = { 'x': [tableselect[0].getX(), tableselect[0].getX()+tableselect[0].getWidth()], 'y': [tableselect[0].getY(), tableselect[0].getY()+tableselect[0].getHeight()] }
            // MADNESS https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort
            function compareNumbers(a, b)  {  
              return a - b;  
            }
            selectCoverage.x.sort(compareNumbers);
            selectCoverage.y.sort(compareNumbers);
            console.log(selectCoverage);
            for (var x = 0; x < layer.children.length; x++) {
                if(layer.children[x].type === "card") {
                    var cardX = layer.children[x].getX();
                    var cardY = layer.children[x].getY();
                    if(cardX > selectCoverage.x[0] && cardX < selectCoverage.x[1] && cardY > selectCoverage.y[0] && cardY < selectCoverage.y[1]) {
                        layer.children[x].setStroke('red');
                        layer.children[x].setStrokeWidth(5);
                        group.add(layer.children[x]);
                    }
                }
            }
            if(group.children.length > 0) {
                layer.add(group);
                layer.draw();
            }
            this.remove(tableselect[0]);
            this.draw();
        }
    });

    table.on('mousedown', function(mouse) {
        this.off('mousemove.tableselect');
        var tableselect = this.get('.tableselect');
        if(tableselect.length > 0) {
            this.remove(tableselect[0]);
        }
        var tableselect = new Kinetic.Rect({
            name: 'tableselect',
            x: mouse.layerX,
            y: mouse.layerY,
            width: 0,
            height: 0,
            fill: "grey",
            stroke: "black",
            strokeWidth: 4
        });
        this.add(tableselect);
        this.on('mousemove.tableselect', function(move) {
            var position = tableselect.getPosition();
            tableselect.setSize(move.layerX-position.x, move.layerY-position.y);
            this.draw();
        });
    });
});
