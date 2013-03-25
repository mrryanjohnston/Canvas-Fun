/**
* Card Shit
*/

var maxValue = 13; 
var minValue = 1;
var snapArea = { 'x': 400, 'y': 300 }
var colors   = ['red', 'black'];
var suits   = ['club', 'spade', 'heart', 'diamond'];
var names    = { '11': 'Jack', '12': 'Queen', '13': 'King', '1': 'Ace' }
var cardheight = 244;
var cardwidth  = 167;
var canvascardheight = 100;
var canvascardwidth  = 75; 
var cardsnap   = 30; 
var spriteurl  = 'card_sprite.png';
var cardsprite = {}
var initSprites = function(cardheight, cardwidth) {
cardsprite = { 
  'club1': { 'x': 0, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club2': { 'x': cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club3': { 'x': 2*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club4': { 'x': 3*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club5': { 'x': 4*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club6': { 'x': 5*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club7': { 'x': 6*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club8': { 'x': 7*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club9': { 'x': 8*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club10': { 'x': 9*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club11': { 'x': 10*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club12': { 'x': 11*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'club13': { 'x': 12*cardwidth, 'y': 0, 'width': cardwidth, 'height': cardheight },
  'diamond1': { 'x': 0, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond2': { 'x': cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond3': { 'x': 2*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond4': { 'x': 3*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond5': { 'x': 4*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond6': { 'x': 5*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond7': { 'x': 6*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond8': { 'x': 7*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond9': { 'x': 8*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond10': { 'x': 9*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond11': { 'x': 10*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond12': { 'x': 11*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'diamond13': { 'x': 12*cardwidth, 'y': cardheight, 'width': cardwidth, 'height': cardheight },
  'heart1': { 'x': 0, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart2': { 'x': cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart3': { 'x': 2*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart4': { 'x': 3*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart5': { 'x': 4*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart6': { 'x': 5*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart7': { 'x': 6*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart8': { 'x': 7*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart9': { 'x': 8*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart10': { 'x': 9*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart11': { 'x': 10*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart12': { 'x': 11*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'heart13': { 'x': 12*cardwidth, 'y': 2*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade1': { 'x': 0, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade2': { 'x': cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade3': { 'x': 2*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade4': { 'x': 3*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade5': { 'x': 4*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade6': { 'x': 5*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade7': { 'x': 6*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade8': { 'x': 7*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade9': { 'x': 8*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade10': { 'x': 9*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade11': { 'x': 10*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade12': { 'x': 11*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight },
  'spade13': { 'x': 12*cardwidth, 'y': 3*cardheight, 'width': cardwidth, 'height': cardheight }};  
}
initSprites(cardheight, cardwidth);

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
        this.value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    }
    if (this.value > 10 || this.value === 1) {
        this.name = names[this.value] + ' of ' + this.suit + 's';
    } else {
        this.name = this.value + ' of ' + this.suit + 's';
    }
}

var deck = function() {
    this.numberInDeck = 0;
    this.maxInDeck    = 52;
    this.cards  = [];
    this.inDeck = {};
    for (var x=0; x<this.maxInDeck; x++) {
        var newCard = new card();
        if (!(newCard.suit in this.inDeck)) {
            // Add the card to the deck. Also put it in the inDeck index so we can better determine
            // what cards are in the deck.
            this.inDeck[newCard.suit] = [newCard.value];
            this.cards.push(newCard);
            this.numberInDeck ++;
        } else {
            // If this suit was in the deck already, if the value isn't in, add it.
            if (this.inDeck[newCard.suit].indexOf(newCard.value) === -1) {
                this.inDeck[newCard.suit][newCard.value] = newCard.value;
                this.cards.push(newCard);
                this.numberInDeck ++;
            } else {
                x--;
            }
        }
    }
    this.deal = function(callback) {
        var card = this.cards.pop();
        this.numberInDeck--;
        delete this.inDeck[card.suit][card.value];
        callback(card);
    }
}

var isNearSnapArea = function(image, snapArea) {
    if (image.attrs.x > snapArea.x - 30 && image.attrs.x < snapArea.x + 30 && image.attrs.y > snapArea.y - 30 && image.attrs.y < snapArea.y + 30) {
        return true;
    } else {
        return false;
    }
}
var isNearCardSnapArea = function(image, layer, callback) {
    // What the new card will snap to if it is near it
    var snapTo = { 'x': image.attrs.x, 'y': image.attrs.y };
    for (var x = 0; x < layer.children.length; x++) {
        var card   = { 'x': layer.children[x].attrs.x, 'y': layer.children[x].attrs.y, '_id': layer.children[x]._id, 'type': layer.children[x].type }
        if(isNearSnapArea(image, card) && card.type === 'card' && image._id !== card._id) {
            snapTo.x = card.x;
            snapTo.y = card.y + 30;
            callback(snapTo);
            return;
        }
    }
}
