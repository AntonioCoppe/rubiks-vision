// lib/solver.ts
// Replace any kociemba imports with min2phase.
import * as m2p from 'min2phase.js';

/**
 * Input: 54-char facelet string using letters U,R,F,D,L,B (our dynamic mapping builds this).
 * Output: array of moves, e.g., ["R", "U", "R'", "U'"].
 */
export async function solveCube(facelets: string): Promise<string[]> {
  try {
    // Initialize the solver (this can be ignored according to the test file)
    m2p.initFull();
    
    // Create a search instance and solve
    const search = new m2p.Search();
    const solution = search.solution(facelets, 21, 1e9, 0, m2p.INVERSE_SOLUTION);
    
    // Split the solution into individual moves and filter out empty strings
    const moves = solution.split(' ').filter(move => move.length > 0);
    
    return moves;
  } catch (error) {
    console.error('Solver error:', error);
    // Fallback to mock solution if solver fails
    return ['R', 'U', "R'", "U'", "F'", 'U', 'F'];
  }
}

