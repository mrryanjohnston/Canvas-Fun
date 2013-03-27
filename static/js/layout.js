/**
* Prevents click-based selection of text in all matched elements.
*/

jQuery.fn.disableTextSelection = function() {
    return this.each(function() {
        if (typeof this.onselectstart != "undefined") { //IE
            this.onselectstart = function() { return false; };
        }else if (typeof this.style.MozUserSelect != "undefined") { //Firefox
            this.style.MozUserSelect = "none";
        }else{ // All others
            this.onmousedown = function() { return false; };
        }
    });
};

$(document).ready(function() {

    $('#container').disableTextSelection();

    var side_width = 600;
    var side_height = 600;
    var buffer_width = 15;
    var buffer_height = 15;

    var new_deck = new deck();
    var stage = new Kinetic.Stage({
        container: "container",
        width: 2 * side_width,
        height: side_height 
    });
    var layer = new Kinetic.Layer();
    var table = new Kinetic.Layer();
    var table_home_rect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: side_width,
        height: side_height,
        fill: "lightgrey",
        stroke: "black",
        strokeWidth: 3
    });
    table.add(table_home_rect);

    var table_away_rect = new Kinetic.Rect({
        x: side_width,
        y: 0,
        width: side_width,
        height: side_height,
        fill: "grey",
        stroke: "black",
        strokeWidth: 3
    });
    table.add(table_away_rect);

    var pile_rect = new Kinetic.Rect({
        x: side_width - canvas_card_width - buffer_width, //snap_area.x,
        y: side_height - canvas_card_height - buffer_height, //snap_area.y,
        width: canvas_card_width,
        height: canvas_card_height,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 1
    });

    layer.add(pile_rect);
    stage.add(table);
    stage.add(layer);

    $('#deck_count_1').html(new_deck.number_in_deck);

    $('#deal_button').click(function() {
        new_deck.deal(function(card) {
            var image_objectect = new Image();
            image_objectect.onload = function() {
                if (!this.initialized) {
                    var image = new Kinetic.Image({
                        x: stage.getWidth() / 2 - 2 * canvas_card_width + 2 * buffer_width,
                        y: stage.getHeight() - canvas_card_height / 2 - buffer_height,
                        crop: cardsprite[card.suit + card.value],
                        width: canvas_card_width,
                        height: canvas_card_height,
                        image: image_objectect,
                        draggable: true,
                        offset: [canvas_card_width/2, canvas_card_height/2],
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
                        if(is_near_snap_area(image, snap_area)) {
                            image.attrs.x = snap_area.x;
                            image.attrs.y = snap_area.y;
                            layer.draw();
                        }
                        is_near_card_snap_area(image, layer, function(snapTo) {
                            image.attrs.x = snapTo.x;
                            image.attrs.y = snapTo.y;
                            layer.draw();
                        });
                    });
                }
            }
            image_objectect.src = sprite_url;
            var notification_text = "<p>Dealt one card. It was a " + card.name + " with a value of " + card.value + ", suit of " + card.suit + ", and color of " + card.color + ".</p> ";
            $(notification_text).hide().prependTo('#action_area').slideToggle("slow");
            $('#deck_count_1').html(new_deck.number_in_deck);
        });
    });

    $('#card_sprite_height_width').click(function() {
        card_height = $('#card_on_sprite_height').val();
        card_width  = $('#card_on_sprite_width').val();
        init_sprites(card_height, card_width);
        // Retroactively apply this new setting to old cards
        for (var x = 0; x < layer.children.length; x++) {
            if(layer.children[x].type === "card") {
                //layer.children[x].setImage(image_objectect);
                layer.children[x].setCrop(card_sprite[layer.children[x].suit + layer.children[x].value]);
            }
        }
    layer.draw();
    });

    $('#card_height_width').click(function() {
        canvas_card_height = $('#card_height').val();
        canvas_card_width  = $('#card_width').val();
        // Retroactively apply this new sprite to old cards
        for (var x = 0; x < layer.children.length; x++) {
            if(layer.children[x].type === "card") {
                layer.children[x].setHeight(canvas_card_height);
                layer.children[x].setWidth(canvas_card_width);
                layer.children[x].setOffset(canvas_card_width/2, canvas_card_height/2);
            }
        }
        layer.draw();
    });

    $('#round_up').click(function() {
        var round_number = parseInt($('span#round_count').html())+1;
        $('span#round_count').html(round_number);
        var notification_text = "<p>Raised the round to "+round_number+".</p>";
        $(notification_text).hide().prependTo('#action_area').slideToggle("slow");
    });

    $('#round_down').click(function() {
        var round_number = parseInt($('span#round_count').html())-1;
        $('span#round_count').html(round_number);
        var notification_text = "<p>Dropped the round to "+round_number+".</p>";
        $(notification_text).hide().prependTo('#action_area').slideToggle("slow");
    });

    $('#roll_die').click(function() {
        var die_roll = Math.floor(Math.random() * (parseInt($('input#die_sides').val())))+1;
        var notification_text = "<p>Rolled a "+die_roll+" (1D"+$('#die_sides').val()+").</p>";
        $(notification_text).hide().prependTo('#action_area').slideToggle("slow");
        //$('span#die_value').html(die_roll);
        // Report the die rolling results in the actionarea
        //var notificationText = "<p>Rolled a die of X sides with a result of <b>Y<b></p> ";
        //$(notificationText).hide().prependTo('#actionarea').slideToggle("slow");
    });

    $('#sprite_button').click(function() {
        sprite_url = $('#sprite_url').val();
        // Retroactively apply this new sprite to old cards
        // We'll have to just remove the card and then create a new one in its place.
        var number_of_children = layer.children.length;
        for (var x = 0; x < number_of_children; x++) {
            if(layer.children[x].type === "card") {
                //var oldCard = layer.children[x];
                var image_object = layer.children[x].getImage();
                image_object.src = sprite_url
                // layer.children[x].attrs.image.src = sprite_url
                layer.children[x].setImage(image_object);
            }
        }
    layer.draw();
    });

    table.on('mouseup', function(mouse) {
        this.off('mousemove.table_select');
        var table_select = this.get('.table_select');
        if(table_select.length > 0) {
            var group = new Kinetic.Group({
                name: 'select_group',
                draggable: true
            });
            var select_coverage = { 'x': [table_select[0].getX(), table_select[0].getX()+table_select[0].getWidth()], 'y': [table_select[0].getY(), table_select[0].getY()+table_select[0].getHeight()] }
            // MADNESS https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort
            function compare_numbers(a, b)  {
              return a - b;
            }
            select_coverage.x.sort(compare_numbers);
            select_coverage.y.sort(compare_numbers);
            console.log(select_coverage);
            for (var x = 0; x < layer.children.length; x++) {
                if(layer.children[x].type === "card") {
                    var cardX = layer.children[x].getX();
                    var cardY = layer.children[x].getY();
                    if(cardX > select_coverage.x[0] && cardX < select_coverage.x[1] && cardY > select_coverage.y[0] && cardY < select_coverage.y[1]) {
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
            this.remove(table_select[0]);
            this.draw();
        }
    });

    table.on('mousedown', function(mouse) {
        this.off('mousemove.table_select');
        var table_select = this.get('.table_select');
        if(table_select.length > 0) {
            this.remove(table_select[0]);
        }
        var table_select = new Kinetic.Rect({
            name: 'table_select',
            x: mouse.layerX,
            y: mouse.layerY,
            width: 0,
            height: 0,
            fill: "yellow",
            stroke: "black",
            strokeWidth: 1
        });
        this.add(table_select);
        this.on('mousemove.table_select', function(move) {
            var position = table_select.getPosition();
            table_select.setSize(move.layerX-position.x, move.layerY-position.y);
            this.draw();
        });
    });
});
