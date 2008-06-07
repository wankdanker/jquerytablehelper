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

	jQuery.fn.isTable = function (el) {
		return (el.nodeName == 'TABLE') ? true : false;
	}
	
	jQuery.fn.isCell = function (el) {
		return (el.nodeName == 'TD') ? true : false;
	}
	
	jQuery.fn.isRow = function (el) {
		return (el.nodeName == 'TR') ? true : false;
	}
	
	jQuery.fn.cell = function (row,col) {
		var myjq = this;
	
		this.each(function(i,el) {
			if (myjq.isTable(this)) {
				myjq = myjq.not(this);
				jQuery.fn.depth++;
				tbl = this;
			}
			else if (myjq.isCell(this)) {
				//alert('cell');
				tbl = this.parentNode.parentNode;
			}
			
			if (tbl && tbl.rows.item(row) && tbl.rows.item(row).cells.item(col)) {
				var cell = tbl.rows.item(row).cells.item(col);
				myjq = myjq.add(cell);
				jQuery.fn.depth++;
			}
		});
		
		return myjq;
	};
	
	jQuery.fn.row = function (row) {
		var jq = this;
	
		jq.each(function (i,el) {
			if (jq.isTable(this)) {
				jq = jq.not(this);
				jQuery.fn.depth++;
				tbl = this;
			}
			else if (jq.isCell(this)) {
				//alert('cell');
				tbl = this.parentNode.parentNode;
			}
	
			var tmp = [];
			var rw = tbl.rows.item(row);
	
			for (var x = 0; x < rw.cells.length; x++) {
				var cell = rw.cells.item(x);
				jq = jq.add(cell);
			}
		});
	
		return jq;
	}
	
	jQuery.fn.col = function (col) {
		var jq = this;
	
		jq.each(function (i,el) {
			if (jq.isTable(this)) {
				jq = jq.not(this);
				jQuery.fn.depth++;
				tbl = this;
			}
			else if (jq.isCell(this)) {
				//alert('cell');
				tbl = this.parentNode.parentNode;
			}
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
			jq.each(function (i, el) {
				jq = jq.end();
			});
		}
		jq = jq.end();
	
		return jq;
	}
	
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
					td.innerHTML = '.';
				}
			}
		});
		
		return jq;
	}
})();