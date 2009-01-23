 /****************************************************************
  *  jquery.tableHelper.js                                       *
  *                                                              *
  *  by: Dan VerWeire                                            *
  *  email: dverweire@gmail.com                                  *
  *                                                              *
  *  sponsored by: Pavilion Gift Company                         *
  *  www.paviliongift.com                                        *
  *                                                              *
  *  This library is free software; you can redistribute         *
  *  it and/or modify it under the terms of the GNU              *
  *  Lesser General Public License as published by the           *
  *  Free Software Foundation; either version 2.1 of the         *
  *  License, or (at your option) any later version.             *
  *                                                              *
  *  This library is distributed in the hope that it will        *
  *  be useful, but WITHOUT ANY WARRANTY; without even the       *
  *  implied warranty of MERCHANTABILITY or FITNESS FOR A        *
  *  PARTICULAR PURPOSE. See the GNU Lesser General Public       *
  *  License for more details.                                   *
  *                                                              *
  *  You should have received a copy of the GNU Lesser           *
  *  General Public License along with this library;             *
  *  Inc., 59 Temple Place, Suite 330, Boston,                   *
  *  MA 02111-1307 USA                                           *
  ****************************************************************/

(function () {
	var alphaColLookup = {}
	var colIndex = 0;

	for (var x = 97; x <= 122; x++) {
	    alphaColLookup[String.fromCharCode(x)] = colIndex++;	  
	}

	for (var x = 97; x <= 122; x++) {
	    for (var y = 97; y <= 122; y++) {
		alphaColLookup[String.fromCharCode(x) + String.fromCharCode(y)] = colIndex++;	  
	    }
	}

	//helper function to quickly determine if an element is a table
	isTable = function (el) {
		return (el.nodeName == 'TABLE') ? true : false;
	}
	
	//helper function to quickly determine if an element is a tbody
	isTbody = function (el) {
		return (el.nodeName == 'TBODY') ? true : false;
	}

	//helper function to quickly determine if an element is a tfoot
	isTfoot = function (el) {
		return (el.nodeName == 'TFOOT') ? true : false;
	}

	//helper function to quickly determine if an element is a thead
	isThead = function (el) {
		return (el.nodeName == 'THEAD') ? true : false;
	}

	//helper function to quickly determine if an element is a table cell
	isCell = function (el) {
		return (el.nodeName == 'TD') ? true : false;
	}
	
	//helper function to quickly determine if an element is a table row
	isRow = function (el) {
		return (el.nodeName == 'TR') ? true : false;
	}

	getTable = function (el,jq) {
		var tbl;

		if (isTable(el) || isThead(el) || isTbody(el) || isTfoot(el)) {
                	jq = jq.not(el);
                        tbl = el;
                }
                else if (isCell(el)) {
                        tbl = el.parentNode.parentNode;
                }
                else if (isRow(el)) {
                        tbl = el.parentNode;
                }

		return { table : tbl, jq : jq }
	}

	getVirtTable = function (tbl) {
		//tables which contain cells that have a rowSpan or cellSpan make the indices not friendly for
		//any type of coordinate system. What this section does is loop through the actual table, building
		//a map of that table where a 'merged cell' has a reference at every coordinate which it takes up.
		//i tried other methods, but this is the one that ended up working. not sure if this is the most efficient.
		//
		//this method helps with including merged cells in an overlapping range

		var virtTable  = {};

		for (var y = 0; y < tbl.rows.length; y++) {
			var row = tbl.rows[y];
			for (var x = 0; x < row.cells.length; x++) {
				var cell = row.cells[x];
				
				//this loop is for setting the references of a cell that might have a rowSpan or cellSpan
				for (var a = 0; a < cell.rowSpan; a++) {
					for (var b = 0; b < cell.colSpan; b++) {
						if (!virtTable[y + a]) virtTable[y + a] = {};
						
						if (!virtTable[y + a][x + b]) {
							virtTable[y + a][x + b] = cell;
						}
						else {
							var c = 0;
							while (virtTable[y + a][x + b + c]) {
								c++;
							}
							virtTable[y + a][x + b + c] = cell;
						}
					}
				}
			}
		}

		return virtTable;
	}

	//add the cell method to the jQuery object
	//this method adds the cell at row,col in any tables in the current
	//selection to the selection
	//
	//it will remove the table from the selection
	jQuery.fn.cell = function (col,row) {
		var jq = this;
	
		this.each(function(i,el) {
			var obj = getTable(this,jq);
			jq = obj.jq;
			tbl = obj.table;
			
			var virtTable = getVirtTable(tbl);
			
			if (virtTable && virtTable[row] && virtTable[row][col]) {
				var cell = virtTable[row][col];
				jq = jq.add(cell);
			}
		});
		
		return jq;
	};
	
	jQuery.fn.row = function (row) {
		var jq = this;
	
		jq.each(function (i,el) {
			var obj = getTable(this,jq);
			jq = obj.jq;
			tbl = obj.table;
	
			var tmp = Array();
			var rw = tbl.rows.item(row);
			
			if (rw) {
				for (var x = 0; x < rw.cells.length; x++) {
					var cell = rw.cells.item(x);
					tmp.push(cell);
				}
			
				jq = jq.add(tmp);
			}
		});
	
		return jq;
	}

	jQuery.fn.alternate = function(start, interval) {
		var jq = this;

		jq.each(function (i,el) {
			var obj = getTable(this,jq);
			jq = obj.jq;
			tbl = obj.table;

			var tmp = Array();
			
			for (var x = start; x < tbl.rows.length; x += interval) {
				var rw = tbl.rows.item(x);
				
				for (var y = 0; y < rw.cells.length; y++) {
					var cell = rw.cells.item(y);
					tmp.push(cell);
				}
			}
			
			jq = jq.add(tmp);
		});

		return jq;
	}

	jQuery.fn.even = function () {
		return this.alternate(0,2);
	}

	jQuery.fn.odd = function () {
		return this.alternate(1,2);
	}
	
	jQuery.fn.all = function () {
		return this.alternate(0,1);
	}

	
	jQuery.fn.col = function (col) {
		var jq = this;
	
		jq.each(function (i,el) {
			var obj = getTable(this,jq);
			jq = obj.jq;
			tbl = obj.table;
			
			var tmp = Array();
		
			for (var y = 0; y < tbl.rows.length; y++) {
				var cell = tbl.rows.item(y).cells.item(col)
				tmp.push(cell);
			}
	
			jq = jq.add(tmp);
		});
	
		return jq;
	}
	
	jQuery.fn.tableEnd  = function () {
		var jq = this;
		
		while (jq.length > 0 ) {
		//	jq.each(function (i, el) {
				jq = jq.end();
		//	});
		}
		jq = jq.end();
		
		return jq;
	}
	
	//resize the table, only grows the table at the moment
	jQuery.fn.resize = function (cols,rows) {
		var jq = this;
		//fix off by one issue
		cols--;
		rows--;
		result = this.each(function(i,el) {
	
			for (var y = this.rows.length; y < rows + 1; y++) {
				var rw = this.insertRow(-1);
			}
			
			//now for each row, check all the cells
			for (var y = 0; y < this.rows.length; y++) {
				var rw = this.rows.item(y);
		
				for (var x = rw.cells.length; x < cols + 1; x ++) {
					var td = rw.insertCell(-1);
				}
			}
		});
		
		return jq;
	}

	jQuery.fn.range = function (stRange) { //yes i called this stRange for fun reasons.
		var jq = this;

		if (stRange.indexOf(':') >= 0) {
			var tokens = stRange.split(':');
			var range = []
			
			for (var x = 0; x < tokens.length; x++) {
				var token = tokens[x];
				var col = alphaColLookup[/[a-zA-Z]{1,2}/.exec(token)];
				var row = (/[0-9]{1,}/.exec(token)) - 1;
				
				range.push({row : row, col : col});
			}
				
			if (range.length == 2) {
				//we have a start coord and a stop coord
				jq.each(function(i,el) {
					var cells = [];
					var obj = getTable(this,jq);
					
					jq = obj.jq;
					tbl = obj.table;
					
					var virtTable = getVirtTable(tbl);

					//now grab the cells in the range from the virtual table.
					for (var y = range[0].row ; y <= range[1].row ; y ++) {
						for (var x = range[0].col; x <= range[1].col; x++) {
							if (virtTable[y][x]) {
								cells.push(virtTable[y][x]);
							}
						}
					}

					//add the cells we collected to the jquery object
					jq = jq.add(cells);
				});
			}
		}
		
		return jq;
	}

	jQuery.fn.merge = function (copyContents) {
		var jq = this;
		var contents = '';

		var cells = [];
		
		jq.each(function (i, el) {
			if (isCell(this)) cells.push(this);
		})
		
		//find the top left most cell
		if (cells.length > 0) {
			
			var tl = {row : cells[0].parentNode.rowIndex, col : cells[0].cellIndex, cell : cells[0]};
			var br = {row : cells[0].parentNode.rowIndex, col : cells[0].cellIndex, cell : cells[0]};

			for (var x = 0; x < cells.length; x ++){
				var cell = cells[x];

				var row = cell.parentNode.rowIndex;
				var col = cell.cellIndex
				
				if (row < tl.row || col < tl.col ) tl = {row : row, col : col, cell : cell};
				if (row > br.row || col > br.col ) br = {row : row, col : col, cell : cell};
			}
			
			for (var x = 0; x < cells.length; x ++){
				var cell = cells[x];
				
				if (cell != tl.cell) {
					if (copyContents) contents += cell.innerHTML;
					cell.parentNode.removeChild(cell);
				}
			}

			tl.cell.colSpan = br.col - tl.col + 1;
			tl.cell.rowSpan = br.row - tl.row + 1;
			if (copyContents) tl.cell.innerHTML += contents;
		}

		return jq;
	}

	jQuery.fn.unMerge = function () {
		var jq = this;
		var contents = '';

		var cells = [];
		
		jq.each(function (i, el) {
			var done = false;

			if (isCell(this)) {
				var tbl = getTable(this).table;
				var virtTable = getVirtTable(tbl);
				
				//loop through the virtual table to find the top leftest reference to this merged cell.
				for ( var y in virtTable ) {
					var row = virtTable[y];
					
					for (var x in row) {
						var cell = row[x];
						
						if (cell == this) {
							rowSpan = this.rowSpan;
							colSpan = this.colSpan;
							//
							//loop through the size of this cell and insert new cells
							for ( var a = 0; a < rowSpan; a++ ) {
								for ( var b = 0 ; b < colSpan; b++ ) {
									//alert(parseInt(x) + colSpan);
									//alert((parseInt(y) + a) + ' ' + y + ' ' + a)// + virtTable[String(y + a)][x])
									var cell = jQuery('<td />').insertBefore(virtTable[(parseInt(y) + a)][parseInt(x) + colSpan]).get(0)
									cells.push(cell);
								}
							}
							$(this).remove();
							done = true;
							break;
						}
					}
					if (done) break;
				}
			}
		})
		return jq.add(cells);
	}

})();
