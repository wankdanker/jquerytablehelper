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

	//add the cell method to the jQuery object
	//this method adds the cell at row,col in any tables in the current
	//selection to the selection
	//
	//it will remove the table from the selection
	jQuery.fn.cell = function (row,col) {
		var jq = this;
	
		this.each(function(i,el) {
			var obj = getTable(this,jq);
			jq = obj.jq;
			tbl = obj.table;
			
			if (tbl && tbl.rows.item(row) && tbl.rows.item(row).cells.item(col)) {
				var cell = tbl.rows.item(row).cells.item(col);
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
})();
