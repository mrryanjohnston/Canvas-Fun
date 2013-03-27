/**
* Card Shit
*/

var max_value = 13;
var min_value = 1;
var snap_area = { 'x': 400, 'y': 300 }
var colors   = ['red', 'black'];
var suits   = ['club', 'spade', 'heart', 'diamond'];
var names    = { '11': 'Jack', '12': 'Queen', '13': 'King', '1': 'Ace' }
var card_height = 242; //pixel height max 242 x5 = 1210 // old-val: 244 & 1220
var card_width  = 170; //pixel width  max 170 x13= 2210 // old-val: 167 & 2171
var canvas_card_height = 160;
var canvas_card_width  = 120;
var card_snap   = 30;
var sprite_url  = 'img/card_sprite.png';
var card_sprite = {}
var init_sprites = function(card_height, card_width) {
    cardsprite = {
        'club1': { 'x': 0, 'y': 0, 'width': card_width, 'height': card_height },
        'club2': { 'x': card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club3': { 'x': 2*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club4': { 'x': 3*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club5': { 'x': 4*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club6': { 'x': 5*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club7': { 'x': 6*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club8': { 'x': 7*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club9': { 'x': 8*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club10': { 'x': 9*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club11': { 'x': 10*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club12': { 'x': 11*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'club13': { 'x': 12*card_width, 'y': 0, 'width': card_width, 'height': card_height },
        'diamond1': { 'x': 0, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond2': { 'x': card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond3': { 'x': 2*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond4': { 'x': 3*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond5': { 'x': 4*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond6': { 'x': 5*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond7': { 'x': 6*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond8': { 'x': 7*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond9': { 'x': 8*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond10': { 'x': 9*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond11': { 'x': 10*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond12': { 'x': 11*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'diamond13': { 'x': 12*card_width, 'y': card_height, 'width': card_width, 'height': card_height },
        'heart1': { 'x': 0, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart2': { 'x': card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart3': { 'x': 2*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart4': { 'x': 3*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart5': { 'x': 4*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart6': { 'x': 5*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart7': { 'x': 6*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart8': { 'x': 7*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart9': { 'x': 8*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart10': { 'x': 9*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart11': { 'x': 10*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart12': { 'x': 11*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'heart13': { 'x': 12*card_width, 'y': 2*card_height, 'width': card_width, 'height': card_height },
        'spade1': { 'x': 0, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade2': { 'x': card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade3': { 'x': 2*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade4': { 'x': 3*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade5': { 'x': 4*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade6': { 'x': 5*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade7': { 'x': 6*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade8': { 'x': 7*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade9': { 'x': 8*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade10': { 'x': 9*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade11': { 'x': 10*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade12': { 'x': 11*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height },
        'spade13': { 'x': 12*card_width, 'y': 3*card_height, 'width': card_width, 'height': card_height }
    };
}

init_sprites(card_height, card_width);

var card = function(value, color, suit) {
    this.value = value || null;
    this.color = color || null;
    this.suit = suit || null;
    if (this.value === null || this.color === null || this.suit === null) {
        this.suit = suits[Math.floor(Math.random() * (suits.length))];
        //Color depends on the suit.
        if (this.suit === 'club' || this.suit === 'spade') {
            this.color = colors[1];
        } else {
            this.color = colors[0];
        }
        this.value = Math.floor(Math.random() * (max_value - min_value + 1)) + min_value;
    }
    if (this.value > 10 || this.value === 1) {
        this.name = names[this.value] + ' of ' + this.suit + 's';
    } else {
        this.name = this.value + ' of ' + this.suit + 's';
    }
}

var hits = 0;

var deck = function() {
    this.number_in_deck = 0;
    this.max_in_deck    = 52;
    this.cards  = [];
    this.in_deck = {};
    // to-do: rewrite deck generation as it is wasteful (over 200+ loops sometimes. should loop the number of cards times.
    for (var x=0; x<this.max_in_deck; x++) {
        var new_card = new card();
        if (!(new_card.suit in this.in_deck)) {
            // Add the card to the deck. Also put it in the inDeck index so we can better determine
            // what cards are in the deck.
            this.in_deck[new_card.suit] = [new_card.value];
            this.cards.push(new_card);
            this.number_in_deck++;
        } else {
            // If this suit was in the deck already, if the value isn't in, add it.
            if (this.in_deck[new_card.suit].indexOf(new_card.value) === -1) {
                this.in_deck[new_card.suit][new_card.value] = new_card.value;
                this.cards.push(new_card);
                this.number_in_deck++;
            } else {
                x--;
            }
        }
    }
    this.deal = function(callback) {
        var card = this.cards.pop();
        this.number_in_deck--;
        delete this.in_deck[card.suit][card.value];
        callback(card);
    }
}

var is_near_snap_area = function(image, snap_area) {
    if (image.attrs.x > snap_area.x - card_snap && image.attrs.x < snap_area.x + card_snap && image.attrs.y > snap_area.y - card_snap && image.attrs.y < snap_area.y + card_snap) {
        return true;
    } else {
        return false;
    }
}

var is_near_card_snap_area = function(image, layer, callback) {
    // What the new card will snap to if it is near it
    var snap_to = { 'x': image.attrs.x, 'y': image.attrs.y };
    for (var x = 0; x < layer.children.length; x++) {
        var card   = { 'x': layer.children[x].attrs.x, 'y': layer.children[x].attrs.y, '_id': layer.children[x]._id, 'type': layer.children[x].type }
        if(is_near_snap_area(image, card) && card.type === 'card' && image._id !== card._id) {
            snap_to.x = card.x;
            snap_to.y = card.y + 30;
            callback(snap_to);
            return;
        }
    }
}
