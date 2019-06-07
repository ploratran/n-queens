// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {

      /*
        0: (4) [0, 0, 0, 0]
        1: (4) [0, 0, 0, 0]
        2: (4) [0, 0, 0, 0]
        3: (4) [0, 0, 0, 0]
        this.rows().length => 4
        this.rows()[rowIndex] => [0,1,1,0]
        this.rows()[rowIndex][1] => 1
        */
      var queens = 0;
      for(var i = 0; i < this.rows().length; i++){
        if(this.rows()[rowIndex][i] === 1){
          queens++;
        }
      }
      if(queens >= 2){ //when more than 2 queens conflict in a row
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var queens = 0;
      for(var i = 0; i < this.rows().length; i++){
        if(this.hasRowConflictAt(i) === true){
          queens++;
        }
      }
      if(queens >= 1){ //when there's any queen on board that has conflict
        return true;
      }
      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var queens = 0;
      for(var i = 0; i < this.rows().length; i++){
        if(this.rows()[i][colIndex] === 1){ //when colIndex is fixed
          queens++;
        }
      }
      if(queens >= 2){
        return true;
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var queens = 0;
      for(var i = 0; i < this.rows().length; i++){
        if(this.hasColConflictAt(i) === true){
          return true;
        }
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {

      /*
      loop for the elements in chessboard starting at current column index and first row
      check if the current elements is a queen or not
      track of elements at [i][col+i]
      */
      var queens = 0;
      var col = majorDiagonalColumnIndexAtFirstRow;

      for(var i = 0; i < this.rows().length; i++){
        if(this.rows()[i][col+i] === 1){
          queens++;
        }
      }
      if(queens >= 2){
        return true;
      }else{
        return false;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      /*
      0: [0, 1, 0, 0] undefined, undefined, undefined],
      1: [0, 0, 1, 0] undefined, undefined, undefined],
      2: [0, 0, 0, 0] undefined, undefined, undefined]
      3: [0, 0, 0, 0] undefined, undefined, undefined]

      0: [0, 0, 0, 0] undefined, undefined, undefined],
      1: [1, 0, 0, 0] undefined, undefined, undefined],
      2: [0, 0, 0, 0] undefined, undefined, undefined],
      3: [0, 0, 1, 0] undefined, undefined, undefined]
      */
      var n = this.rows().length-1;
      console.log("length", n);
      for(var i = (n*-1); i < n; i++){
        console.log("i", i);
        console.log("n",n);
        if(this.hasMajorDiagonalConflictAt(i) === true){
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var n = this.rows().length;
      var count = 0; //keep track of queen
      var index = minorDiagonalColumnIndexAtFirstRow;

      /*loop over board*/
      for(var i = 0; i < n; i++){
        //check if the current element at row contains 1 then return true
        if(this.rows()[i][index-i] === 1){
          count++;
        }

      }
      if(count > 1){
        return true;
      }else{
        return false;
      }
      //return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var n = this.rows().length - 1; // 3
      var doubleBoard = 2 * n; //6
      console.log('n: ',doubleBoard);
      for(var i = 1; i < doubleBoard; i++){
        console.log('i', i);
        if(this.hasMinorDiagonalConflictAt(i) === true){
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
