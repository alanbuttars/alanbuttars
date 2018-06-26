import { Component, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';

export const LETTER_POINTS = {
  a: 1,
  b: 4,
  c: 4,
  d: 2,
  e: 1,
  f: 4,
  g: 3,
  h: 4,
  i: 1,
  j: 10,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 4,
  q: 0,
  r: 1,
  s: 1,
  t: 1,
  u: 2,
  v: 4,
  w: 4,
  x: 0,
  y: 4,
  z: 0,
}

declare var $: any;

@Component({
  selector: 'app-blog-post-1',
  templateUrl: './post1.component.html',
})
export class BlogPost1Component {
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    console.log("TRYING");
    console.log($(".ui.sticky.page.navigation"));
    console.log($(".ui.sticky.blog.navigation"));


    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });

    $(".ui.sticky.blog.navigation").sticky({
      context: "#blog"
    });

  }

  javaCode = `package ruzzle;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

/**
 * @author Alan Buttars, AlanButtars.com
 */
public class Ruzzle {

	private static char[][] grid = new char[4][4];
	private static List<String> dictionary = new ArrayList<String>();
	private static Set<String> foundWords = new HashSet<String>();

	public static void main(String[] args) throws Exception {
		readInDictionary();
		readInGrid();
		solve();
		
		for (String found : foundWords) {
			System.out.println(found);
		}
	}

	private static void readInDictionary() throws FileNotFoundException {
		Scanner scanner = new Scanner(new File("dictionary.txt"));
		while (scanner.hasNext()) {
			dictionary.add(scanner.nextLine().trim());
		}
		scanner.close();
	}

	private static void readInGrid() {
		System.out.println("Enter the grid like this:");
		System.out.println("\tabcd");
		System.out.println("\tefgh");
		System.out.println("\tijkl");
		System.out.println("\tmnop");
		Scanner scanner = new Scanner(System.in);
		String nextline = null;
		for (int row = 0; row < 4; row++) {
			nextline = scanner.nextLine();
			char[] chars = nextline.toCharArray();
			for (int col = 0; col < 4; col++) {
				grid[row][col] = chars[col];
			}
		}
		scanner.close();
	}

	private static void solve() {
		for (int row = 0; row < 4; row++) {
			for (int col = 0; col < 4; col++) {
				StringBuilder stringSoFar = new StringBuilder(grid[row][col]);
				boolean[][] visitedNodes = new boolean[4][4];
				visitedNodes[row][col] = true;
				solveWithStringSoFar(row, col, stringSoFar, visitedNodes);
			}
		}
	}

	/**
	 * Recursively finds dictionary words with a given position and
	 * string word constructed so far.
	 * @param startingRow starting row position of the word
	 * @param startingCol starting column position of the word
	 * @param currentRow current row position of the built grid path
	 * @param currentCol current column position of the built grid path
	 * @param stringSoFar constructed word so far
	 * @param pathSoFar constructed grid path so far
	 */
	private static void solveWithStringSoFar(int currentRow, int currentCol, StringBuilder stringSoFar,
			boolean[][] visitedNodes) {
		String string = stringSoFar.toString();
		if (maybeInDictionary(string)) {
			for (Node node : getAvailableNodes(currentRow, currentCol, visitedNodes)) {
				StringBuilder sb = new StringBuilder(string);
				sb.append(grid[node.row][node.col]);
				solveWithStringSoFar(node.row, node.col, sb, visitedNodes);
			}
		}
		if (isInDictionary(string)) {
			foundWords.add(string);
		}
	}

	private static boolean isInDictionary(String searchWord) {
		int startIndex = 0;
		int endIndex = dictionary.size() - 1;
		return isInDictionary(searchWord, startIndex, endIndex);
	}

	private static boolean isInDictionary(String searchWord, int startIndex, int endIndex) {
		int midIndex = (startIndex + endIndex) / 2;
		String midWord = dictionary.get(midIndex);
		int compare = searchWord.compareTo(midWord);
		if (startIndex == endIndex) {
			return compare == 0;
		}
		else if (compare < 0) {
			return isInDictionary(searchWord, startIndex, midIndex);
		}
		else if (compare > 0) {
			return isInDictionary(searchWord, midIndex + 1, endIndex);
		}
		else {
			return true;
		}
	}

	/**
	 * Performs a binary search to determine whether a given search term may be
	 * in the pre-loaded dictionary.
	 * @param searchWord
	 * @return true if the word, once completed, could occur in the
	 *         dictionary (e.g., calling this method with searchWord of "carro"
	 *         would return because "carrot" is in the
	 *         dictionary)
	 *         
	 *		   false if the word, even once completed, could not
	 *         occur in the dictionary (e.g., calling this method with
	 *         searchWord of "carrotsa" would return false because
	 *         no word exists which starts with "carrotsa")
	 */
	private static boolean maybeInDictionary(String searchWord) {
		int startIndex = 0;
		int endIndex = dictionary.size() - 1;
		return maybeInDictionary(searchWord, startIndex, endIndex);
	}

	/**
	 * Helper method which completes a search of the searchWord within the
	 * dictionary indices given as parameters.
	 * @param searchWord
	 * @param startIndex starting index from which to search in the dictionary
	 * @param endIndex ending index from which to search in the dictionary
	 * @return
	 */
	private static boolean maybeInDictionary(String searchWord, int startIndex, int endIndex) {
		int midIndex = (startIndex + endIndex) / 2;
		String midWord = dictionary.get(midIndex);
		if (midWord.length() >= searchWord.length()) {
			midWord = midWord.substring(0, searchWord.length());
		}
		int compare = searchWord.compareTo(midWord);
		if (startIndex == endIndex) {
			return compare == 0;
		}
		else if (compare < 0) {
			return maybeInDictionary(searchWord, startIndex, midIndex);
		}
		else if (compare > 0) {
			return maybeInDictionary(searchWord, midIndex + 1, endIndex);
		}
		else {
			return true;
		}
	}

	/**
	 * Retrieves all possible grid positions which neighbor a given grid
	 * position.
	 */
	private static List<Node> getAvailableNodes(int row, int col, boolean[][] visitedNodes) {
		List<Node> nodes = new ArrayList<Node>();
		addIfAvailable(row - 1, col - 1, visitedNodes, nodes);
		addIfAvailable(row - 1, col    , visitedNodes, nodes);
		addIfAvailable(row - 1, col + 1, visitedNodes, nodes);
		addIfAvailable(row    , col - 1, visitedNodes, nodes);
		addIfAvailable(row    , col + 1, visitedNodes, nodes);
		addIfAvailable(row + 1, col - 1, visitedNodes, nodes);
		addIfAvailable(row + 1, col    , visitedNodes, nodes);
		addIfAvailable(row + 1, col + 1, visitedNodes, nodes);
		return nodes;
	}

	/**
	 * Adds a given grid position to a list of {@link Node}s if the position is
	 * on the board and has not been visited already.
	 */
	private static void addIfAvailable(int row, int col, boolean[][] visitedNodes, List<Node> nodes) {
		if (row >= 0 && row <= 3) {
			if (col >= 0 && col <= 3) {
				if (!visitedNodes[row][col]) {
					nodes.add(new Node(row, col));
				}
			}
		}
	}

	/**
	 * Inner class which represents a grid position.
	 */
	static class Node {
		int row;
		int col;

		public Node(int row, int col) {
			this.row = row;
			this.col = col;
		}
	}
}   
  `;

  cppCode = `#include "stdafx.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
using namespace std;

class Node {
  int row;
  int col;

public:
  Node::Node(int r, int c) {
    row = r;
    col = c;
  }

  int getRow() {
    return row;
  }

  int getCol() {
    return col;
  }
};

void readInDictionary();
void readInGrid();
void solve();
void solveWithStringSoFar(int row, int col, string stringSoFar, bool visitedNodes[4][4]);
bool isInDictionary(string searchWord);
bool isInDictionary(string searchWord, int startIndex, int endIndex);
bool maybeInDictionary(string searchWord);
bool maybeInDictionary(string searchWord, int startIndex, int endIndex);
vector<Node> getAvailableNodes(int row, int col, bool visitedNodes[4][4]);
void addIfAvailable(int row, int col, bool visitedNodes[4][4], vector<Node> &nodes);

char grid[4][4];
vector<string> dictionary;
vector<string> foundWords;


int main() {
  readInDictionary();
  readInGrid();
  solve();

  cout << "FOUND : " << foundWords.size() << endl;
  for (string &foundWord : foundWords) {
    cout << foundWord << endl;
  }
}

void readInDictionary() {
  cout << "Loading dictionary..." << endl;
  ifstream infile("dictionary.txt");
  string line;
  while (getline(infile, line)) {
    dictionary.push_back(line);
  }
  infile.close();
}

void readInGrid() {
  cout << "Print the grid (16 characters):" << endl;
  for (int row = 0; row < 4; row++) {
    for (int col = 0; col < 4; col++) {
      cin >> grid[row][col];
    }
  }
}


void solve() {
  for (int row = 0; row < 4; row++) {
    for (int col = 0; col < 4; col++) {
      string stringSoFar = string(1, grid[row][col]);
      bool visitedNodes[4][4] = {0};
      visitedNodes[row][col] = true;
      solveWithStringSoFar(row, col, stringSoFar, visitedNodes);
    }
  }
}

void solveWithStringSoFar(int row, int col, string stringSoFar, bool visitedNodes[4][4]) {
  if (maybeInDictionary(stringSoFar)) {
    for (Node &node : getAvailableNodes(row, col, visitedNodes)) {
      string nextString = stringSoFar + grid[node.getRow()][node.getCol()];
      solveWithStringSoFar(node.getRow(), node.getCol(), nextString, visitedNodes);
    }
  }
  if (isInDictionary(stringSoFar)) {
    foundWords.push_back(stringSoFar);
  }
}

bool isInDictionary(string searchWord) {
  int startIndex = 0;
  int endIndex = dictionary.size() - 1;
  return isInDictionary(searchWord, startIndex, endIndex);
}

bool isInDictionary(string searchWord, int startIndex, int endIndex) {
  int midIndex = (startIndex + endIndex) / 2;
  string midWord = dictionary[midIndex];
  int compare = searchWord.compare(midWord);
  if (startIndex == endIndex) {
    return compare == 0;
  }
  else if (compare < 0) {
    return isInDictionary(searchWord, startIndex, midIndex);
  }
  else if (compare > 0) {
    return isInDictionary(searchWord, midIndex + 1, endIndex);
  }
  else {
    return true;
  }
}

bool maybeInDictionary(string searchWord) {
  int startIndex = 0;
  int endIndex = dictionary.size() - 1;
  return maybeInDictionary(searchWord, startIndex, endIndex);
}

bool maybeInDictionary(string searchWord, int startIndex, int endIndex) {
  int midIndex = (startIndex + endIndex) / 2;
  string midWord = dictionary[midIndex];
  if (midWord.length() >= searchWord.length()) {
    midWord = midWord.substr(0, searchWord.length());
  }
  int compare = searchWord.compare(midWord);
  if (startIndex == endIndex) {
    return compare == 0;
  }
  else if (compare < 0) {
    return maybeInDictionary(searchWord, startIndex, midIndex);
  }
  else if (compare > 0) {
    return maybeInDictionary(searchWord, midIndex + 1, endIndex);
  }
  else {
    return true;
  }
}

vector<Node> getAvailableNodes(int row, int col, bool visitedNodes[4][4]) {
  vector<Node> * nodes = new vector<Node>();
  addIfAvailable(row - 1, col - 1, visitedNodes, *nodes);
  addIfAvailable(row - 1, col    , visitedNodes, *nodes);
  addIfAvailable(row - 1, col + 1, visitedNodes, *nodes);
  addIfAvailable(row    , col - 1, visitedNodes, *nodes);
  addIfAvailable(row    , col + 1, visitedNodes, *nodes);
  addIfAvailable(row + 1, col - 1, visitedNodes, *nodes);
  addIfAvailable(row + 1, col    , visitedNodes, *nodes);
  addIfAvailable(row + 1, col + 1, visitedNodes, *nodes);
  return *nodes;
}


void addIfAvailable(int row, int col, bool visitedNodes[4][4], vector<Node> &nodes) {
  if (row >= 0 && row <= 3) {
    if (col >= 0 && col <= 3) {
      if (!visitedNodes[row][col]) {
        nodes.push_back(*(new Node(row, col)));
      }
    }
  }
}
  `;

  phpCode = `<?php
if (!isset($_GET['cells'])) {
	throw new Exception("Invalid input. Must set cells to construct grid");
}

$foundWords = array();
$dictionary = loadDictionary();
$dictionarySize = count($dictionary);
$grid = getCellGrid();
solve();


class Node {
	public $row;
	public $col;

	public function __construct($row, $col) {
		$this->row = $row;
		$this->col = $col;
	}
}

/*************************************************************/
// RUN THE SCRIPT 
/*************************************************************/

/* 1. Set up dictionary */
function loadDictionary() {
	$dictionary = array();
	$handle = fopen("dictionary.txt", "r");
	if ($handle) {
		while (($line = fgets($handle)) !== false) {
			$dictionary [] = trim($line);
		}
	}
	return $dictionary;
}

/* 2. Set up grid */
function getCellGrid() {
	$cells = explode(',', $_GET ['cells']);
	$grid = array();
	for($row = 0; $row < 4; $row++) {
		$grid [$row] = array();
		for($col = 0; $col < 4; $col++) {
			$index = $row * 4 + $col;
			if (isset($cells[$index])) { 
				$cellEntry = $cells[$row * 4 + $col];
				if (!empty($cellEntry)) {
					$grid [$row] [$col] = $cellEntry;
				} else {
					throw new Exception("Invalid input. Grid index must not be empty");
				}
			} else {
				throw new Exception("Invalid input. Must include 16 characters");
			}
		}
	}
	return $grid;
}

/* 3. Solve */
function solve() {
	for($row = 0; $row < 4; $row++) {
		for($col = 0; $col < 4; $col++) {
			$stringSoFar = $GLOBALS['grid'][$row][$col];
			$visitedNodes = array(
								array(false, false, false, false),
								array(false, false, false, false),
								array(false, false, false, false),
								array(false, false, false, false)
							);
			$visitedNodes[$row][$col] = true;
			solveWithStringSoFar($row, $col, $stringSoFar, $visitedNodes);
		}
	}
}

/**
 * Recursively finds dictionary words with a given position and word constructed so far.
 * @param currentRow current row position of the built grid path
 * @param currentCol current column position of the built grid path
 * @param stringSoFar constructed word so far
 * @param visitedNodes visited nodes so far
 */
function solveWithStringSoFar($currentRow, $currentCol, $stringSoFar, $visitedNodes) {
	if (maybeInDictionary($stringSoFar)) {
		foreach (getAvailableNodes($currentRow, $currentCol, $visitedNodes) as $node) {
			$nextString = $stringSoFar;
			$nextString .= $GLOBALS['grid'][$node->row][$node->col];
			solveWithStringSoFar($node->row, $node->col, $nextString, $visitedNodes);
		}
	}
	if (isInDictionary($stringSoFar)) {
		$GLOBALS['foundWords'][] = $stringSoFar;
	}
}

/**
 * Performs a binary search to determine whether a given search term may be
 * in the pre-loaded dictionary.
 *
 * @param searchWord
 * @return true if the word, once completed, could occur in the
 *         dictionary (e.g., calling this method with searchWord of "carro"
 *         would return true because "carrot" is in the dictionary)
 *         false if the word, even once completed, could not
 *         occur in the dictionary (e.g., calling this method with
 *         searchWord of "carrotsa" would return false because
 *         no word exists which starts with "carrotsa")
 */
function maybeInDictionary($searchWord) {
	$startIndex = 0;
	$endIndex = $GLOBALS['dictionarySize'] - 1;
	return maybeInDictionaryHelper($searchWord, $startIndex, $endIndex);
}

function maybeInDictionaryHelper($searchWord, $startIndex, $endIndex) {
	$midIndex = floor(($startIndex + $endIndex) / 2);
	$midWord = $GLOBALS['dictionary'][$midIndex];
	if (strlen($midWord) >= strlen($searchWord)) {
		$midWord = substr($midWord, 0, strlen($searchWord));
	}
	$compare = strcmp($searchWord, $midWord);
	if ($startIndex == $endIndex) {
		return $compare == 0;
	}
	else if ($compare < 0) {
		return maybeInDictionaryHelper($searchWord, $startIndex, $midIndex);
	}
	else if ($compare > 0) {
		return maybeInDictionaryHelper($searchWord, $midIndex + 1, $endIndex);
	}
	else {
		return true;
	}
}

/**
 * Performs a binary search to determine whether a given search term is in the pre-loaded dictionary.
 * @param searchWord
 * @return true if the word exists in the dictionary
 */
function isInDictionary($searchWord) {
	$startIndex = 0;
	$endIndex = $GLOBALS['dictionarySize'] - 1;
	return isInDictionaryHelper($searchWord, $startIndex, $endIndex);
}

function isInDictionaryHelper($searchWord, $startIndex, $endIndex) {
	$midIndex = floor(($startIndex + $endIndex) / 2);
	$midWord = $GLOBALS['dictionary'][$midIndex];
	$compare = strcmp($searchWord, $midWord);

	if ($startIndex == $endIndex) {
		return $compare == 0;
	}
	else if ($compare < 0) {
		return isInDictionaryHelper($searchWord, $startIndex, $midIndex);
	}
	else if ($compare > 0) {
		return isInDictionaryHelper($searchWord, $midIndex + 1, $endIndex);
	}
	else {
		return true;
	}
}

/**
 * Retrieves all possible grid positions which neighbor a given grid
 * position.
 */
function getAvailableNodes($row, $col, $visitedNodes) {
	$nodes = array();
	addIfAvailable($row - 1, $col - 1, $visitedNodes, $nodes);
	addIfAvailable($row - 1, $col    , $visitedNodes, $nodes);
	addIfAvailable($row - 1, $col + 1, $visitedNodes, $nodes);
	addIfAvailable($row    , $col - 1, $visitedNodes, $nodes);
	addIfAvailable($row    , $col + 1, $visitedNodes, $nodes);
	addIfAvailable($row + 1, $col - 1, $visitedNodes, $nodes);
	addIfAvailable($row + 1, $col    , $visitedNodes, $nodes);
	addIfAvailable($row + 1, $col + 1, $visitedNodes, $nodes);
	return $nodes;
}

/**
 * Adds a given grid position to a list of nodes if the position is
 * on the board and has not been visited already.
 */
function addIfAvailable($row, $col, $visitedNodes, &$nodes) {
	if ($row >= 0 && $row <= 3) {
		if ($col >= 0 && $col <= 3) {
			if (!$visitedNodes[$row][$col]) {
				$nodes [] = new Node($row, $col);
			}
		}
	}
}
?>
  `;

  jump(e: any) {
    if (e.target.value.length == 1) {
      console.log(e);
      console.log(e.target);
      var x = this.renderer.selectRootElement("input.ruzzle-cell");
      console.log(x);
      var next = x.eq(x.index(e.target) + 1);
      next.focus();
    }
  }

  assignPoints(e: any) {
    var char = e.target.value;
    var pts = LETTER_POINTS[char];
    if (typeof pts != 'undefined') {
    //$(e.target).parent().children('.ruzzle-cell-points-sd').remove();
    //$(e.target).parent().children('.ruzzle-cell-points-dd').remove();
      if (pts < 10) {
      //$(e.target).parent().append('<div class="ruzzle-cell-points-sd">' + pts + '</div>');
      } else {
      //$(e.target).parent().append('<div class="ruzzle-cell-points-dd">' + pts + '</div>');
      }
    }
  }

  breakRuzzle(f: NgForm) {
    console.log(f);
  }
}
